import React from 'react';
import { TooltipData } from '../../types/financial';

interface TooltipProps {
  tooltip: TooltipData;
}

export const Tooltip: React.FC<TooltipProps> = ({ tooltip }) => {
  if (!tooltip.visible) return null;

  const { x, y, data } = tooltip;

  return (
    <div
      className="fixed z-50 bg-gray-900 text-white p-4 rounded-lg shadow-xl border border-gray-700 pointer-events-none"
      style={{
        left: x + 10,
        top: y - 10,
        transform: 'translateY(-100%)',
      }}
    >
      <div className="text-sm font-medium mb-2">
        {new Date(data.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="text-gray-400">Price Range</div>
          <div>${data.lowPrice.toLocaleString()} - ${data.highPrice.toLocaleString()}</div>
        </div>
        
        <div>
          <div className="text-gray-400">Close</div>
          <div>${data.closePrice.toLocaleString()}</div>
        </div>
        
        <div>
          <div className="text-gray-400">Volume</div>
          <div>{(data.volume / 1000000).toFixed(1)}M</div>
        </div>
        
        <div>
          <div className="text-gray-400">Performance</div>
          <div className={data.performance >= 0 ? 'text-green-400' : 'text-red-400'}>
            {data.performance >= 0 ? '+' : ''}{data.performance.toFixed(2)}%
          </div>
        </div>
        
        <div>
          <div className="text-gray-400">Volatility</div>
          <div>{data.volatility.toFixed(2)}%</div>
        </div>
        
        <div>
          <div className="text-gray-400">Liquidity</div>
          <div>{(data.liquidity * 100).toFixed(0)}%</div>
        </div>
      </div>
    </div>
  );
};