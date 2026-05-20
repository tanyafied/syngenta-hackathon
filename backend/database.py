import os
import csv
import sqlite3
import json

CSV_PATH = "../syngenta_ml/growers.csv"
DB_PATH = "farmers.db"

def init_and_seed_db():
    # 1. Verification step: Ensure the source dataset is available
    if not os.path.exists(CSV_PATH):
        print(f"❌ Critical Error: Cannot find {CSV_PATH}. Please ensure your syngenta_ml folder is next to the backend folder.")
        return

    print("🔄 Establishing connection to SQLite and preparing schema...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 2. Build the structured SQL Relational Table structure
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS farmers (
        grower_id TEXT PRIMARY KEY,
        state TEXT,
        district TEXT,
        language TEXT,
        crop TEXT,
        grower_age INTEGER,
        grower_farm_size REAL,
        device_type TEXT,
        product_scan TEXT,
        offline_campaign_attended TEXT,
        grower_crop_calendar TEXT,
        message_sent_date TEXT
    );
    """)

    # Clean old records if resetting the system to prevent overlapping rows
    cursor.execute("DELETE FROM farmers;")

    # 3. Read raw file attributes out of the CSV and seed rows natively into SQL
    with open(CSV_PATH, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Safely resolve standard fallback fields for your ML Encoders
            crop_name = row.get("crop", row.get("campaign_crop", "wheat")).strip().lower()
            
            cursor.execute("""
            INSERT OR IGNORE INTO farmers (
                grower_id, state, district, language, crop, 
                grower_age, grower_farm_size, device_type, 
                product_scan, offline_campaign_attended, grower_crop_calendar, message_sent_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                row.get("grower_id"),
                row.get("state", "Uttar Pradesh"),
                row.get("district", "Kanpur Nagar"),
                row.get("language", "Hindi"),
                crop_name,
                int(row.get("grower_age", 45)),
                float(row.get("grower_farm_size", 3.5)),
                row.get("device_type", "smartphone"),
                row.get("product_scan", "false"),
                row.get("offline_campaign_attended", "true"),
                row.get("grower_crop_calendar", "{}"),
                row.get("message_sent_date", "2026-03-01")
            ))

    conn.commit()
    conn.close()
    print("✨ SUCCESS: SQLite 'farmers.db' created and pre-populated natively from growers.csv!")

if __name__ == "__main__":
    init_and_seed_db()