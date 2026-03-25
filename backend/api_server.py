import os
from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route('/api/add_symbol', methods=['POST'])
def add_symbol():
    data = request.get_json()
    symbol = data.get('symbol', '').upper()
    if not symbol:
        return jsonify({'success': False, 'error': 'No symbol provided'}), 400
    try:
        # Call the add_symbol.py script
        result = subprocess.run([
            'python', os.path.join('backend', 'add_symbol.py'), symbol
        ], capture_output=True, text=True, check=True)
        return jsonify({'success': True, 'output': result.stdout})
    except subprocess.CalledProcessError as e:
        return jsonify({'success': False, 'error': e.stderr}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)
