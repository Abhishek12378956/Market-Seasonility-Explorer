import { describe, it, expect } from 'vitest';
import {
  generateFinancialData,
  getVolatilityColor,
  getPerformanceColor,
  getLiquidityOpacity,
} from '../dataGenerator';

describe('dataGenerator', () => {
  describe('generateFinancialData', () => {
    it('should generate correct number of data points', () => {
      const startDate = new Date('2024-01-01');
      const days = 30;
      const data = generateFinancialData(startDate, days);
      
      expect(data).toHaveLength(days);
    });

    it('should generate data with required properties', () => {
      const startDate = new Date('2024-01-01');
      const data = generateFinancialData(startDate, 1);
      
      expect(data[0]).toHaveProperty('date');
      expect(data[0]).toHaveProperty('openPrice');
      expect(data[0]).toHaveProperty('closePrice');
      expect(data[0]).toHaveProperty('highPrice');
      expect(data[0]).toHaveProperty('lowPrice');
      expect(data[0]).toHaveProperty('volume');
      expect(data[0]).toHaveProperty('volatility');
      expect(data[0]).toHaveProperty('liquidity');
      expect(data[0]).toHaveProperty('performance');
    });

    it('should generate realistic price ranges', () => {
      const startDate = new Date('2024-01-01');
      const data = generateFinancialData(startDate, 10);
      
      data.forEach(item => {
        expect(item.highPrice).toBeGreaterThanOrEqual(Math.max(item.openPrice, item.closePrice));
        expect(item.lowPrice).toBeLessThanOrEqual(Math.min(item.openPrice, item.closePrice));
        expect(item.volume).toBeGreaterThan(0);
        expect(item.volatility).toBeGreaterThanOrEqual(0);
        expect(item.liquidity).toBeGreaterThan(0);
      });
    });
  });

  describe('getVolatilityColor', () => {
    it('should return green for low volatility', () => {
      expect(getVolatilityColor(1)).toBe('bg-green-500');
    });

    it('should return yellow for medium volatility', () => {
      expect(getVolatilityColor(5)).toBe('bg-yellow-400');
    });

    it('should return red for high volatility', () => {
      expect(getVolatilityColor(10)).toBe('bg-red-500');
    });
  });

  describe('getPerformanceColor', () => {
    it('should return green for positive performance', () => {
      expect(getPerformanceColor(3)).toBe('text-green-500');
    });

    it('should return red for negative performance', () => {
      expect(getPerformanceColor(-5)).toBe('text-red-500');
    });

    it('should return gray for neutral performance', () => {
      expect(getPerformanceColor(-1)).toBe('text-gray-400');
    });
  });

  describe('getLiquidityOpacity', () => {
    it('should return full opacity for high liquidity', () => {
      expect(getLiquidityOpacity(0.9)).toBe('opacity-100');
    });

    it('should return low opacity for low liquidity', () => {
      expect(getLiquidityOpacity(0.1)).toBe('opacity-20');
    });
  });
});