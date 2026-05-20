"""
Syngenta IITM Hackathon 2026 — AI Content Generator (Gemini Native)
===================================================================
Uses official Google GenAI SDK to generate personalized vernacular marketing content.
Loads API credentials seamlessly from the local .env file.
"""

import os
import sys
import traceback
# Automatically loads variables from your local .env file
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

# ── Language display names ──────────────────────
LANGUAGE_NAMES = {
    "Hindi":   "Hindi (हिंदी)",
    "Marathi": "Marathi (मराठी)",
    "Punjabi": "Punjabi (ਪੰਜਾਬੀ)",
    "Gujarati":"Gujarati (ગુજરાતી)",
    "Kannada": "Kannada (ಕನ್ನಡ)",
    "Bengali": "Bengali (বাংলা)",
}

# ── Crop names in vernacular ────────────────────
CROP_VERNACULAR = {
    "wheat": {
        "Hindi": "गेहूं", "Punjabi": "ਕਣਕ",
        "Gujarati": "ઘਉਂ", "Marathi": "गहू",
        "Bengali": "গম",   "Kannada": "ಗೋಧಿ"
    },
    "mustard": {
        "Hindi": "सरसों", "Punjabi": "ਸਰ੍ਹੋਂ",
        "Gujarati": "સરસવ", "Marathi": "मोहरी",
        "Bengali": "সরিষা", "Kannada": "ಸಾಸಿವೆ"
    },
    "chickpea": {
        "Hindi": "चना", "Punjabi": "ਛੋਲੇ",
        "Gujarati": "ਚਣਾ", "Marathi": "हरभरा",
        "Bengali": "ছোলা", "Kannada": "ಕಡಲೆ"
    },
    "potato": {
        "Hindi": "आलू", "Punjabi": "ਆਲੂ",
        "Gujarati": "ਬટેટા", "Marathi": "ಬಟಾಟਾ",
        "Bengali": "আলু", "Kannada": "ಆಲೂਗੱಡೆ"
    },
    "barley": {
        "Hindi": "जौ", "Punjabi": "ਜੌਂ",
        "Gujarati": "જਵ", "Marathi": "जव",
        "Bengali": "যব", "Kannada": "ಜವೆಗೋಧಿ"
    },
    "maize": {
        "Hindi": "मक्का", "Punjabi": "ਮੱਕੀ",
        "Gujarati": "ਮਕਾਈ", "Marathi": "मका",
        "Bengali": "ভুট্টা", "Kannada": "ಜೋಳ"
    },
}

def get_crop_name(crop: str, language: str) -> str:
    """Get crop name in farmer's language."""
    if not crop:
        return ""
    return CROP_VERNACULAR.get(str(crop).lower(), {}).get(language, crop)

def get_gemini_client():
    """Initializes and returns the official Gemini client using .env credentials."""
    if "GEMINI_API_KEY" not in os.environ:
        print("❌ Error: GEMINI_API_KEY not found in environment or .env file.")
        print("Please verify that a '.env' file exists in this directory containing: GEMINI_API_KEY=your_key")
        sys.exit(1)
    return genai.Client()

