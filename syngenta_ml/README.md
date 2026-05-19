# 🌱 Syngenta IITM Hackathon 2026 — ML System

> **AI-Powered Agricultural Marketing at Scale**  
> Track: Campaign-to-action conversion optimization

---

## 🏗️ Architecture

```
growers.csv + whatsapp_campaign.csv + retailer_pos.csv
          ↓ Feature Engineering
    ┌─────────────────────────────────┐
    │         5 ML Models             │
    │  1. Engagement Predictor        │
    │  2. Channel Recommender         │
    │  3. Campaign Timing Scorer      │
    │  4. Product Affinity Model      │
    │  5. Conversion Propensity (KPI) │
    │  + Micro-segmentation (K-Means) │
    └─────────────────────────────────┘
          ↓ Flask REST API
    Frontend / Backend connects here
```

---

## ⚡ Quick Start

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Set data path
The data should be in `/tmp/hackathon_data/` (update `DATA_DIR` in `train.py` and `eda.py` if different).

### 3. Run EDA (optional but recommended)
```bash
python eda.py
```

### 4. Train models (~2 min)
```bash
python train.py
```
Saves models to `./models/` directory.

### 5. Start API server
```bash
python api.py
```
API runs at `http://localhost:5000`

---

## 🔌 API — For Your Frontend/Backend Team

### Main Endpoint (use this one)
```
POST /predict/full
Content-Type: application/json
```

**Request body:**
```json
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
```

**Response:**
```json
{
    "grower_id": "GRW_00001",
    "segment": {
        "segment_id": 0,
        "persona": "Digital-Savvy Large Farmer"
    },
    "predictions": {
        "engagement": {
            "click_probability": 0.12,
            "will_engage": true,
            "engagement_tier": "medium"
        },
        "channel": {
            "recommended_channel": "WhatsApp",
            "channel_scores": {"WhatsApp": 0.75, "SMS": 0.15, "Voice": 0.07, "Retailer Visit": 0.03},
            "fallback_channel": "SMS"
        },
        "product": {
            "recommended_product": "Topik 15 WP",
            "confidence": 0.67,
            "top_3_products": [...]
        },
        "conversion": {
            "conversion_probability": 0.14,
            "conversion_tier": "top",
            "priority_score": 14.0
        },
        "timing": {
            "is_optimal_timing": true,
            "recommended_window": "December–February (peak Rabi growth)"
        }
    },
    "content_brief": {
        "crop": "wheat",
        "growth_stage": "tillering",
        "product": "Topik 15 WP",
        "channel_format": "rich_message_with_image",
        "language": "Hindi",
        "tone": "informative_visual",
        "key_message_hooks": [...],
        "call_to_action": "Tap to know more",
        "visual_concept": "Wheat field at tillering stage, farmer inspecting crop, Topik 15 WP pack visible"
    },
    "campaign_action": {
        "should_target": true,
        "priority": "top",
        "recommended_channel": "WhatsApp",
        "recommended_product": "Topik 15 WP",
        "persona": "Digital-Savvy Large Farmer"
    }
}
```

---

### Batch Endpoint (rank thousands of growers)
```
POST /predict/batch
Body: { "growers": [ {...}, {...}, ... ] }
```
Returns all growers ranked by conversion probability — perfect for campaign targeting.

---

### Other Endpoints
| Endpoint | Method | Purpose |
|---|---|---|
| `/health` | GET | Health check |
| `/models/info` | GET | Model performance stats |
| `/predict/engagement` | POST | Engagement only |
| `/predict/channel` | POST | Channel recommendation |
| `/predict/product` | POST | Product recommendation |
| `/predict/conversion` | POST | Conversion score |
| `/segment` | POST | Grower persona |

---

## 🧠 ML Models Explained

### Model 1: Engagement Predictor
- **Task:** Binary classification — will this grower click a WhatsApp message?
- **Algorithm:** Gradient Boosting (200 trees)
- **Key Features:** Device type, crop-message match, season phase, engagement history
- **Output:** Click probability (0–1) + tier (high/medium/low)

### Model 2: Channel Recommender
- **Task:** Multi-class — WhatsApp / SMS / Voice / Retailer Visit
- **Algorithm:** Random Forest (200 trees)
- **Logic:** Feature phone users → Voice/SMS; Smartphone + engaged → WhatsApp; Offline-first → Retailer
- **Output:** Recommended channel + probability for each

### Model 3: Product Affinity
- **Task:** Multi-class — which product to recommend?
- **Algorithm:** Random Forest on scan + click history
- **Fallback:** Crop-to-product mapping if insufficient training data
- **Output:** Top 3 products with confidence scores

### Model 4: Conversion Propensity (Main KPI)
- **Task:** Binary — P(farmer takes action after campaign)
- **Algorithm:** Gradient Boosting (300 trees, conservative lr=0.05)
- **Target:** Clicked WhatsApp OR (opened + scanned product)
- **Output:** Probability + priority tier + priority score (0–100)

### Model 5: Micro-Segmentation
- **Task:** Unsupervised — 8 grower personas
- **Algorithm:** K-Means on normalized features
- **Personas:**
  - Digital-Savvy Large Farmer
  - Traditional Smallholder
  - Young Tech-Adopter
  - Senior Feature Phone User
  - High-Value Commercial Farmer
  - Offline-First Rural Farmer
  - Engaged Multi-Crop Farmer
  - New-to-Brand Explorer

---

## 🎯 Key Features Engineered

| Feature | Description |
|---|---|
| `device_score` | smartphone=2, keypad=1, unknown=0 |
| `engagement_score` | product_scan + offline_campaign_attended |
| `language_region_match` | Does language match state's primary language? |
| `crop_message_match` | Does campaign crop match grower's crop? |
| `growth_stage_encoded` | 0=sowing → 4=harvest |
| `season_phase` | 0=early(Oct-Nov), 1=mid(Dec-Feb), 2=late(Mar-Apr) |
| `days_since_scan` | Recency of last product engagement |
| `days_to_harvest` | Urgency signal — closer = higher receptivity |

---

## 🏆 Winning Angle for Judges

1. **End-to-end pipeline:** Raw CSV → trained models → REST API → personalized campaign in milliseconds

2. **Offline/low-bandwidth aware:** Channel recommender explicitly handles feature phone users, voice fallback for elderly farmers

3. **Micro-personalization at scale:** From ~4 campaign variants → 8 segments × N crops × language = thousands of micro-targeted versions

4. **Content brief generation:** API returns not just a prediction but a ready-to-use content template with visual concept, CTA, and tone

5. **Batch prioritization:** `/predict/batch` ranks thousands of growers by conversion probability — enables intelligent budget allocation

---

## 📁 File Structure
```
syngenta_ml/
├── train.py           ← Run first to train all models
├── api.py             ← Flask API server
├── eda.py             ← Exploratory analysis + insights
├── requirements.txt
├── README.md
└── models/            ← Created after train.py
    ├── engagement_model.pkl
    ├── channel_model.pkl
    ├── timing_model.pkl
    ├── product_model.pkl
    ├── conversion_model.pkl
    ├── segmentation_model.pkl
    ├── metadata.json
    └── insights_report.json
```
