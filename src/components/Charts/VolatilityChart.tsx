import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { FinancialData } from '../../types/financial';

interface VolatilityChartProps {
  data: FinancialData[];
}

export const VolatilityChart: React.FC<VolatilityChartProps> = ({ data }) => {
  const chartData = data.slice(-30).map(item => ({
    date: new Date(item.date).getDate(),
    volatility: item.volatility,
    liquidity: item.liquidity * 100,
  }));

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-white text-lg font-semibold mb-4">30-Day Volatility & Liquidity</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#FFFFFF',
              }}
            />
            <Area
              type="monotone"
              dataKey="volatility"
              stackId="1"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="liquidity"
              stackId="2"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};