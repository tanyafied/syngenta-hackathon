import os
import csv
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This allows Tanya's Next.js app to talk to this server

# Custom Agri-Swiggy Marketplace Logic
MANDI_PRICING = {
    "wheat": {"base": 2275, "bonus": 180},
    "rice": {"base": 2300, "bonus": 210},
    "paddy": {"base": 2300, "bonus": 210},
    "default": {"base": 3000, "bonus": 150}
}

LOGISTICS_FLEET = [
    {"company": "KisanRath Freight", "eta": "15 mins", "rating": "4.8★", "type": "Mini Truck"},
    {"company": "AgriMove Swiggy-Fleet", "eta": "30 mins", "rating": "4.9★", "type": "Tractor"}
]

@app.route('/api/v1/farmers', methods=['GET'])
def get_farmers():
    # 1. Look for the dataset by stepping out of the backend folder
    csv_path = "../syngenta_ml/growers.csv"
    
    # Safe fallback if the CSV isn't generated/copied yet
    if not os.path.exists(csv_path):
        return jsonify([
            {"grower_id": "GRW_00001", "state": "Uttar Pradesh", "language": "Hindi", "grower_crop_calendar": "Wheat"},
            {"grower_id": "GRW_00002", "state": "Punjab", "language": "Punjabi", "grower_crop_calendar": "Rice"}
        ])

    # 2. This is the logic that executes when the CSV file exists!
    farmers_list = []
    try:
        with open(csv_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader):
                if i >= 15:  # Cap at 15 rows so the frontend loads instantly
                    break
                
                # Extract crop and compute custom pricing context
                crop = row.get("crop", row.get("campaign_crop", "Wheat"))
                price_rule = MANDI_PRICING.get(crop.lower(), MANDI_PRICING["default"])

                # Build the exact object keys Tanya's frontend is expecting
                farmers_list.append({
                    "grower_id": row.get("grower_id", f"GRW_{i+1:05d}"),
                    "state": row.get("state", "Uttar Pradesh"),
                    "language": row.get("language", "Hindi"),
                    "grower_crop_calendar": crop,
                    # 🌾 Your Custom Ecosystem Value-Add Overlays!
                    "mandi_context": {
                        "market_rate": f"₹{price_rule['base']}/quintal",
                        "premium_rate": f"₹{price_rule['base'] + price_rule['bonus']}/quintal"
                    },
                    "logistics_options": LOGISTICS_FLEET
                })
        return jsonify(farmers_list)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Python Orchestration Backend running on http://localhost:8080")
    app.run(host='0.0.0.0', port=8080, debug=True)