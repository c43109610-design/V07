import React, { useState, useEffect } from 'react';
import { calculateForexModel, runModelTests } from './lib/modelCalculations';
import { Currency, ModelResult } from './types/forex';
import ForexDashboard from './components/ForexDashboard';
import ModelInput from './components/ModelInput';
import TestResults from './components/TestResults';

function App() {
  const [modelResult, setModelResult] = useState<ModelResult | null>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Run model tests on component mount
  useEffect(() => {
    try {
      const results = runModelTests();
      setTestResults(results);
      console.log('Model tests completed:', results);
    } catch (error) {
      console.error('Error running model tests:', error);
    }
  }, []);

  const handleCalculateModel = async (marketData: any, currencyData: any) => {
    setIsLoading(true);
    try {
      const result = calculateForexModel(marketData, currencyData);
      setModelResult(result);
    } catch (error) {
      console.error('Error calculating model:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                PERFECT RETAIL FOREX MACRO SCORING MODEL V07
              </h1>
              <p className="text-gray-600 mt-1">
                Institutional-grade currency analysis for retail traders
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Model Input Panel */}
          <div className="lg:col-span-1">
            <ModelInput onCalculate={handleCalculateModel} isLoading={isLoading} />
          </div>

          {/* Results Dashboard */}
          <div className="lg:col-span-2">
            {modelResult ? (
              <ForexDashboard result={modelResult} />
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Model Results
                </h2>
                <p className="text-gray-600">
                  Enter market data and currency information to calculate forex signals.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="mt-8">
            <TestResults results={testResults} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;