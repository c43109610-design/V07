import React from 'react';
import { ModelResult, Currency } from '../types/forex';

interface ForexDashboardProps {
  result: ModelResult;
}

const ForexDashboard: React.FC<ForexDashboardProps> = ({ result }) => {
  const getRegimeColor = (regime: string) => {
    switch (regime) {
      case 'RISK-OFF':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'RISK-ON':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CENTRAL_BANK_WEEK':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'Very Strong':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Strong':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Weak':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 0.5) return 'text-green-600';
    if (score > 0) return 'text-blue-600';
    if (score > -0.5) return 'text-gray-600';
    return 'text-red-600';
  };

  const currencies = Object.keys(result.currencyScores) as Currency[];
  const sortedCurrencies = currencies.sort((a, b) => 
    result.currencyScores[b].totalScore - result.currencyScores[a].totalScore
  );

  const sortedSignals = result.pairSignals
    .filter(signal => signal.signalStrength !== 'Neutral')
    .sort((a, b) => b.scoreDifference - a.scoreDifference);

  return (
    <div className="space-y-6">
      {/* Market State Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Market State</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Regime</p>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRegimeColor(result.marketState.regime)}`}>
              {result.marketState.regime.replace('_', ' ')}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">VIX Percentile</p>
            <p className="text-lg font-semibold">{result.marketState.vixPercentile}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">SPY vs GLD</p>
            <p className="text-lg font-semibold">{(result.marketState.spyVsGldPerformance * 100).toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Timestamp</p>
            <p className="text-sm font-medium">{result.timestamp.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Factor Weights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Factor Weights</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-sm text-gray-600">Rate Policy</p>
            <p className="text-lg font-semibold">{(result.marketState.factorWeights.ratePolicy * 100).toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Growth Momentum</p>
            <p className="text-lg font-semibold">{(result.marketState.factorWeights.growthMomentum * 100).toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Real Interest</p>
            <p className="text-lg font-semibold">{(result.marketState.factorWeights.realInterest * 100).toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Risk Appetite</p>
            <p className="text-lg font-semibold">{(result.marketState.factorWeights.riskAppetite * 100).toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Positioning</p>
            <p className="text-lg font-semibold">{(result.marketState.factorWeights.positioning * 100).toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* Currency Scores */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Currency Scores</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate Policy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Real Interest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Appetite
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Positioning
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCurrencies.map((currency) => {
                const score = result.currencyScores[currency];
                return (
                  <tr key={currency}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{currency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${getScoreColor(score.totalScore)}`}>
                        {score.totalScore.toFixed(3)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${getScoreColor(score.ratePolicy.totalScore)}`}>
                        {score.ratePolicy.totalScore.toFixed(3)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${getScoreColor(score.growthMomentum.totalScore)}`}>
                        {score.growthMomentum.totalScore.toFixed(3)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${getScoreColor(score.realInterest.totalScore)}`}>
                        {score.realInterest.totalScore.toFixed(3)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${getScoreColor(score.riskAppetite.totalScore)}`}>
                        {score.riskAppetite.totalScore.toFixed(3)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${getScoreColor(score.positioning.positioningScore)}`}>
                        {score.positioning.positioningScore.toFixed(3)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trading Signals */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Trading Signals</h2>
        {sortedSignals.length > 0 ? (
          <div className="space-y-4">
            {sortedSignals.map((signal, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{signal.pair}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSignalColor(signal.signalStrength)}`}>
                    {signal.signalStrength}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Score Difference</p>
                    <p className="font-semibold">{signal.scoreDifference.toFixed(3)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Confidence</p>
                    <p className="font-semibold">{signal.confidenceLevel}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Bias</p>
                    <p className={`font-semibold ${signal.bias === 'Buy' ? 'text-green-600' : signal.bias === 'Sell' ? 'text-red-600' : 'text-gray-600'}`}>
                      {signal.bias}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Action</p>
                    <p className="font-semibold">
                      {signal.signalStrength === 'Very Strong' ? 'Trade immediately' :
                       signal.signalStrength === 'Strong' ? 'Wait for pullback' :
                       signal.signalStrength === 'Moderate' ? 'Wait for setup' :
                       'Only if perfect setup'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No significant trading signals detected.</p>
        )}
      </div>

      {/* Detailed Currency Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Analysis</h2>
        <div className="space-y-6">
          {sortedCurrencies.slice(0, 3).map((currency) => {
            const score = result.currencyScores[currency];
            return (
              <div key={currency} className="border rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">{currency} Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Rate Policy</h4>
                    <div className="space-y-1">
                      <p>Current Rate: {score.ratePolicy.currentPolicyRate}%</p>
                      <p>Terminal Rate: {score.ratePolicy.marketTerminalRate}%</p>
                      <p>Rate Gap: {score.ratePolicy.rateGap.toFixed(2)}%</p>
                      <p>Hawkish Words: {score.ratePolicy.hawkishWords}</p>
                      <p>Dovish Words: {score.ratePolicy.dovishWords}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Growth Momentum</h4>
                    <div className="space-y-1">
                      <p>Employment Score: {score.growthMomentum.employmentScore.toFixed(2)}</p>
                      <p>Manufacturing Score: {score.growthMomentum.manufacturingScore.toFixed(2)}</p>
                      <p>GDP Score: {score.growthMomentum.gdpScore.toFixed(2)}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Real Interest</h4>
                    <div className="space-y-1">
                      <p>2Y Yield: {score.realInterest.twoYearYield}%</p>
                      <p>Inflation Expectation: {score.realInterest.inflationExpectation}%</p>
                      <p>Real Rate: {score.realInterest.realRate.toFixed(2)}%</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Risk Appetite</h4>
                    <div className="space-y-1">
                      <p>VIX Score: {score.riskAppetite.vixScore.toFixed(2)}</p>
                      <p>Risk Score: {score.riskAppetite.riskScore.toFixed(2)}</p>
                      <p>Currency Risk Factor: {score.riskAppetite.currencyRiskFactor}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ForexDashboard;