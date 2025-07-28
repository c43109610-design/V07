// PERFECT RETAIL FOREX MACRO SCORING MODEL V07 - Core Calculations
import {
  Currency,
  MarketRegime,
  RatePolicyData,
  GrowthMomentumData,
  RealInterestData,
  RiskAppetiteData,
  PositioningData,
  CurrencyScore,
  MarketData,
  FactorWeights,
  PairSignal,
  ModelResult,
  RATE_SENSITIVITY,
  EMPLOYMENT_THRESHOLDS,
  CURRENCY_RISK_FACTORS,
  HAWKISH_KEYWORDS,
  DOVISH_KEYWORDS,
  REGIME_FACTOR_WEIGHTS,
  SIGNAL_THRESHOLDS,
} from '../types/forex';

// ============================================================================
// IMPROVED REGIME DETECTION
// ============================================================================

export function detectMarketRegime(
  vix: number,
  vixPercentile: number,
  spyWeeklyReturn: number,
  gldWeeklyReturn: number,
  isCentralBankWeek: boolean = false
): MarketRegime {
  if (isCentralBankWeek) {
    return 'CENTRAL_BANK_WEEK';
  }

  // RISK-OFF: VIX > 75th percentile OR Gold outperforms SPX 5+ days
  const isRiskOff = vixPercentile > 75 || (gldWeeklyReturn - spyWeeklyReturn) > 0.05;

  // RISK-ON: VIX < 25th percentile AND SPX above 20-day MA (simplified)
  const isRiskOn = vixPercentile < 25 && spyWeeklyReturn > 0;

  if (isRiskOff) return 'RISK-OFF';
  if (isRiskOn) return 'RISK-ON';
  return 'NEUTRAL';
}

// ============================================================================
// FACTOR 1: RATE POLICY (35%) - COMPLETELY FIXED
// ============================================================================

export function calculateRatePolicy(
  currency: Currency,
  currentPolicyRate: number,
  marketTerminalRate: number,
  hawkishWords: number = 0,
  dovishWords: number = 0
): RatePolicyData {
  // A. Rate Differential Model (80% of factor)
  const rateGap = marketTerminalRate - currentPolicyRate;
  const rateScore = rateGap * RATE_SENSITIVITY[currency];

  // B. Central Bank Tone Shift (20% of factor)
  const toneScore = Math.min(Math.max((hawkishWords - dovishWords) * 0.1, -1.0), 1.0);

  // Combined score: 80% rate gap + 20% tone
  const totalScore = (rateScore * 0.8) + (toneScore * 0.2);

  return {
    currentPolicyRate,
    marketTerminalRate,
    rateGap,
    rateScore,
    hawkishWords,
    dovishWords,
    toneScore,
    totalScore,
  };
}

// ============================================================================
// FACTOR 2: GROWTH MOMENTUM (25%) - REFINED
// ============================================================================

export function calculateGrowthMomentum(
  currency: Currency,
  employmentData: number,
  manufacturingPMI: number,
  gdpGrowth: number
): GrowthMomentumData {
  const thresholds = EMPLOYMENT_THRESHOLDS[currency];

  // A. Employment Component (40% of factor)
  let employmentScore = 0;
  if (employmentData >= thresholds.strong) {
    employmentScore = 1.0;
  } else if (employmentData <= thresholds.weak) {
    employmentScore = -1.0;
  }

  // B. Manufacturing Component (30% of factor)
  let manufacturingScore = 0;
  if (manufacturingPMI > 52) {
    manufacturingScore = 1.0;
  } else if (manufacturingPMI >= 50) {
    manufacturingScore = 0.5;
  } else if (manufacturingPMI >= 48) {
    manufacturingScore = 0.0;
  } else if (manufacturingPMI >= 45) {
    manufacturingScore = -0.5;
  } else {
    manufacturingScore = -1.0;
  }

  // C. GDP Momentum (30% of factor)
  let gdpScore = 0;
  if (gdpGrowth > 3.0) {
    gdpScore = 1.0;
  } else if (gdpGrowth >= 2.0) {
    gdpScore = 0.5;
  } else if (gdpGrowth >= 1.0) {
    gdpScore = 0.0;
  } else if (gdpGrowth >= 0) {
    gdpScore = -0.5;
  } else {
    gdpScore = -1.0;
  }

  // Composite score: 40% employment + 30% manufacturing + 30% GDP
  const compositeScore = (employmentScore * 0.4) + (manufacturingScore * 0.3) + (gdpScore * 0.3);

  return {
    employmentScore,
    manufacturingScore,
    gdpScore,
    compositeScore,
  };
}

