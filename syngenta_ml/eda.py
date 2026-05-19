"""
Syngenta IITM Hackathon 2026 — Exploratory Data Analysis + Insights
===================================================================
Run BEFORE train.py to understand your data and validate features.
Also generates the key analytics your team can present to judges.
"""

import pandas as pd
import numpy as np
import json, os
from datetime import datetime

DATA_DIR = "/tmp/hackathon_data"

def load_all():
    return {
        "growers":   pd.read_csv(f"{DATA_DIR}/growers.csv"),
        "wa":        pd.read_csv(f"{DATA_DIR}/whatsapp_campaign.csv"),
        "pos":       pd.read_csv(f"{DATA_DIR}/retailer_pos.csv"),
        "retailers": pd.read_csv(f"{DATA_DIR}/retailers.csv"),
        "funnel":    pd.read_csv(f"{DATA_DIR}/digital_funnel_weekly.csv"),
        "visits":    pd.read_csv(f"{DATA_DIR}/retailer_visit_log.csv"),
        "inventory": pd.read_csv(f"{DATA_DIR}/retailer_inventory_weekly.csv"),
    }


def eda_growers(df):
    print("\n=== GROWER PROFILE EDA ===")
    print(f"Total growers: {len(df):,}")
    print(f"\nDevice split:")
    print(df["device_type"].value_counts(normalize=True).apply(lambda x: f"{x:.1%}"))
    print(f"\nLanguage split:")
    print(df["language"].value_counts())
    print(f"\nAge stats:")
    print(df["grower_age"].describe())
    print(f"\nFarm size stats:")
    print(df["grower_farm_size"].describe())
    print(f"\nProduct scan rate: {df['product_scan'].mean():.1%}")
    print(f"Offline event attendance: {df['offline_campaign_attended'].mean():.1%}")
    
    # Extract crops from calendar
    crops = df["grower_crop_calendar"].apply(
        lambda x: json.loads(x).get("crop", "unknown") if pd.notna(x) else "unknown")
    print(f"\nCrop distribution:")
    print(crops.value_counts())


def eda_whatsapp(wa_df, growers_df):
    print("\n=== WHATSAPP CAMPAIGN EDA ===")
    print(f"Total messages: {len(wa_df):,}")
    print(f"Delivery rate:  {wa_df['delivered_status'].mean():.1%}")
    print(f"Open rate:      {wa_df['opened_status'].mean():.1%}")
    print(f"Click rate:     {wa_df['clicked_status'].mean():.1%}")
    
    merged = wa_df.merge(growers_df[["grower_id", "language", "device_type", "grower_age"]], 
                         on="grower_id", how="left")
    
    print(f"\nClick rate by crop:")
    print(wa_df.groupby("campaign_crop")["clicked_status"].mean().sort_values(ascending=False))
    
    print(f"\nClick rate by language:")
    print(merged.groupby("language")["clicked_status"].mean().sort_values(ascending=False))
    
    print(f"\nOpen rate by month:")
    wa_df2 = wa_df.copy()
    wa_df2["month"] = pd.to_datetime(wa_df2["message_sent_date"]).dt.month
    print(wa_df2.groupby("month")[["opened_status", "clicked_status"]].mean())


def eda_funnel(df):
    print("\n=== DIGITAL FUNNEL EDA ===")
    df["ctr"] = df["landing_page_visits"] / df["social_post_impression"]
    df["lead_rate"] = df["lead_form_submission"] / df["landing_page_visits"]
    
    print("Campaign performance summary:")
    summary = df.groupby("campaign_crop").agg(
        total_impressions=("social_post_impression", "sum"),
        total_visits=("landing_page_visits", "sum"),
        total_leads=("lead_form_submission", "sum"),
        avg_ctr=("ctr", "mean"),
        avg_lead_rate=("lead_rate", "mean")
    ).reset_index()
    summary["overall_conversion"] = summary["total_leads"] / summary["total_impressions"]
    print(summary.to_string(index=False))


def eda_pos(pos_df, retailers_df):
    print("\n=== POINT OF SALE EDA ===")
    merged = pos_df.merge(retailers_df[["retailer_id", "state"]], on="retailer_id")
    merged["transaction_date"] = pd.to_datetime(merged["transaction_date"])
    merged["month"] = merged["transaction_date"].dt.month
    
    print("Top products by revenue:")
    top = merged.groupby("sku_name").agg(
        total_revenue=("sku_price", "sum"),
        total_qty=("sku_qty", "sum"),
        transactions=("transaction_id", "count")
    ).sort_values("total_revenue", ascending=False).head(10)
    print(top.to_string())
    
    print("\nTop states by sales:")
    print(merged.groupby("state")["sku_price"].sum().sort_values(ascending=False).head(8))


def generate_insights_report(data):
    """Generate a structured insights JSON for the frontend dashboard."""
    wa = data["wa"]
    growers = data["growers"]
    pos = data["pos"]
    funnel = data["funnel"]

    crops = growers["grower_crop_calendar"].apply(
        lambda x: json.loads(x).get("crop", "unknown") if pd.notna(x) else "unknown")

    funnel["ctr"] = funnel["landing_page_visits"] / funnel["social_post_impression"]
    funnel["lead_rate"] = funnel["lead_form_submission"] / funnel["landing_page_visits"]

    report = {
        "generated_at": datetime.now().isoformat(),
        "summary_kpis": {
            "total_growers": int(len(growers)),
            "smartphone_growers": int((growers["device_type"] == "smartphone").sum()),
            "wa_messages_sent": int(len(wa)),
            "overall_open_rate": round(float(wa["opened_status"].mean()), 4),
            "overall_click_rate": round(float(wa["clicked_status"].mean()), 4),
            "product_scan_rate": round(float(growers["product_scan"].mean()), 4),
        },
        "engagement_by_crop": wa.groupby("campaign_crop").agg(
            messages=("id", "count"),
            click_rate=("clicked_status", "mean"),
            open_rate=("opened_status", "mean")
        ).reset_index().to_dict(orient="records"),
        "grower_segments": {
            "by_device": growers["device_type"].value_counts().to_dict(),
            "by_language": growers["language"].value_counts().to_dict(),
            "by_crop": crops.value_counts().to_dict(),
        },
        "digital_funnel": {
            "by_campaign": funnel.groupby("campaign_crop").agg(
                total_impressions=("social_post_impression", "sum"),
                total_leads=("lead_form_submission", "sum"),
                avg_ctr=("ctr", "mean")
            ).reset_index().to_dict(orient="records")
        },
        "top_products": pos.groupby("sku_name").agg(
            total_revenue=("sku_price", "sum"),
            total_qty=("sku_qty", "sum")
        ).sort_values("total_revenue", ascending=False).head(10).reset_index().to_dict(orient="records")
    }

    os.makedirs("models", exist_ok=True)
    with open("models/insights_report.json", "w") as f:
        json.dump(report, f, indent=2)
    print("\n✅ Saved: models/insights_report.json")
    return report


if __name__ == "__main__":
    print("🔍 Syngenta IITM Hackathon — EDA & Insights")
    data = load_all()
    eda_growers(data["growers"])
    eda_whatsapp(data["wa"], data["growers"])
    eda_funnel(data["funnel"])
    eda_pos(data["pos"], data["retailers"])
    report = generate_insights_report(data)
    print("\n✅ EDA Complete. Summary:")
    print(f"  Growers: {report['summary_kpis']['total_growers']:,}")
    print(f"  Click Rate: {report['summary_kpis']['overall_click_rate']:.2%}")
    print(f"  Open Rate: {report['summary_kpis']['overall_open_rate']:.2%}")
