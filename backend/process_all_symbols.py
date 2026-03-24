import json
import sys
import subprocess

SYMBOLS_PATH = 'symbols.json'

def load_symbols():
    with open(SYMBOLS_PATH, 'r') as f:
        return json.load(f)

def main():
    symbols = load_symbols()
    for symbol in symbols:
        print(f'Processing {symbol}...')
        subprocess.run([sys.executable, 'run_paper_workflow.py', symbol], check=True)

if __name__ == '__main__':
    main()
