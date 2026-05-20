import os
import csv
import sqlite3

CSV_PATH = "../syngenta_ml/growers.csv"
DB_PATH = "farmers.db"

def init_and_seed_db():
    if not os.path.exists(CSV_PATH):
        print(f"❌ Critical Error: Cannot find {CSV_PATH}.")
        return

    print("🔄 Establishing connection to SQLite and preparing schema...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

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

    cursor.execute("DELETE FROM farmers;")

    with open(CSV_PATH, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            crop_name = row.get("crop", row.get("campaign_crop", "wheat")).strip().lower()
            
            # Safe data cleansing fallbacks
            raw_age = row.get("grower_age", "").strip()
            grower_age = int(raw_age) if raw_age and raw_age.isdigit() else 45

            raw_size = row.get("grower_farm_size", "").strip()
            try:
                grower_farm_size = float(raw_size) if raw_size else 3.5
            except ValueError:
                grower_farm_size = 3.5

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
                grower_age,
                grower_farm_size,
                row.get("device_type", "smartphone"),
                row.get("product_scan", "false"),
                row.get("offline_campaign_attended", "true"),
                row.get("grower_crop_calendar", "{}"),
                row.get("message_sent_date", "2026-03-01")
            ))

    conn.commit()
    conn.close()
    print("✨ SUCCESS: SQLite 'farmers.db' created and pre-populated flawlessly!")

if __name__ == "__main__":
    init_and_seed_db()