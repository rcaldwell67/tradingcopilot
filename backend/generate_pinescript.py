import sys

def generate_pinescript(symbol: str) -> str:
    """
    Generate a basic Pine Script template for a given symbol.
    """
    # Placeholder: In production, customize based on symbol/CUSIP and strategy
    template = f"""
//@version=5
strategy("Auto-{symbol}", overlay=true)

// Example: Simple Moving Average Crossover
fast = ta.sma(close, 9)
slow = ta.sma(close, 21)

if ta.crossover(fast, slow)
    strategy.entry("Long", strategy.long)
if ta.crossunder(fast, slow)
    strategy.close("Long")
"""
    return template

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_pinescript.py SYMBOL")
        sys.exit(1)
    symbol = sys.argv[1]
    print(generate_pinescript(symbol))
