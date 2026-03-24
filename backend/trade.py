
import sys
import alpaca_trade_api as tradeapi
import time
import sqlite3
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.environ.get('APCA_API_KEY_ID')
API_SECRET = os.environ.get('APCA_API_SECRET_KEY')
BASE_URL = os.environ.get('APCA_API_BASE_URL', 'https://paper-api.alpaca.markets')
DB_PATH = 'backend/tradingcopilot.db'

api = tradeapi.REST(API_KEY, API_SECRET, BASE_URL, api_version='v2')

SYMBOL = sys.argv[1] if len(sys.argv) > 1 else 'AAPL'
QTY = 1

def log_run(symbol, mode, strategy, beginning_balance, ending_balance, total_equity):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO runs (symbol, mode, strategy, beginning_balance, ending_balance, total_equity, last_update)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (symbol, mode, strategy, beginning_balance, ending_balance, total_equity, datetime.utcnow().isoformat()+"Z"))
    run_id = cur.lastrowid
    conn.commit()
    conn.close()
    return run_id

def log_trade(run_id, symbol, trade_time, side, action, position, price, pnl, balance, exit_type):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO trades (run_id, version, trade_time, side, action, position, price, pnl, balance, exit_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (run_id, '', trade_time, side, action, position, price, pnl, balance, exit_type))
    conn.commit()
    conn.close()

def get_equity():
    account = api.get_account()
    return float(account.equity)

def trade():
    clock = api.get_clock()
    if not clock.is_open:
        print('Market is closed')
        return
    position = None
    try:
        position = api.get_position(SYMBOL)
    except Exception:
        pass
    beginning_balance = get_equity()
    run_id = log_run(SYMBOL, 'paper', 'SMA Crossover', beginning_balance, beginning_balance, beginning_balance)
    if not position:
        print(f'Buying {QTY} shares of {SYMBOL}')
        order = api.submit_order(symbol=SYMBOL, qty=QTY, side='buy', type='market', time_in_force='gtc')
        time.sleep(2)
        fill_price = float(api.get_order(order.id).filled_avg_price or 0)
        ending_balance = get_equity()
        log_trade(run_id, SYMBOL, datetime.utcnow().isoformat()+"Z", 'buy', 'open', 'long', fill_price, 0, ending_balance, 'entry')
    else:
        print(f'Selling {QTY} shares of {SYMBOL}')
        order = api.submit_order(symbol=SYMBOL, qty=QTY, side='sell', type='market', time_in_force='gtc')
        time.sleep(2)
        fill_price = float(api.get_order(order.id).filled_avg_price or 0)
        ending_balance = get_equity()
        pnl = ending_balance - beginning_balance
        log_trade(run_id, SYMBOL, datetime.utcnow().isoformat()+"Z", 'sell', 'close', 'long', fill_price, pnl, ending_balance, 'exit')
    # Update run summary
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("UPDATE runs SET ending_balance=?, total_equity=?, last_update=? WHERE id=?", (ending_balance, ending_balance, datetime.utcnow().isoformat()+"Z", run_id))
    conn.commit()
    conn.close()

if __name__ == "__main__":
    trade()
