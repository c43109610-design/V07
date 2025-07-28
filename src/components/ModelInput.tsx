import React, { useState } from 'react';
import { Currency } from '../types/forex';

interface ModelInputProps {
  onCalculate: (marketData: any, currencyData: any) => void;
  isLoading: boolean;
}

const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF'];

const ModelInput: React.FC<ModelInputProps> = ({ onCalculate, isLoading }) => {
  const [marketData, setMarketData] = useState({
    vixPercentile: 45,
    spyVsGldPerformance: 0.015,
    isCentralBankWeek: false,
  });

  const [currencyData, setCurrencyData] = useState<Record<Currency, any>>({
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
    GBP: {
      currentPolicyRate: 5.25,
      marketTerminalRate: 5.00,
      hawkishWords: 1,
      dovishWords: 1,
      employmentData: -15000,
      manufacturingPMI: 50,
      gdpGrowth: 1.8,
      twoYearYield: 4.5,
      inflationExpectation: 2.1,
      cotPercentile: 55,
    },
    JPY: {
      currentPolicyRate: 0.10,
      marketTerminalRate: 0.25,
      hawkishWords: 0,
      dovishWords: 3,
      employmentData: 1.28,
      manufacturingPMI: 49,
      gdpGrowth: 0.8,
      twoYearYield: 0.3,
      inflationExpectation: 1.8,
      cotPercentile: 30,
    },
    AUD: {
      currentPolicyRate: 4.35,
      marketTerminalRate: 4.50,
      hawkishWords: 1,
      dovishWords: 1,
      employmentData: 66.8,
      manufacturingPMI: 51,
      gdpGrowth: 2.2,
      twoYearYield: 4.2,
      inflationExpectation: 2.2,
      cotPercentile: 65,
    },
    CAD: {
      currentPolicyRate: 5.00,
      marketTerminalRate: 4.75,
      hawkishWords: 1,
      dovishWords: 2,
      employmentData: 62.8,
      manufacturingPMI: 49,
      gdpGrowth: 1.5,
      twoYearYield: 4.0,
      inflationExpectation: 2.0,
      cotPercentile: 45,
    },
    CHF: {
      currentPolicyRate: 1.75,
      marketTerminalRate: 1.50,
      hawkishWords: 0,
      dovishWords: 2,
      employmentData: 0.1,
      manufacturingPMI: 47,
      gdpGrowth: 1.0,
      twoYearYield: 1.2,
      inflationExpectation: 1.5,
      cotPercentile: 35,
    },
  });

  const handleMarketDataChange = (field: string, value: any) => {
    setMarketData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCurrencyDataChange = (currency: Currency, field: string, value: any) => {
    setCurrencyData(prev => ({
      ...prev,
      [currency]: {
        ...prev[currency],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(marketData, currencyData);
  };

  const loadSampleData = () => {
    // Sample data represents a risk-on market scenario
    setMarketData({
      vixPercentile: 20,
      spyVsGldPerformance: 0.03,
      isCentralBankWeek: false,
    });

    setCurrencyData({
      USD: {
        currentPolicyRate: 5.25,
        marketTerminalRate: 5.75,
        hawkishWords: 3,
        dovishWords: 0,
        employmentData: 200000,
        manufacturingPMI: 54,
        gdpGrowth: 3.2,
        twoYearYield: 4.8,
        inflationExpectation: 2.4,
        cotPercentile: 70,
      },
      EUR: {
        currentPolicyRate: 4.00,
        marketTerminalRate: 3.50,
        hawkishWords: 0,
        dovishWords: 3,
        employmentData: -0.5,
        manufacturingPMI: 46,
        gdpGrowth: 0.8,
        twoYearYield: 3.0,
        inflationExpectation: 1.8,
        cotPercentile: 25,
      },
      GBP: {
        currentPolicyRate: 5.25,
        marketTerminalRate: 4.75,
        hawkishWords: 1,
        dovishWords: 2,
        employmentData: 25000,
        manufacturingPMI: 48,
        gdpGrowth: 1.2,
        twoYearYield: 4.2,
        inflationExpectation: 2.0,
        cotPercentile: 40,
      },
      JPY: {
        currentPolicyRate: 0.10,
        marketTerminalRate: 0.15,
        hawkishWords: 0,
        dovishWords: 4,
        employmentData: 1.25,
        manufacturingPMI: 47,
        gdpGrowth: 0.5,
        twoYearYield: 0.2,
        inflationExpectation: 1.6,
        cotPercentile: 20,
      },
      AUD: {
        currentPolicyRate: 4.35,
        marketTerminalRate: 4.75,
        hawkishWords: 2,
        dovishWords: 0,
        employmentData: 67.2,
        manufacturingPMI: 53,
        gdpGrowth: 2.8,
        twoYearYield: 4.5,
        inflationExpectation: 2.3,
        cotPercentile: 80,
      },
      CAD: {
        currentPolicyRate: 5.00,
        marketTerminalRate: 4.50,
        hawkishWords: 0,
        dovishWords: 2,
        employmentData: 62.5,
        manufacturingPMI: 48,
        gdpGrowth: 1.0,
        twoYearYield: 3.8,
        inflationExpectation: 1.9,
        cotPercentile: 35,
      },
      CHF: {
        currentPolicyRate: 1.75,
        marketTerminalRate: 1.25,
        hawkishWords: 0,
        dovishWords: 3,
        employmentData: -0.2,
        manufacturingPMI: 45,
        gdpGrowth: 0.8,
        twoYearYield: 1.0,
        inflationExpectation: 1.4,
        cotPercentile: 25,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Model Input</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Market Data Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Market Conditions</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                VIX Percentile (20-day)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={marketData.vixPercentile}
                onChange={(e) => handleMarketDataChange('vixPercentile', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SPY vs GLD Performance (weekly)
              </label>
              <input
                type="number"
                step="0.001"
                value={marketData.spyVsGldPerformance}
                onChange={(e) => handleMarketDataChange('spyVsGldPerformance', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={marketData.isCentralBankWeek}
                onChange={(e) => handleMarketDataChange('isCentralBankWeek', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Central Bank Week
              </label>
            </div>
          </div>
        </div>

        {/* Currency Data Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Currency Data</h3>
          <div className="space-y-4">
            {CURRENCIES.map((currency) => (
              <div key={currency} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{currency}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600">Policy Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={currencyData[currency].currentPolicyRate}
                      onChange={(e) => handleCurrencyDataChange(currency, 'currentPolicyRate', parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Terminal Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={currencyData[currency].marketTerminalRate}
                      onChange={(e) => handleCurrencyDataChange(currency, 'marketTerminalRate', parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Employment Data</label>
                    <input
                      type="number"
                      step="0.1"
                      value={currencyData[currency].employmentData}
                      onChange={(e) => handleCurrencyDataChange(currency, 'employmentData', parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">PMI</label>
                    <input
                      type="number"
                      step="0.1"
                      value={currencyData[currency].manufacturingPMI}
                      onChange={(e) => handleCurrencyDataChange(currency, 'manufacturingPMI', parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">GDP Growth (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={currencyData[currency].gdpGrowth}
                      onChange={(e) => handleCurrencyDataChange(currency, 'gdpGrowth', parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">2Y Yield (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={currencyData[currency].twoYearYield}
                      onChange={(e) => handleCurrencyDataChange(currency, 'twoYearYield', parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Inflation Expectation (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={currencyData[currency].inflationExpectation}
                      onChange={(e) => handleCurrencyDataChange(currency, 'inflationExpectation', parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">COT Percentile</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={currencyData[currency].cotPercentile}
                      onChange={(e) => handleCurrencyDataChange(currency, 'cotPercentile', parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={loadSampleData}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Load Sample Data
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Calculating...' : 'Calculate Model'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModelInput;