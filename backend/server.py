import os
import sqlite3
import json
import traceback
import uuid
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from twilio.rest import Client

# Load environment variables cleanly from .env file
load_dotenv()

app = Flask(__name__)

# 🔑 CORS configuration: Accepts requests from local environment or live Vercel deployments
CORS(app, resources={r"/*": {"origins": "*"}})

ML_SERVER_URL = "http://localhost:5000/predict/full"
DB_PATH = "farmers.db"

MANDI_PRICING = {
    "wheat": {"base": 2275, "bonus": 180},
    "mustard": {"base": 5650, "bonus": 200},
    "chickpea": {"base": 5440, "bonus": 150},
    "potato": {"base": 1500, "bonus": 100},
    "maize": {"base": 2090, "bonus": 110},
    "default": {"base": 3000, "bonus": 150}
}

LOGISTICS_FLEET = [
    {"company": "KisanRath Freight", "eta": "15 mins", "rating": "4.8★", "type": "Mini Truck"},
    {"company": "AgriMove Swiggy-Fleet", "eta": "30 mins", "rating": "4.9★", "type": "Tractor"}
]

LOCALIZED_TEMPLATES = {
    "Hindi": "प्रिय किसान भाई, आपकी {crop} की फसल के लिए विशेषज्ञों ने {product} के उपयोग की सलाह दी है। मंडी में आपकी फसल का प्रीमियम भाव {rate} है। डिलीवरी के लिए किसानरथ वाहन तैयार है!",
    "Marathi": "प्रिय शेतकरी बांधवांनो, तुमच्या {crop} पिकासाठी तज्ज्ञांनी {product} वापरण्याचा सल्ला दिला आहे. मंडीमध्ये प्रीमियम दर {rate} आहे. किसानरथ वाहतूक तयार आहे!",
    "Punjabi": "ਪਿਆਰੇ ਕਿਸਾਨ ਵੀਰੋ, ਤੁਹਾਡੀ {crop} ਦੀ ਫਸਲ ਲਈ ਮਾਹਿਰਾਂ ਨੇ {product} ਦੀ ਵਰਤੋਂ ਦੀ ਸਲਾਹ ਦਿੱਤੀ ਹੈ। ਮੰਡੀ ਵਿੱਚ ਪ੍ਰੀਮੀਅਮ ਰੇਟ {rate} ਹੈ। ਕਿਸਾਨ ਰਥ ਗੱਡੀ ਤਿਆਰ ਹੈ!",
    "default": "Dear Farmer, for your {crop} crop, experts highly recommend applying {product}. Current premium Mandi rate is {rate}. Logistics options are ready for immediate dispatch via KisanRath Freight!"
}

# 🔐 SECURE EXTREMETIES FOR SYSTEM DEPLOYMENT
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_SANDBOX_NUMBER = os.getenv("TWILIO_SANDBOX_NUMBER")

@app.route('/api/v1/farmers', methods=['GET'])
def get_farmers():
    if not os.path.exists(DB_PATH):
        return jsonify([{"grower_id": "ERROR", "state": "Database missing!"}])

    farmers_list = []
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        rows = cursor.execute("SELECT * FROM farmers ORDER BY grower_id DESC LIMIT 15;").fetchall()
        conn.close()

        for row in rows:
            crop_cleaned = str(row["crop"]).strip().lower()
            if crop_cleaned not in ["wheat", "mustard", "chickpea", "potato", "barley", "maize", "lentil", "safflower", "cumin"]:
                crop_cleaned = "wheat"

            price_rule = MANDI_PRICING.get(crop_cleaned, MANDI_PRICING["default"])
            premium_rate_str = f"₹{price_rule['base'] + price_rule['bonus']}/quintal"

            ml_request_payload = {
                "grower_id": row["grower_id"],
                "state": row["state"],
                "district": row["district"],
                "language": row["language"] if row["language"] in ["Hindi", "Marathi", "Punjabi", "Gujarati", "Kannada", "Bengali"] else "Hindi",
                "device_type": "smartphone" if str(row["device_type"]).lower() == "smartphone" else "keypad",
                "grower_age": int(row["grower_age"] or 45),
                "grower_farm_size": float(row["grower_farm_size"] or 3.5),
                "product_scan": str(row["product_scan"]).lower() == "true",
                "offline_campaign_attended": str(row["offline_campaign_attended"]).lower() == "true",
                "grower_crop_calendar": {"crop": crop_cleaned},
                "campaign_crop": crop_cleaned,
                "message_sent_date": "2026-01-15"
            }

            try:
                ml_res = requests.post(ML_SERVER_URL, json=ml_request_payload, timeout=2.0)
                ml_data = ml_res.json() if ml_res.status_code == 200 else {}
            except Exception:
                ml_data = {}

            segment_obj = ml_data.get("segment", {})
            pred_obj = ml_data.get("predictions", {})
            weather_obj = ml_data.get("weather", {})
            
            persona = segment_obj.get("persona", "Digital-Savvy Large Farmer")
            weather_temp = weather_obj.get("temperature", 34.2)
            weather_hum = weather_obj.get("humidity", 45.0)
            
            product_recommendation = pred_obj.get("product", {}).get("recommended_product", "Tilt 250 EC")
            product_confidence = int(pred_obj.get("product", {}).get("confidence", 0.65) * 100)
            channel_recommendation = pred_obj.get("channel", {}).get("recommended_channel", "WhatsApp")
            conversion_pct = int(pred_obj.get("conversion", {}).get("conversion_probability", 0.45) * 100)

            farmers_list.append({
                "grower_id": row["grower_id"],
                "state": row["state"],
                "district": row["district"],
                "language": row["language"],
                "grower_crop_calendar": crop_cleaned.capitalize(),
                "persona": persona,
                "recommended_product": product_recommendation,
                "recommended_channel": channel_recommendation,
                "conversion_probability": conversion_pct,
                "confidence": product_confidence,
                "temperature": weather_temp,
                "humidity": weather_hum,
                "mandi_context": {
                    "market_rate": f"₹{price_rule['base']}/quintal",
                    "premium_rate": premium_rate_str
                }
            })
                
        return jsonify(farmers_list)
    except Exception as e:
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500


