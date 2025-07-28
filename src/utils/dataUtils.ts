// PERFECT RETAIL FOREX MACRO SCORING MODEL V07 - Data Utilities
import { Currency, HAWKISH_KEYWORDS, DOVISH_KEYWORDS } from '../types/forex';

// ============================================================================
// VIX PERCENTILE CALCULATION
// ============================================================================

export function calculateVIXPercentile(currentVIX: number, vixHistory: number[]): number {
  if (vixHistory.length === 0) return 50; // Default to neutral if no history
  
  // Sort history to find percentile
  const sortedHistory = [...vixHistory].sort((a, b) => a - b);
  
  // Find position of current VIX in sorted array
  const position = sortedHistory.findIndex(vix => vix >= currentVIX);
  
  if (position === -1) return 100; // Current VIX is higher than all historical values
  if (position === 0) return 0; // Current VIX is lower than all historical values
  
  // Calculate percentile
  const percentile = (position / sortedHistory.length) * 100;
  return Math.round(percentile);
}

// ============================================================================
// CENTRAL BANK TONE ANALYSIS
// ============================================================================

export function analyzeCentralBankTone(speechText: string): { hawkishWords: number; dovishWords: number } {
  const text = speechText.toLowerCase();
  let hawkishCount = 0;
  let dovishCount = 0;

  // Count hawkish keywords
  HAWKISH_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      hawkishCount += matches.length;
    }
  });

  // Count dovish keywords
  DOVISH_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      dovishCount += matches.length;
    }
  });

  return { hawkishWords: hawkishCount, dovishWords: dovishCount };
}

// ============================================================================
// INFLATION EXPECTATION CALCULATION
// ============================================================================

export function calculateInflationExpectation(
  currency: Currency,
  centralBankTarget: number = 2.0,
  recentCPI: number = 2.0
): number {
  // Use central bank target as base
  let inflationExpectation = centralBankTarget;
  
  // Adjustment: If recent CPI >0.5% above target, add +0.3%
  if (recentCPI > centralBankTarget + 0.5) {
    inflationExpectation += 0.3;
  }
  // If recent CPI <0.5% below target, subtract -0.3%
  else if (recentCPI < centralBankTarget - 0.5) {
    inflationExpectation -= 0.3;
  }
  
  return Math.max(0, inflationExpectation); // Ensure non-negative
}

// ============================================================================
// CENTRAL BANK WEEK DETECTION
// ============================================================================

export function isCentralBankWeek(date: Date = new Date()): boolean {
  // Major central bank meeting dates (simplified - in practice, you'd use a calendar API)
  const cbMeetings = [
    // Fed meetings (typically every 6 weeks)
    // ECB meetings (typically every 6 weeks)
    // BoE meetings (typically every 6 weeks)
    // BoJ meetings (typically every 6 weeks)
    // Add actual meeting dates here
  ];
  
  // For now, return false - implement with actual calendar data
  return false;
}

// ============================================================================
// DATA VALIDATION
// ============================================================================

export function validateCurrencyData(data: any): boolean {
  const requiredFields = [
    'currentPolicyRate',
    'marketTerminalRate',
    'employmentData',
    'manufacturingPMI',
    'gdpGrowth',
    'twoYearYield',
    'inflationExpectation',
    'cotPercentile'
  ];

  return requiredFields.every(field => 
    typeof data[field] === 'number' && !isNaN(data[field])
  );
}

export function validateMarketData(data: any): boolean {
  const requiredFields = ['vix', 'vixPercentile', 'spyWeeklyReturn', 'gldWeeklyReturn'];
  
  return requiredFields.every(field => 
    typeof data[field] === 'number' && !isNaN(data[field])
  );
}

// ============================================================================
// SCORE NORMALIZATION
// ============================================================================

export function normalizeScore(score: number, min: number = -1, max: number = 1): number {
  return Math.min(Math.max(score, min), max);
}

// ============================================================================
// PERCENTILE CALCULATION (GENERIC)
// ============================================================================

export function calculatePercentile(value: number, data: number[]): number {
  if (data.length === 0) return 50;
  
  const sortedData = [...data].sort((a, b) => a - b);
  const position = sortedData.findIndex(item => item >= value);
  
  if (position === -1) return 100;
  if (position === 0) return 0;
  
  return Math.round((position / sortedData.length) * 100);
}

// ============================================================================
// WEEKLY RETURN CALCULATION
// ============================================================================

export function calculateWeeklyReturn(currentPrice: number, previousPrice: number): number {
  if (previousPrice === 0) return 0;
  return (currentPrice - previousPrice) / previousPrice;
}

// ============================================================================
// CURRENCY PAIR UTILITIES
// ============================================================================

export function getMajorPairs(): Array<[Currency, Currency]> {
  return [
    ['EUR', 'USD'],
    ['GBP', 'USD'],
    ['USD', 'JPY'],
    ['AUD', 'USD'],
    ['USD', 'CAD'],
    ['USD', 'CHF'],
  ];
}

export function formatCurrencyPair(base: Currency, quote: Currency): string {
  return `${base}/${quote}`;
}

// ============================================================================
// SIGNAL STRENGTH CLASSIFICATION
// ============================================================================

export function classifySignalStrength(scoreDifference: number): {
  strength: 'Very Strong' | 'Strong' | 'Moderate' | 'Weak' | 'Neutral';
  confidence: 'High' | 'Medium-High' | 'Medium' | 'Low-Medium' | 'Low';
} {
  const absDifference = Math.abs(scoreDifference);
  
  if (absDifference >= 2.0) {
    return { strength: 'Very Strong', confidence: 'High' };
  } else if (absDifference >= 1.5) {
    return { strength: 'Strong', confidence: 'Medium-High' };
  } else if (absDifference >= 1.0) {
    return { strength: 'Moderate', confidence: 'Medium' };
  } else if (absDifference >= 0.5) {
    return { strength: 'Weak', confidence: 'Low-Medium' };
  } else {
    return { strength: 'Neutral', confidence: 'Low' };
  }
}

// ============================================================================
// DATA SOURCE MAPPINGS
// ============================================================================

export const DATA_SOURCES = {
  RATES: {
    USD: 'SOFR 1Y rate',
    EUR: 'ESTR 1Y rate',
    GBP: 'SONIA 1Y rate',
    JPY: 'BoJ target rate',
    AUD: 'RBA cash rate',
    CAD: 'BoC overnight rate',
    CHF: 'SNB policy rate',
  },
  YIELDS: {
    USD: 'DGS2 (FRED)',
    EUR: 'DE2Y-EUR',
    GBP: 'UK2Y-GBP',
    JPY: 'JP2Y-JPY',
    AUD: 'AU2Y-AUD',
    CAD: 'CA2Y-CAD',
    CHF: 'CH2Y-CHF',
  },
  INFLATION: {
    USD: '5Y5Y TIPS breakeven',
    EUR: '5Y5Y Euro Inflation Swap',
    GBP: 'UK 5Y5Y RPI Breakeven',
    JPY: '2.0% (BoJ target)',
    AUD: 'RBA target + adjustments',
    CAD: 'BoC target + adjustments',
    CHF: 'SNB target + adjustments',
  },
  COT_FUTURES: {
    EUR: 'Euro FX (6E)',
    GBP: 'British Pound (6B)',
    JPY: 'Japanese Yen (6J)',
    AUD: 'Australian Dollar (6A)',
    CAD: 'Canadian Dollar (6C)',
    CHF: 'Swiss Franc (6S)',
  },
} as const;

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class ModelError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ModelError';
  }
}

export function handleDataError(error: unknown, context: string): never {
  if (error instanceof ModelError) {
    throw error;
  }
  
  const message = error instanceof Error ? error.message : 'Unknown error';
  throw new ModelError(`${context}: ${message}`, 'DATA_ERROR');
}