import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarCell } from '../Calendar/CalendarCell';
import { CalendarCellData } from '../../types/financial';

const mockData: CalendarCellData = {
  date: '2024-01-15',
  dayOfMonth: 15,
  openPrice: 50000,
  closePrice: 51000,
  highPrice: 52000,
  lowPrice: 49000,
  volume: 100000000,
  volatility: 5.5,
  liquidity: 0.8,
  performance: 2.0,
  rsi: 65,
  movingAverage: 50500,
  isToday: false,
  isSelected: false,
  isInCurrentMonth: true,
};

describe('CalendarCell', () => {
  const mockOnClick = vi.fn();
  const mockOnMouseEnter = vi.fn();
  const mockOnMouseLeave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render calendar cell with correct data', () => {
    render(
      <CalendarCell
        data={mockData}
        activeMetric="performance"
        onClick={mockOnClick}
        onMouseEnter={mockOnMouseEnter}
        onMouseLeave={mockOnMouseLeave}
      />
    );

    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('$51,000')).toBeInTheDocument();
    expect(screen.getByText('+2.0%')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    render(
      <CalendarCell
        data={mockData}
        activeMetric="performance"
        onClick={mockOnClick}
        onMouseEnter={mockOnMouseEnter}
        onMouseLeave={mockOnMouseLeave}
      />
    );

    const cell = screen.getByText('15').closest('div');
    fireEvent.click(cell!);

    expect(mockOnClick).toHaveBeenCalledWith(mockData);
  });

  it('should handle mouse events', () => {
    render(
      <CalendarCell
        data={mockData}
        activeMetric="performance"
        onClick={mockOnClick}
        onMouseEnter={mockOnMouseEnter}
        onMouseLeave={mockOnMouseLeave}
      />
    );

    const cell = screen.getByText('15').closest('div');
    
    fireEvent.mouseEnter(cell!);
    expect(mockOnMouseEnter).toHaveBeenCalled();

    fireEvent.mouseLeave(cell!);
    expect(mockOnMouseLeave).toHaveBeenCalled();
  });

  it('should show today indicator when isToday is true', () => {
    const todayData = { ...mockData, isToday: true };
    
    render(
      <CalendarCell
        data={todayData}
        activeMetric="performance"
        onClick={mockOnClick}
        onMouseEnter={mockOnMouseEnter}
        onMouseLeave={mockOnMouseLeave}
      />
    );

    const dayNumber = screen.getByText('15');
    expect(dayNumber).toHaveClass('bg-blue-600');
  });

  it('should show correct performance indicator', () => {
    const negativeData = { ...mockData, performance: -3.5 };
    
    render(
      <CalendarCell
        data={negativeData}
        activeMetric="performance"
        onClick={mockOnClick}
        onMouseEnter={mockOnMouseEnter}
        onMouseLeave={mockOnMouseLeave}
      />
    );

    expect(screen.getByText('-3.5%')).toBeInTheDocument();
  });

  it('should apply correct opacity for non-current month', () => {
    const nonCurrentMonthData = { ...mockData, isInCurrentMonth: false };
    
    render(
      <CalendarCell
        data={nonCurrentMonthData}
        activeMetric="performance"
        onClick={mockOnClick}
        onMouseEnter={mockOnMouseEnter}
        onMouseLeave={mockOnMouseLeave}
      />
    );

    // Find the main cell container by looking for the div that contains the day number
    // and has the opacity class applied
    const dayNumber = screen.getByText('15');
    const cell = dayNumber.closest('div');
    // Navigate up to the main container that has the opacity class
    const mainContainer = cell?.parentElement;
    expect(mainContainer).toHaveClass('opacity-40');
  });
});