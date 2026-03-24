// TradingCopilot Dashboard JS

document.getElementById('symbol-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const symbol = document.getElementById('symbol').value.trim();
  // For demo: fetch static JSON from backend (replace with real API call)
  const response = await fetch('sample_output.json');
  const data = await response.json();
  renderSummary(data);
  renderVersions(data.versions);
  renderVersionComparison(data.versions);
});

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