@app.route('/api/v1/farmers/register', methods=['POST'])
def register_farmer():
    print("\n[HOOK DETECTED] Incoming farmer tracking payload registered on endpoint!", flush=True)
    try:
        data = request.get_json() or {}
        
        raw_name = data.get("farmer_name", "Farmer1").strip()
        phone_number = data.get("phone_number", "").strip() 
        grower_id = f"GRW_{raw_name.replace(' ', '_').upper()}"
        
        ui_lang = data.get("language", "Odia")
        state_mapping = {"Odia": "Odisha", "Hindi": "Uttar Pradesh", "Marathi": "Maharashtra", "Punjabi": "Punjab", "Tamil": "Tamil Nadu", "English": "Karnataka"}
        state = state_mapping.get(ui_lang, "Odisha")
        district = data.get("district", "Kanpur Nagar").strip()
        
        try:
            farm_size = float(data.get("farm_size") or 3.0)
        except ValueError:
            farm_size = 3.0
            
        soil_type = data.get("soil_type", "Clay Soil")
        crop = "wheat" if "clay" in soil_type.lower() else "maize"

        # Save record execution inside SQLite database instance
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO farmers (
                grower_id, state, district, language, crop, 
                grower_age, grower_farm_size, device_type, 
                product_scan, offline_campaign_attended, grower_crop_calendar, message_sent_date
            ) VALUES (?, ?, ?, ?, ?, 42, ?, 'smartphone', 'true', 'true', '{}', '2026-03-01')
        """, (grower_id, state, district, ui_lang, crop, farm_size))
        conn.commit()
        conn.close()

        preferred_channel = "WhatsApp" if ui_lang in ["English", "Hindi", "Tamil"] else "SMS"
        simulated_product = "Syngenta Virtako + Amistar Top" if crop == "wheat" else "Syngenta YieldMax Booster"
        
        whatsapp_message_body = f"🌾 AgriConnect Advisory: Hello {raw_name}! Crop analytics for your field in {district} show high climate moisture metrics. We recommend deploying {simulated_product} within 24 hours."

        # 🚀 REAL TWILIO WHATSAPP GATEWAY DISPATCH WITH REPAIRED VARIABLES
        if phone_number and TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
            print(f"📡 Forwarding dispatch metadata to Twilio targeting: {phone_number}...", flush=True)
            try:
                client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
                message = client.messages.create(
                    body=whatsapp_message_body,
                    from_=f"whatsapp:{TWILIO_SANDBOX_NUMBER}",
                    to=f"whatsapp:{phone_number}"
                )
                print(f"✅ Real WhatsApp dispatched successfully! Message SID: {message.sid}", flush=True)
            except Exception as twilio_err:
                print(f"❌ Twilio Gateway Error: {twilio_err}", flush=True)
        else:
            print("⚠️ Skipping Twilio Broadcast. Missing phone data configuration or API keys.", flush=True)

        return jsonify({
            "status": "success", 
            "message": f"Farmer {raw_name} registered under id {grower_id}!",
            "preferred_channel": preferred_channel,
            "recommended_fertilizer": simulated_product,
            "recommended_crop": crop.capitalize(),
            "redirect_context": {"grower_id": grower_id, "state": state, "crop": crop.capitalize()}
        }), 201
        
    except Exception as e:
        print(f"💥 Server internal breakdown error: {str(e)}", flush=True)
        return jsonify({"status": "error", "error": str(e), "trace": traceback.format_exc()}), 500


@app.route('/api/v1/farmers/generate-message', methods=['POST'])
def generate_message():
    try:
        data = request.get_json() or {}
        lang = data.get("language", "Hindi")
        crop = data.get("crop", "Wheat")
        prod = data.get("recommended_product", "Tilt 250 EC")
        rate = data.get("premium_rate", "₹2455/quintal")

        template = LOCALIZED_TEMPLATES.get(lang, LOCALIZED_TEMPLATES["default"])
        formatted_msg = template.format(crop=crop, product=prod, rate=rate)

        return jsonify({"status": "success", "message": formatted_msg})
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500


if __name__ == '__main__':
    print("\n--- [BOOTUP] Architecture loaded. Monitoring inbound telemetry streams on Port 8080 ---", flush=True)
    app.run(host='0.0.0.0', port=8080, debug=True)