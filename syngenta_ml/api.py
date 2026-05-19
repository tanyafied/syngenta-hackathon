"""
Syngenta IITM Hackathon 2026 — ML REST API
==========================================
Run: python api.py
Base URL: http://localhost:5000

Endpoints:
  POST /predict/engagement      — Will this grower engage with a campaign?
  POST /predict/channel         — Best channel for this grower
  POST /predict/product         — Best product to recommend
  POST /predict/conversion      — Overall conversion propensity score
  POST /predict/full            — All predictions in one call (recommended)
  POST /segment                 — Get grower persona/segment
  GET  /health                  — Health check
  GET  /models/info             — Model performance stats
"""

from flask import Flask, request, jsonify
import joblib, json, os, traceback
import pandas as pd
import numpy as np
from datetime import datetime

app = Flask(__name__)
MODEL_DIR = "models"

# ─── Load models at startup ───────────────────
models = {}

def load_models():
    global models
    model_files = {
        "engagement": "engagement_model.pkl",
        "channel":    "channel_model.pkl",
        "timing":     "timing_model.pkl",
        "product":    "product_model.pkl",
        "conversion": "conversion_model.pkl",
        "segment":    "segmentation_model.pkl",
    }
    for name, fname in model_files.items():
        path = os.path.join(MODEL_DIR, fname)
        if os.path.exists(path):
            models[name] = joblib.load(path)
            print(f"  ✅ Loaded: {name}")
        else:
            print(f"  ⚠  Missing: {name} ({path})")

    meta_path = os.path.join(MODEL_DIR, "metadata.json")
    if os.path.exists(meta_path):
        with open(meta_path) as f:
            models["metadata"] = json.load(f)


# ─── Feature builder (mirrors train.py) ───────

CROP_STAGE_MAP = {
    "sowing": 0, "germination": 0, "tillering": 1,
    "vegetative": 1, "flowering": 2, "grain filling": 2,
    "ripening": 3, "maturity": 3, "harvest": 4
}

LANG_REGION = {
    "Hindi": ["Uttar Pradesh", "Rajasthan", "Madhya Pradesh", "Bihar", "Haryana"],
    "Punjabi": ["Punjab"],
    "Marathi": ["Maharashtra"],
    "Gujarati": ["Gujarat"],
    "Kannada": ["Karnataka"],
    "Bengali": ["West Bengal"]
}

DEVICE_MAP = {"smartphone": 2, "keypad": 1, "unknown": 0}

def parse_crop_calendar_api(cal):
    """Accept dict or JSON string, return crop features."""
    if isinstance(cal, str):
        try:
            cal = json.loads(cal)
        except:
            return {"crop": "unknown", "days_to_harvest": 120,
                    "num_crop_stages": 0, "growth_stage_encoded": 0}

    crop = cal.get("crop", "unknown")
    harvest_start = cal.get("harvest", {}).get("start", None)
    stages = cal.get("stages", [])
    stage_names = [s.get("stage", "") for s in stages]
    max_stage = max([CROP_STAGE_MAP.get(s, 0) for s in stage_names], default=0)

    days_to_harvest = 120
    if harvest_start:
        try:
            h = datetime.strptime(harvest_start, "%Y-%m-%d")
            ref = datetime(2025, 11, 15)
            days_to_harvest = max(0, (h - ref).days)
        except:
            pass

    return {
        "crop": crop,
        "days_to_harvest": days_to_harvest,
        "num_crop_stages": len(stages),
        "growth_stage_encoded": max_stage
    }


