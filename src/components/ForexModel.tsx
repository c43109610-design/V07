import React, { useState, useEffect } from 'react';
import { runForexModel, runModelTests } from '../lib/modelCalculations';
import { Currency, ModelResult, MarketRegime } from '../types/forex';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Globe, 
  Activity,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const ForexModel: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [modelResult, setModelResult] = useState<ModelResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  // Sample data for demonstration
  const sampleData = {
    vix: 19,
    vixPercentile: 45,
    spyWeeklyReturn: 0.012,
    gldWeeklyReturn: -0.008,
    isCentralBankWeek: false,
    currencies: {
      USD: {
        currentPolicyRate: 5.25,
        marketTerminalRate: 5.50,
        hawkishWords: 2,
        dovishWords: 0,
        employmentData: 180000,
        manufacturingPMI: 53,
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
        employmentData: -0.2,
        manufacturingPMI: 48,
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
        employmentData: -15000,
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
        employmentData: 1.28,
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
        employmentData: 66.8,
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
        employmentData: 62.8,
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
        employmentData: 0.1,
        manufacturingPMI: 47,
        gdpGrowth: 1.0,
        twoYearYield: 1.5,
        inflationExpectation: 1.8,
        cotPercentile: 50,
      },
    },
  };

  const runModel = async () => {
    setIsLoading(true);
    try {
      const result = runForexModel(sampleData);
      setModelResult(result);
    } catch (error) {
      console.error('Error running model:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runTests = async () => {
    setIsLoading(true);
    try {
      const results = runModelTests();
      setTestResults(results);
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-run model on component mount
    runModel();
    runTests();
  }, []);

  const getRegimeColor = (regime: MarketRegime) => {
    switch (regime) {
      case 'RISK-OFF':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      case 'RISK-ON':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'CENTRAL_BANK_WEEK':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 0.5) return 'forex-score-positive';
    if (score < -0.5) return 'forex-score-negative';
    return 'forex-score-neutral';
  };

  const getSignalClass = (signalStrength: string) => {
    switch (signalStrength) {
      case 'Very Strong':
        return 'signal-very-strong';
      case 'Strong':
        return 'signal-strong';
      case 'Moderate':
        return 'signal-moderate';
      case 'Weak':
        return 'signal-weak';
      default:
        return 'signal-neutral';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="forex-header mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">PERFECT RETAIL FOREX MACRO SCORING MODEL V07</h1>
            <p className="text-blue-100 mt-2">Institutional-grade currency analysis simplified for retail traders</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {theme === 'dark' ? '☀️' : '🌙'} Theme
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <Button onClick={runModel} disabled={isLoading} className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          {isLoading ? 'Running Model...' : 'Run Model'}
        </Button>
        <Button onClick={runTests} disabled={isLoading} variant="outline" className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Run Tests
        </Button>
      </div>

      {/* Test Results */}
      {testResults && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Model Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.success ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  All tests passed successfully!
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Market Regime</h4>
                    <Badge className={getRegimeColor(testResults.marketRegime)}>
                      {testResults.marketRegime}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Currency Scores</h4>
                    <div className="space-y-1">
                      {Object.entries(testResults.currencyScores).map(([currency, score]: [string, any]) => (
                        <div key={currency} className="flex justify-between">
                          <span>{currency}:</span>
                          <span className={getScoreColor(score.totalScore)}>
                            {score.totalScore.toFixed(3)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="w-4 h-4" />
                Test failed: {testResults.error}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Model Results */}
      {modelResult && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="currencies">Currency Scores</TabsTrigger>
            <TabsTrigger value="signals">Trading Signals</TabsTrigger>
            <TabsTrigger value="factors">Factor Analysis</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Market Regime */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Market Regime
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={`text-sm ${getRegimeColor(modelResult.marketData.regime)}`}>
                    {modelResult.marketData.regime}
                  </Badge>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>VIX:</span>
                      <span>{modelResult.marketData.vix}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VIX Percentile:</span>
                      <span>{modelResult.marketData.vixPercentile}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SPY Weekly:</span>
                      <span className={modelResult.marketData.spyWeeklyReturn > 0 ? 'text-green-600' : 'text-red-600'}>
                        {(modelResult.marketData.spyWeeklyReturn * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>GLD Weekly:</span>
                      <span className={modelResult.marketData.gldWeeklyReturn > 0 ? 'text-green-600' : 'text-red-600'}>
                        {(modelResult.marketData.gldWeeklyReturn * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Factor Weights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Factor Weights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Rate Policy</span>
                        <span>{(modelResult.marketData.factorWeights.ratePolicy * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={modelResult.marketData.factorWeights.ratePolicy * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Growth Momentum</span>
                        <span>{(modelResult.marketData.factorWeights.growthMomentum * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={modelResult.marketData.factorWeights.growthMomentum * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Real Interest Edge</span>
                        <span>{(modelResult.marketData.factorWeights.realInterestEdge * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={modelResult.marketData.factorWeights.realInterestEdge * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Risk Appetite</span>
                        <span>{(modelResult.marketData.factorWeights.riskAppetite * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={modelResult.marketData.factorWeights.riskAppetite * 100} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Signals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Top Signals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {modelResult.pairSignals
                      .sort((a, b) => Math.abs(b.scoreDifference) - Math.abs(a.scoreDifference))
                      .slice(0, 3)
                      .map((signal) => (
                        <div key={signal.pair} className={`p-3 rounded-lg border ${getSignalClass(signal.signalStrength)}`}>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">{signal.pair}</span>
                            <span className="text-sm">{signal.bias}</span>
                          </div>
                          <div className="text-sm mt-1">
                            {signal.signalStrength} ({signal.confidenceLevel})
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Currency Scores Tab */}
          <TabsContent value="currencies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(modelResult.currencyScores).map(([currency, score]) => (
                <Card key={currency}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      {currency}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(score.totalScore)}`}>
                          {score.totalScore.toFixed(3)}
                        </div>
                        <div className="text-sm text-gray-500">Total Score</div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Rate Policy:</span>
                          <span className={getScoreColor(score.ratePolicy)}>
                            {score.ratePolicy.toFixed(3)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Growth:</span>
                          <span className={getScoreColor(score.growthMomentum)}>
                            {score.growthMomentum.toFixed(3)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Real Interest:</span>
                          <span className={getScoreColor(score.realInterestEdge)}>
                            {score.realInterestEdge.toFixed(3)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Risk Appetite:</span>
                          <span className={getScoreColor(score.riskAppetite)}>
                            {score.riskAppetite.toFixed(3)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Positioning:</span>
                          <span className={getScoreColor(score.positioning)}>
                            {score.positioning.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trading Signals Tab */}
          <TabsContent value="signals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modelResult.pairSignals.map((signal) => (
                <Card key={signal.pair}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {signal.bias === 'Bullish' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : signal.bias === 'Bearish' ? (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      ) : (
                        <Activity className="w-5 h-5 text-gray-600" />
                      )}
                      {signal.pair}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`p-4 rounded-lg border ${getSignalClass(signal.signalStrength)}`}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Signal Strength</div>
                          <div className="font-semibold">{signal.signalStrength}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Confidence</div>
                          <div className="font-semibold">{signal.confidenceLevel}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Bias</div>
                          <div className="font-semibold">{signal.bias}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Score Diff</div>
                          <div className={`font-semibold ${getScoreColor(signal.scoreDifference)}`}>
                            {signal.scoreDifference.toFixed(3)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Factor Analysis Tab */}
          <TabsContent value="factors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rate Policy Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Rate Policy Analysis (35%)</CardTitle>
                  <CardDescription>
                    Interest rate differentials and central bank tone
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(modelResult.currencyScores).map(([currency, score]) => (
                      <div key={currency} className="flex justify-between items-center">
                        <span>{currency}</span>
                        <div className="flex items-center gap-2">
                          <span className={getScoreColor(score.ratePolicy)}>
                            {score.ratePolicy.toFixed(3)}
                          </span>
                          {score.ratePolicy > 0.5 && <TrendingUp className="w-4 h-4 text-green-600" />}
                          {score.ratePolicy < -0.5 && <TrendingDown className="w-4 h-4 text-red-600" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Growth Momentum Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Growth Momentum Analysis (25%)</CardTitle>
                  <CardDescription>
                    Employment, manufacturing PMI, and GDP growth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(modelResult.currencyScores).map(([currency, score]) => (
                      <div key={currency} className="flex justify-between items-center">
                        <span>{currency}</span>
                        <div className="flex items-center gap-2">
                          <span className={getScoreColor(score.growthMomentum)}>
                            {score.growthMomentum.toFixed(3)}
                          </span>
                          {score.growthMomentum > 0.5 && <TrendingUp className="w-4 h-4 text-green-600" />}
                          {score.growthMomentum < -0.5 && <TrendingDown className="w-4 h-4 text-red-600" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Real Interest Edge Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Real Interest Edge Analysis (30%)</CardTitle>
                  <CardDescription>
                    Real yields after inflation expectations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(modelResult.currencyScores).map(([currency, score]) => (
                      <div key={currency} className="flex justify-between items-center">
                        <span>{currency}</span>
                        <div className="flex items-center gap-2">
                          <span className={getScoreColor(score.realInterestEdge)}>
                            {score.realInterestEdge.toFixed(3)}
                          </span>
                          {score.realInterestEdge > 0.5 && <TrendingUp className="w-4 h-4 text-green-600" />}
                          {score.realInterestEdge < -0.5 && <TrendingDown className="w-4 h-4 text-red-600" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Appetite Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Appetite Analysis (10%)</CardTitle>
                  <CardDescription>
                    VIX regime and cross-asset sentiment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(modelResult.currencyScores).map(([currency, score]) => (
                      <div key={currency} className="flex justify-between items-center">
                        <span>{currency}</span>
                        <div className="flex items-center gap-2">
                          <span className={getScoreColor(score.riskAppetite)}>
                            {score.riskAppetite.toFixed(3)}
                          </span>
                          {score.riskAppetite > 0.5 && <TrendingUp className="w-4 h-4 text-green-600" />}
                          {score.riskAppetite < -0.5 && <TrendingDown className="w-4 h-4 text-red-600" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Footer */}
      <div className="mt-12 text-center text-gray-500">
        <p>PERFECT RETAIL FOREX MACRO SCORING MODEL V07 - Institutional-grade analysis for retail traders</p>
        <p className="text-sm mt-2">
          Last updated: {modelResult?.timestamp.toLocaleString() || 'Never'}
        </p>
      </div>
    </div>
  );
};

export default ForexModel;