// ============================================================================
// FACTOR 3: REAL INTEREST EDGE (30%) - MAJOR FIX
// ============================================================================

export function calculateRealInterestEdge(
  baseCurrency: Currency,
  quoteCurrency: Currency,
  baseTwoYearYield: number,
  quoteTwoYearYield: number,
  baseInflationExpectation: number,
  quoteInflationExpectation: number
): RealInterestData {
  // CORRECTED Real Rate Formula
  const baseRealRate = baseTwoYearYield - baseInflationExpectation;
  const quoteRealRate = quoteTwoYearYield - quoteInflationExpectation;
  
  // Pair Score = (Currency A Real Rate - Currency B Real Rate) × 1.5
  const realRateDifference = baseRealRate - quoteRealRate;
  const pairScore = realRateDifference * 1.5;

  return {
    twoYearYield: baseTwoYearYield,
    inflationExpectation: baseInflationExpectation,
    realRate: baseRealRate,
    pairScore,
  };
}

// ============================================================================
// FACTOR 4: RISK APPETITE (10%) - SIMPLIFIED
// ============================================================================

export function calculateRiskAppetite(
  currency: Currency,
  vixPercentile: number,
  spyWeeklyReturn: number,
  gldWeeklyReturn: number
): RiskAppetiteData {
  // A. Volatility Regime (60% of factor)
  let vixScore = 0;
  if (vixPercentile < 20) {
    vixScore = 1.0; // Risk-on
  } else if (vixPercentile < 40) {
    vixScore = 0.5;
  } else if (vixPercentile < 60) {
    vixScore = 0.0; // Neutral
  } else if (vixPercentile < 80) {
    vixScore = -0.5;
  } else {
    vixScore = -1.0; // Risk-off
  }

  // B. Cross-Asset Risk Sentiment (40% of factor)
  const riskScore = Math.min(Math.max((spyWeeklyReturn - gldWeeklyReturn) * 2, -1.0), 1.0);
  
  // Apply currency-specific risk factors
  const currencyRiskFactor = CURRENCY_RISK_FACTORS[currency];
  const crossAssetScore = riskScore * currencyRiskFactor;

  // Total score: 60% VIX + 40% cross-asset
  const totalScore = (vixScore * 0.6) + (crossAssetScore * 0.4);

  return {
    vixPercentile,
    vixScore,
    spyReturn: spyWeeklyReturn,
    gldReturn: gldWeeklyReturn,
    crossAssetScore,
    totalScore,
  };
}

// ============================================================================
// POSITIONING DATA (5%) - Replaces Money Flow
// ============================================================================

export function calculatePositioning(cotPercentile: number): PositioningData {
  let positioningScore = 0;
  
  if (cotPercentile > 90) {
    positioningScore = 1.0; // Extremely bullish positioning
  } else if (cotPercentile > 70) {
    positioningScore = 0.5;
  } else if (cotPercentile > 30) {
    positioningScore = 0.0; // Neutral
  } else if (cotPercentile > 10) {
    positioningScore = -0.5;
  } else {
    positioningScore = -1.0; // Extremely bearish positioning
  }

  return {
    cotPercentile,
    positioningScore,
  };
}

// ============================================================================
// IMPROVED SCORING CALCULATION
// ============================================================================

export function calculateCurrencyScore(
  currency: Currency,
  ratePolicyData: RatePolicyData,
  growthMomentumData: GrowthMomentumData,
  realInterestEdgeData: RealInterestData,
  riskAppetiteData: RiskAppetiteData,
  positioningData: PositioningData,
  factorWeights: FactorWeights
): CurrencyScore {
  const totalScore = 
    (ratePolicyData.totalScore * factorWeights.ratePolicy) +
    (growthMomentumData.compositeScore * factorWeights.growthMomentum) +
    (realInterestEdgeData.pairScore * factorWeights.realInterestEdge) +
    (riskAppetiteData.totalScore * factorWeights.riskAppetite) +
    (positioningData.positioningScore * factorWeights.positioning);

  return {
    currency,
    ratePolicy: ratePolicyData.totalScore,
    growthMomentum: growthMomentumData.compositeScore,
    realInterestEdge: realInterestEdgeData.pairScore,
    riskAppetite: riskAppetiteData.totalScore,
    positioning: positioningData.positioningScore,
    totalScore,
  };
}

// ============================================================================
// PAIR SIGNAL GENERATION
// ============================================================================