def build_features_from_request(data: dict) -> dict:
    """
    Build all features from a grower + campaign request payload.
    
    Expected fields (all optional with defaults):
      grower_id, state, district, language, device_type, grower_age,
      gender, grower_crop_calendar (JSON), product_scan (bool),
      offline_campaign_attended (bool), grower_farm_size,
      campaign_crop, message_sent_date (ISO string)
    """
    # Calendar parsing
    cal = data.get("grower_crop_calendar", {})
    cal_feat = parse_crop_calendar_api(cal)
    crop = cal_feat["crop"]

    # Grower basics
    device_type = data.get("device_type", "unknown")
    device_score = DEVICE_MAP.get(device_type, 0)
    grower_age = float(data.get("grower_age", 40))
    grower_farm_size = float(data.get("grower_farm_size", 2.0))
    state = data.get("state", "Unknown")
    language = data.get("language", "Hindi")

    product_scan = int(bool(data.get("product_scan", False)))
    offline_attended = int(bool(data.get("offline_campaign_attended", False)))
    engagement_score = product_scan + offline_attended

    lang_match = 1 if state in LANG_REGION.get(language, []) else 0

    # Days since scan
    scan_dt_str = data.get("product_scan_datetime", None)
    days_since_scan = 999
    if scan_dt_str:
        try:
            scan_dt = datetime.fromisoformat(scan_dt_str)
            days_since_scan = max(0, (datetime(2026, 4, 1) - scan_dt).days)
        except:
            pass

    # Campaign timing
    msg_date_str = data.get("message_sent_date", datetime.now().strftime("%Y-%m-%d"))
    try:
        msg_date = datetime.strptime(msg_date_str, "%Y-%m-%d")
    except:
        msg_date = datetime.now()

    msg_dow = msg_date.weekday()
    msg_month = msg_date.month

    def season_phase(m):
        if m in [10, 11]: return 0
        elif m in [12, 1, 2]: return 1
        return 2

    campaign_crop = data.get("campaign_crop", crop)
    crop_message_match = 1 if campaign_crop == crop else 0

    return {
        "crop": crop,
        "device_score": device_score,
        "grower_age": grower_age,
        "grower_farm_size": grower_farm_size,
        "engagement_score": engagement_score,
        "product_scan": product_scan,
        "offline_campaign_attended": offline_attended,
        "language_region_match": lang_match,
        "days_since_scan": days_since_scan,
        "message_dow": msg_dow,
        "message_month": msg_month,
        "season_phase": season_phase(msg_month),
        "crop_message_match": crop_message_match,
        "growth_stage_encoded": cal_feat["growth_stage_encoded"],
        "days_to_harvest": cal_feat["days_to_harvest"],
        "num_crop_stages": cal_feat["num_crop_stages"],
        "state": state,
        "language": language,
        "device_type": device_type,
    }


def safe_encode(le, value, default_val=0):
    """Encode with label encoder, handle unseen labels."""
    try:
        return int(le.transform([value])[0])
    except:
        return default_val


def predict_engagement(features: dict) -> dict:
    m = models.get("engagement")
    if not m: return {"error": "model not loaded"}
    crop_enc = safe_encode(m["le_crop"], features["crop"])
    lang_enc = safe_encode(m["le_lang"], features["language"])
    state_enc = safe_encode(m["le_state"], features["state"])
    features.update({"crop_enc": crop_enc, "lang_enc": lang_enc, "state_enc": state_enc})
    X = pd.DataFrame([[features.get(c, 0) for c in m["feature_cols"]]], columns=m["feature_cols"])
    prob = float(m["model"].predict_proba(X)[0][1])
    return {
        "click_probability": round(prob, 4),
        "will_engage": prob > 0.05,
        "engagement_tier": "high" if prob > 0.15 else "medium" if prob > 0.05 else "low"
    }


def predict_channel(features: dict) -> dict:
    m = models.get("channel")
    if not m: return {"error": "model not loaded"}
    state_enc = safe_encode(m["le_state"], features["state"])
    features["state_enc"] = state_enc
    X = pd.DataFrame([[features.get(c, 0) for c in m["feature_cols"]]], columns=m["feature_cols"])
    probs = m["model"].predict_proba(X)[0]
    channel_idx = int(np.argmax(probs))
    channel_labels = m["channel_labels"]
    all_channels = {channel_labels[i]: round(float(p), 3) for i, p in enumerate(probs)}
    return {
        "recommended_channel": channel_labels[channel_idx],
        "channel_scores": all_channels,
        "fallback_channel": channel_labels[int(np.argsort(probs)[-2])]
    }


def predict_product(features: dict) -> dict:
    m = models.get("product")
    if not m or "model" not in m: 
        # Fallback: crop-to-product mapping
        crop_product_map = {
            "wheat": "Topik 15 WP", "mustard": "Score 250 EC",
            "chickpea": "Actara 25 WG", "potato": "Kavach 75 WP",
            "barley": "Topik 15 WP", "lentil": "Actara 25 WG",
            "safflower": "Score 250 EC", "cumin": "Actara 25 WG",
            "maize": "Ampligo 150 ZC"
        }
        crop = features.get("crop", "unknown")
        product = crop_product_map.get(crop, "Score 250 EC")
        return {"recommended_product": product, "confidence": 0.5, "method": "heuristic"}

    crop_enc = safe_encode(m["le_crop"], features["crop"])
    state_enc = safe_encode(m["le_state"], features["state"])
    lang_enc = safe_encode(m["le_lang"], features["language"])
    features.update({"crop_enc": crop_enc, "state_enc": state_enc, "lang_enc": lang_enc})
    X = pd.DataFrame([[features.get(c, 0) for c in m["feature_cols"]]], columns=m["feature_cols"])
    probs = m["model"].predict_proba(X)[0]
    top3_idx = np.argsort(probs)[-3:][::-1]
    top3 = [{"product": m["le_product"].inverse_transform([i])[0], "score": round(float(probs[i]), 3)}
            for i in top3_idx]
    return {
        "recommended_product": top3[0]["product"],
        "confidence": top3[0]["score"],
        "top_3_products": top3,
        "method": "ml"
    }


