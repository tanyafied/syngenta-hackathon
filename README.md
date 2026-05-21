# 🌾 AgriConnect: Intelligent Hyper-Local Agri-Advisory & Real-Time Outreach Engine

**AgriConnect** is a data-driven, full-stack agricultural intelligence dashboard designed to optimize grower outreach, predict crop protection demands, and streamline supply chains. By combining regional environment telemetry with predictive machine learning models, the platform instantly profiles farmers, forecasts high-probability input requirements, dispatches automated alerts via a live Twilio WhatsApp gateway, and instantly connects growers to regional Syngenta distribution pipelines.

---

## 🎯 Core Value Proposition & Key Features

* **Real-Time Dynamic Telemetry:** Processes localized atmospheric data (ambient temperature, humidity, and location variables) to track environmental field configurations.
* **Predictive AI Profiling Engine:** Runs feature matrices through an isolated machine learning server to classify growers into distinct behavioral personas with priority conversion confidence scores.
* **Direct-to-Device WhatsApp Automation:** Triggers instant, physical notification handshakes via a Twilio SMS/WhatsApp sandbox proxy layer using strict international E.164 signaling protocols.
* **Dynamic Market Integration (Dealers Hub):** Bridges data analytics with retail distribution, showing verified regional Syngenta dealers dynamically filtered by the grower's operational territory.
* **Resilient Offline Architecture:** Features localized SQLite data replication to preserve operational continuity even during remote network pipe drops.

---

## 🛠️ System Infrastructure Framework

The system functions on a decoupled, multi-process architecture to manage high-throughput analytics:

1. **Frontend Dashboard Interface (Port 3000):** Built using Next.js (React), Tailwind CSS, Lucide Icons, and TypeScript with smooth anchor navigation layout controls.
2. **Backend Gateway Orchestrator (Port 8080):** Powered by Python Flask and SQLite (`farmers.db`) to manage user registry caching, CORS handshake rule validations, and communications loops.
3. **Machine Learning Model API (Port 5000):** A Python Flask microservice processing crop matrices to return predictive yield security recommendation metrics.

---

## 🚀 Rapid Deployment & Startup Guide

To initialize the full-stack system layout, open **three independent terminal windows** and execute the corresponding commands sequentially:

### 🤖 Terminal 1: Machine Learning Prediction Engine

1. Navigate into the ML resource folder:
   ```bash
   cd syngenta_ml
   ```

2. Install predictive data science dependencies:
   ```bash
   pip install flask flask-cors scikit-learn pandas numpy requests imbalanced-learn google-generativeai python-dotenv
   ```

3. Train the ML models (run once):
   ```bash
   python train.py
   ```

4. Boot up the machine learning intelligence web server (Listens on Port 5000):
   ```bash
   python api.py
   ```

---

### 💻 Terminal 2: Python Flask Backend Infrastructure

1. Open a new terminal window and enter the backend directory:
   ```bash
   cd backend
   ```

2. Install enterprise gateway utilities and CORS security libraries:
   ```bash
   pip install flask flask-cors twilio python-dotenv requests
   ```

3. Seed the local SQLite database from growers.csv:
   ```bash
   python database.py
   ```

4. Fire up the central API routing system architecture (Listens on Port 8080):
   ```bash
   python server.py
   ```

---

### 🌐 Terminal 3: Next.js Frontend User Interface

1. Open a third terminal window and enter the web interface workspace folder:
   ```bash
   cd farmsaathi
   ```

2. Fetch and unpack your Node module dependency distribution trees cleanly:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the `farmsaathi/` directory:
   ```
   NEXT_PUBLIC_ML_API_URL=http://localhost:5000
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
   ```

4. Deploy the hot-reloading client application shell runtime (Hosts on Port 3000):
   ```bash
   npm run dev
   ```

---

## 📱 Live Evaluation Walkthrough

Follow these precise verification steps to demonstrate the end-to-end telemetry system pipeline during your presentation:

1. Launch your browser workspace to the web application page: `http://localhost:3000`

2. Opt-in your hardware: Grant Twilio clear messaging rights by texting your custom sandbox join string (e.g., `join details-velvet`) to the official Twilio contact portal: **+1 415 523 8886**.

3. Fill out the farmer registration parameters completely inside the input dashboard block. Ensure the target phone number strictly follows international format syntax (e.g., `+919888499166`).

4. Select **"Generate Smart Farming Insights"**.

5. **Observe:** The browser client routes the dataset through the Flask orchestrator to pull predictive modeling results. The user interface metrics will refresh seamlessly, and your physical mobile phone will receive the real-time crop alert instantly.

6. **Market Match:** Use the Navbar links to glide down to the Insights or Dealers view modules. The system will automatically showcase local Syngenta procurement nodes specifically filtered to your registered zone.

---

## 📁 Repository Directory Blueprint

```
syngenta-hackathon/
├── backend/
│   ├── server.py              # Main Flask REST API & Gateway Routing Matrix (Port 8080)
│   ├── database.py            # SQLite seeding from growers.csv
│   ├── farmers.db             # Local Relational SQLite Datastore Cache
│   └── .env                   # Hidden Environment Secrets Management File (Git-ignored)
├── syngenta_ml/
│   ├── api.py                 # Machine Learning Model API (Port 5000)
│   ├── train.py               # Model Training Pipeline
│   ├── feature_engineering.py # Feature Engineering + Weather API Integration
│   ├── content_generator.py   # Gemini AI Content Generation
│   ├── eda.py                 # Exploratory Data Analysis
│   ├── models/                # Trained ML Model Files (.pkl)
│   └── *.csv                  # Syngenta Dataset Files
├── farmsaathi/
│   ├── app/
│   │   ├── layout.tsx         # Global Application Font/Style Base Layout
│   │   └── page.tsx           # Home Layout Aggregating Main Component Interfaces
│   ├── components/
│   │   ├── Navbar.tsx         # Sticky Header Menu containing Fixed Scroll Controls
│   │   ├── Register.tsx       # Farmer Data Intake Module Frontend Component
│   │   ├── Recommendations.tsx# Live ML-Powered Analytics Dashboard Target Panel
│   │   ├── LiveAlerts.tsx     # Dynamic Environmental Status Loop Display
│   │   ├── LanguageSupport.tsx# Multilingual AI Message Generator
│   │   ├── Analytics.tsx      # Campaign Performance Charts
│   │   └── Weather.tsx        # Live Weather Telemetry Display
│   ├── .env.local             # Frontend Environment Variables
│   ├── package.json           # Node Package Module Matrix Target Manifest
│   └── ...
└── README.md                  # System Architecture Reference Manual
```

---

## 🧠 ML Models Overview

| Model | Algorithm | Purpose |
|---|---|---|
| Engagement Predictor | Gradient Boosting + SMOTE | Predicts WhatsApp click probability |
| Channel Recommender | Random Forest | WhatsApp / SMS / Voice / Retailer |
| Product Affinity | Random Forest | Which product to recommend |
| Conversion Propensity | Gradient Boosting + SMOTE | Master KPI — P(farmer converts) |
| Micro-Segmentation | K-Means (8 clusters) | Farmer persona classification |

---

## 🌐 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | ML server health check |
| POST | `/predict/full` | All predictions for one farmer |
| POST | `/predict/batch` | Rank multiple farmers by priority |
| POST | `/generate/full_campaign` | Predictions + AI-generated vernacular content |
| GET | `/api/v1/farmers` | Farmer list with ML predictions (Port 8080) |

---

*Built for Syngenta IITM Hackathon 2026 — FarmSaathi Team*
