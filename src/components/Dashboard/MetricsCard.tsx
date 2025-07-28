import React from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  type: 'price' | 'volume' | 'volatility' | 'performance';
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, change, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'price':
        return <DollarSign size={20} />;
      case 'volume':
        return <Activity size={20} />;
      case 'volatility':
        return <Activity size={20} />;
      case 'performance':
        return change && change >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />;
      default:
        return <Activity size={20} />;
    }
  };

  const getChangeColor = () => {
    if (change === undefined) return 'text-gray-400';
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">{title}</span>
        <div className="text-blue-400">
          {getIcon()}
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <span className="text-white text-2xl font-bold">{value}</span>
        {change !== undefined && (
          <span className={`text-sm ${getChangeColor()}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
          </span>
        )}
      </div>
    </div>
  );
};