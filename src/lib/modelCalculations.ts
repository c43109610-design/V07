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
  MarketState,
  FactorWeights,
  PairSignal,
  ModelResult,
  RATE_SENSITIVITY,
  CURRENCY_RISK_FACTORS,
  EMPLOYMENT_THRESHOLDS,
  REGIME_FACTOR_WEIGHTS,
  SIGNAL_THRESHOLDS,
  HAWKISH_KEYWORDS,
  DOVISH_KEYWORDS,
} from '../types/forex';

// Market regime detection
export function detectMarketRegime(
  vixPercentile: number,
  spyVsGldPerformance: number,
  isCentralBankWeek: boolean = false
): MarketRegime {
  if (isCentralBankWeek) {
    return 'CENTRAL_BANK_WEEK';
  }
  
  if (vixPercentile > 75 || spyVsGldPerformance < -0.05) {
    return 'RISK-OFF';
  }
  
  if (vixPercentile < 25 && spyVsGldPerformance > 0.02) {
    return 'RISK-ON';
  }
  
  return 'NEUTRAL';
}

// Factor 1: Rate Policy (35% - Most Important)
export function calculateRatePolicy(
  currency: Currency,
  currentPolicyRate: number,
  marketTerminalRate: number,
  hawkishWords: number = 0,
  dovishWords: number = 0
): RatePolicyData {
  // Rate differential calculation (80% of factor)
  const rateGap = marketTerminalRate - currentPolicyRate;
  const rateScore = rateGap * RATE_SENSITIVITY[currency];
  
  // Central bank tone shift (20% of factor)
  const toneScore = Math.min(Math.max((hawkishWords - dovishWords) * 0.1, -1.0), 1.0);
  
  // Combined score
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

// Factor 2: Growth Momentum (25%)
export function calculateGrowthMomentum(
  currency: Currency,
  employmentData: number,
  manufacturingPMI: number,
  gdpGrowth: number
): GrowthMomentumData {
  // Employment component (40% of factor)
  const thresholds = EMPLOYMENT_THRESHOLDS[currency];
  let employmentScore = 0;
  
  if (employmentData >= thresholds.strong) {
    employmentScore = 1.0;
  } else if (employmentData <= thresholds.weak) {
    employmentScore = -1.0;
  }
  
  // Manufacturing component (30% of factor)
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
  
  // GDP momentum (30% of factor)
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
  
  // Composite score
  const compositeScore = (employmentScore * 0.4) + (manufacturingScore * 0.3) + (gdpScore * 0.3);
  
  return {
    employmentScore,
    manufacturingScore,
    gdpScore,
    compositeScore,
    totalScore: compositeScore,
  };
}

// Factor 3: Real Interest Edge (30%)
export function calculateRealInterest(
  twoYearYield: number,
  inflationExpectation: number
): RealInterestData {
  // Real rate = 2-year yield - inflation expectation
  const realRate = twoYearYield - inflationExpectation;
  
  // Score based on real rate level
  let totalScore = 0;
  if (realRate > 2.0) {
    totalScore = 1.0;
  } else if (realRate > 1.0) {
    totalScore = 0.5;
  } else if (realRate > 0) {
    totalScore = 0.0;
  } else if (realRate > -1.0) {
    totalScore = -0.5;
  } else {
    totalScore = -1.0;
  }
  
  return {
    twoYearYield,
    inflationExpectation,
    realRate,
    totalScore,
  };
}

// Calculate real interest differential for currency pairs
export function calculateRealInterestDifferential(
  currencyARealRate: number,
  currencyBRealRate: number
): number {
  const differential = currencyARealRate - currencyBRealRate;
  return differential * 1.5; // Apply the 1.5 multiplier as specified in the model
}

// Factor 4: Risk Appetite (10%)
export function calculateRiskAppetite(
  currency: Currency,
  vixPercentile: number,
  spyReturn: number,
  gldReturn: number
): RiskAppetiteData {
  // VIX scoring (60% of factor)
  let vixScore = 0;
  if (vixPercentile < 20) {
    vixScore = 1.0;
  } else if (vixPercentile < 40) {
    vixScore = 0.5;
  } else if (vixPercentile < 60) {
    vixScore = 0.0;
  } else if (vixPercentile < 80) {
    vixScore = -0.5;
  } else {
    vixScore = -1.0;
  }
  
  // Cross-asset risk sentiment (40% of factor)
  const riskScore = Math.min(Math.max((spyReturn - gldReturn) * 2, -1.0), 1.0);
  
  // Apply currency risk factor
  const currencyRiskFactor = CURRENCY_RISK_FACTORS[currency];
  const totalScore = (vixScore * 0.6) + (riskScore * currencyRiskFactor * 0.4);
  
  return {
    vixPercentile,
    vixScore,
    spyReturn,
    gldReturn,
    riskScore,
    currencyRiskFactor,
    totalScore,
  };
}

// Positioning data (5%)
export function calculatePositioning(cotPercentile: number): PositioningData {
  let positioningScore = 0;
  if (cotPercentile > 90) {
    positioningScore = 1.0;
  } else if (cotPercentile > 70) {
    positioningScore = 0.5;
  } else if (cotPercentile > 30) {
    positioningScore = 0.0;
  } else if (cotPercentile > 10) {
    positioningScore = -0.5;
  } else {
    positioningScore = -1.0;
  }
  
  return {
    cotPercentile,
    positioningScore,
  };
}

// Calculate total currency score
export function calculateCurrencyScore(
  currency: Currency,
  ratePolicy: RatePolicyData,
  growthMomentum: GrowthMomentumData,
  realInterest: RealInterestData,
  riskAppetite: RiskAppetiteData,
  positioning: PositioningData,
  factorWeights: FactorWeights
): CurrencyScore {
  const totalScore = 
    (ratePolicy.totalScore * factorWeights.ratePolicy) +
    (growthMomentum.totalScore * factorWeights.growthMomentum) +
    (realInterest.totalScore * factorWeights.realInterest) +
    (riskAppetite.totalScore * factorWeights.riskAppetite) +
    (positioning.positioningScore * factorWeights.positioning);
  
  return {
    currency,
    ratePolicy,
    growthMomentum,
    realInterest,
    riskAppetite,
    positioning,
    totalScore,
  };
}

// Calculate pair signals
export function calculatePairSignals(
  currencyScores: Record<Currency, CurrencyScore>
): PairSignal[] {
  const currencies = Object.keys(currencyScores) as Currency[];
  const pairs: PairSignal[] = [];
  
  for (let i = 0; i < currencies.length; i++) {
    for (let j = i + 1; j < currencies.length; j++) {
      const currencyA = currencies[i];
      const currencyB = currencies[j];
      const scoreA = currencyScores[currencyA].totalScore;
      const scoreB = currencyScores[currencyB].totalScore;
      const scoreDifference = scoreA - scoreB;
      
      // Determine signal strength and confidence
      let signalStrength: PairSignal['signalStrength'] = 'Neutral';
      let confidenceLevel: PairSignal['confidenceLevel'] = 'Low';
      
      if (Math.abs(scoreDifference) > SIGNAL_THRESHOLDS.VERY_STRONG) {
        signalStrength = 'Very Strong';
        confidenceLevel = 'High';
      } else if (Math.abs(scoreDifference) > SIGNAL_THRESHOLDS.STRONG) {
        signalStrength = 'Strong';
        confidenceLevel = 'Medium-High';
      } else if (Math.abs(scoreDifference) > SIGNAL_THRESHOLDS.MODERATE) {
        signalStrength = 'Moderate';
        confidenceLevel = 'Medium';
      } else if (Math.abs(scoreDifference) > SIGNAL_THRESHOLDS.WEAK) {
        signalStrength = 'Weak';
        confidenceLevel = 'Low-Medium';
      }
      
      const bias = scoreDifference > 0 ? 'Buy' : scoreDifference < 0 ? 'Sell' : 'Neutral';
      
      pairs.push({
        pair: `${currencyA}/${currencyB}`,
        currencyAScore: scoreA,
        currencyBScore: scoreB,
        scoreDifference: Math.abs(scoreDifference),
        signalStrength,
        confidenceLevel,
        bias,
      });
    }
  }
  
  return pairs;
}

// Main model calculation function
export function calculateForexModel(
  marketData: {
    vixPercentile: number;
    spyVsGldPerformance: number;
    isCentralBankWeek?: boolean;
  },
  currencyData: Record<Currency, {
    currentPolicyRate: number;
    marketTerminalRate: number;
    hawkishWords?: number;
    dovishWords?: number;
    employmentData: number;
    manufacturingPMI: number;
    gdpGrowth: number;
    twoYearYield: number;
    inflationExpectation: number;
    cotPercentile?: number;
  }>
): ModelResult {
  // Detect market regime
  const regime = detectMarketRegime(
    marketData.vixPercentile,
    marketData.spyVsGldPerformance,
    marketData.isCentralBankWeek
  );
  
  const factorWeights = REGIME_FACTOR_WEIGHTS[regime];
  
  const marketState: MarketState = {
    regime,
    vixPercentile: marketData.vixPercentile,
    spyVsGldPerformance: marketData.spyVsGldPerformance,
    factorWeights,
  };
  
  // Calculate scores for each currency
  const currencyScores: Record<Currency, CurrencyScore> = {} as Record<Currency, CurrencyScore>;
  
  for (const [currency, data] of Object.entries(currencyData)) {
    const c = currency as Currency;
    
    const ratePolicy = calculateRatePolicy(
      c,
      data.currentPolicyRate,
      data.marketTerminalRate,
      data.hawkishWords || 0,
      data.dovishWords || 0
    );
    
    const growthMomentum = calculateGrowthMomentum(
      c,
      data.employmentData,
      data.manufacturingPMI,
      data.gdpGrowth
    );
    
    const realInterest = calculateRealInterest(
      data.twoYearYield,
      data.inflationExpectation
    );
    
    const riskAppetite = calculateRiskAppetite(
      c,
      marketData.vixPercentile,
      marketData.spyVsGldPerformance,
      -marketData.spyVsGldPerformance // GLD return is inverse of SPY vs GLD performance
    );
    
    const positioning = calculatePositioning(data.cotPercentile || 50);
    
    currencyScores[c] = calculateCurrencyScore(
      c,
      ratePolicy,
      growthMomentum,
      realInterest,
      riskAppetite,
      positioning,
      factorWeights
    );
  }
  
  // Calculate pair signals with proper real interest differentials
  const pairSignals = calculatePairSignalsWithRealInterest(currencyScores);
  
  return {
    marketState,
    currencyScores,
    pairSignals,
    timestamp: new Date(),
  };
}

// Enhanced pair signals calculation with real interest differentials
export function calculatePairSignalsWithRealInterest(
  currencyScores: Record<Currency, CurrencyScore>
): PairSignal[] {
  const currencies = Object.keys(currencyScores) as Currency[];
  const pairs: PairSignal[] = [];
  
  for (let i = 0; i < currencies.length; i++) {
    for (let j = i + 1; j < currencies.length; j++) {
      const currencyA = currencies[i];
      const currencyB = currencies[j];
      const scoreA = currencyScores[currencyA];
      const scoreB = currencyScores[currencyB];
      
      // Calculate real interest differential
      const realInterestDiff = calculateRealInterestDifferential(
        scoreA.realInterest.realRate,
        scoreB.realInterest.realRate
      );
      
      // Adjust scores based on real interest differential
      const adjustedScoreA = scoreA.totalScore + (realInterestDiff * 0.3); // 30% weight for real interest
      const adjustedScoreB = scoreB.totalScore - (realInterestDiff * 0.3);
      
      const scoreDifference = adjustedScoreA - adjustedScoreB;
      
      // Determine signal strength and confidence
      let signalStrength: PairSignal['signalStrength'] = 'Neutral';
      let confidenceLevel: PairSignal['confidenceLevel'] = 'Low';
      
      if (Math.abs(scoreDifference) > SIGNAL_THRESHOLDS.VERY_STRONG) {
        signalStrength = 'Very Strong';
        confidenceLevel = 'High';
      } else if (Math.abs(scoreDifference) > SIGNAL_THRESHOLDS.STRONG) {
        signalStrength = 'Strong';
        confidenceLevel = 'Medium-High';
      } else if (Math.abs(scoreDifference) > SIGNAL_THRESHOLDS.MODERATE) {
        signalStrength = 'Moderate';
        confidenceLevel = 'Medium';
      } else if (Math.abs(scoreDifference) > SIGNAL_THRESHOLDS.WEAK) {
        signalStrength = 'Weak';
        confidenceLevel = 'Low-Medium';
      }
      
      const bias = scoreDifference > 0 ? 'Buy' : scoreDifference < 0 ? 'Sell' : 'Neutral';
      
      pairs.push({
        pair: `${currencyA}/${currencyB}`,
        currencyAScore: adjustedScoreA,
        currencyBScore: adjustedScoreB,
        scoreDifference: Math.abs(scoreDifference),
        signalStrength,
        confidenceLevel,
        bias,
      });
    }
  }
  
  return pairs;
}

// Utility function to analyze central bank speech tone
export function analyzeSpeechTone(speechText: string): { hawkishWords: number; dovishWords: number } {
  const lowerText = speechText.toLowerCase();
  let hawkishWords = 0;
  let dovishWords = 0;
  
  for (const word of HAWKISH_KEYWORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      hawkishWords += matches.length;
    }
  }
  
  for (const word of DOVISH_KEYWORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      dovishWords += matches.length;
    }
  }
  
  return { hawkishWords, dovishWords };
}

