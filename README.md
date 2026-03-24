# TradingCopilot

A dashboard to monitor and automate trading for Crypto and ETFs.

## Project Structure

- `frontend/` — Static dashboard (React, Vite) for GitHub Pages
- `backend/` — Python scripts for Pine Script generation, backtesting (Backtrader), and Alpaca trading
- `.github/workflows/` — GitHub Actions for automation
- `docs/` — Static site content for GitHub Pages

## Workflow Overview

1. User enters CUSIP/Symbol in the dashboard
2. GitHub Action triggers backend automation:
	- Generates Pine Script
	- Runs backtest (Backtrader)
	- Initiates paper/live trading (Alpaca)
3. Results and logs are pushed to the repo and displayed on the dashboard

## Technologies
- Frontend: React, Vite, GitHub Pages
- Backend: Python, Backtrader, Alpaca API, Pine Script
- Automation: GitHub Actions/Workflows

## Getting Started
- Frontend: See `frontend/README.md`
- Backend: See `backend/README.md`
- Automation: See `.github/workflows/`

---

This project is designed for full automation and monitoring of trading strategies, leveraging GitHub Actions and static hosting.
# tradingcopilot