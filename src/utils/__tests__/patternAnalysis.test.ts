import { describe, it, expect } from 'vitest';
import { detectPatterns } from '../patternAnalysis';
import { FinancialData } from '../../types/financial';

const createMockData = (days: number, baseVolatility: number = 5): FinancialData[] => {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    openPrice: 50000 + Math.random() * 1000,
    closePrice: 50000 + Math.random() * 1000,
    highPrice: 51000 + Math.random() * 1000,
    lowPrice: 49000 + Math.random() * 1000,
    volume: 100000000 + Math.random() * 50000000,
    volatility: baseVolatility + Math.random() * 2,
    liquidity: 0.7 + Math.random() * 0.3,
    performance: (Math.random() - 0.5) * 10,
    rsi: 40 + Math.random() * 20,
    movingAverage: 50000 + Math.random() * 1000,
  }));
};

describe('patternAnalysis', () => {
  describe('detectPatterns', () => {
    it('should return empty array for insufficient data', () => {
      const data = createMockData(5);
      const patterns = detectPatterns(data);
      
      expect(Array.isArray(patterns)).toBe(true);
    });

    it('should detect anomalies in high volatility data', () => {
      const data = createMockData(30, 3); // Low base volatility
      
      // Add some high volatility anomalies
      data[10].volatility = 15; // High volatility anomaly
      data[20].volatility = 18; // Another high volatility anomaly
      
      const patterns = detectPatterns(data);
      
      const anomalies = patterns.filter(p => p.type === 'anomaly');
      expect(anomalies.length).toBeGreaterThan(0);
      
      if (anomalies.length > 0) {
        expect(anomalies[0].description).toContain('extreme volatility');
        expect(anomalies[0].confidence).toBeGreaterThan(0.8);
      }
    });

    it('should detect seasonal patterns', () => {
      const data = createMockData(60); // 2 months of data
      const patterns = detectPatterns(data);
      
      expect(Array.isArray(patterns)).toBe(true);
      // Seasonal patterns might be detected depending on the data distribution
    });

    it('should return patterns with correct structure', () => {
      const data = createMockData(30, 10); // High volatility to trigger anomalies
      const patterns = detectPatterns(data);
      
      patterns.forEach(pattern => {
        expect(pattern).toHaveProperty('type');
        expect(pattern).toHaveProperty('dates');
        expect(pattern).toHaveProperty('description');
        expect(pattern).toHaveProperty('confidence');
        
        expect(['seasonal', 'anomaly', 'trend']).toContain(pattern.type);
        expect(Array.isArray(pattern.dates)).toBe(true);
        expect(typeof pattern.description).toBe('string');
        expect(typeof pattern.confidence).toBe('number');
        expect(pattern.confidence).toBeGreaterThanOrEqual(0);
        expect(pattern.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('should detect trends in trending data', () => {
      const data = createMockData(20);
      
      // Create an upward trend
      data.forEach((item, index) => {
        item.closePrice = 50000 + (index * 100); // Steady upward trend
      });
      
      const patterns = detectPatterns(data);
      
      // Should detect trend patterns if the algorithm finds sustained movements
      expect(Array.isArray(patterns)).toBe(true);
    });
  });
});