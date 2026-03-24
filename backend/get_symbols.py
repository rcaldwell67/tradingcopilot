import sqlite3
import json

DB_PATH = 'backend/tradingcopilot.db'

def get_all_symbols():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT symbol FROM runs ORDER BY symbol ASC")
    symbols = [row[0] for row in cur.fetchall()]
    conn.close()
    return symbols

if __name__ == '__main__':
    symbols = get_all_symbols()
    print(json.dumps({'symbols': symbols}))
