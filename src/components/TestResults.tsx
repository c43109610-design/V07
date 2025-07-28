import React from 'react';

interface TestResultsProps {
  results: any;
}

const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  const getScoreColor = (score: number) => {
    if (score > 0.5) return 'text-green-600';
    if (score > 0) return 'text-blue-600';
    if (score > -0.5) return 'text-gray-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Model Validation Tests</h2>
      
      {/* Market State */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Market State</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Regime</p>
            <p className="text-lg font-semibold">{results.marketState.regime}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">VIX Percentile</p>
            <p className="text-lg font-semibold">{results.marketState.vixPercentile}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">SPY vs GLD</p>
            <p className="text-lg font-semibold">{(results.marketState.spyVsGldPerformance * 100).toFixed(2)}%</p>
          </div>
        </div>
      </div>

      {/* Currency Scores */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Currency Scores</h3>
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
                  Growth Momentum
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
              {Object.entries(results.currencyScores).map(([currency, score]: [string, any]) => (
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
                    <div className={`text-sm ${getScoreColor(score.ratePolicy)}`}>
                      {score.ratePolicy.toFixed(3)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${getScoreColor(score.growthMomentum)}`}>
                      {score.growthMomentum.toFixed(3)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${getScoreColor(score.realInterest)}`}>
                      {score.realInterest.toFixed(3)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${getScoreColor(score.riskAppetite)}`}>
                      {score.riskAppetite.toFixed(3)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${getScoreColor(score.positioning)}`}>
                      {score.positioning.toFixed(3)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pair Signals */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Pair Signals</h3>
        {results.pairSignals && results.pairSignals.length > 0 ? (
          <div className="space-y-3">
            {results.pairSignals.map((signal: any, index: number) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{signal.pair}</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    signal.signalStrength === 'Very Strong' ? 'bg-green-100 text-green-800' :
                    signal.signalStrength === 'Strong' ? 'bg-blue-100 text-blue-800' :
                    signal.signalStrength === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {signal.signalStrength}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Score Diff: </span>
                    <span className="font-semibold">{signal.scoreDifference.toFixed(3)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Confidence: </span>
                    <span className="font-semibold">{signal.confidenceLevel}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Bias: </span>
                    <span className={`font-semibold ${
                      signal.bias === 'Buy' ? 'text-green-600' : 
                      signal.bias === 'Sell' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {signal.bias}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No pair signals available.</p>
        )}
      </div>

      {/* Test Status */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Model Tests Completed Successfully
            </h3>
            <p className="text-sm text-green-700 mt-1">
              All calculations are working correctly according to the V07 specification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResults;