# PERFECT RETAIL FOREX MACRO SCORING MODEL V07

## 🎯 Overview

This is a complete implementation of the **PERFECT RETAIL FOREX MACRO SCORING MODEL V07** - an institutional-grade currency analysis system simplified for retail traders. The model provides systematic, data-driven forex trading signals based on four core factors that drive currency movements.

## 🏗️ Architecture

The implementation consists of:

- **Core Model Logic** (`src/lib/modelCalculations.ts`) - All V07 calculations and algorithms
- **Type Definitions** (`src/types/forex.ts`) - TypeScript interfaces and constants
- **Data Utilities** (`src/utils/dataUtils.ts`) - Helper functions for data processing
- **React Interface** (`src/components/ForexModel.tsx`) - Modern web UI for model interaction
- **UI Components** (`src/components/ui/`) - Reusable shadcn/ui components

## 📊 Model Factors

### 1. Rate Policy (35% - Most Important)
- **Rate Differential Model (80%)**: Market terminal rate vs current policy rate
- **Central Bank Tone (20%)**: Hawkish/dovish keyword analysis in speeches
- **Currency Sensitivity Multipliers**: Account for CB communication styles

### 2. Growth Momentum (25%)
- **Employment Component (40%)**: Country-specific employment metrics
- **Manufacturing PMI (30%)**: Business activity indicators
- **GDP Momentum (30%)**: Economic growth trends

### 3. Real Interest Edge (30%)
- **Real Rate Formula**: 2-year yield - inflation expectations
- **Pair Scoring**: (Currency A Real Rate - Currency B Real Rate) × 1.5
- **Market-Based Inflation**: Uses breakeven rates, not CPI adjustments

### 4. Risk Appetite (10%)
- **VIX Regime (60%)**: Dynamic percentile-based volatility scoring
- **Cross-Asset Sentiment (40%)**: SPY vs GLD performance differential
- **Currency Risk Classification**: Risk-on beneficiaries vs safe havens

### 5. Positioning Data (5%)
- **COT Reports**: Large speculator net positions
- **Percentile Scoring**: 52-week basis for institutional sentiment

## 🔄 Market Regime Detection

The model dynamically adjusts factor weights based on market conditions:

| Regime | Rate Policy | Growth | Real Interest | Risk Appetite |
|--------|-------------|--------|---------------|---------------|
| **Risk-Off** | 45% | 15% | 25% | 15% |
| **Risk-On** | 30% | 35% | 25% | 10% |
| **Neutral** | 35% | 25% | 30% | 10% |
| **CB Week** | 55% | 15% | 25% | 5% |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Testing
```bash
node test.js
```

## 📈 Usage

### 1. Market Data Input
The model requires the following data for each currency:

```typescript
{
  vix: number,                    // Current VIX level
  vixPercentile: number,          // VIX 20-day percentile
  spyWeeklyReturn: number,        // SPY weekly return
  gldWeeklyReturn: number,        // GLD weekly return
  currencies: {
    USD: {
      currentPolicyRate: number,      // Current central bank rate
      marketTerminalRate: number,     // Market-implied terminal rate
      hawkishWords: number,           // Hawkish keywords in speeches
      dovishWords: number,            // Dovish keywords in speeches
      employmentData: number,         // Employment metric
      manufacturingPMI: number,       // Manufacturing PMI
      gdpGrowth: number,              // GDP growth rate
      twoYearYield: number,           // 2-year government yield
      inflationExpectation: number,   // Inflation expectations
      cotPercentile: number,          // COT positioning percentile
    },
    // ... repeat for EUR, GBP, JPY, AUD, CAD, CHF
  }
}
```

### 2. Running the Model
```typescript
import { runForexModel } from './src/lib/modelCalculations';

const result = runForexModel(inputData);
console.log(result.pairSignals); // Trading signals
console.log(result.currencyScores); // Individual currency scores
```

### 3. Interpreting Results

#### Signal Strength Guide
| Score Difference | Signal Strength | Confidence | Action |
|------------------|-----------------|------------|---------|
| >2.0 | Very Strong | High | Trade immediately |
| 1.5-2.0 | Strong | Medium-High | Wait for pullback |
| 1.0-1.5 | Moderate | Medium | Wait for setup |
| 0.5-1.0 | Weak | Low-Medium | Only if perfect setup |
| <0.5 | Neutral | Low | Don't trade |

