import React from 'react';
import { CalendarCellData } from '../../types/financial';
import { getVolatilityColor, getPerformanceColor, getLiquidityOpacity } from '../../utils/dataGenerator';
import { MetricType } from '../../types/financial';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CalendarCellProps {
  data: CalendarCellData;
  activeMetric: MetricType;
  onClick: (data: CalendarCellData) => void;
  onMouseEnter: (event: React.MouseEvent, data: CalendarCellData) => void;
  onMouseLeave: () => void;
}

export const CalendarCell: React.FC<CalendarCellProps> = ({
  data,
  activeMetric,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const getPerformanceIcon = () => {
    if (data.performance > 1) return <TrendingUp size={12} className="text-green-400" />;
    if (data.performance < -1) return <TrendingDown size={12} className="text-red-400" />;
    return <Minus size={12} className="text-gray-400" />;
  };

  const getMetricColor = () => {
    switch (activeMetric) {
      case 'volatility':
        return getVolatilityColor(data.volatility);
      case 'liquidity':
        if (data.liquidity > 0.8) return 'bg-blue-500';
        if (data.liquidity > 0.6) return 'bg-blue-400';
        if (data.liquidity > 0.4) return 'bg-blue-300';
        if (data.liquidity > 0.2) return 'bg-blue-200';
        return 'bg-blue-100';
      case 'performance':
        if (data.performance > 3) return 'bg-green-500';
        if (data.performance > 1) return 'bg-green-400';
        if (data.performance > -1) return 'bg-gray-400';
        if (data.performance > -3) return 'bg-red-400';
        return 'bg-red-500';
      default:
        return getVolatilityColor(data.volatility);
    }
  };

  const getMetricValue = () => {
    switch (activeMetric) {
      case 'volatility':
        return `${data.volatility.toFixed(1)}%`;
      case 'liquidity':
        return `${(data.liquidity * 100).toFixed(0)}%`;
      case 'performance':
        return `${data.performance >= 0 ? '+' : ''}${data.performance.toFixed(1)}%`;
      default:
        return `${data.volatility.toFixed(1)}%`;
    }
  };
  const cellClasses = `
    relative min-h-[80px] p-2 border border-gray-600 cursor-pointer transition-all duration-300 transform
    ${data.isInCurrentMonth ? 'opacity-100' : 'opacity-40'}
    ${data.isToday ? 'ring-2 ring-blue-400' : ''}
    ${data.isSelected ? 'ring-2 ring-yellow-400' : ''}
    ${getMetricColor()} ${activeMetric === 'liquidity' ? getLiquidityOpacity(data.liquidity) : ''}
    hover:ring-2 hover:ring-blue-300 hover:scale-105 hover:z-10
  `;

  return (
    <div
      className={cellClasses}
      onClick={() => onClick(data)}
      onMouseEnter={(e) => onMouseEnter(e, data)}
      onMouseLeave={onMouseLeave}
    >
      {/* Day Number */}
      <div className="flex justify-between items-start mb-1">
        <span className={`text-sm font-medium ${
          data.isToday ? 'bg-blue-600 text-white px-2 py-1 rounded-full' : 'text-white'
        }`}>
          {data.dayOfMonth}
        </span>
        {activeMetric === 'performance' ? getPerformanceIcon() : null}
      </div>
      
      {/* Price Information */}
      <div className="text-xs text-white space-y-1">
        <div className="font-medium">
          ${data.closePrice.toLocaleString()}
        </div>
        <div className={activeMetric === 'performance' ? getPerformanceColor(data.performance) : 'text-white'}>
          {getMetricValue()}
        </div>
      </div>
      
      {/* Metric Indicator Bar */}
      {activeMetric === 'volatility' && (
        <div className="absolute bottom-1 left-2 right-2 h-1 bg-black bg-opacity-30 rounded">
          <div
            className="h-full bg-white rounded"
            style={{ width: `${Math.min(data.volatility * 10, 100)}%` }}
          />
        </div>
      )}
      
      {/* Liquidity Indicator Bar */}
      {activeMetric === 'liquidity' && (
        <div className="absolute bottom-1 left-2 right-2 h-1 bg-black bg-opacity-30 rounded">
          <div
            className="h-full bg-blue-400 rounded"
            style={{ width: `${data.liquidity * 100}%` }}
          />
        </div>
      )}
      
      {/* Performance Indicator Bar */}
      {activeMetric === 'performance' && (
        <div
          className="absolute bottom-1 left-2 right-2 h-1 bg-black bg-opacity-30 rounded"
        >
          <div
            className={`h-full rounded ${data.performance >= 0 ? 'bg-green-400' : 'bg-red-400'}`}
            style={{ width: `${Math.min(Math.abs(data.performance) * 10, 100)}%` }}
          />
        </div>
      )}
      
      {/* Volume Indicator */}
      <div className="absolute top-1 right-1">
        <div
          className="w-2 h-2 bg-blue-400 rounded-full opacity-70"
          style={{
            transform: `scale(${Math.min(data.volume / 200000000, 1.5)})`,
          }}
        />
      </div>
    </div>
  );
};