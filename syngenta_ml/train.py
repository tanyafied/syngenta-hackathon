"""
Syngenta IITM Hackathon 2026 — ML Pipeline
==========================================
Models:
  1. Engagement Predictor   — Will a grower open/click a WhatsApp campaign?
  2. Channel Recommender    — Best channel (WhatsApp/SMS/Voice/Retailer) per grower
  3. Campaign Timing Score  — Best week to send based on crop stage proximity
  4. Product Affinity Model — Which product is most likely to convert for a grower
  5. Conversion Propensity  — Overall campaign-to-action conversion probability (the KPI)

Run: python train.py
Outputs: models/ directory with .pkl files + feature metadata
"""

import pandas as pd
import numpy as np
import json, os, joblib, warnings
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import (classification_report, roc_auc_score,
                             precision_recall_fscore_support, mean_absolute_error)
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

warnings.filterwarnings("ignore")
os.makedirs("models", exist_ok=True)

DATA_DIR = "."
MODEL_DIR = "models"

# ─────────────────────────────────────────────
# 1. DATA LOADING & FEATURE ENGINEERING
# ─────────────────────────────────────────────

def parse_crop_calendar(cal_str):
    """Extract crop, growth stage proximity, and days-to-harvest from JSON calendar."""
    try:
        cal = json.loads(cal_str)
        crop = cal.get("crop", "unknown")
        harvest_start = cal.get("harvest", {}).get("start", None)
        sowing_start = cal.get("sowing", {}).get("start", None)
        stages = cal.get("stages", [])
        stage_names = [s.get("stage", "") for s in stages]

        # Days to harvest from a reference date (use mid-season as proxy)
        days_to_harvest = None
        if harvest_start:
            h = datetime.strptime(harvest_start, "%Y-%m-%d")
            # Use Nov 15 as season reference
            ref = datetime(2025, 11, 15)
            days_to_harvest = max(0, (h - ref).days)

        # Growth stage encoding: sowing=0, tillering=1, flowering=2, ripening=3
        stage_map = {"sowing": 0, "germination": 0, "tillering": 1,
                     "vegetative": 1, "flowering": 2, "grain filling": 2,
                     "ripening": 3, "maturity": 3, "harvest": 4}
        max_stage = max([stage_map.get(s, 0) for s in stage_names], default=0)

        return pd.Series({
            "crop": crop,
            "days_to_harvest": days_to_harvest if days_to_harvest else 120,
            "num_crop_stages": len(stages),
            "growth_stage_encoded": max_stage
        })
    except:
        return pd.Series({"crop": "unknown", "days_to_harvest": 120,
                          "num_crop_stages": 0, "growth_stage_encoded": 0})


def build_grower_features(growers_df):
    """Rich feature engineering on grower profiles."""
    df = growers_df.copy()

    # Parse crop calendar
    cal_features = df["grower_crop_calendar"].apply(parse_crop_calendar)
    df = pd.concat([df, cal_features], axis=1)

    # Device capability score: smartphone=2, keypad=1, unknown=0
    device_map = {"smartphone": 2, "keypad": 1, "unknown": 0}
    df["device_score"] = df["device_type"].map(device_map).fillna(0)

    # Age buckets
    df["age_group"] = pd.cut(df["grower_age"],
                              bins=[0, 30, 45, 60, 100],
                              labels=["young", "mid", "senior", "elder"])

    # Farm size buckets
    df["farm_size_bucket"] = pd.cut(df["grower_farm_size"],
                                     bins=[0, 2, 5, 10, 100],
                                     labels=["small", "medium", "large", "commercial"])

    # Engagement flags
    df["product_scan"] = df["product_scan"].astype(int)
    df["offline_campaign_attended"] = df["offline_campaign_attended"].astype(int)
    df["engagement_score"] = df["product_scan"] + df["offline_campaign_attended"]

    # Language-region alignment score (proxy for content resonance)
    lang_region = {
        "Hindi": ["Uttar Pradesh", "Rajasthan", "Madhya Pradesh", "Bihar", "Haryana"],
        "Punjabi": ["Punjab"],
        "Marathi": ["Maharashtra"],
        "Gujarati": ["Gujarat"],
        "Kannada": ["Karnataka"],
        "Bengali": ["West Bengal"]
    }
    def lang_match(row):
        langs = lang_region.get(row["language"], [])
        return 1 if row["state"] in langs else 0
    df["language_region_match"] = df.apply(lang_match, axis=1)

    # Days since product scan
    df["product_scan_datetime"] = pd.to_datetime(df["product_scan_datetime"], errors="coerce")
    ref_date = datetime(2026, 4, 1)
    df["days_since_scan"] = (ref_date - df["product_scan_datetime"]).dt.days.fillna(999)
    df["days_since_scan"] = df["days_since_scan"].clip(0, 999)

    return df


