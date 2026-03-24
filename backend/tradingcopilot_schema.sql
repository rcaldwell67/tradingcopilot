-- SQLite schema for tradingcopilot data storage
-- Table for storing all trading runs (backtest, paper, live) by symbol
CREATE TABLE IF NOT EXISTS runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT NOT NULL,
    mode TEXT NOT NULL, -- 'backtest', 'paper', 'live'
    strategy TEXT NOT NULL,
    run_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    beginning_balance REAL,
    ending_balance REAL,
    total_equity REAL,
    last_update TEXT
);

-- Table for storing version stats for each run
CREATE TABLE IF NOT EXISTS run_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id INTEGER NOT NULL,
    version TEXT NOT NULL,
    timeframe TEXT,
    trades INTEGER,
    win_rate REAL,
    profit_factor REAL,
    net_pnl REAL,
    net_return_pct REAL,
    FOREIGN KEY(run_id) REFERENCES runs(id)
);

-- Table for storing individual trades (optional, for detailed logs)
CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id INTEGER NOT NULL,
    version TEXT,
    trade_time TEXT,
    side TEXT,
    action TEXT,
    position TEXT,
    price REAL,
    pnl REAL,
    balance REAL,
    exit_type TEXT,
    FOREIGN KEY(run_id) REFERENCES runs(id)
);
