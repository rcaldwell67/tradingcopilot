# Initializes the tradingcopilot SQLite database using the schema file
import sqlite3

SCHEMA_PATH = 'backend/tradingcopilot_schema.sql'
DB_PATH = 'backend/tradingcopilot.db'

def init_db():
    with open(SCHEMA_PATH, 'r') as f:
        schema = f.read()
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.executescript(schema)
        print(f"Database initialized at {DB_PATH}")
    finally:
        conn.close()

if __name__ == '__main__':
    init_db()