def build_wa_features(wa_df, growers_df):
    """Merge WhatsApp campaign data with grower features."""
    growers_feat = build_grower_features(growers_df)
    df = wa_df.merge(growers_feat, on="grower_id", how="left")

    # Message timing features
    df["message_sent_date"] = pd.to_datetime(df["message_sent_date"])
    df["message_dow"] = df["message_sent_date"].dt.dayofweek
    df["message_month"] = df["message_sent_date"].dt.month
    df["message_week"] = df["message_sent_date"].dt.isocalendar().week.astype(int)

    # Season timing: early (Oct-Nov), mid (Dec-Feb), late (Mar-Apr)
    def season_phase(month):
        if month in [10, 11]: return 0
        elif month in [12, 1, 2]: return 1
        else: return 2
    df["season_phase"] = df["message_month"].apply(season_phase)

    # Campaign-crop match (does the message crop match grower's crop?)
    df["crop_message_match"] = (df["campaign_crop"] == df["crop"]).astype(int)

    return df


def build_pos_features(pos_df, retailers_df):
    """Aggregate POS data to territory level for conversion signal."""
    merged = pos_df.merge(retailers_df[["retailer_id", "state", "district"]], on="retailer_id")
    
    # Monthly sales volume by SKU + district
    merged["transaction_date"] = pd.to_datetime(merged["transaction_date"])
    merged["month"] = merged["transaction_date"].dt.month

    agg = merged.groupby(["district", "sku_name"]).agg(
        total_qty=("sku_qty", "sum"),
        total_revenue=("sku_price", "sum"),
        num_transactions=("transaction_id", "count")
    ).reset_index()
    agg["avg_price"] = agg["total_revenue"] / agg["num_transactions"]
    return agg


# ─────────────────────────────────────────────
# 2. MODEL 1: WhatsApp ENGAGEMENT PREDICTOR
#    Target: clicked_status (conversion proxy)
# ─────────────────────────────────────────────

def train_engagement_model(wa_df, growers_df):
    print("\n" + "="*60)
    print("MODEL 1: Engagement (Click) Predictor")
    print("="*60)

    df = build_wa_features(wa_df, growers_df)

    feature_cols = [
        "device_score", "grower_age", "grower_farm_size",
        "engagement_score", "product_scan", "offline_campaign_attended",
        "language_region_match", "days_since_scan",
        "message_dow", "message_month", "season_phase",
        "crop_message_match", "growth_stage_encoded",
        "days_to_harvest", "num_crop_stages"
    ]

    # Encode categoricals
    le_crop = LabelEncoder()
    df["crop_enc"] = le_crop.fit_transform(df["crop"].fillna("unknown"))
    feature_cols.append("crop_enc")

    le_lang = LabelEncoder()
    df["lang_enc"] = le_lang.fit_transform(df["language"].fillna("Hindi"))
    feature_cols.append("lang_enc")

    le_state = LabelEncoder()
    df["state_enc"] = le_state.fit_transform(df["state"].fillna("Unknown"))
    feature_cols.append("state_enc")

    X = df[feature_cols].fillna(0)
    y = df["clicked_status"].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y)

    # Handle severe class imbalance with manual oversampling of minority class
    from imblearn.over_sampling import SMOTE
    sm = SMOTE(random_state=42, k_neighbors=3)
    X_train_bal, y_train_bal = sm.fit_resample(X_train, y_train)
    print(f"  After SMOTE — Class balance: {dict(zip(*np.unique(y_train_bal, return_counts=True)))}")

    # Gradient Boosting — best for tabular imbalanced data
    model = GradientBoostingClassifier(
        n_estimators=200, max_depth=4, learning_rate=0.05,
        subsample=0.8, min_samples_leaf=10, random_state=42
    )
    model.fit(X_train_bal, y_train_bal)

    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    auc = roc_auc_score(y_test, y_prob)
    print(f"  AUC-ROC: {auc:.4f}")
    print(f"  Classification Report:\n{classification_report(y_test, y_pred)}")

    # Feature importance
    feat_imp = pd.DataFrame({
        "feature": feature_cols,
        "importance": model.feature_importances_
    }).sort_values("importance", ascending=False)
    print(f"\n  Top 5 Features:\n{feat_imp.head(5).to_string(index=False)}")

    # Save model + encoders
    bundle = {
        "model": model,
        "feature_cols": feature_cols,
        "le_crop": le_crop,
        "le_lang": le_lang,
        "le_state": le_state,
        "auc": auc
    }
    joblib.dump(bundle, f"{MODEL_DIR}/engagement_model.pkl")
    print(f"  ✅ Saved: models/engagement_model.pkl")
    return bundle


