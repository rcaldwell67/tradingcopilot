// TradingCopilot Dashboard JS



// On page load, fetch symbols and populate dropdown
window.addEventListener('DOMContentLoaded', async function() {
  await populateSymbolDropdown();
});

async function populateSymbolDropdown() {
  const dropdown = document.getElementById('symbol-dropdown');
  try {
    // For demo: fetch from backend via local server or static file
    // Replace with real API endpoint as needed
    const resp = await fetch('backend/get_symbols.py');
    // APM Dashboard JS Starter

    window.addEventListener('DOMContentLoaded', function() {
      // Populate symbol dropdown (stub)
      const dropdown = document.getElementById('symbol-dropdown');
      dropdown.innerHTML = '<option value="BTCUSD">BTCUSD</option><option value="ETHUSD">ETHUSD</option>';

      // Handle form submit (stub)
      document.getElementById('symbol-form').addEventListener('submit', function(e) {
        e.preventDefault();
        // TODO: Fetch and render data for selected symbol
        alert('Run backtest for: ' + dropdown.value);
      });

      // Render demo transactions table
      renderTransactionsTable([
        { time: '2026-03-14 10:45', timeframe: '15m', side: 'BUY', action: 'Close', position: 'short', price: 70565.38, pnl: 25.15, balance: 12529.17, exit_type: 'SL' },
        { time: '2026-03-14 09:15', timeframe: '15m', side: 'SELL', action: 'Open', position: 'short', price: 70678.56, pnl: null, balance: 12529.17, exit_type: null }
      ]);

      // Render demo trade log table
      renderTradeLogTable([
        { timeframe: '15m', entry: 'Mar 14, 26', exit: 'Mar 14, 26', position: 'short', entry_price: 70678.56, exit_price: 70565.38, pnl: 25.15, exit_type: 'SL', balance: 12554.32 }
      ]);
    });

    function renderTransactionsTable(transactions) {
      const div = document.getElementById('transactions-table');
      if (!transactions || transactions.length === 0) {
        div.innerHTML = '<div style="color:#888;">No transactions found.</div>';
        return;
      }
      let html = '<table class="transactions-table"><thead><tr>';
      const headers = ['Time', 'Timeframe', 'Side', 'Action', 'Position', 'Price', 'PnL', 'Balance', 'Exit Type'];
      headers.forEach(h => html += `<th>${h}</th>`);
      html += '</tr></thead><tbody>';
      transactions.forEach(t => {
        html += `<tr><td>${t.time}</td><td>${t.timeframe}</td><td>${t.side}</td><td>${t.action}</td><td>${t.position}</td><td>${t.price ?? ''}</td><td>${t.pnl ?? ''}</td><td>${t.balance ?? ''}</td><td>${t.exit_type ?? ''}</td></tr>`;
      });
      html += '</tbody></table>';
      div.innerHTML = html;
    }

    function renderTradeLogTable(trades) {
      const div = document.getElementById('trade-log-table');
      if (!trades || trades.length === 0) {
        div.innerHTML = '<div style="color:#888;">No trades found.</div>';
        return;
      }
      let html = '<table class="trade-log-table"><thead><tr>';
      const headers = ['Timeframe', 'Entry', 'Exit', 'Position', 'Entry Price', 'Exit Price', 'PnL', 'Exit Type', 'Balance'];
      headers.forEach(h => html += `<th>${h}</th>`);
      html += '</tr></thead><tbody>';
      trades.forEach(t => {
        html += `<tr><td>${t.timeframe}</td><td>${t.entry}</td><td>${t.exit}</td><td>${t.position}</td><td>${t.entry_price ?? ''}</td><td>${t.exit_price ?? ''}</td><td>${t.pnl ?? ''}</td><td>${t.exit_type ?? ''}</td><td>${t.balance ?? ''}</td></tr>`;
      });
      html += '</tbody></table>';
      div.innerHTML = html;
    }
    renderPaperSummary({error: pdata.error});
    renderPaperTrades([]);
    return;
  }
  renderPaperSummary(pdata.summary);
  renderPaperTrades(pdata.trades);
}

function renderPaperSummary(summary) {
  const div = document.getElementById('paper-summary');
  if (summary.error) {
    div.innerHTML = `<h2>Paper Trading</h2><p style="color:#c62828;">${summary.error}</p>`;
    return;
  }
  div.innerHTML = `
    <h2>Paper Trading Summary</h2>
    <div><strong>Beginning Balance:</strong> $${summary.beginning_balance?.toFixed(2) ?? '--'}</div>
    <div><strong>Ending Balance:</strong> $${summary.ending_balance?.toFixed(2) ?? '--'}</div>
    <div><strong>Total Equity:</strong> $${summary.total_equity?.toFixed(2) ?? '--'}</div>
    <div><strong>Last Update:</strong> ${summary.last_update ?? '--'}</div>
  `;
}

