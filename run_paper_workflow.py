import subprocess
import sys

def run_paper_workflow(symbol):
    # 1. Run the paper trading script
    print(f"Running paper trade for {symbol}...")
    subprocess.run([sys.executable, 'backend/trade.py', symbol], check=True)
    # 2. Export results to frontend JSON
    print(f"Exporting paper trading results for {symbol}...")
    with open(f'frontend/paper_results.json', 'w') as outfile:
        subprocess.run([sys.executable, 'backend/get_paper_results.py', symbol], stdout=outfile, check=True)
    print("Done. Refresh the dashboard to see updated results.")

if __name__ == '__main__':
    symbol = sys.argv[1] if len(sys.argv) > 1 else 'AAPL'
    run_paper_workflow(symbol)