# ─────────────────────────────────────────────
# 3. MODEL 2: CHANNEL RECOMMENDER
#    Multi-label: recommend best channel per grower
# ─────────────────────────────────────────────

def train_channel_recommender(growers_df):
    print("\n" + "="*60)
    print("MODEL 2: Channel Recommender")
    print("="*60)

    df = build_grower_features(growers_df)

    # Rule-enriched heuristic + ML hybrid
    # Channels: 0=WhatsApp, 1=SMS, 2=Voice, 3=Retailer
    def assign_channel(row):
        if row["device_type"] == "smartphone" and row["engagement_score"] >= 1:
            return 0  # WhatsApp
        elif row["device_type"] == "smartphone":
            return 0  # Still WhatsApp but lower priority
        elif row["device_type"] == "keypad":
            if row["grower_age"] > 55:
                return 2  # Voice call for older feature phone users
            return 1  # SMS for younger feature phone users
        else:
            return 3  # Retailer visit for unknown/offline

    df["best_channel"] = df.apply(assign_channel, axis=1)

    feature_cols = [
        "device_score", "grower_age", "grower_farm_size",
        "engagement_score", "language_region_match",
        "growth_stage_encoded", "days_to_harvest"
    ]

    le_state = LabelEncoder()
    df["state_enc"] = le_state.fit_transform(df["state"].fillna("Unknown"))
    feature_cols.append("state_enc")

    X = df[feature_cols].fillna(0)
    y = df["best_channel"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(
        n_estimators=200, max_depth=6, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    acc = model.score(X_test, y_test)
    print(f"  Accuracy: {acc:.4f}")

    channel_labels = {0: "WhatsApp", 1: "SMS", 2: "Voice", 3: "Retailer Visit"}
    bundle = {
        "model": model,
        "feature_cols": feature_cols,
        "le_state": le_state,
        "channel_labels": channel_labels,
        "accuracy": acc
    }
    joblib.dump(bundle, f"{MODEL_DIR}/channel_model.pkl")
    print(f"  ✅ Saved: models/channel_model.pkl")
    return bundle


# ─────────────────────────────────────────────
# 4. MODEL 3: CAMPAIGN TIMING SCORE
#    Regression: predict best week offset to send
# ─────────────────────────────────────────────

def train_timing_model(wa_df, growers_df):
    print("\n" + "="*60)
    print("MODEL 3: Optimal Campaign Timing Scorer")
    print("="*60)

    df = build_wa_features(wa_df, growers_df)

    # Only use messages that were opened (positive engagement)
    df_pos = df[df["opened_status"] == True].copy()

    # Target: days before harvest the message was sent (sweet spot timing)
    df_pos["message_sent_date"] = pd.to_datetime(df_pos["message_sent_date"])

    feature_cols = [
        "crop_enc", "season_phase", "message_dow",
        "message_month", "growth_stage_encoded",
        "days_to_harvest", "device_score", "grower_age"
    ]

    le_crop = LabelEncoder()
    df_pos["crop_enc"] = le_crop.fit_transform(df_pos["crop"].fillna("unknown"))

    X = df_pos[feature_cols].fillna(0)
    y = df_pos["message_month"]  # Predict optimal month to send

    if len(X) < 50:
        print("  ⚠ Limited positive samples; using heuristic timing")
        joblib.dump({"heuristic": True, "le_crop": le_crop}, f"{MODEL_DIR}/timing_model.pkl")
        return None

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestRegressor(n_estimators=100, max_depth=5, random_state=42)
    model.fit(X_train, y_train)

    mae = mean_absolute_error(y_test, model.predict(X_test))
    print(f"  MAE (month): {mae:.3f}")

    bundle = {"model": model, "feature_cols": feature_cols,
              "le_crop": le_crop, "mae": mae}
    joblib.dump(bundle, f"{MODEL_DIR}/timing_model.pkl")
    print(f"  ✅ Saved: models/timing_model.pkl")
    return bundle


# ─────────────────────────────────────────────
# 5. MODEL 4: PRODUCT AFFINITY RECOMMENDER
#    Predict which product to promote for a grower
# ─────────────────────────────────────────────

def train_product_affinity(growers_df, wa_df, pos_df, retailers_df):
    print("\n" + "="*60)
    print("MODEL 4: Product Affinity Recommender")
    print("="*60)

    # Growers who scanned a product → that's an affinity signal
    df = build_grower_features(growers_df)
    df_scanned = df[df["product_scan"] == 1].copy()

    # Also use WA clicked data as signal
    wa_clicked = wa_df[wa_df["clicked_status"] == True][["grower_id", "campaign_product"]].copy()
    wa_clicked.rename(columns={"campaign_product": "product_name"}, inplace=True)
    # Build from scanned growers
    scanned_part = df_scanned[["grower_id", "state", "language", "device_score",
                     "grower_age", "grower_farm_size", "crop", "growth_stage_encoded",
                     "days_to_harvest", "engagement_score", "product_name"]].copy()

    # Build from WA clicks
    wa_merged = df.merge(wa_clicked, on="grower_id", how="inner", suffixes=("_grower", "_wa"))
    # Use WA product name (more reliable signal)
    wa_merged["product_name"] = wa_merged.get("product_name_wa", wa_merged.get("product_name_y", None))
    wa_part = wa_merged[["grower_id", "state", "language", "device_score", "grower_age",
             "grower_farm_size", "crop", "growth_stage_encoded", "days_to_harvest",
             "engagement_score", "product_name"]].copy()

    df_scanned_wa = pd.concat([scanned_part, wa_part], ignore_index=True).dropna(subset=["product_name"])

    print(f"  Training samples: {len(df_scanned_wa)}")
    print(f"  Products: {df_scanned_wa['product_name'].nunique()}")

    feature_cols = [
        "device_score", "grower_age", "grower_farm_size",
        "engagement_score", "growth_stage_encoded", "days_to_harvest"
    ]

    le_crop = LabelEncoder()
    df_scanned_wa["crop_enc"] = le_crop.fit_transform(df_scanned_wa["crop"].fillna("unknown"))
    feature_cols.append("crop_enc")

    le_state = LabelEncoder()
    df_scanned_wa["state_enc"] = le_state.fit_transform(df_scanned_wa["state"].fillna("Unknown"))
    feature_cols.append("state_enc")

    le_lang = LabelEncoder()
    df_scanned_wa["lang_enc"] = le_lang.fit_transform(df_scanned_wa["language"].fillna("Hindi"))
    feature_cols.append("lang_enc")

    le_product = LabelEncoder()
    df_scanned_wa["product_enc"] = le_product.fit_transform(df_scanned_wa["product_name"])

    X = df_scanned_wa[feature_cols].fillna(0)
    y = df_scanned_wa["product_enc"]

    if len(X) < 20:
        print("  ⚠ Not enough data for product model; saving label encoder only")
        joblib.dump({"le_product": le_product}, f"{MODEL_DIR}/product_model.pkl")
        return None

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42,
        stratify=y if y.value_counts().min() >= 2 else None)

    model = RandomForestClassifier(n_estimators=200, max_depth=6, random_state=42)
    model.fit(X_train, y_train)

    acc = model.score(X_test, y_test)
    print(f"  Top-1 Accuracy: {acc:.4f}")

    bundle = {
        "model": model, "feature_cols": feature_cols,
        "le_crop": le_crop, "le_state": le_state,
        "le_lang": le_lang, "le_product": le_product, "accuracy": acc
    }
    joblib.dump(bundle, f"{MODEL_DIR}/product_model.pkl")
    print(f"  ✅ Saved: models/product_model.pkl")
    return bundle


# ─────────────────────────────────────────────
# 6. MODEL 5: CONVERSION PROPENSITY SCORE
#    Master score: P(farmer takes action after campaign)
# ─────────────────────────────────────────────

def train_conversion_model(wa_df, growers_df, pos_df, retailers_df):
    print("\n" + "="*60)
    print("MODEL 5: Conversion Propensity (Master KPI Model)")
    print("="*60)

    df = build_wa_features(wa_df, growers_df)

    # Ground truth conversion: clicked WhatsApp + grower's district had POS sales
    # of same product within 30 days after message
    pos_df["transaction_date"] = pd.to_datetime(pos_df["transaction_date"])
    pos_enriched = pos_df.merge(
        retailers_df[["retailer_id", "district"]], on="retailer_id")

    # Create district-product-date lookup
    pos_lookup = set()
    for _, row in pos_enriched.iterrows():
        key = (row["district"], row["sku_name"],
               row["transaction_date"].strftime("%Y-%m"))
        pos_lookup.add(key)

    def is_converted(row):
        # Strong signal: clicked AND opened
        if row["clicked_status"]: return 1
        if row["opened_status"] and row.get("product_scan", 0) == 1: return 1
        return 0

    df["converted"] = df.apply(is_converted, axis=1)
    print(f"  Conversion rate: {df['converted'].mean():.3%}")

    feature_cols = [
        "device_score", "grower_age", "grower_farm_size",
        "engagement_score", "product_scan", "offline_campaign_attended",
        "language_region_match", "days_since_scan",
        "message_dow", "season_phase", "crop_message_match",
        "growth_stage_encoded", "days_to_harvest", "num_crop_stages"
    ]

    le_crop = LabelEncoder()
    df["crop_enc"] = le_crop.fit_transform(df["crop"].fillna("unknown"))
    feature_cols.append("crop_enc")

    le_lang = LabelEncoder()
    df["lang_enc"] = le_lang.fit_transform(df["language"].fillna("Hindi"))
    feature_cols.append("lang_enc")

    le_state = LabelEncoder()
    df["state_enc"] = le_state.fit_transform(df["state"].fillna("Unknown"))
    feature_cols.append("state_enc")

    X = df[feature_cols].fillna(0)
    y = df["converted"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y)

    # Oversample minority class
    from imblearn.over_sampling import SMOTE
    sm = SMOTE(random_state=42, k_neighbors=3)
    X_train_bal, y_train_bal = sm.fit_resample(X_train, y_train)
    print(f"  After SMOTE — Class balance: {dict(zip(*np.unique(y_train_bal, return_counts=True)))}")

    # Class weight to handle imbalance
    model = GradientBoostingClassifier(
        n_estimators=300, max_depth=4, learning_rate=0.05,
        subsample=0.8, min_samples_leaf=5, random_state=42
    )
    model.fit(X_train_bal, y_train_bal)

    y_prob = model.predict_proba(X_test)[:, 1]
    auc = roc_auc_score(y_test, y_prob)
    print(f"  AUC-ROC: {auc:.4f}")
    print(f"  Classification Report:\n{classification_report(y_test, model.predict(X_test))}")

    feat_imp = pd.DataFrame({
        "feature": feature_cols,
        "importance": model.feature_importances_
    }).sort_values("importance", ascending=False)
    print(f"\n  Top 7 Conversion Drivers:\n{feat_imp.head(7).to_string(index=False)}")

    bundle = {
        "model": model, "feature_cols": feature_cols,
        "le_crop": le_crop, "le_lang": le_lang, "le_state": le_state, "auc": auc
    }
    joblib.dump(bundle, f"{MODEL_DIR}/conversion_model.pkl")
    print(f"  ✅ Saved: models/conversion_model.pkl")
    return bundle


# ─────────────────────────────────────────────
# 7. MICRO-SEGMENTATION (No model needed — rule + cluster)
# ─────────────────────────────────────────────

def build_micro_segments(growers_df):
    print("\n" + "="*60)
    print("MICRO-SEGMENTS: Grower Persona Matrix")
    print("="*60)

    from sklearn.cluster import KMeans
    df = build_grower_features(growers_df)

    le_crop = LabelEncoder()
    df["crop_enc"] = le_crop.fit_transform(df["crop"].fillna("unknown"))
    le_state = LabelEncoder()
    df["state_enc"] = le_state.fit_transform(df["state"].fillna("Unknown"))

    cluster_features = [
        "device_score", "grower_age", "grower_farm_size",
        "engagement_score", "growth_stage_encoded",
        "days_to_harvest", "crop_enc", "language_region_match"
    ]
    X = df[cluster_features].fillna(0)

    from sklearn.preprocessing import StandardScaler
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    kmeans = KMeans(n_clusters=8, random_state=42, n_init=10)
    df["segment"] = kmeans.fit_predict(X_scaled)

    # Label segments
    segment_labels = {
        0: "Digital-Savvy Large Farmer",
        1: "Traditional Smallholder",
        2: "Young Tech-Adopter",
        3: "Senior Feature Phone User",
        4: "High-Value Commercial Farmer",
        5: "Offline-First Rural Farmer",
        6: "Engaged Multi-Crop Farmer",
        7: "New-to-Brand Explorer"
    }

    seg_summary = df.groupby("segment").agg(
        count=("grower_id", "count"),
        avg_farm_size=("grower_farm_size", "mean"),
        avg_age=("grower_age", "mean"),
        avg_device_score=("device_score", "mean"),
        avg_engagement=("engagement_score", "mean"),
        top_crop=("crop", lambda x: x.mode()[0] if len(x) > 0 else "unknown")
    ).reset_index()
    seg_summary["persona"] = seg_summary["segment"].map(segment_labels)
    print(seg_summary[["persona", "count", "avg_farm_size",
                         "avg_age", "avg_device_score", "top_crop"]].to_string(index=False))

    bundle = {
        "kmeans": kmeans, "scaler": scaler,
        "cluster_features": cluster_features,
        "segment_labels": segment_labels,
        "le_crop": le_crop
    }
    joblib.dump(bundle, f"{MODEL_DIR}/segmentation_model.pkl")
    print(f"  ✅ Saved: models/segmentation_model.pkl")
    return bundle, df


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────

def main():
    print("🌱 Syngenta IITM Hackathon 2026 — ML Training Pipeline")
    print("="*60)

    print("Loading datasets...")
    growers    = pd.read_csv(f"{DATA_DIR}/growers.csv")
    wa         = pd.read_csv(f"{DATA_DIR}/whatsapp_campaign.csv")
    pos        = pd.read_csv(f"{DATA_DIR}/retailer_pos.csv")
    retailers  = pd.read_csv(f"{DATA_DIR}/retailers.csv")
    funnel     = pd.read_csv(f"{DATA_DIR}/digital_funnel_weekly.csv")

    print(f"  Growers: {len(growers):,} | WhatsApp msgs: {len(wa):,} | POS txns: {len(pos):,}")

    # Train all models
    m1 = train_engagement_model(wa, growers)
    m2 = train_channel_recommender(growers)
    m3 = train_timing_model(wa, growers)
    m4 = train_product_affinity(growers, wa, pos, retailers)
    m5 = train_conversion_model(wa, growers, pos, retailers)
    seg_bundle, seg_df = build_micro_segments(growers)

    # Save metadata
    metadata = {
        "trained_at": datetime.now().isoformat(),
        "models": {
            "engagement": {"auc": float(m1["auc"])},
            "channel": {"accuracy": float(m2["accuracy"])},
            "conversion": {"auc": float(m5["auc"])},
        },
        "data_stats": {
            "growers": len(growers),
            "wa_messages": len(wa),
            "pos_transactions": len(pos)
        }
    }
    with open(f"{MODEL_DIR}/metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)

    print("\n" + "="*60)
    print("✅ ALL MODELS TRAINED SUCCESSFULLY")
    print(f"   Engagement AUC:  {m1['auc']:.4f}")
    print(f"   Channel Acc:     {m2['accuracy']:.4f}")
    print(f"   Conversion AUC:  {m5['auc']:.4f}")
    print("="*60)
    print("\nNext step: python api.py  →  starts Flask API on port 5000")


if __name__ == "__main__":
    main()
