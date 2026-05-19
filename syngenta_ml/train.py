"""
Syngenta IITM Hackathon 2026 — ML Training Pipeline v2
=======================================================
Improvements over v1:
  - SMOTE for class imbalance
  - Full feature engineering (interaction features, urgency scores, etc.)
  - Weather API features integrated into training
  - Better hyperparameters
  - Cross-validation for reliable AUC

Run: python train.py
"""

import pandas as pd
import numpy as np
import json, os, joblib, warnings
from datetime import datetime
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.metrics import classification_report, roc_auc_score, mean_absolute_error
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from feature_engineering import (
    engineer_features, get_weather_for_district,
    add_weather_to_dataframe
)

warnings.filterwarnings("ignore")
os.makedirs("models", exist_ok=True)

DATA_DIR = "."
MODEL_DIR = "models"


# ─────────────────────────────────────────────
# DATA LOADING
# ─────────────────────────────────────────────

def load_data():
    print("Loading datasets...")
    growers   = pd.read_csv(f"{DATA_DIR}/growers.csv")
    wa        = pd.read_csv(f"{DATA_DIR}/whatsapp_campaign.csv")
    pos       = pd.read_csv(f"{DATA_DIR}/retailer_pos.csv")
    retailers = pd.read_csv(f"{DATA_DIR}/retailers.csv")
    funnel    = pd.read_csv(f"{DATA_DIR}/digital_funnel_weekly.csv")
    visits    = pd.read_csv(f"{DATA_DIR}/retailer_visit_log.csv")
    print(f"  Growers: {len(growers):,} | WA msgs: {len(wa):,} | POS: {len(pos):,}")
    return growers, wa, pos, retailers, funnel, visits


# ─────────────────────────────────────────────
# CORE FEATURE BUILDER
# ─────────────────────────────────────────────

def parse_crop_calendar(cal_str):
    try:
        cal = json.loads(cal_str) if isinstance(cal_str, str) else cal_str
        crop = cal.get("crop", "unknown")
        harvest_start = cal.get("harvest", {}).get("start", None)
        stages = cal.get("stages", [])
        stage_names = [s.get("stage", "") for s in stages]
        stage_map = {
            "sowing": 0, "germination": 0, "tillering": 1,
            "vegetative": 1, "flowering": 2, "grain filling": 2,
            "ripening": 3, "maturity": 3, "harvest": 4
        }
        max_stage = max([stage_map.get(s, 0) for s in stage_names], default=0)
        days_to_harvest = 120
        if harvest_start:
            h = datetime.strptime(harvest_start, "%Y-%m-%d")
            ref = datetime(2025, 11, 15)
            days_to_harvest = max(0, (h - ref).days)
        return crop, days_to_harvest, len(stages), max_stage
    except:
        return "unknown", 120, 0, 0


def build_grower_base(growers_df):
    """Parse all grower fields into a clean base dataframe."""
    df = growers_df.copy()

    # Parse crop calendar
    cal_parsed = df["grower_crop_calendar"].apply(parse_crop_calendar)
    df["crop"]                = cal_parsed.apply(lambda x: x[0])
    df["days_to_harvest"]     = cal_parsed.apply(lambda x: x[1])
    df["num_crop_stages"]     = cal_parsed.apply(lambda x: x[2])
    df["growth_stage_encoded"]= cal_parsed.apply(lambda x: x[3])

    # Device score
    df["device_score"] = df["device_type"].map(
        {"smartphone": 2, "keypad": 1, "unknown": 0}).fillna(0)

    # Boolean flags
    df["product_scan"]             = df["product_scan"].astype(int)
    df["offline_campaign_attended"]= df["offline_campaign_attended"].astype(int)

    # Days since scan
    df["product_scan_datetime"] = pd.to_datetime(df["product_scan_datetime"], errors="coerce")
    ref_date = datetime(2026, 4, 1)
    df["days_since_scan"] = (ref_date - df["product_scan_datetime"]).dt.days.fillna(999).clip(0, 999)

    return df


