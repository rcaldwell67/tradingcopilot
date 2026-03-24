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
    <h2>Summary</h2>
    <p><strong>Strategy:</strong> ${data.strategy}</p>
    <p><strong>Symbol:</strong> ${data.symbol}</p>
    <p><strong>Mode:</strong> ${data.mode}</p>
    <p><strong>Beginning Balance:</strong> $${data.beginning_balance.toFixed(2)}</p>
    <p><strong>Ending Balance:</strong> $${data.ending_balance.toFixed(2)}</p>
    <p><strong>Total Equity:</strong> $${data.total_equity.toFixed(2)}</p>
    <p><strong>Last Update:</strong> ${data.last_update}</p>
  `;
}

function renderVersions(versions) {
  const versionsDiv = document.getElementById('versions');
  versionsDiv.innerHTML = '<h2>Strategy Versions</h2>';
  versionsDiv.innerHTML += versions.map(v => `
    <div class="version-card">
      <h3>${v.version} (${v.timeframe})</h3>
      <p><strong>Trades:</strong> ${v.trades}</p>
      <p><strong>Win Rate:</strong> ${v.win_rate}%</p>
      <p><strong>Profit Factor:</strong> ${v.profit_factor}</p>
      <p><strong>Net PnL:</strong> $${v.net_pnl}</p>
      <p><strong>Net Return %:</strong> ${v.net_return_pct}</p>
    </div>
  `).join('');
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