def predict_conversion(features: dict) -> dict:
    m = models.get("conversion")
    if not m: return {"error": "model not loaded"}
    crop_enc = safe_encode(m["le_crop"], features["crop"])
    lang_enc = safe_encode(m["le_lang"], features["language"])
    state_enc = safe_encode(m["le_state"], features["state"])
    features.update({"crop_enc": crop_enc, "lang_enc": lang_enc, "state_enc": state_enc})
    X = pd.DataFrame([[features.get(c, 0) for c in m["feature_cols"]]], columns=m["feature_cols"])
    prob = float(m["model"].predict_proba(X)[0][1])
    
    # Percentile bucket (estimated from training distribution)
    tier = "top" if prob > 0.20 else "mid" if prob > 0.08 else "low"
    return {
        "conversion_probability": round(prob, 4),
        "conversion_tier": tier,
        "priority_score": round(prob * 100, 1)
    }


def get_segment(features: dict) -> dict:
    m = models.get("segment")
    if not m: return {"segment_id": 0, "persona": "Unknown"}
    crop_enc = safe_encode(m["le_crop"], features["crop"])
    features["crop_enc"] = crop_enc
    feat_vec = [features.get(c, 0) for c in m["cluster_features"]]
    X = np.array(feat_vec).reshape(1, -1)
    X_scaled = m["scaler"].transform(X)
    seg_id = int(m["kmeans"].predict(X_scaled)[0])
    return {
        "segment_id": seg_id,
        "persona": m["segment_labels"].get(seg_id, "Unknown Segment")
    }


def generate_content_template(features: dict, product: str, channel: str, language: str) -> dict:
    """Generate a personalized content framework for the campaign."""
    crop = features.get("crop", "wheat")
    stage = features.get("growth_stage_encoded", 1)
    stage_names = ["sowing", "tillering", "flowering", "ripening", "harvest"]
    stage_name = stage_names[min(stage, 4)]
    farm_size = features.get("grower_farm_size", 2.0)

    # Message tone based on device
    device_score = features.get("device_score", 2)
    is_feature_phone = device_score < 2

    # Channel-specific format
    format_map = {
        "WhatsApp": "rich_message_with_image",
        "SMS": "short_sms_160chars",
        "Voice": "ivr_script_30sec",
        "Retailer Visit": "in_store_talking_points"
    }

    content_brief = {
        "crop": crop,
        "growth_stage": stage_name,
        "product": product,
        "channel_format": format_map.get(channel, "rich_message_with_image"),
        "language": language,
        "tone": "simple_vernacular" if is_feature_phone else "informative_visual",
        "key_message_hooks": [
            f"Your {crop} is at {stage_name} stage — protect your yield now",
            f"{product} proven for {crop} growers in your region",
            f"Ideal time to apply — {stage_name} is critical for protection"
        ],
        "call_to_action": "Call your nearest retailer" if channel == "Voice"
                          else "Tap to know more" if device_score == 2
                          else "Reply YES for details",
        "visual_concept": f"{crop.capitalize()} field at {stage_name}, farmer inspecting crop, {product} pack visible",
        "content_length": "short" if is_feature_phone else "medium"
    }
    return content_brief


# ─── API ROUTES ────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "models_loaded": list(models.keys()),
        "timestamp": datetime.now().isoformat()
    })


@app.route("/models/info", methods=["GET"])
def model_info():
    meta = models.get("metadata", {})
    return jsonify(meta)


@app.route("/predict/engagement", methods=["POST"])
def route_engagement():
    try:
        data = request.get_json()
        features = build_features_from_request(data)
        return jsonify(predict_engagement(features))
    except Exception as e:
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500


@app.route("/predict/channel", methods=["POST"])
def route_channel():
    try:
        data = request.get_json()
        features = build_features_from_request(data)
        return jsonify(predict_channel(features))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict/product", methods=["POST"])
