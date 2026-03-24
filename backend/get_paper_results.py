import sqlite3
import json
import sys

DB_PATH = 'backend/tradingcopilot.db'

def get_latest_paper_run(symbol):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        SELECT id, beginning_balance, ending_balance, total_equity, last_update
        FROM runs WHERE symbol=? AND mode='paper' ORDER BY run_time DESC LIMIT 1
    """, (symbol,))
    row = cur.fetchone()
    conn.close()
    if not row:
        return None
    return {
        'run_id': row[0],
        'beginning_balance': row[1],
        'ending_balance': row[2],
        'total_equity': row[3],
        'last_update': row[4]
    }

def get_trades_for_run(run_id):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        SELECT trade_time, side, action, position, price, pnl, balance, exit_type
        FROM trades WHERE run_id=? ORDER BY trade_time ASC
    """, (run_id,))
    trades = [
        {
            'trade_time': t[0],
            'side': t[1],
            'action': t[2],
            'position': t[3],
            'price': t[4],
            'pnl': t[5],
            'balance': t[6],
            'exit_type': t[7]
        }
        for t in cur.fetchall()
    ]
    conn.close()
    return trades

def main():
    symbol = sys.argv[1] if len(sys.argv) > 1 else 'AAPL'
    run = get_latest_paper_run(symbol)
    if not run:
        print(json.dumps({'error': 'No paper trading run found for symbol'}))
        return
    trades = get_trades_for_run(run['run_id'])
    output = {
        'symbol': symbol,
        'summary': {
            'beginning_balance': run['beginning_balance'],
            'ending_balance': run['ending_balance'],
            'total_equity': run['total_equity'],
            'last_update': run['last_update']
        },
        'trades': trades
    }
    print(json.dumps(output, indent=2))

if __name__ == '__main__':
    main()