## 🎨 Features

### Web Interface
- **Real-time Model Execution**: Run the model with sample data
- **Interactive Results**: View scores, signals, and factor analysis
- **Dark/Light Theme**: Toggle between themes
- **Responsive Design**: Works on desktop and mobile
- **Tabbed Interface**: Overview, Currency Scores, Trading Signals, Factor Analysis

### Core Capabilities
- ✅ **Complete V07 Implementation**: All factors and calculations
- ✅ **Dynamic Regime Detection**: Automatic market state classification
- ✅ **Currency-Specific Logic**: Different thresholds and sensitivities
- ✅ **Signal Generation**: Pair-specific trading recommendations
- ✅ **Data Validation**: Input validation and error handling
- ✅ **TypeScript Support**: Full type safety and IntelliSense

## 📋 Data Sources

### Required Data Sources
- **VIX**: CBOE Volatility Index
- **SPY/GLD**: Weekly returns for risk sentiment
- **OIS Rates**: 1-year overnight index swap rates
- **2-Year Yields**: Government bond yields
- **PMI Data**: Manufacturing purchasing managers index
- **Employment Data**: Country-specific employment metrics
- **COT Reports**: Commitment of Traders data (weekly)

### Data Source Mappings
```typescript
DATA_SOURCES = {
  RATES: {
    USD: 'SOFR 1Y rate',
    EUR: 'ESTR 1Y rate',
    GBP: 'SONIA 1Y rate',
    // ...
  },
  YIELDS: {
    USD: 'DGS2 (FRED)',
    EUR: 'DE2Y-EUR',
    GBP: 'UK2Y-GBP',
    // ...
  },
  // ...
}
```

## 🔧 Customization

### Adding New Currencies
1. Add currency to `Currency` type in `src/types/forex.ts`
2. Add rate sensitivity in `RATE_SENSITIVITY`
3. Add employment thresholds in `EMPLOYMENT_THRESHOLDS`
4. Add risk factors in `CURRENCY_RISK_FACTORS`

### Modifying Factor Weights
Update `REGIME_FACTOR_WEIGHTS` in `src/types/forex.ts` to adjust factor importance by regime.

### Custom Signal Thresholds
Modify `SIGNAL_THRESHOLDS` in `src/types/forex.ts` to change signal strength classifications.

## 🧪 Testing

The model includes comprehensive test data and validation:

```bash
# Run basic validation
node test.js

# Expected output:
# ✅ Test data structure validated
# ✅ Model specification implemented
# ✅ All core calculations present
# ✅ Factor weights correctly applied
# ✅ Regime detection logic implemented
# ✅ Signal generation working
# 🎯 Model V07 is fully implemented and ready for use!
```

## 📚 Model Documentation

### 25-Minute Weekly Routine
1. **Minutes 1-4**: Market regime classification
2. **Minutes 5-12**: Rate policy analysis
3. **Minutes 13-19**: Real interest rate update
4. **Minutes 20-23**: Growth & risk assessment
5. **Minutes 24-25**: COT positioning check

### Key Improvements in V07
- ✅ **Rate Policy**: Uses market-implied terminal rates vs current policy
- ✅ **Real Rates**: Uses actual breakeven inflation rates
- ✅ **Regime Detection**: Dynamic percentile-based thresholds
- ✅ **Positioning**: COT data replaces money flow
- ✅ **Factor Weights**: Research-backed regime adaptation

## 🤝 Contributing

This implementation follows the exact specifications of the V07 model. Any modifications should maintain the core mathematical relationships and factor weights as specified in the model documentation.

## 📄 License

This project implements the PERFECT RETAIL FOREX MACRO SCORING MODEL V07 for educational and research purposes.

## 🎯 Success Principles

1. **Consistency Over Perfection**: Run the 25-minute routine every Sunday
2. **Follow the Scores**: Trust the model, not gut feelings
3. **Start Simple**: Begin with EUR/USD and USD/JPY
4. **Data Quality**: Use exact sources mentioned
5. **Marathon Mindset**: Track accuracy over 20+ trades

---

**Remember**: This isn't about being right every single time. It's about having a systematic edge that compounds over months and years.
