# 🌾 FarmSaathi: Intelligent Hyper-Local Agri-Advisory & Real-Time Outreach Engine

**FarmSaathi** is a data-driven, full-stack agricultural intelligence dashboard designed to optimize grower outreach, predict crop protection demands, and streamline supply chains. By combining regional environment telemetry with predictive machine learning models, the platform instantly profiles farmers, forecasts high-probability input requirements, dispatches automated alerts via a live Twilio WhatsApp gateway, and instantly connects growers to regional Syngenta distribution pipelines.

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
1. Navigate into the backend resource folder:
   ```bash
   cd backend
Install predictive data science dependencies:

Bash
pip install flask flask-cors scikit-learn pandas numpy requests
Boot up the machine learning intelligence web server (Listens on Port 5000):

Bash
python ml_server.py
💻 Terminal 2: Python Flask Backend Infrastructure
Open a new terminal window and enter the backend directory:

Bash
cd backend
Install enterprise gateway utilities and CORS security libraries:

Bash
pip install flask flask-cors twilio python-dotenv requests
Set up your local runtime secrets. Create a file named .env inside this backend/ directory:

Code snippet
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_SANDBOX_NUMBER=+14155238886
Fire up the central API routing system architecture (Listens on Port 8080):

Bash
python server.py
🌐 Terminal 3: Next.js Frontend User Interface
Open a third terminal window and enter the web interface workspace folder:

Bash
cd farmsaathi
Fetch and unpack your Node module dependency distribution trees cleanly:

Bash
npm install
Deploy the hot-reloading client application shell runtime (Hosts on Port 3000):

Bash
npm run dev
📱 Live Evaluation Walkthrough
Follow these precise verification steps to demonstrate the end-to-end telemetry system pipeline during your presentation:

Launch your browser workspace to the web application page: http://localhost:3000

Opt-in your hardware: Grant Twilio clear messaging rights by texting your custom sandbox join string (e.g., join details-velvet) to the official Twilio contact portal: +1 415 523 8886.

Fill out the farmer registration parameters completely inside the input dashboard block. Ensure the target phone number strictly follows international format syntax (e.g., +919888499166).

Select "Generate Smart Farming Insights".

Observe: The browser client routes the dataset through the Flask orchestrator to pull predictive modeling results. The user interface metrics will refresh seamlessly, and your physical mobile phone will receive the real-time crop alert instantly.

Market Match: Use the Navbar links to glide down to the Insights or Dealers view modules. The system will automatically showcase local Syngenta procurement nodes specifically filtered to your registered zone.
