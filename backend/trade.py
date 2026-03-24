import sys
import alpaca_trade_api as tradeapi
import time

API_KEY = 'YOUR_API_KEY'
API_SECRET = 'YOUR_API_SECRET'
BASE_URL = 'https://paper-api.alpaca.markets'

api = tradeapi.REST(API_KEY, API_SECRET, BASE_URL, api_version='v2')

SYMBOL = sys.argv[1] if len(sys.argv) > 1 else 'AAPL'
QTY = 1

# Example: Simple buy and sell logic
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
    if not position:
        print(f'Buying {QTY} shares of {SYMBOL}')
        api.submit_order(symbol=SYMBOL, qty=QTY, side='buy', type='market', time_in_force='gtc')
    else:
        print(f'Selling {QTY} shares of {SYMBOL}')
        api.submit_order(symbol=SYMBOL, qty=QTY, side='sell', type='market', time_in_force='gtc')

if __name__ == "__main__":
    trade()