export function generatePairSignal(
  baseCurrency: Currency,
  quoteCurrency: Currency,
  baseScore: number,
  quoteScore: number
): PairSignal {
  const scoreDifference = baseScore - quoteScore;
  
  let signalStrength: PairSignal['signalStrength'] = 'Neutral';
  let confidenceLevel: PairSignal['confidenceLevel'] = 'Low';
  let bias: PairSignal['bias'] = 'Neutral';

  if (Math.abs(scoreDifference) >= SIGNAL_THRESHOLDS.VERY_STRONG) {
    signalStrength = 'Very Strong';
    confidenceLevel = 'High';
  } else if (Math.abs(scoreDifference) >= SIGNAL_THRESHOLDS.STRONG) {
    signalStrength = 'Strong';
    confidenceLevel = 'Medium-High';
  } else if (Math.abs(scoreDifference) >= SIGNAL_THRESHOLDS.MODERATE) {
    signalStrength = 'Moderate';
    confidenceLevel = 'Medium';
  } else if (Math.abs(scoreDifference) >= SIGNAL_THRESHOLDS.WEAK) {
    signalStrength = 'Weak';
    confidenceLevel = 'Low-Medium';
  }

  if (scoreDifference > 0) {
    bias = 'Bullish';
  } else if (scoreDifference < 0) {
    bias = 'Bearish';
  }

  return {
    pair: `${baseCurrency}/${quoteCurrency}`,
    baseCurrency,
    quoteCurrency,
    scoreDifference,
    signalStrength,
    confidenceLevel,
    bias,
  };
}

// ============================================================================
// MAIN MODEL EXECUTION
// ============================================================================

export function runForexModel(inputData: {
  vix: number;
  vixPercentile: number;
  spyWeeklyReturn: number;
  gldWeeklyReturn: number;
  isCentralBankWeek?: boolean;
  currencies: Record<Currency, {
    currentPolicyRate: number;
    marketTerminalRate: number;
    hawkishWords?: number;
    dovishWords?: number;
    employmentData: number;
    manufacturingPMI: number;
    gdpGrowth: number;
    twoYearYield: number;
    inflationExpectation: number;
    cotPercentile: number;
  }>;
}): ModelResult {
  // Step 1: Detect market regime
  const regime = detectMarketRegime(
    inputData.vix,
    inputData.vixPercentile,
    inputData.spyWeeklyReturn,
    inputData.gldWeeklyReturn,
    inputData.isCentralBankWeek
  );

  const factorWeights = REGIME_FACTOR_WEIGHTS[regime];

  const marketData: MarketData = {
    vix: inputData.vix,
    vixPercentile: inputData.vixPercentile,
    spyWeeklyReturn: inputData.spyWeeklyReturn,
    gldWeeklyReturn: inputData.gldWeeklyReturn,
    regime,
    factorWeights,
  };

  // Step 2: Calculate scores for each currency
  const currencyScores: Record<Currency, CurrencyScore> = {} as Record<Currency, CurrencyScore>;
  const currencies = Object.keys(inputData.currencies) as Currency[];

  for (const currency of currencies) {
    const data = inputData.currencies[currency];

    const ratePolicyData = calculateRatePolicy(
      currency,
      data.currentPolicyRate,
      data.marketTerminalRate,
      data.hawkishWords || 0,
      data.dovishWords || 0
    );

    const growthMomentumData = calculateGrowthMomentum(
      currency,
      data.employmentData,
      data.manufacturingPMI,
      data.gdpGrowth
    );

    // For real interest edge, we need to compare against a reference currency (USD)
    const realInterestEdgeData = calculateRealInterestEdge(
      currency,
      'USD',
      data.twoYearYield,
      inputData.currencies.USD.twoYearYield,
      data.inflationExpectation,
      inputData.currencies.USD.inflationExpectation
    );

    const riskAppetiteData = calculateRiskAppetite(
      currency,
      inputData.vixPercentile,
      inputData.spyWeeklyReturn,
      inputData.gldWeeklyReturn
    );

    const positioningData = calculatePositioning(data.cotPercentile);

    currencyScores[currency] = calculateCurrencyScore(
      currency,
      ratePolicyData,
      growthMomentumData,
      realInterestEdgeData,
      riskAppetiteData,
      positioningData,
      factorWeights
    );
  }

  // Step 3: Generate pair signals
  const pairSignals: PairSignal[] = [];
  const majorPairs = [
    ['EUR', 'USD'],
    ['GBP', 'USD'],
    ['USD', 'JPY'],
    ['AUD', 'USD'],
    ['USD', 'CAD'],
    ['USD', 'CHF'],
  ] as const;

  for (const [base, quote] of majorPairs) {
    if (currencyScores[base] && currencyScores[quote]) {
      const signal = generatePairSignal(
        base as Currency,
        quote as Currency,
        currencyScores[base].totalScore,
        currencyScores[quote].totalScore
      );
      pairSignals.push(signal);
    }
  }

  return {
    marketData,
    currencyScores,
    pairSignals,
    timestamp: new Date(),
  };
}

