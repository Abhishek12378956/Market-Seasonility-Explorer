import React from 'react';
import { CalendarCellData } from '../../types/financial';
import { MetricsCard } from './MetricsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DataPanelProps {
  selectedData: CalendarCellData | null;
  historicalData: CalendarCellData[];
}

export const DataPanel: React.FC<DataPanelProps> = ({ selectedData, historicalData }) => {
  if (!selectedData) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
        <h3 className="text-white text-lg font-semibold mb-4">Market Data Dashboard</h3>
        <p className="text-gray-400">Select a date on the calendar to view detailed metrics</p>
      </div>
    );
  }

  const chartData = historicalData.slice(-30).map(item => ({
    date: new Date(item.date).getDate(),
    price: item.closePrice,
    volume: item.volume / 1000000,
    volatility: item.volatility,
  }));

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 space-y-6">
      <div>
        <h3 className="text-white text-lg font-semibold mb-2">
          {new Date(selectedData.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </h3>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <MetricsCard
          title="Close Price"
          value={`$${selectedData.closePrice.toLocaleString()}`}
          change={selectedData.performance}
          type="price"
        />
        <MetricsCard
          title="Volume"
          value={`${(selectedData.volume / 1000000).toFixed(1)}M`}
          type="volume"
        />
        <MetricsCard
          title="Volatility"
          value={`${selectedData.volatility.toFixed(2)}%`}
          type="volatility"
        />
        <MetricsCard
          title="Performance"
          value={`${selectedData.performance.toFixed(2)}%`}
          change={selectedData.performance}
          type="performance"
        />
      </div>

      {/* Price Details */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-medium mb-3">Price Details</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Open:</span>
            <span className="text-white ml-2">${selectedData.openPrice.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-400">High:</span>
            <span className="text-white ml-2">${selectedData.highPrice.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-400">Low:</span>
            <span className="text-white ml-2">${selectedData.lowPrice.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-400">Close:</span>
            <span className="text-white ml-2">${selectedData.closePrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Technical Indicators */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-medium mb-3">Technical Indicators</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">RSI:</span>
            <span className="text-white ml-2">{selectedData.rsi.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-400">Moving Average:</span>
            <span className="text-white ml-2">${selectedData.movingAverage.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-400">Liquidity:</span>
            <span className="text-white ml-2">{(selectedData.liquidity * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-medium mb-3">30-Day Price Trend</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Line type="monotone" dataKey="price" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Volume Chart */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-medium mb-3">30-Day Volume (Millions)</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Bar dataKey="volume" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};