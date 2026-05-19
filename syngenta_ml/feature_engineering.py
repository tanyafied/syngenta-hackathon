"""
Feature Engineering + Weather API Integration
Adds powerful new features to improve model accuracy
"""

import pandas as pd
import numpy as np
import requests
import json
from datetime import datetime

# ─── DISTRICT TO COORDINATES MAPPING ───────────
# Major agricultural districts in India
DISTRICT_COORDS = {
    "Bharatpur":      (27.2152, 77.4938),
    "Kanpur Nagar":   (26.4499, 80.3319),
    "Ludhiana":       (30.9010, 75.8573),
    "Amritsar":       (31.6340, 74.8723),
    "Nashik":         (19.9975, 73.7898),
    "Pune":           (18.5204, 73.8567),
    "Ahmedabad":      (23.0225, 72.5714),
    "Surat":          (21.1702, 72.8311),
    "Patna":          (25.5941, 85.1376),
    "Muzaffarpur":    (26.1209, 85.3647),
    "Jaipur":         (26.9124, 75.7873),
    "Jodhpur":        (26.2389, 73.0243),
    "Bhopal":         (23.2599, 77.4126),
    "Indore":         (22.7196, 75.8577),
    "Rohtak":         (28.8955, 76.6066),
    "Hisar":          (29.1492, 75.7217),
    "Meerut":         (28.9845, 77.7064),
    "Agra":           (27.1767, 78.0081),
    "Nagpur":         (21.1458, 79.0882),
    "Aurangabad":     (19.8762, 75.3433),
    # Default fallback
    "DEFAULT":        (20.5937, 78.9629),  # Center of India
}

def get_coords(district):
    """Get lat/lon for a district, fallback to center of India."""
    for key in DISTRICT_COORDS:
        if key.lower() in str(district).lower():
            return DISTRICT_COORDS[key]
    return DISTRICT_COORDS["DEFAULT"]


# ─── WEATHER API (Open-Meteo — FREE, no API key) ───

def get_weather(lat, lon):
    """
    Fetch current weather for a location.
    Uses Open-Meteo — completely free, no signup, no API key.
    """
    try:
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": [
                "temperature_2m",
                "relative_humidity_2m", 
                "precipitation",
                "weather_code",
                "wind_speed_10m",
                "apparent_temperature"
            ],
            "timezone": "Asia/Kolkata",
            "forecast_days": 1
        }
        response = requests.get(url, params=params, timeout=5)
        data = response.json()
        current = data.get("current", {})
        
        temp = current.get("temperature_2m", 25)
        humidity = current.get("relative_humidity_2m", 60)
        precipitation = current.get("precipitation", 0)
        weather_code = current.get("weather_code", 0)
        wind_speed = current.get("wind_speed_10m", 10)
        feels_like = current.get("apparent_temperature", 25)

        # Weather code → is it raining?
        # WMO codes: 51-67 = rain, 71-77 = snow, 80-99 = showers/storm
        is_raining = 1 if weather_code in range(51, 100) else 0
        
        # Derived features
        # High humidity (>70%) = disease pressure = farmer needs fungicide
        disease_pressure = 1 if humidity > 70 else 0
        
        # Comfort score: farmers more receptive in comfortable weather
        # Too hot (>38°C) or too cold (<10°C) = low receptivity
        if 15 <= temp <= 35:
            comfort_score = 1.0
        elif 10 <= temp < 15 or 35 < temp <= 40:
            comfort_score = 0.6
        else:
            comfort_score = 0.3

        # Farmer is likely home and on phone if raining
        receptivity_boost = 1.3 if is_raining else 1.0

        return {
            "temperature": round(temp, 1),
            "humidity": round(humidity, 1),
            "precipitation": round(precipitation, 2),
            "is_raining": is_raining,
            "wind_speed": round(wind_speed, 1),
            "feels_like": round(feels_like, 1),
            "disease_pressure": disease_pressure,
            "comfort_score": comfort_score,
            "receptivity_boost": receptivity_boost,
            "weather_ok": True
        }
    except Exception as e:
        # Return neutral defaults if API fails
        return {
            "temperature": 25.0,
            "humidity": 60.0,
            "precipitation": 0.0,
            "is_raining": 0,
            "wind_speed": 10.0,
            "feels_like": 25.0,
            "disease_pressure": 0,
            "comfort_score": 0.7,
            "receptivity_boost": 1.0,
            "weather_ok": False
        }


def get_weather_for_district(district):
    """Convenience function - get weather by district name."""
    lat, lon = get_coords(district)
    return get_weather(lat, lon)


# ─── FEATURE ENGINEERING ───────────────────────

def engineer_features(row: dict) -> dict:
    """
    Takes a raw grower profile dict and returns enriched features.
    Call this before feeding data to any model.
    """
    features = {}

    # ── Basic ──
    age = float(row.get("grower_age", 40))
    farm_size = float(row.get("grower_farm_size", 2.0))
    device_score = {"smartphone": 2, "keypad": 1, "unknown": 0}.get(
        row.get("device_type", "unknown"), 0)
    product_scan = int(bool(row.get("product_scan", False)))
    offline_attended = int(bool(row.get("offline_campaign_attended", False)))

    # ── NEW: Interaction features ──
    # Big farm + smartphone = highest value segment
    features["farm_x_device"] = farm_size * device_score

    # Age sweet spot for digital adoption (25-50 years)
    features["age_tech_sweet_spot"] = 1 if 25 <= age <= 50 else 0

    # Very young (<30) or very old (>65) farmers behave differently
    features["is_young_farmer"] = 1 if age < 30 else 0
    features["is_elder_farmer"] = 1 if age > 65 else 0

    # ── NEW: Engagement velocity ──
    # Both scanned AND attended = very hot lead
    features["engagement_velocity"] = product_scan * offline_attended
    # Either engaged = warm lead
    features["any_engagement"] = 1 if (product_scan + offline_attended) > 0 else 0

    # ── NEW: Farm size tiers ──
    features["is_small_farm"] = 1 if farm_size < 2 else 0
    features["is_large_farm"] = 1 if farm_size > 5 else 0
    features["farm_size_log"] = np.log1p(farm_size)  # log scale handles outliers better

    # ── NEW: Crop stage urgency ──
    days_to_harvest = float(row.get("days_to_harvest", 120))
    features["harvest_urgency"] = 1 if days_to_harvest < 45 else 0
    features["mid_season"] = 1 if 45 <= days_to_harvest <= 90 else 0
    features["days_to_harvest_log"] = np.log1p(days_to_harvest)

    # ── NEW: Message timing score ──
    try:
        msg_date = datetime.strptime(
            row.get("message_sent_date", "2026-01-15"), "%Y-%m-%d")
        dow = msg_date.weekday()
        month = msg_date.month
        # Tue(1) and Thu(3) are best days for agricultural messaging
        features["optimal_send_day"] = 1 if dow in [1, 3] else 0
        # Mid-season months (Dec-Feb) are best
        features["optimal_send_month"] = 1 if month in [12, 1, 2] else 0
        features["message_dow"] = dow
        features["message_month"] = month
        features["season_phase"] = 0 if month in [10,11] else 1 if month in [12,1,2] else 2
    except:
        features["optimal_send_day"] = 0
        features["optimal_send_month"] = 1
        features["message_dow"] = 1
        features["message_month"] = 1
        features["season_phase"] = 1

    # ── NEW: Language-region alignment ──
    lang_region = {
        "Hindi": ["Uttar Pradesh","Rajasthan","Madhya Pradesh","Bihar","Haryana"],
        "Punjabi": ["Punjab"],
        "Marathi": ["Maharashtra"],
        "Gujarati": ["Gujarat"],
        "Kannada": ["Karnataka"],
        "Bengali": ["West Bengal"]
    }
    state = row.get("state", "")
    language = row.get("language", "Hindi")
    features["language_region_match"] = 1 if state in lang_region.get(language, []) else 0

    # ── NEW: Crop-message relevance ──
    campaign_crop = row.get("campaign_crop", "")
    grower_crop = row.get("crop", row.get("campaign_crop", ""))
    features["crop_message_match"] = 1 if campaign_crop == grower_crop else 0
    # Crop relevance score (same crop family = partial match)
    cereal_crops = ["wheat", "barley", "maize", "rice"]
    oilseed_crops = ["mustard", "safflower", "groundnut"]
    pulse_crops = ["chickpea", "lentil", "pea"]
    def crop_family(c):
        if c in cereal_crops: return "cereal"
        if c in oilseed_crops: return "oilseed"
        if c in pulse_crops: return "pulse"
        return "other"
    features["same_crop_family"] = 1 if crop_family(campaign_crop) == crop_family(grower_crop) else 0

    # ── NEW: Days since last engagement ──
    days_since_scan = float(row.get("days_since_scan", 999))
    features["recently_engaged"] = 1 if days_since_scan < 30 else 0
    features["days_since_scan_log"] = np.log1p(min(days_since_scan, 999))

    return features


def enrich_with_weather(row: dict) -> dict:
    """Add weather features to a grower row."""
    district = row.get("district", "DEFAULT")
    weather = get_weather_for_district(district)
    return {**row, **weather}


# ─── BATCH WEATHER ENRICHMENT ──────────────────

def add_weather_to_dataframe(df: pd.DataFrame, 
                              district_col="district") -> pd.DataFrame:
    """
    Add weather features to entire dataframe.
    Caches by district so we don't call API 6000 times.
    """
    print("  Fetching weather data for districts...")
    unique_districts = df[district_col].unique()
    weather_cache = {}
    
    for i, district in enumerate(unique_districts):
        weather_cache[district] = get_weather_for_district(district)
        if i % 10 == 0:
            print(f"  Weather: {i+1}/{len(unique_districts)} districts done...")

    # Map weather back to dataframe
    weather_df = df[district_col].map(weather_cache).apply(pd.Series)
    return pd.concat([df, weather_df], axis=1)


if __name__ == "__main__":
    # Test it
    print("Testing weather API...")
    weather = get_weather_for_district("Kanpur Nagar")
    print(f"Kanpur Nagar weather: {json.dumps(weather, indent=2)}")
    
    print("\nTesting feature engineering...")
    sample = {
        "grower_age": 35,
        "grower_farm_size": 4.5,
        "device_type": "smartphone",
        "product_scan": True,
        "offline_campaign_attended": False,
        "state": "Uttar Pradesh",
        "language": "Hindi",
        "district": "Kanpur Nagar",
        "campaign_crop": "wheat",
        "crop": "wheat",
        "days_to_harvest": 40,
        "message_sent_date": "2026-01-15",
        "days_since_scan": 15
    }
    enriched = engineer_features(sample)
    print(f"Engineered features: {json.dumps(enriched, indent=2)}")