// ============================================================================
// TEST FUNCTION
// ============================================================================

export function runModelTests(): any {
  console.log('Running V07 Model Tests...\n');

  // Test data based on the model specification
  const testData = {
    vix: 19,
    vixPercentile: 45, // Normal range
    spyWeeklyReturn: 0.012, // 1.2% up
    gldWeeklyReturn: -0.008, // 0.8% down
    isCentralBankWeek: false,
    currencies: {
      USD: {
        currentPolicyRate: 5.25,
        marketTerminalRate: 5.50,
        hawkishWords: 2,
        dovishWords: 0,
        employmentData: 180000, // Good NFP
        manufacturingPMI: 53, // Good PMI
        gdpGrowth: 2.5,
        twoYearYield: 4.7,
        inflationExpectation: 2.3,
        cotPercentile: 50,
      },
      EUR: {
        currentPolicyRate: 4.00,
        marketTerminalRate: 3.75,
        hawkishWords: 0,
        dovishWords: 1,
        employmentData: -0.2, // Bad employment rate
        manufacturingPMI: 48, // Weak PMI
        gdpGrowth: 1.2,
        twoYearYield: 3.2,
        inflationExpectation: 2.0,
        cotPercentile: 50,
      },
      GBP: {
        currentPolicyRate: 5.25,
        marketTerminalRate: 5.00,
        hawkishWords: 1,
        dovishWords: 0,
        employmentData: -15000, // Good claimant count
        manufacturingPMI: 51,
        gdpGrowth: 1.8,
        twoYearYield: 4.5,
        inflationExpectation: 2.1,
        cotPercentile: 50,
      },
      JPY: {
        currentPolicyRate: 0.10,
        marketTerminalRate: 0.15,
        hawkishWords: 0,
        dovishWords: 0,
        employmentData: 1.28, // Job ratio
        manufacturingPMI: 49,
        gdpGrowth: 0.8,
        twoYearYield: 0.1,
        inflationExpectation: 2.0,
        cotPercentile: 50,
      },
      AUD: {
        currentPolicyRate: 4.35,
        marketTerminalRate: 4.50,
        hawkishWords: 1,
        dovishWords: 0,
        employmentData: 66.8, // Participation rate
        manufacturingPMI: 52,
        gdpGrowth: 2.2,
        twoYearYield: 4.2,
        inflationExpectation: 2.2,
        cotPercentile: 50,
      },
      CAD: {
        currentPolicyRate: 5.00,
        marketTerminalRate: 4.75,
        hawkishWords: 0,
        dovishWords: 1,
        employmentData: 62.8, // Employment rate
        manufacturingPMI: 50,
        gdpGrowth: 1.5,
        twoYearYield: 4.0,
        inflationExpectation: 2.1,
        cotPercentile: 50,
      },
      CHF: {
        currentPolicyRate: 1.75,
        marketTerminalRate: 1.50,
        hawkishWords: 0,
        dovishWords: 0,
        employmentData: 0.1, // Employment rate YoY
        manufacturingPMI: 47,
        gdpGrowth: 1.0,
        twoYearYield: 1.5,
        inflationExpectation: 1.8,
        cotPercentile: 50,
      },
    },
  };

  try {
    const result = runForexModel(testData);
    
    console.log('✅ Model execution successful!');
    console.log(`Market Regime: ${result.marketData.regime}`);
    console.log(`VIX Percentile: ${result.marketData.vixPercentile}%`);
    
    console.log('\n📊 Currency Scores:');
    Object.entries(result.currencyScores).forEach(([currency, score]) => {
      console.log(`${currency}: ${score.totalScore.toFixed(3)}`);
    });

    console.log('\n🎯 Pair Signals:');
    result.pairSignals.forEach(signal => {
      console.log(`${signal.pair}: ${signal.bias} (${signal.signalStrength}) - ${signal.scoreDifference.toFixed(3)}`);
    });

    return {
      success: true,
      marketRegime: result.marketData.regime,
      currencyScores: result.currencyScores,
      pairSignals: result.pairSignals,
    };
  } catch (error) {
    console.error('❌ Model execution failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}