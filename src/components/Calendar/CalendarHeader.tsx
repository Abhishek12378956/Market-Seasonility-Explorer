import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { TimeframeType } from '../../types/financial';
import { getMonthName } from '../../utils/dateHelpers';

interface CalendarHeaderProps {
  currentDate: Date;
  timeframe: TimeframeType;
  onDateChange: (date: Date) => void;
  onTimeframeChange: (timeframe: TimeframeType) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  timeframe,
  onDateChange,
  onTimeframeChange,
}) => {
  const handlePrevious = () => {
    if (timeframe === 'monthly') {
      onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()));
    }
  };

  const handleNext = () => {
    if (timeframe === 'monthly') {
      onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()));
    }
  };

  const displayText = () => {
    if (timeframe === 'monthly') {
      return `${getMonthName(currentDate)} ${currentDate.getFullYear()}`;
    }
    return `${getMonthName(currentDate)} ${currentDate.getFullYear()}`;
  };

  return (
    <div className="flex items-center justify-between mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center space-x-4">
        <Calendar className="text-blue-400" size={24} />
        <h2 className="text-xl font-semibold text-white">{displayText()}</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Timeframe Selector */}
        <div className="flex bg-gray-700 rounded-lg p-1">
          {(['daily', 'weekly', 'monthly'] as TimeframeType[]).map((type) => (
            <button
              key={type}
              onClick={() => onTimeframeChange(type)}
              className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 hover:scale-105 ${
                timeframe === type
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={() => onDateChange(new Date())}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-200 hover:scale-105"
          >
            Today
          </button>
          
          <button
            onClick={handleNext}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-all duration-200 hover:scale-110"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};