import sys
import subprocess
import json

# Usage: python backend/add_symbol.py SYMBOL
# This script triggers the automation for a new symbol: runs backtest and paper trading for all versions.

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No symbol provided'}))
        sys.exit(1)
    symbol = sys.argv[1].upper()
    # Trigger the workflow (run_paper_workflow.py will handle DB/logging)
    try:
        result = subprocess.run([
            sys.executable, 'run_paper_workflow.py', symbol
        ], capture_output=True, text=True, check=True)
        print(json.dumps({'success': True, 'output': result.stdout}))
    except subprocess.CalledProcessError as e:
        print(json.dumps({'success': False, 'error': e.stderr}))