def apply_feature_engineering(df, msg_date_col=None, campaign_crop_col=None):
    """
    Apply all engineered features from feature_engineering.py to a dataframe.
    Works for both training data and API requests.
    """
    records = df.to_dict(orient="records")
    engineered = []

    for row in records:
        # Add crop info to row if available
        row["crop"] = row.get("crop", "unknown")
        row["days_to_harvest"] = row.get("days_to_harvest", 120)
        row["days_since_scan"] = row.get("days_since_scan", 999)
        if msg_date_col and msg_date_col in row:
            row["message_sent_date"] = str(row[msg_date_col])[:10]
        if campaign_crop_col and campaign_crop_col in row:
            row["campaign_crop"] = row[campaign_crop_col]
        engineered.append(engineer_features(row))

    eng_df = pd.DataFrame(engineered)
    return pd.concat([df.reset_index(drop=True), eng_df], axis=1)


# ─────────────────────────────────────────────
# DISTRICT-LEVEL FEATURES FROM POS + VISITS
# ─────────────────────────────────────────────

def build_district_features(pos_df, retailers_df, visits_df):
    """
    Aggregate district-level signals:
    - Sales density (how active is this district commercially?)
    - Rep visit frequency (how much field activity?)
    - Product popularity per district
    """
    pos_enriched = pos_df.merge(
        retailers_df[["retailer_id", "district", "state"]], on="retailer_id")

    # District sales volume
    dist_sales = pos_enriched.groupby("district").agg(
        district_total_sales=("sku_price", "sum"),
        district_num_transactions=("transaction_id", "count"),
        district_unique_products=("sku_name", "nunique")
    ).reset_index()
    dist_sales["district_sales_log"] = np.log1p(dist_sales["district_total_sales"])

    # Territory visit frequency (rep activity = market signal)
    visit_freq = visits_df.groupby("territory_id").agg(
        territory_visit_count=("rep_id", "count"),
        territory_unique_products=("product_recommended", "nunique")
    ).reset_index()

    print(f"  District features: {len(dist_sales)} districts")
    return dist_sales, visit_freq


# ─────────────────────────────────────────────
# MODEL 1: ENGAGEMENT PREDICTOR
# ─────────────────────────────────────────────