function renderPaperTrades(trades) {
  const div = document.getElementById('paper-trades');
  if (!trades || trades.length === 0) {
    div.innerHTML = '';
    return;
  }
  let html = '<h2>Paper Trading Log</h2>';
  html += '<table class="paper-trades-table"><thead><tr>';
  html += ['Time', 'Side', 'Action', 'Position', 'Price', 'PnL', 'Balance', 'Exit Type'].map(h => `<th>${h}</th>`).join('');
  html += '</tr></thead><tbody>';
  html += trades.map(t => `<tr><td>${t.trade_time}</td><td>${t.side}</td><td>${t.action}</td><td>${t.position}</td><td>${t.price}</td><td>${t.pnl}</td><td>${t.balance}</td><td>${t.exit_type}</td></tr>`).join('');
  html += '</tbody></table>';
  div.innerHTML = html;
}
function renderSummary(data) {
  const summaryDiv = document.getElementById('summary');
  summaryDiv.innerHTML = `
    <div class="summary-stat"><span class="summary-label">Strategy:</span> ${data.strategy}</div>
    <div class="summary-stat"><span class="summary-label">Symbol:</span> ${data.symbol}</div>
    <div class="summary-stat"><span class="summary-label">Mode:</span> ${data.mode}</div>
    <div class="summary-stat"><span class="summary-label">Beginning Balance:</span> $${data.beginning_balance.toFixed(2)}</div>
    <div class="summary-stat"><span class="summary-label">Ending Balance:</span> $${data.ending_balance.toFixed(2)}</div>
    <div class="summary-stat"><span class="summary-label">Total Equity:</span> $${data.total_equity.toFixed(2)}</div>
    <div class="summary-stat"><span class="summary-label">Last Update:</span> ${data.last_update}</div>
  `;
}

function renderVersions(versions) {
  const versionsDiv = document.getElementById('versions');
  versionsDiv.innerHTML = '<h2>Strategy Versions</h2>';
  versionsDiv.innerHTML += versions.map(v => {
    // Color classes for quick stats
    const netReturnClass = v.net_return_pct > 0 ? 'quick-stat positive' : (v.net_return_pct < 0 ? 'quick-stat negative' : 'quick-stat');
    const winRateClass = v.win_rate > 50 ? 'quick-stat positive' : (v.win_rate < 50 ? 'quick-stat negative' : 'quick-stat');
    const pfClass = v.profit_factor > 1 ? 'quick-stat positive' : (v.profit_factor < 1 ? 'quick-stat negative' : 'quick-stat');
    return `
      <div class="version-card">
        <h3>${v.version} <span style="font-weight:400; color:#444;">(${v.timeframe})</span></h3>
        <div class="quick-stats">
          <span class="${netReturnClass}">Return: ${v.net_return_pct}%</span>
          <span class="${winRateClass}">WR: ${v.win_rate}%</span>
          <span class="${pfClass}">PF: ${v.profit_factor}</span>
          <span class="quick-stat">Trades: ${v.trades}</span>
        </div>
        <div style="font-size:0.97rem; color:#555;">
          Net PnL: $${v.net_pnl}
        </div>
      </div>
    `;
  }).join('');
}

// Demo: Add more fields for version comparison (extend as needed)
function renderVersionComparison(versions) {
  const comparisonDiv = document.getElementById('version-comparison');
  if (!versions || versions.length === 0) {
    comparisonDiv.innerHTML = '';
    return;
  }
  // Placeholder for additional fields (add real fields as backend provides them)
  const headers = [
    'Version', 'Timeframe', 'Trades', 'Win Rate', 'Profit Factor', 'Net PnL', 'Net Return %'
  ];
  const rows = versions.map(v => [
    v.version,
    v.timeframe,
    v.trades,
    v.win_rate,
    v.profit_factor,
    v.net_pnl,
    v.net_return_pct
  ]);
  let html = '<h2>Version Comparison</h2>';
  html += '<table class="version-comparison-table"><thead><tr>';
  html += headers.map(h => `<th>${h}</th>`).join('');
  html += '</tr></thead><tbody>';
  html += rows.map(row => '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>').join('');
  html += '</tbody></table>';
  comparisonDiv.innerHTML = html;
}
