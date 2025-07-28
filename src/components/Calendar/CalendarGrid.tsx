import React, { useState, useEffect, useCallback } from 'react';
import { CalendarCellData, TooltipData, TimeframeType, FinancialData } from '../../types/financial';
import { CalendarCell } from './CalendarCell';
import { Tooltip } from '../UI/Tooltip';
import { getDaysInMonth, getFirstDayOfMonth, isToday, formatDate } from '../../utils/dateHelpers';

interface CalendarGridProps {
  currentDate: Date;
  data: FinancialData[];
  timeframe: TimeframeType;
  selectedDate: Date | null;
  onDateSelect: (date: Date, data: CalendarCellData) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  data,
  timeframe,
  selectedDate,
  onDateSelect,
}) => {
  const [tooltip, setTooltip] = useState<TooltipData>({
    x: 0,
    y: 0,
    data: {} as CalendarCellData,
    visible: false,
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const generateCalendarData = useCallback((): CalendarCellData[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const calendarData: CalendarCellData[] = [];
    const dataMap = new Map(data.map(item => [item.date, item]));

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonthDate = new Date(year, month, -firstDayOfMonth + i + 1);
      const dateStr = formatDate(prevMonthDate);
      const dayData = dataMap.get(dateStr);

      if (dayData) {
        calendarData.push({
          ...dayData,
          dayOfMonth: prevMonthDate.getDate(),
          isToday: isToday(prevMonthDate),
          isSelected: selectedDate ? formatDate(selectedDate) === dateStr : false,
          isInCurrentMonth: false,
        });
      }
    }

    // Add cells for the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDate(date);
      const dayData = dataMap.get(dateStr);

      if (dayData) {
        calendarData.push({
          ...dayData,
          dayOfMonth: day,
          isToday: isToday(date),
          isSelected: selectedDate ? formatDate(selectedDate) === dateStr : false,
          isInCurrentMonth: true,
        });
      }
    }

    // Add cells for the beginning of next month to fill the grid
    const remainingCells = 42 - calendarData.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
      const nextMonthDate = new Date(year, month + 1, day);
      const dateStr = formatDate(nextMonthDate);
      const dayData = dataMap.get(dateStr);

      if (dayData) {
        calendarData.push({
          ...dayData,
          dayOfMonth: day,
          isToday: isToday(nextMonthDate),
          isSelected: selectedDate ? formatDate(selectedDate) === dateStr : false,
          isInCurrentMonth: false,
        });
      }
    }

    return calendarData;
  }, [currentDate, data, selectedDate]);

  const calendarData = generateCalendarData();

  const handleMouseEnter = (event: React.MouseEvent, data: CalendarCellData) => {
    setTooltip({
      x: event.clientX,
      y: event.clientY,
      data,
      visible: true,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const handleCellClick = (data: CalendarCellData) => {
    const date = new Date(data.date);
    onDateSelect(date, data);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedDate) return;

      let newDate = new Date(selectedDate);

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          newDate.setDate(newDate.getDate() - 1);
          break;
        case 'ArrowRight':
          event.preventDefault();
          newDate.setDate(newDate.getDate() + 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          newDate.setDate(newDate.getDate() - 7);
          break;
        case 'ArrowDown':
          event.preventDefault();
          newDate.setDate(newDate.getDate() + 7);
          break;
        default:
          return;
      }

      const dateStr = formatDate(newDate);
      const dayData = data.find(item => item.date === dateStr);
      if (dayData) {
        const cellData = {
          ...dayData,
          dayOfMonth: newDate.getDate(),
          isToday: isToday(newDate),
          isSelected: true,
          isInCurrentMonth: newDate.getMonth() === currentDate.getMonth(),
        };
        onDateSelect(newDate, cellData);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDate, data, currentDate, onDateSelect]);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Week Headers */}
      <div className="grid grid-cols-7 bg-gray-700">
        {weekDays.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-300">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarData.map((cellData, index) => (
          <CalendarCell
            key={`${cellData.date}-${index}`}
            data={cellData}
            onClick={handleCellClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>

      <Tooltip tooltip={tooltip} />
    </div>
  );
};