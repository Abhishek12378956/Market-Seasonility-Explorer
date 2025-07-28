import { FinancialData, PatternMatch } from '../types/financial';
import { format, getMonth, getDay, differenceInDays } from 'date-fns';

export const detectPatterns = (data: FinancialData[]): PatternMatch[] => {
  const patterns: PatternMatch[] = [];

  // Detect seasonal patterns
  const seasonalPatterns = detectSeasonalPatterns(data);
  patterns.push(...seasonalPatterns);

  // Detect anomalies
  const anomalies = detectAnomalies(data);
  patterns.push(...anomalies);

  // Detect trends
  const trends = detectTrends(data);
  patterns.push(...trends);

  return patterns;
};

const detectSeasonalPatterns = (data: FinancialData[]): PatternMatch[] => {
  const patterns: PatternMatch[] = [];
  const monthlyData = new Map<number, FinancialData[]>();

  // Group data by month
  data.forEach(item => {
    const month = getMonth(new Date(item.date));
    if (!monthlyData.has(month)) {
      monthlyData.set(month, []);
    }
    monthlyData.get(month)!.push(item);
  });

  // Analyze monthly volatility patterns
  const monthlyVolatility = Array.from(monthlyData.entries()).map(([month, monthData]) => ({
    month,
    avgVolatility: monthData.reduce((sum, d) => sum + d.volatility, 0) / monthData.length,
    dates: monthData.map(d => d.date),
  }));

  // Find months with consistently high volatility
  const highVolatilityMonths = monthlyVolatility.filter(m => m.avgVolatility > 6);
  if (highVolatilityMonths.length > 0) {
    patterns.push({
      type: 'seasonal',
      dates: highVolatilityMonths.flatMap(m => m.dates),
      description: `High volatility season detected in ${highVolatilityMonths.map(m => 
        new Date(2024, m.month).toLocaleDateString('en-US', { month: 'long' })
      ).join(', ')}`,
      confidence: 0.8,
    });
  }

  return patterns;
};

const detectAnomalies = (data: FinancialData[]): PatternMatch[] => {
  const patterns: PatternMatch[] = [];
  
  // Calculate volatility statistics
  const volatilities = data.map(d => d.volatility);
  const avgVolatility = volatilities.reduce((sum, v) => sum + v, 0) / volatilities.length;
  const stdDev = Math.sqrt(
    volatilities.reduce((sum, v) => sum + Math.pow(v - avgVolatility, 2), 0) / volatilities.length
  );

  // Find extreme volatility days (more than 2 standard deviations from mean)
  const anomalies = data.filter(d => Math.abs(d.volatility - avgVolatility) > 2 * stdDev);
  
  if (anomalies.length > 0) {
    patterns.push({
      type: 'anomaly',
      dates: anomalies.map(d => d.date),
      description: `${anomalies.length} extreme volatility events detected (>2σ from mean)`,
      confidence: 0.9,
    });
  }

  return patterns;
};

const detectTrends = (data: FinancialData[]): PatternMatch[] => {
  const patterns: PatternMatch[] = [];
  
  if (data.length < 10) return patterns;

  // Simple trend detection using moving averages
  const windowSize = 10;
  const trends: { date: string; trend: 'up' | 'down' | 'sideways' }[] = [];

  for (let i = windowSize; i < data.length; i++) {
    const recentData = data.slice(i - windowSize, i);
    const olderData = data.slice(i - windowSize * 2, i - windowSize);
    
    const recentAvg = recentData.reduce((sum, d) => sum + d.closePrice, 0) / recentData.length;
    const olderAvg = olderData.reduce((sum, d) => sum + d.closePrice, 0) / olderData.length;
    
    const change = (recentAvg - olderAvg) / olderAvg;
    
    let trend: 'up' | 'down' | 'sideways';
    if (change > 0.02) trend = 'up';
    else if (change < -0.02) trend = 'down';
    else trend = 'sideways';
    
    trends.push({ date: data[i].date, trend });
  }

  // Find sustained trends
  let currentTrend = trends[0]?.trend;
  let trendStart = 0;
  
  for (let i = 1; i < trends.length; i++) {
    if (trends[i].trend !== currentTrend) {
      const trendLength = i - trendStart;
      if (trendLength >= 5 && currentTrend !== 'sideways') {
        patterns.push({
          type: 'trend',
          dates: trends.slice(trendStart, i).map(t => t.date),
          description: `Sustained ${currentTrend}ward trend detected (${trendLength} periods)`,
          confidence: Math.min(0.9, trendLength / 10),
        });
      }
      currentTrend = trends[i].trend;
      trendStart = i;
    }
  }

  return patterns;
};