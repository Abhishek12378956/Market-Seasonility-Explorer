import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFinancialData } from '../useFinancialData';

// Mock the data generator
vi.mock('../../utils/dataGenerator', () => ({
  generateFinancialData: vi.fn(() => [
    {
      date: '2024-01-01',
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
    },
  ]),
}));

describe('useFinancialData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    const { result } = renderHook(() => 
      useFinancialData(new Date('2024-01-01'), 'daily')
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
  });

  it('should return data after loading', async () => {
    const { result } = renderHook(() => 
      useFinancialData(new Date('2024-01-01'), 'daily')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0]).toHaveProperty('date', '2024-01-01');
  });

  it('should handle timeframe changes', async () => {
    const { result, rerender } = renderHook(
      ({ timeframe }: { timeframe: 'daily' | 'weekly' | 'monthly' }) => 
        useFinancialData(new Date('2024-01-01'), timeframe),
      { initialProps: { timeframe: 'daily' } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    rerender({ timeframe: 'weekly' });

    expect(result.current.data).toBeDefined();
  });
});