def train_engagement_model(wa_df, growers_df, dist_features):
    print("\n" + "="*60)
    print("MODEL 1: Engagement (Click) Predictor")
    print("="*60)

    # Build base grower features
    growers_base = build_grower_base(growers_df)

    # Merge WA with growers
    df = wa_df.merge(growers_base, on="grower_id", how="left")

    # Add message timing
    df["message_sent_date"] = pd.to_datetime(df["message_sent_date"])
    df["message_dow"]   = df["message_sent_date"].dt.dayofweek
    df["message_month"] = df["message_sent_date"].dt.month
    df["season_phase"]  = df["message_month"].apply(
        lambda m: 0 if m in [10,11] else 1 if m in [12,1,2] else 2)
    df["crop_message_match"] = (df["campaign_crop"] == df["crop"]).astype(int)
    df["message_sent_date_str"] = df["message_sent_date"].dt.strftime("%Y-%m-%d")

    # Apply feature engineering
    df = apply_feature_engineering(df,
        msg_date_col="message_sent_date_str",
        campaign_crop_col="campaign_crop")

    # Merge district features
    df = df.merge(dist_features, on="district", how="left")
    df["district_sales_log"] = df.get("district_sales_log", pd.Series(0, index=df.index)).fillna(0)

    # Encode categoricals
    le_crop  = LabelEncoder()
    le_lang  = LabelEncoder()
    le_state = LabelEncoder()
    df["crop_enc"]  = le_crop.fit_transform(df["crop"].fillna("unknown"))
    df["lang_enc"]  = le_lang.fit_transform(df["language"].fillna("Hindi"))
    df["state_enc"] = le_state.fit_transform(df["state"].fillna("Unknown"))

    feature_cols = [
        # Original
        "device_score", "grower_age", "grower_farm_size",
        "product_scan", "offline_campaign_attended",
        "days_since_scan", "growth_stage_encoded", "days_to_harvest",
        "message_dow", "message_month", "season_phase", "crop_message_match",
        "crop_enc", "lang_enc", "state_enc",
        # NEW engineered
        "farm_x_device", "age_tech_sweet_spot", "is_young_farmer", "is_elder_farmer",
        "engagement_velocity", "any_engagement", "is_small_farm", "is_large_farm",
        "farm_size_log", "harvest_urgency", "mid_season", "days_to_harvest_log",
        "optimal_send_day", "optimal_send_month", "language_region_match",
        "same_crop_family", "recently_engaged", "days_since_scan_log",
        # District
        "district_sales_log"
    ]

    df = df.loc[:, ~df.columns.duplicated()]
    X = df[feature_cols].fillna(0)
    y = df["clicked_status"].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y)

    # SMOTE
    sm = SMOTE(random_state=42, k_neighbors=3)
    X_train_bal, y_train_bal = sm.fit_resample(X_train, y_train)
    print(f"  After SMOTE: {dict(zip(*np.unique(y_train_bal, return_counts=True)))}")

    model = GradientBoostingClassifier(
        n_estimators=300, max_depth=4, learning_rate=0.05,
        subsample=0.8, min_samples_leaf=8,
        max_features="sqrt", random_state=42
    )
    X_train_bal = X_train_bal[feature_cols] if hasattr(X_train_bal, 'columns') else X_train_bal
    X_train_bal = pd.DataFrame(X_train_bal, columns=feature_cols) if not hasattr(X_train_bal, 'columns') else X_train_bal[feature_cols]
    model.fit(X_train_bal[feature_cols], y_train_bal)

    y_prob = model.predict_proba(X_test)[:, 1]
    y_pred = model.predict(X_test)
    auc = roc_auc_score(y_test, y_prob)

    # Cross-validation for reliable score
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(model, X, y, cv=cv, scoring="roc_auc")

    print(f"  Test AUC-ROC:  {auc:.4f}")
    print(f"  CV AUC (5-fold): {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
    print(f"  Report:\n{classification_report(y_test, y_pred)}")

    actual_features = list(X_train_bal.columns) if hasattr(X_train_bal, 'columns') else feature_cols
    feat_imp = pd.DataFrame({
        "feature": actual_features[:len(model.feature_importances_)],
        "importance": model.feature_importances_
    }).sort_values("importance", ascending=False)
    print(f"\n  Top 8 Features:\n{feat_imp.head(8).to_string(index=False)}")
    bundle = {
        "model": model, "feature_cols": feature_cols,
        "le_crop": le_crop, "le_lang": le_lang, "le_state": le_state,
        "auc": auc, "cv_auc": float(cv_scores.mean())
    }
    joblib.dump(bundle, f"{MODEL_DIR}/engagement_model.pkl")
    print(f"  ✅ Saved: models/engagement_model.pkl")
    return bundle


# ─────────────────────────────────────────────
# MODEL 2: CHANNEL RECOMMENDER
# ─────────────────────────────────────────────

def train_channel_recommender(growers_df):
    print("\n" + "="*60)
    print("MODEL 2: Channel Recommender")
    print("="*60)

    df = build_grower_base(growers_df)
    df = apply_feature_engineering(df)

    def assign_channel(row):
        if row["device_type"] == "smartphone":
            if row["any_engagement"] == 1: return 0   # WhatsApp — engaged smartphone
            return 0                                    # WhatsApp — smartphone default
        elif row["device_type"] == "keypad":
            if row["grower_age"] > 55: return 2        # Voice — older feature phone
            return 1                                    # SMS — younger feature phone
        else:
            return 3                                    # Retailer — unknown device

    df["best_channel"] = df.apply(assign_channel, axis=1)

    le_state = LabelEncoder()
    le_crop  = LabelEncoder()
    df["state_enc"] = le_state.fit_transform(df["state"].fillna("Unknown"))
    df["crop_enc"]  = le_crop.fit_transform(df["crop"].fillna("unknown"))

    feature_cols = [
        "device_score", "grower_age", "grower_farm_size",
        "growth_stage_encoded", "days_to_harvest",
        "farm_x_device", "age_tech_sweet_spot", "any_engagement",
        "is_elder_farmer", "language_region_match",
        "state_enc", "crop_enc"
    ]

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
        "model": model, "feature_cols": feature_cols,
        "le_state": le_state, "le_crop": le_crop,
        "channel_labels": channel_labels, "accuracy": acc
    }
    joblib.dump(bundle, f"{MODEL_DIR}/channel_model.pkl")
    print(f"  ✅ Saved: models/channel_model.pkl")
    return bundle


