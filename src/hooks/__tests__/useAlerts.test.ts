import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAlerts } from '../useAlerts';
import { FinancialData } from '../../types/financial';

const mockData: FinancialData[] = [
  {
    date: '2024-01-01',
    openPrice: 50000,
    closePrice: 51000,
    highPrice: 52000,
    lowPrice: 49000,
    volume: 100000000,
    volatility: 10, // High volatility to trigger alert
    liquidity: 0.8,
    performance: 2.0,
    rsi: 65,
    movingAverage: 50500,
  },
  {
    date: '2024-01-02',
    openPrice: 51000,
    closePrice: 49000,
    highPrice: 51500,
    lowPrice: 48000,
    volume: 250000000, // High volume to trigger alert
    volatility: 3,
    liquidity: 0.7,
    performance: -6, // Negative performance to trigger alert
    rsi: 45,
    movingAverage: 50000,
  },
];

describe('useAlerts', () => {
  it('should initialize with default alerts', () => {
    const { result } = renderHook(() => useAlerts([]));

    expect(result.current.alerts).toHaveLength(3);
    expect(result.current.alerts[0].type).toBe('volatility');
    expect(result.current.alerts[1].type).toBe('performance');
    expect(result.current.alerts[2].type).toBe('volume');
  });

  it('should detect triggered alerts', () => {
    const { result } = renderHook(() => useAlerts(mockData));

    expect(result.current.triggeredAlerts.length).toBeGreaterThan(0);
    
    // Should trigger volatility alert (10 > 8)
    const volatilityAlert = result.current.triggeredAlerts.find(
      alert => alert.type === 'volatility'
    );
    expect(volatilityAlert).toBeDefined();
    expect(volatilityAlert?.triggeredDates).toContain('2024-01-01');
  });

  it('should add new alert', () => {
    const { result } = renderHook(() => useAlerts([]));

    act(() => {
      result.current.addAlert({
        type: 'volatility',
        condition: 'above',
        threshold: 15,
        isActive: true,
        message: 'Test alert',
      });
    });

    expect(result.current.alerts).toHaveLength(4);
    expect(result.current.alerts[3].message).toBe('Test alert');
  });

  it('should update alert', () => {
    const { result } = renderHook(() => useAlerts([]));

    const alertId = result.current.alerts[0].id;

    act(() => {
      result.current.updateAlert(alertId, { isActive: false });
    });

    const updatedAlert = result.current.alerts.find(alert => alert.id === alertId);
    expect(updatedAlert?.isActive).toBe(false);
  });

  it('should delete alert', () => {
    const { result } = renderHook(() => useAlerts([]));

    const initialCount = result.current.alerts.length;
    const alertId = result.current.alerts[0].id;

    act(() => {
      result.current.deleteAlert(alertId);
    });

    expect(result.current.alerts).toHaveLength(initialCount - 1);
    expect(result.current.alerts.find(alert => alert.id === alertId)).toBeUndefined();
  });
});