def route_product():
    try:
        data = request.get_json()
        features = build_features_from_request(data)
        return jsonify(predict_product(features))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict/conversion", methods=["POST"])
def route_conversion():
    try:
        data = request.get_json()
        features = build_features_from_request(data)
        return jsonify(predict_conversion(features))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict/full", methods=["POST"])
def route_full():
    """
    Master endpoint — returns all predictions in one shot.
    
    Sample request:
    {
        "grower_id": "GRW_00001",
        "state": "Uttar Pradesh",
        "language": "Hindi",
        "device_type": "smartphone",
        "grower_age": 45,
        "grower_farm_size": 3.5,
        "product_scan": false,
        "offline_campaign_attended": true,
        "grower_crop_calendar": {
            "crop": "wheat",
            "sowing": {"start": "2025-11-01"},
            "harvest": {"start": "2026-03-20"},
            "stages": [
                {"stage": "tillering", "approx": "2026-01-15"},
                {"stage": "flowering", "approx": "2026-02-20"}
            ]
        },
        "campaign_crop": "wheat",
        "message_sent_date": "2026-01-15"
    }
    """
    try:
        data = request.get_json()
        features = build_features_from_request(data)

        engagement = predict_engagement(features)
        channel_rec = predict_channel(features)
        product_rec = predict_product(features)
        conversion = predict_conversion(features)
        segment = get_segment(features)

        # Content personalization brief
        content = generate_content_template(
            features,
            product=product_rec.get("recommended_product", ""),
            channel=channel_rec.get("recommended_channel", "WhatsApp"),
            language=features["language"]
        )

        # Optimal timing recommendation
        month = features["message_month"]
        timing_rec = {
            "current_month": month,
            "is_optimal_timing": features["season_phase"] == 1,  # mid-season best
            "recommended_window": "December–February (peak Rabi growth)",
            "send_day": "Tuesday or Thursday" if features["message_dow"] in [1, 3]
                        else "Recommend Tuesday/Thursday"
        }

        response = {
            "grower_id": data.get("grower_id", "unknown"),
            "segment": segment,
            "predictions": {
                "engagement": engagement,
                "channel": channel_rec,
                "product": product_rec,
                "conversion": conversion,
                "timing": timing_rec
            },
            "content_brief": content,
            "campaign_action": {
                "should_target": conversion["conversion_probability"] > 0.03,
                "priority": conversion["conversion_tier"],
                "recommended_channel": channel_rec["recommended_channel"],
                "recommended_product": product_rec["recommended_product"],
                "persona": segment["persona"]
            }
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500


@app.route("/predict/batch", methods=["POST"])
def route_batch():
    """
    Batch scoring — send a list of growers, get ranked campaign list.
    Body: { "growers": [ {...grower1...}, {...grower2...} ] }
    Returns growers sorted by conversion priority.
    """
    try:
        data = request.get_json()
        growers_list = data.get("growers", [])
        if not growers_list:
            return jsonify({"error": "No growers provided"}), 400

        results = []
        for g in growers_list:
            features = build_features_from_request(g)
            conv = predict_conversion(features)
            channel = predict_channel(features)
            product = predict_product(features)
            seg = get_segment(features)
            results.append({
                "grower_id": g.get("grower_id", "unknown"),
                "conversion_probability": conv["conversion_probability"],
                "priority_score": conv["priority_score"],
                "recommended_channel": channel["recommended_channel"],
                "recommended_product": product["recommended_product"],
                "persona": seg["persona"],
                "tier": conv["conversion_tier"]
            })

        # Sort by conversion probability descending
        results.sort(key=lambda x: x["conversion_probability"], reverse=True)
        return jsonify({
            "total": len(results),
            "ranked_growers": results
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/segment", methods=["POST"])
def route_segment():
    try:
        data = request.get_json()
        features = build_features_from_request(data)
        return jsonify(get_segment(features))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("🌱 Syngenta ML API starting...")
    load_models()
    print(f"\n  Endpoints:")
    print(f"    POST /predict/full      ← Main endpoint (use this)")
    print(f"    POST /predict/batch     ← Batch scoring")
    print(f"    POST /predict/engagement")
    print(f"    POST /predict/channel")
    print(f"    POST /predict/product")
    print(f"    POST /predict/conversion")
    print(f"    GET  /health")
    print(f"    GET  /models/info")
    print(f"\n  Running on http://0.0.0.0:5000")
    app.run(host="0.0.0.0", port=5000, debug=False)