// Test function for validation
export function runModelTests(): any {
  const testData = {
    marketData: {
      vixPercentile: 45,
      spyVsGldPerformance: 0.015,
      isCentralBankWeek: false,
    },
    currencyData: {
      USD: {
        currentPolicyRate: 5.25,
        marketTerminalRate: 5.50,
        hawkishWords: 2,
        dovishWords: 1,
        employmentData: 180000,
        manufacturingPMI: 53,
        gdpGrowth: 2.5,
        twoYearYield: 4.7,
        inflationExpectation: 2.3,
        cotPercentile: 60,
      },
      EUR: {
        currentPolicyRate: 4.00,
        marketTerminalRate: 3.75,
        hawkishWords: 1,
        dovishWords: 2,
        employmentData: -0.2,
        manufacturingPMI: 48,
        gdpGrowth: 1.2,
        twoYearYield: 3.2,
        inflationExpectation: 2.0,
        cotPercentile: 40,
      },
    },
  };
  
  const result = calculateForexModel(testData.marketData, testData.currencyData);
  
  return {
    marketState: result.marketState,
    currencyScores: Object.fromEntries(
      Object.entries(result.currencyScores).map(([currency, score]) => [
        currency,
        {
          totalScore: score.totalScore,
          ratePolicy: score.ratePolicy.totalScore,
          growthMomentum: score.growthMomentum.totalScore,
          realInterest: score.realInterest.totalScore,
          riskAppetite: score.riskAppetite.totalScore,
          positioning: score.positioning.positioningScore,
        },
      ])
    ),
    pairSignals: result.pairSignals,
  };
}