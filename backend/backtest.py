import sys
import backtrader as bt
import json
from datetime import datetime

class SmaCrossStrategy(bt.Strategy):
    params = (('fast', 9), ('slow', 21))
    def __init__(self):
        self.fast = bt.ind.SMA(period=self.p.fast)
        self.slow = bt.ind.SMA(period=self.p.slow)
        self.trades = 0
        self.wins = 0
        self.losses = 0
        self.pnl = 0
    def next(self):
        if not self.position and self.fast[0] > self.slow[0]:
            self.buy()
        elif self.position and self.fast[0] < self.slow[0]:
            self.close()
    def notify_trade(self, trade):
        if trade.isclosed:
            self.trades += 1
            pnl = trade.pnl
            self.pnl += pnl
            if pnl > 0:
                self.wins += 1
            else:
                self.losses += 1

def run_backtest_multi(datafile, versions):
    results = []
    beginning_balance = 10000.0
    for v in versions:
        cerebro = bt.Cerebro()
        cerebro.broker.setcash(beginning_balance)
        data = bt.feeds.GenericCSVData(
            dataname=datafile,
            dtformat=('%Y-%m-%d'),
            datetime=0, open=1, high=2, low=3, close=4, volume=5, openinterest=-1
        )
        cerebro.adddata(data)
        strat = cerebro.addstrategy(SmaCrossStrategy, fast=v['fast'], slow=v['slow'])
        res = cerebro.run()
        s = res[0]
        ending_balance = cerebro.broker.getvalue()
        trades = s.trades
        win_rate = (s.wins / trades * 100) if trades > 0 else 0
        profit_factor = (s.pnl / abs(s.pnl - s.pnl if s.pnl > 0 else 1)) if trades > 0 else 0
        net_pnl = s.pnl
        net_return_pct = ((ending_balance - beginning_balance) / beginning_balance) * 100
        results.append({
            "version": v['version'],
            "timeframe": v['timeframe'],
            "trades": trades,
            "win_rate": win_rate,
            "profit_factor": profit_factor,
            "net_pnl": net_pnl,
            "net_return_pct": net_return_pct
        })
    # Use the last version's ending balance for summary
    output = {
        "strategy": "SMA Crossover",
        "symbol": "SYMBOL_PLACEHOLDER",
        "mode": "backtest",
        "beginning_balance": beginning_balance,
        "ending_balance": ending_balance,
        "total_equity": ending_balance,
        "last_update": datetime.utcnow().isoformat() + "Z",
        "versions": results
    }
    print(json.dumps(output, indent=2))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python backtest.py DATAFILE.csv")
        sys.exit(1)
    # Example: multi-version config
    versions = [
        {"version": "v1", "timeframe": "5m", "fast": 9, "slow": 21},
        {"version": "v2", "timeframe": "15m", "fast": 12, "slow": 26},
        {"version": "v3", "timeframe": "30m", "fast": 20, "slow": 50},
        {"version": "v4", "timeframe": "1h", "fast": 50, "slow": 100},
        {"version": "v5", "timeframe": "4h", "fast": 100, "slow": 200},
        {"version": "v6", "timeframe": "1D", "fast": 200, "slow": 400}
    ]
    run_backtest_multi(sys.argv[1], versions)