def build_content_prompt(farmer: dict, channel: str) -> tuple[str, str]:
    """
    Build the structured context and prompts for generation.
    Returns: (system_instruction, user_prompt)
    """
    crop           = farmer.get("crop", "wheat")
    language       = farmer.get("language", "Hindi")
    product        = farmer.get("recommended_product", "Score 250 EC")
    growth_stage   = farmer.get("growth_stage", "tillering")
    persona        = farmer.get("persona", "farmer")
    device_score   = farmer.get("device_score", 2)
    temp           = farmer.get("temperature", 25)
    is_raining     = farmer.get("is_raining", 0)
    disease_alert  = farmer.get("disease_pressure", 0)
    harvest_urgency= farmer.get("harvest_urgency", 0)
    district       = farmer.get("district", "your district")
    state          = farmer.get("state", "")
    grower_age     = farmer.get("grower_age", 40)
    farm_size      = farmer.get("grower_farm_size", 2.0)

    crop_vernacular = get_crop_name(crop, language)

    # Build context string based on agronomic logic
    context_parts = []
    if disease_alert:
        context_parts.append(f"high humidity detected in {district} — elevated disease/pest risk")
    if is_raining:
        context_parts.append("it is currently raining in the farmer's area")
    if harvest_urgency:
        context_parts.append(f"the crop is approaching harvest — critical protection window")
    if temp and float(temp) > 38:
        context_parts.append(f"extreme heat ({temp}°C) — heat stress risk")

    context_str = ("; ".join(context_parts) if context_parts else "normal growing conditions")

    # Adapt presentation tone based on farmer profile
    if (device_score and int(device_score) < 2) or (grower_age and int(grower_age) > 55):
        tone = "very simple, short sentences, easy to understand for low-literacy users"
    else:
        tone = "informative but conversational, with a friendly tone"

    # Channel-specific output blueprints
    channel_instructions = {
        "WhatsApp": f"""Generate a WhatsApp message with:
- A greeting in {language}
- 2-3 short sentences about why {product} is needed RIGHT NOW for their {crop_vernacular} crop
- One specific tip related to current conditions: {context_str}
- A clear call to action (contact retailer / call helpline)
- Use 1-2 relevant emojis (🌾 🌿 ✅ 💧 ☀️)
- Keep under 200 words
- Write ENTIRELY in {language} script""",

        "SMS": f"""Generate an SMS message (strictly under 160 characters):
- Must be in {language} script
- Mention the crop ({crop_vernacular}), product ({product}), and one action
- No emojis
- End with a short call to action""",

        "Voice": f"""Generate a 30-second IVR voice call script:
- Opening greeting in {language}
- Identify the farmer's crop ({crop_vernacular}) and current growth stage ({growth_stage})
- Explain in 2 sentences why {product} is important right now
- Clear instruction: "Press 1 to speak to an expert" or "Press 2 to find nearest retailer"
- Closing in {language}
- Mark pauses with [PAUSE]
- Write the spoken text in {language} script""",

        "Retailer Visit": f"""Generate retailer talking points in {language}:
- 3-4 bullet points the retailer should tell the farmer
- Focus on {product} benefits for {crop_vernacular} at {growth_stage} stage
- Mention current conditions: {context_str}
- Include one objection handler ("if farmer says it's too expensive...")
- Keep it practical and brief"""
    }

    instructions = channel_instructions.get(channel, channel_instructions["WhatsApp"])

    system_instruction = f"""You are an expert agricultural marketing copywriter for Syngenta India.
You write highly personalized, culturally resonant crop protection messages for Indian farmers.
Rule 1: Always write output directly in the requested native {language} script — NOT in English transliteration.
Rule 2: Never make false claims — only factual product benefits.
Rule 3: The message should feel like it comes from a trusted local agronomist, not a corporate ad."""

    user_prompt = f"""FARMER PROFILE:
- Crop: {crop} ({crop_vernacular} in {language})
- Location: {district}, {state}
- Growth Stage: {growth_stage}
- Language: {language}
- Persona: {persona}
- Farm Size: {farm_size} acres
- Age: {grower_age} years
- Recommended Product: {product}
- Current Conditions: {context_str}
- Temperature: {temp}°C

CHANNEL: {channel}

TASK:
{instructions}

Tone requirement: {tone}
Reference the actual current conditions (weather, crop stage) to make it feel personal.
Generate ONLY the message content — no conversational introductory phrasing, explanations, or wrappers."""

    return system_instruction, user_prompt


def generate_content(farmer: dict, channel: str, api_key: str = None) -> dict:
    """
    Calls Gemini API to generate personalized content using .env credentials.
    BACKEND SAFE: accepts optional api_key parameter to avoid breaking legacy api.py hooks.
    """
    client = get_gemini_client()
    system_instruction, user_prompt = build_content_prompt(farmer, channel)

    try:
        # Utilizing efficient gemini-3-flash model
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.3,
            )
        )
        
        content = response.text.strip()
        return {
            "success":   True,
            "content":   content,
            "language":  farmer.get("language", "Hindi"),
            "channel":   channel,
            "crop":      farmer.get("crop", "unknown"),
            "product":   farmer.get("recommended_product", ""),
            "char_count": len(content),
            "model":     "gemini-3-flash"
        }
    except Exception as e:
        return {
            "success": False,
            "error":   str(e),
            "content": f"Fallback content for {farmer.get('recommended_product')} on {farmer.get('crop')}"
        }


def generate_all_variants(farmer: dict, api_key: str = None) -> dict:
    """Generate marketing content variants across all communication mediums at once."""
    channels = ["WhatsApp", "SMS", "Voice", "Retailer Visit"]
    results  = {}
    for channel in channels:
        results[channel] = generate_content(farmer, channel)
    return {
        "grower_id": farmer.get("grower_id", "unknown"),
        "language":  farmer.get("language", "Hindi"),
        "crop":      farmer.get("crop", "unknown"),
        "product":   farmer.get("recommended_product", ""),
        "persona":   farmer.get("persona", ""),
        "variants":  results
    }


# ─── Standalone Verification Execution ───────────────────────────────────────────
if __name__ == "__main__":
    test_farmer = {
        "grower_id":            "GRW_00001",
        "crop":                 "wheat",
        "language":             "Hindi",
        "district":             "Kanpur Nagar",
        "state":                "Uttar Pradesh",
        "growth_stage":         "tillering",
        "persona":              "Digital-Savvy Large Farmer",
        "recommended_product":  "Topik 15 WP",
        "device_score":         2,
        "grower_age":           45,
        "grower_farm_size":     3.5,
        "temperature":          28.0,
        "is_raining":           0,
        "disease_pressure":     1,
        "harvest_urgency":      0,
    }

    print("🌾 Testing generation via locally configured .env key...\n")
    print("─" * 50)
    result = generate_content(test_farmer, "WhatsApp")
    if result["success"]:
        print(f"✅ WhatsApp Content:\n\n{result['content']}")
    else:
        print(f"❌ Error: {result['error']}")