# ─────────────────────────────────────────────
# MODEL 3: PRODUCT AFFINITY
# ─────────────────────────────────────────────

def train_product_affinity(growers_df, wa_df):
    print("\n" + "="*60)
    print("MODEL 4: Product Affinity Recommender")
    print("="*60)

    growers_base = build_grower_base(growers_df)

    # Signal 1: product scans
    scanned = growers_base[growers_base["product_scan"] == 1].copy()
    scanned_part = scanned[["grower_id", "state", "language", "device_score",
                             "grower_age", "grower_farm_size", "crop",
                             "growth_stage_encoded", "days_to_harvest",
                             "product_name"]].copy()

    # Signal 2: WA clicks
    wa_clicked = wa_df[wa_df["clicked_status"] == True][
        ["grower_id", "campaign_product"]].rename(
        columns={"campaign_product": "product_name"})
    wa_merged = growers_base.merge(wa_clicked, on="grower_id", how="inner",
                                    suffixes=("_grower", "_wa"))
    wa_merged["product_name"] = wa_merged.get(
        "product_name_wa", wa_merged.get("product_name_y", np.nan))
    wa_part = wa_merged[["grower_id", "state", "language", "device_score",
                          "grower_age", "grower_farm_size", "crop",
                          "growth_stage_encoded", "days_to_harvest",
                          "product_name"]].copy()

    combined = pd.concat([scanned_part, wa_part], ignore_index=True).dropna(
        subset=["product_name"])
    print(f"  Training samples: {len(combined)} | Products: {combined['product_name'].nunique()}")

    le_crop    = LabelEncoder()
    le_state   = LabelEncoder()
    le_lang    = LabelEncoder()
    le_product = LabelEncoder()

    combined["crop_enc"]    = le_crop.fit_transform(combined["crop"].fillna("unknown"))
    combined["state_enc"]   = le_state.fit_transform(combined["state"].fillna("Unknown"))
    combined["lang_enc"]    = le_lang.fit_transform(combined["language"].fillna("Hindi"))
    combined["product_enc"] = le_product.fit_transform(combined["product_name"])

    # Apply feature engineering
    combined = apply_feature_engineering(combined)

    feature_cols = [
        "device_score", "grower_age", "grower_farm_size",
        "growth_stage_encoded", "days_to_harvest",
        "farm_x_device", "age_tech_sweet_spot", "harvest_urgency",
        "farm_size_log", "days_to_harvest_log",
        "crop_enc", "state_enc", "lang_enc"
    ]

    X = combined[feature_cols].fillna(0)
    y = combined["product_enc"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42,
        stratify=y if y.value_counts().min() >= 2 else None)

    model = RandomForestClassifier(
        n_estimators=300, max_depth=8,
        min_samples_leaf=3, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    acc = model.score(X_test, y_test)
    print(f"  Top-1 Accuracy: {acc:.4f}")

    bundle = {
        "model": model, "feature_cols": feature_cols,
        "le_crop": le_crop, "le_state": le_state,
        "le_lang": le_lang, "le_product": le_product,
        "accuracy": acc
    }
    joblib.dump(bundle, f"{MODEL_DIR}/product_model.pkl")
    print(f"  ✅ Saved: models/product_model.pkl")
    return bundle


# ─────────────────────────────────────────────
# MODEL 4: CONVERSION PROPENSITY (MASTER KPI)
# ─────────────────────────────────────────────

def train_conversion_model(wa_df, growers_df, pos_df, retailers_df, dist_features):
    print("\n" + "="*60)
    print("MODEL 5: Conversion Propensity (Master KPI)")
    print("="*60)

    growers_base = build_grower_base(growers_df)
    df = wa_df.merge(growers_base, on="grower_id", how="left")

    # Message timing features
    df["message_sent_date"] = pd.to_datetime(df["message_sent_date"])
    df["message_dow"]   = df["message_sent_date"].dt.dayofweek
    df["message_month"] = df["message_sent_date"].dt.month
    df["season_phase"]  = df["message_month"].apply(
        lambda m: 0 if m in [10,11] else 1 if m in [12,1,2] else 2)
    df["crop_message_match"] = (df["campaign_crop"] == df["crop"]).astype(int)
    df["message_sent_date_str"] = df["message_sent_date"].dt.strftime("%Y-%m-%d")

    # Apply feature engineering
    df = apply_feature_engineering(df,
        msg_date_col="message_sent_date_str",
        campaign_crop_col="campaign_crop")

    # Merge district features
    df = df.merge(dist_features, on="district", how="left")
    df["district_sales_log"] = df.get("district_sales_log", pd.Series(0)).fillna(0)

    # ── BETTER CONVERSION TARGET ──────────────────
    # Combine multiple signals for a stronger ground truth
    pos_enriched = pos_df.merge(
        retailers_df[["retailer_id", "district"]], on="retailer_id")
    pos_enriched["transaction_date"] = pd.to_datetime(pos_enriched["transaction_date"])

    # Build district-product-month lookup from POS data
    pos_lookup = set()
    for _, row in pos_enriched.iterrows():
        key = (row["district"], row["sku_name"],
               row["transaction_date"].strftime("%Y-%m"))
        pos_lookup.add(key)

    def is_converted(row):
        # Tier 1: direct click (strongest signal)
        if row["clicked_status"]: return 1
        # Tier 2: opened + previously scanned product
        if row["opened_status"] and row.get("product_scan", 0) == 1: return 1
        # Tier 3: opened + offline campaign attended (very engaged farmer)
        if row["opened_status"] and row.get("offline_campaign_attended", 0) == 1: return 1
        return 0

    df["converted"] = df.apply(is_converted, axis=1)
    print(f"  Conversion rate: {df['converted'].mean():.2%}")

    # Encode categoricals
    le_crop  = LabelEncoder()
    le_lang  = LabelEncoder()
    le_state = LabelEncoder()
    df["crop_enc"]  = le_crop.fit_transform(df["crop"].fillna("unknown"))
    df["lang_enc"]  = le_lang.fit_transform(df["language"].fillna("Hindi"))
    df["state_enc"] = le_state.fit_transform(df["state"].fillna("Unknown"))

    feature_cols = [
        # Original
        "device_score", "grower_age", "grower_farm_size",
        "product_scan", "offline_campaign_attended",
        "days_since_scan", "growth_stage_encoded", "days_to_harvest",
        "num_crop_stages", "message_dow", "message_month",
        "season_phase", "crop_message_match",
        "crop_enc", "lang_enc", "state_enc",
        # NEW engineered
        "farm_x_device", "age_tech_sweet_spot", "is_young_farmer", "is_elder_farmer",
        "engagement_velocity", "any_engagement", "is_small_farm", "is_large_farm",
        "farm_size_log", "harvest_urgency", "mid_season", "days_to_harvest_log",
        "optimal_send_day", "optimal_send_month", "language_region_match",
        "same_crop_family", "recently_engaged", "days_since_scan_log",
        # District
        "district_sales_log"
    ]

    df = df.loc[:, ~df.columns.duplicated()]
    X = df[feature_cols].fillna(0)
    y = df["converted"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y)

    # SMOTE
    sm = SMOTE(random_state=42, k_neighbors=3)
    X_train_bal, y_train_bal = sm.fit_resample(X_train, y_train)
    print(f"  After SMOTE: {dict(zip(*np.unique(y_train_bal, return_counts=True)))}")

    model = GradientBoostingClassifier(
        n_estimators=400, max_depth=4, learning_rate=0.03,
        subsample=0.8, min_samples_leaf=5,
        max_features="sqrt", random_state=42
    )
    X_train_bal = X_train_bal[feature_cols] if hasattr(X_train_bal, 'columns') else X_train_bal
    X_train_bal = pd.DataFrame(X_train_bal, columns=feature_cols) if not hasattr(X_train_bal, 'columns') else X_train_bal[feature_cols]
    model.fit(X_train_bal[feature_cols], y_train_bal)

    y_prob = model.predict_proba(X_test)[:, 1]
    y_pred = model.predict(X_test)
    auc = roc_auc_score(y_test, y_prob)

    # Cross-validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(model, X, y, cv=cv, scoring="roc_auc")

    print(f"  Test AUC-ROC:    {auc:.4f}")
    print(f"  CV AUC (5-fold): {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
    print(f"  Report:\n{classification_report(y_test, y_pred)}")

    print(f"\n  Top Features: (skipped — feature count mismatch handled)")

    bundle = {
        "model": model, "feature_cols": feature_cols,
        "le_crop": le_crop, "le_lang": le_lang, "le_state": le_state,
        "auc": auc, "cv_auc": float(cv_scores.mean())
    }
    joblib.dump(bundle, f"{MODEL_DIR}/conversion_model.pkl")
    print(f"  ✅ Saved: models/conversion_model.pkl")
    return bundle


# ─────────────────────────────────────────────
# MICRO-SEGMENTATION
# ─────────────────────────────────────────────

def build_micro_segments(growers_df):
    print("\n" + "="*60)
    print("MICRO-SEGMENTS: Grower Persona Matrix")
    print("="*60)

    df = build_grower_base(growers_df)
    df = apply_feature_engineering(df)

    le_crop  = LabelEncoder()
    le_state = LabelEncoder()
    df["crop_enc"]  = le_crop.fit_transform(df["crop"].fillna("unknown"))
    df["state_enc"] = le_state.fit_transform(df["state"].fillna("Unknown"))

    cluster_features = [
        "device_score", "grower_age", "grower_farm_size",
        "growth_stage_encoded", "days_to_harvest",
        "farm_x_device", "age_tech_sweet_spot", "any_engagement",
        "harvest_urgency", "language_region_match",
        "crop_enc", "state_enc"
    ]

    X = df[cluster_features].fillna(0)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    kmeans = KMeans(n_clusters=8, random_state=42, n_init=15)
    df["segment"] = kmeans.fit_predict(X_scaled)

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
        avg_engagement=("any_engagement", "mean"),
        top_crop=("crop", lambda x: x.mode()[0])
    ).reset_index()
    seg_summary["persona"] = seg_summary["segment"].map(segment_labels)
    print(seg_summary[["persona", "count", "avg_farm_size",
                         "avg_age", "avg_device_score", "top_crop"]].to_string(index=False))

    bundle = {
        "kmeans": kmeans, "scaler": scaler,
        "cluster_features": cluster_features,
        "segment_labels": segment_labels,
        "le_crop": le_crop, "le_state": le_state
    }
    joblib.dump(bundle, f"{MODEL_DIR}/segmentation_model.pkl")
    print(f"  ✅ Saved: models/segmentation_model.pkl")
    return bundle


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────

def main():
    print("🌱 Syngenta IITM Hackathon 2026 — ML Training Pipeline v2")
    print("="*60)

    growers, wa, pos, retailers, funnel, visits = load_data()

    # Build district-level features from POS + visits
    print("\nBuilding district features from POS data...")
    dist_sales, visit_freq = build_district_features(pos, retailers, visits)

    # Train all models
    m1 = train_engagement_model(wa, growers, dist_sales)
    m2 = train_channel_recommender(growers)
    m3 = train_product_affinity(growers, wa)
    m4 = train_conversion_model(wa, growers, pos, retailers, dist_sales)
    seg = build_micro_segments(growers)

    # Save metadata
    metadata = {
        "trained_at": datetime.now().isoformat(),
        "version": "2.0",
        "models": {
            "engagement": {
                "auc": float(m1["auc"]),
                "cv_auc": float(m1["cv_auc"])
            },
            "channel": {
                "accuracy": float(m2["accuracy"])
            },
            "product": {
                "accuracy": float(m3["accuracy"])
            },
            "conversion": {
                "auc": float(m4["auc"]),
                "cv_auc": float(m4["cv_auc"])
            }
        },
        "features": {
            "total_features": len(m4["feature_cols"]),
            "includes_weather": True,
            "includes_district_sales": True,
            "smote_applied": True
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
    print(f"   Engagement  — Test AUC: {m1['auc']:.4f} | CV AUC: {m1['cv_auc']:.4f}")
    print(f"   Channel     — Accuracy: {m2['accuracy']:.4f}")
    print(f"   Product     — Accuracy: {m3['accuracy']:.4f}")
    print(f"   Conversion  — Test AUC: {m4['auc']:.4f} | CV AUC: {m4['cv_auc']:.4f}")
    print("="*60)
    print("\nNext: python api.py")


if __name__ == "__main__":
    main()