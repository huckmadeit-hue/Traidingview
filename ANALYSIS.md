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

These are drawn as colored lines and shaded boxes on the chart. **In v4.0, CHoCH/BOS events now feed into the signal engine** — a recent structure event is required (within a configurable lookback) before buy/sell signals can fire.

### 2. Buy/Sell Signal Generation

The main signals (red "SELL" / green "BUY" labels) require **all enabled filters** to pass simultaneously:

| Filter | What it checks |
|---|---|
| **Momentum Filter** | Price change exceeds a volatility-adjusted threshold (ATR-scaled) |
| **Higher TF Trend Filter** | Price must be above/below both EMA(20) and VWAP on the chosen higher timeframe |
| **Lower TF Filter** | Prevents signals that contradict the lower timeframe trend |
| **Volume Filter** | Volume must be above the 50-period SMA and short-term volume must be rising |
| **Breakout Filter** | Price must break above/below the recent N-bar high/low |
| **Structure Filter** | Requires a recent CHoCH or BOS event within the lookback window |
| **Min Signal Distance** | Enforces a minimum number of bars between signals |
| **Restrict Repeated Signals** | Prevents duplicate signals in the same trend direction |

When a signal fires, it calculates:
- **Take Profit (TP):** ATR(14) * TP multiplier beyond the signal bar's high/low
- **Stop Loss (SL):** ATR(14) * SL multiplier behind the signal bar's high/low

### 3. Multi-Timeframe Trend Dashboard (Top-Right Table)

A table in the top-right corner showing:
- **Trend Strength:** Aggregate score from -100 to +100 across 7 timeframes (1M, 5M, 15M, 30M, 1H, 4H, 1D). Each timeframe votes +1 (bullish), -1 (bearish), or 0 (neutral) based on whether price is above/below both EMA(20) and VWAP.
- **System Confidence:** 50% (mixed), 60% (2+ aligned), 75% (4+ aligned), 90% (all 7 aligned)
- **Cumulative Volume Delta (CVD):** Running sum of volume weighted by candle body ratio — more accurate than simple up/down classification
- **Per-timeframe direction:** Quick visual of each timeframe's trend

### 4. Trend Bias Matrix (Bottom-Right Table)

When "Enable Trend Strength Matrix" is on, a second table shows directional bias for 5M through 1D. Each score combines:
- Trend direction (+1/-1/0)
- Momentum (close vs close 3 bars ago: +0.5/-0.5)
- Volatility expansion (current ATR vs 20-period ATR average: +0.5 if expanding)

Displayed as UP, DN, or -- per timeframe.

### 5. Advanced Analysis Tools (Optional)

- **Liquidity Zone Detection:** Marks areas where price clusters near recent 20-bar highs/lows (potential stop-hunt / liquidity sweep zones)
- **Market Profile Analysis:** Uses rolling SMA of buy/sell volume to identify order flow imbalance (>65% or <35% with above-average volume)
- **Divergence Scanner:** Detects RSI divergences - bullish (price lower lows + RSI higher lows, RSI < 40) and bearish (price higher highs + RSI lower highs, RSI > 60)
- **Get Ready Signals:** Pre-signals when momentum is approaching but hasn't reached the full trigger threshold

### 6. Dynamic Support/Resistance Lines

On the last bar, the script draws two trendlines:
- **Support line:** Connecting the lowest lows from two lookback windows (short and long periods)
- **Resistance line:** Connecting the highest highs from two lookback windows
- Colors shift based on overall trend strength (green for bullish, red for bearish, gray for neutral)

### 7. Alert Conditions

The script includes `alertcondition()` calls for:
- Buy / Sell signals
- CHoCH Bullish / Bearish
- BOS Bullish / Bearish
- Get Ready Buy / Sell

---

## How to Use

### Setup
1. Open TradingView, go to **Pine Editor**, paste the script, and click "Add to chart"
2. The indicator overlays directly on your price chart
3. Configure alerts via TradingView's alert dialog to get notifications

### Recommended Workflow

1. **Check the Dashboard (top-right):** Look at trend strength and confidence. Higher confidence (75%+) with most timeframes aligned gives higher-probability setups.
2. **Watch for BUY/SELL labels:** These are the primary signals. They only fire when multiple filters agree, including market structure confirmation.
3. **Use CHoCH/BOS for context:** CHoCH warns of reversal, BOS confirms continuation. These now also gate signal generation.
4. **Check the Bias Matrix (bottom-right):** If most timeframes show the same direction, the signal has more confluence.
5. **Manage risk with TP/SL:** Levels are ATR-based and adapt to the instrument's volatility automatically.

### Key Settings

| Setting | Default | Notes |
|---|---|---|
| Pivot Length | 5 | Lower = more sensitive, higher = fewer but stronger pivots |
| TP ATR Multiplier | 1.5 | TP distance as a multiple of ATR(14) |
| SL ATR Multiplier | 1.0 | SL distance as a multiple of ATR(14) |
| Structure Lookback | 10 bars | How far back to look for a confirming CHoCH/BOS event |
| Higher TF / Lower TF | 5M / 5M | Set relative to your chart timeframe |
| Min Signal Distance | 5 bars | Prevents signal clustering |
| Max Labels | 200 | Prevents TradingView from silently dropping old drawings |
| Signal Filters | All ON | Disable individually for more signals (lower quality) |

### Important Caveats

- The bias matrix shows rule-based scores from trend, momentum, and volatility - not machine learning or AI
- The CVD uses candle body ratio to weight volume, which is a better approximation than simple direction but still not true order-flow data
- This indicator does **not** execute trades - it provides visual signals for manual decision-making
- Signals can and will produce false positives; always use proper risk management

---

## v4.0 Changelog (fixes from v3.0)

1. **Bug fix:** Get Ready signal operator precedence — momentum check is now properly separated from shared filter conditions
2. **Bug fix:** Market Profile volume ratio — now uses rolling SMA of per-bar buy/sell volume instead of stale single-side updates
3. **Bug fix:** Support/resistance initialization — replaced hardcoded 60000/0 with current bar's high/low so it works on any instrument
4. **Feature:** CHoCH/BOS events now gate buy/sell signals via a configurable structure lookback filter
5. **Feature:** TP/SL are now ATR-based multipliers instead of fixed points, adapting to each instrument's volatility
6. **Feature:** Added 8 `alertcondition()` calls for all signal types
7. **Performance:** Consolidated ~25 `request.security()` calls down to 7 (one per timeframe)
8. **Stability:** Label management via rolling array prevents exceeding TradingView's drawing object limits
9. **Code quality:** Extracted repetitive timeframe selection into `get_trend_for_tf()` function
10. **Accuracy:** CVD now uses candle body ratio (`(close-open)/(high-low)`) instead of binary up/down classification
11. **Naming:** Renamed "Predict" to "Bias" in the trend matrix to avoid implying predictive AI capability
