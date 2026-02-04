# Smart Money Structure | GainzAlgo - Script Analysis

## Overview

This is a **Pine Script v5** TradingView indicator that combines Smart Money Concepts (SMC) with multi-timeframe trend analysis, volume profiling, and divergence detection. It overlays directly on the price chart.

---

## Core Components

### 1. Market Structure Detection (CHoCH & BOS)

The script identifies two key Smart Money Concepts using pivot highs/lows:

- **CHoCH (Change of Character):** Detects when price crosses a previous pivot level *against* the prior trend, signaling a potential trend reversal.
  - `choch_sell`: Price crosses below the last pivot high with a bearish candle
  - `choch_buy`: Price crosses above the last pivot low with a bullish candle

- **BOS (Break of Structure):** Detects when price breaks beyond a previous pivot level in the same trend direction, confirming continuation.
  - `bos_sell`: Price breaks below the previous pivot low with a bearish candle
  - `bos_buy`: Price breaks above the previous pivot high with a bullish candle

These are drawn as colored lines and shaded boxes on the chart.

### 2. Buy/Sell Signal Generation

The main signals (red "SELL" / green "BUY" labels) require **all enabled filters** to pass simultaneously:

| Filter | What it checks |
|---|---|
| **Momentum Filter** | Price change exceeds a volatility-adjusted threshold (ATR-scaled) |
| **Higher TF Trend Filter** | Price must be above/below both EMA(20) and VWAP on the chosen higher timeframe |
| **Lower TF Filter** | Prevents signals that contradict the lower timeframe trend |
| **Volume Filter** | Volume must be above the 50-period SMA and short-term volume must be rising |
| **Breakout Filter** | Price must break above/below the recent N-bar high/low |
| **Min Signal Distance** | Enforces a minimum number of bars between signals |
| **Restrict Repeated Signals** | Prevents duplicate signals in the same trend direction |

When a signal fires, it calculates:
- **Take Profit (TP):** `tp_points` beyond the signal bar's high/low
- **Stop Loss (SL):** `sl_points` behind the signal bar's high/low

### 3. Multi-Timeframe Trend Dashboard (Top-Right Table)

A table in the top-right corner showing:
- **Trend Strength:** Aggregate score from -100 to +100 across 7 timeframes (1M, 5M, 15M, 30M, 1H, 4H, 1D). Each timeframe votes +1 (bullish), -1 (bearish), or 0 (neutral) based on whether price is above/below both EMA(20) and VWAP.
- **System Confidence:** 50% (mixed), 60% (2+ aligned), 75% (4+ aligned), 90% (all 7 aligned)
- **Cumulative Volume Delta (CVD):** Running sum of signed volume - positive if buying pressure dominates, negative if selling pressure dominates
- **Per-timeframe arrows:** Quick visual of each timeframe's trend direction

### 4. Trend Prediction Matrix (Bottom-Right Table)

When "Enable Trend Strength Matrix" is on, a second table shows direction estimates for 5M through 1D. Each score combines:
- Trend direction (+1/-1/0)
- Momentum (close vs close 3 bars ago: +0.5/-0.5)
- Volatility expansion (current ATR vs 20-period ATR average: +0.5 if expanding)

Displayed as up arrow, down arrow, or flat dash per timeframe.

### 5. Advanced Analysis Tools (Optional)

- **Liquidity Zone Detection:** Marks areas where price clusters near recent 20-bar highs/lows (potential stop-hunt / liquidity sweep zones)
- **Market Profile Analysis:** Identifies bars with strong buy or sell order flow imbalance (buy/sell volume ratio > 65% or < 35% with above-average volume)
- **Divergence Scanner:** Detects RSI divergences - bullish (price lower lows + RSI higher lows, RSI < 40) and bearish (price higher highs + RSI lower highs, RSI > 60)
- **Get Ready Signals:** Pre-signals when momentum is approaching but hasn't reached the full trigger threshold

### 6. Dynamic Support/Resistance Lines

On the last bar, the script draws two trendlines:
- **Support line:** Connecting the lowest lows from two lookback windows (short and long periods)
- **Resistance line:** Connecting the highest highs from two lookback windows
- Colors shift based on overall trend strength (green for bullish, red for bearish, gray for neutral)

---

## How to Use

### Setup
1. Open TradingView, go to **Pine Editor**, paste the script, and click "Add to chart"
2. The indicator overlays directly on your price chart

### Recommended Workflow

1. **Check the Dashboard (top-right):** Look at trend strength and confidence. Higher confidence (75%+) with most timeframes aligned gives higher-probability setups.
2. **Watch for BUY/SELL labels:** These are the primary signals. They only fire when multiple filters agree.
3. **Use CHoCH/BOS for context:** CHoCH warns of reversal, BOS confirms continuation.
4. **Check the Prediction Matrix (bottom-right):** If most timeframes show the same arrow direction, the signal has more confluence.
5. **Manage risk with TP/SL:** Use the calculated levels as guidelines for order placement.

### Key Settings

| Setting | Default | Notes |
|---|---|---|
| Pivot Length | 5 | Lower = more sensitive, higher = fewer but stronger pivots |
| TP / SL Points | 10 / 10 | In price points - adjust to your instrument's volatility |
| Higher TF / Lower TF | 5M / 5M | Set relative to your chart timeframe |
| Min Signal Distance | 5 bars | Prevents signal clustering |
| Signal Filters | All ON | Disable individually for more signals (lower quality) |

### Important Caveats

- The "predictions" are rule-based scores from trend, momentum, and volatility - not machine learning or AI
- The CVD uses candle direction to classify volume, which is a simplified proxy for true order-flow data
- This indicator does **not** execute trades - it provides visual signals for manual decision-making
- Signals can and will produce false positives; always use proper risk management
