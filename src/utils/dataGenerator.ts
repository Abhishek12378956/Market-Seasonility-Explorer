import { FinancialData } from '../types/financial';
import { formatDate, addDays } from './dateHelpers';

// Simulate realistic financial data patterns
export const generateFinancialData = (startDate: Date, days: number): FinancialData[] => {
  const data: FinancialData[] = [];
  let currentPrice = 45000 + Math.random() * 10000; // Starting around $45-55k
  
  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i);
    
    // Simulate price movements with some correlation
    const dailyChange = (Math.random() - 0.5) * 0.08; // ±4% daily change
    const openPrice = currentPrice;
    const closePrice = currentPrice * (1 + dailyChange);
    
    // High and low prices
    const volatility = 0.02 + Math.random() * 0.08; // 2-10% volatility
    const highPrice = Math.max(openPrice, closePrice) * (1 + volatility * Math.random());
    const lowPrice = Math.min(openPrice, closePrice) * (1 - volatility * Math.random());
    
    // Volume simulation (higher volume on higher volatility days)
    const baseVolume = 100000000; // 100M base volume
    const volumeMultiplier = 1 + volatility * 5;
    const volume = baseVolume * volumeMultiplier * (0.5 + Math.random());
    
    // Liquidity (inverse correlation with volatility)
    const liquidity = Math.max(0.3, 1 - volatility * 2);
    
    // Performance calculation
    const performance = (closePrice - openPrice) / openPrice;
    
    // Technical indicators
    const rsi = 30 + Math.random() * 40; // RSI between 30-70
    const movingAverage = currentPrice * (0.98 + Math.random() * 0.04);
    
    data.push({
      date: formatDate(date),
      openPrice: Math.round(openPrice * 100) / 100,
      closePrice: Math.round(closePrice * 100) / 100,
      highPrice: Math.round(highPrice * 100) / 100,
      lowPrice: Math.round(lowPrice * 100) / 100,
      volume: Math.round(volume),
      volatility: Math.round(volatility * 10000) / 100, // Convert to percentage
      liquidity: Math.round(liquidity * 100) / 100,
      performance: Math.round(performance * 10000) / 100, // Convert to percentage
      rsi: Math.round(rsi * 100) / 100,
      movingAverage: Math.round(movingAverage * 100) / 100,
    });
    
    currentPrice = closePrice;
  }
  
  return data;
};

export const getVolatilityColor = (volatility: number): string => {
  if (volatility < 2) return 'bg-green-500';
  if (volatility < 4) return 'bg-green-400';
  if (volatility < 6) return 'bg-yellow-400';
  if (volatility < 8) return 'bg-orange-400';
  if (volatility < 10) return 'bg-red-400';
  return 'bg-red-500';
};

export const getPerformanceColor = (performance: number): string => {
  if (performance > 2) return 'text-green-500';
  if (performance > 0) return 'text-green-400';
  if (performance > -2) return 'text-gray-400';
  if (performance > -4) return 'text-red-400';
  return 'text-red-500';
};

export const getLiquidityOpacity = (liquidity: number): string => {
  if (liquidity > 0.8) return 'opacity-100';
  if (liquidity > 0.6) return 'opacity-80';
  if (liquidity > 0.4) return 'opacity-60';
  if (liquidity > 0.2) return 'opacity-40';
  return 'opacity-20';
};