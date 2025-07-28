// PERFECT RETAIL FOREX MACRO SCORING MODEL V07 - Type Definitions

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF';

export type MarketRegime = 'RISK-OFF' | 'RISK-ON' | 'NEUTRAL' | 'CENTRAL_BANK_WEEK';

export interface RatePolicyData {
  currentPolicyRate: number;
  marketTerminalRate: number;
  rateGap: number;
  rateScore: number;
  hawkishWords: number;
  dovishWords: number;
  toneScore: number;
  totalScore: number;
}

export interface GrowthMomentumData {
  employmentScore: number;
  manufacturingScore: number;
  gdpScore: number;
  compositeScore: number;
}

export interface RealInterestData {
  twoYearYield: number;
  inflationExpectation: number;
  realRate: number;
  pairScore: number;
}

export interface RiskAppetiteData {
  vixPercentile: number;
  vixScore: number;
  spyReturn: number;
  gldReturn: number;
  crossAssetScore: number;
  totalScore: number;
}

export interface PositioningData {
  cotPercentile: number;
  positioningScore: number;
}

export interface CurrencyScore {
  currency: Currency;
  ratePolicy: number;
  growthMomentum: number;
  realInterestEdge: number;
  riskAppetite: number;
  positioning: number;
  totalScore: number;
}

export interface MarketData {
  vix: number;
  vixPercentile: number;
  spyWeeklyReturn: number;
  gldWeeklyReturn: number;
  regime: MarketRegime;
  factorWeights: FactorWeights;
}

export interface FactorWeights {
  ratePolicy: number;
  growthMomentum: number;
  realInterestEdge: number;
  riskAppetite: number;
  positioning: number;
}

export interface PairSignal {
  pair: string;
  baseCurrency: Currency;
  quoteCurrency: Currency;
  scoreDifference: number;
  signalStrength: 'Very Strong' | 'Strong' | 'Moderate' | 'Weak' | 'Neutral';
  confidenceLevel: 'High' | 'Medium-High' | 'Medium' | 'Low-Medium' | 'Low';
  bias: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface ModelResult {
  marketData: MarketData;
  currencyScores: Record<Currency, CurrencyScore>;
  pairSignals: PairSignal[];
  timestamp: Date;
}

// Rate sensitivity multipliers by currency
export const RATE_SENSITIVITY: Record<Currency, number> = {
  USD: 0.4, // Fed transparency
  EUR: 0.6, // ECB forward guidance heavy
  GBP: 0.5, // BoE data dependent
  JPY: 1.0, // YCC sensitivity
  AUD: 0.4, // RBA transparent
  CAD: 0.3, // BoC follows Fed
  CHF: 0.8, // SNB intervention risk
};

// Employment thresholds by currency
export interface EmploymentThresholds {
  strong: number;
  weak: number;
}

export const EMPLOYMENT_THRESHOLDS: Record<Currency, EmploymentThresholds> = {
  USD: { strong: 180000, weak: 100000 }, // NFP 3-month avg
  EUR: { strong: 0.3, weak: -0.1 }, // Employment Rate YoY %
  GBP: { strong: -20000, weak: 40000 }, // Claimant Count Chg
  JPY: { strong: 1.30, weak: 1.25 }, // Job-to-applicant ratio
  AUD: { strong: 66.5, weak: 66.0 }, // Participation Rate %
  CAD: { strong: 62.5, weak: 61.5 }, // Employment Rate %
};

// Currency risk classification for risk appetite
export const CURRENCY_RISK_FACTORS: Record<Currency, number> = {
  AUD: 1.0, // Risk-on beneficiary
  EUR: 0.5, // Risk-on beneficiary
  CAD: 0.3, // Risk-on beneficiary
  JPY: 1.0, // Safe haven
  CHF: 0.8, // Safe haven
  USD: 0.3, // Safe haven
  GBP: 0.0, // Neutral
};

// Hawkish and dovish keywords for central bank tone analysis
export const HAWKISH_KEYWORDS = [
  'tighten', 'aggressive', 'vigilant', 'persistent', 'accelerate', 'committed'
];

export const DOVISH_KEYWORDS = [
  'pause', 'patient', 'gradual', 'assess', 'flexible', 'data-dependent'
];

// Factor weights by market regime
export const REGIME_FACTOR_WEIGHTS: Record<MarketRegime, FactorWeights> = {
  'RISK-OFF': {
    ratePolicy: 0.45,
    growthMomentum: 0.15,
    realInterestEdge: 0.25,
    riskAppetite: 0.15,
    positioning: 0.05,
  },
  'RISK-ON': {
    ratePolicy: 0.30,
    growthMomentum: 0.35,
    realInterestEdge: 0.25,
    riskAppetite: 0.10,
    positioning: 0.05,
  },
  'NEUTRAL': {
    ratePolicy: 0.35,
    growthMomentum: 0.25,
    realInterestEdge: 0.30,
    riskAppetite: 0.10,
    positioning: 0.05,
  },
  'CENTRAL_BANK_WEEK': {
    ratePolicy: 0.55,
    growthMomentum: 0.15,
    realInterestEdge: 0.25,
    riskAppetite: 0.05,
    positioning: 0.05,
  },
};

// Signal strength thresholds
export const SIGNAL_THRESHOLDS = {
  VERY_STRONG: 2.0,
  STRONG: 1.5,
  MODERATE: 1.0,
  WEAK: 0.5,
};