import { useState, useEffect, useMemo } from 'react';
import { FinancialData, TimeframeType } from '../types/financial';
import { generateFinancialData } from '../utils/dataGenerator';
import { addDays, addMonths } from '../utils/dateHelpers';

export const useFinancialData = (currentDate: Date, timeframe: TimeframeType) => {
  const [data, setData] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateData = () => {
      setLoading(true);
      
      // Generate data for a wider range to support navigation
      const startDate = addMonths(currentDate, -6);
      const endDate = addMonths(currentDate, 6);
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      const generatedData = generateFinancialData(startDate, daysDiff);
      setData(generatedData);
      setLoading(false);
    };

    // Simulate API delay
    const timeout = setTimeout(generateData, 500);
    return () => clearTimeout(timeout);
  }, [currentDate]);

  const processedData = useMemo(() => {
    if (timeframe === 'daily') {
      return data;
    }

    if (timeframe === 'weekly') {
      const weeklyData: FinancialData[] = [];
      const weeks = new Map<string, FinancialData[]>();

      // Group data by week
      data.forEach(item => {
        const date = new Date(item.date);
        const weekKey = `${date.getFullYear()}-${Math.ceil(date.getDate() / 7)}`;
        
        if (!weeks.has(weekKey)) {
          weeks.set(weekKey, []);
        }
        weeks.get(weekKey)!.push(item);
      });

      // Aggregate weekly data
      weeks.forEach((weekData, weekKey) => {
        if (weekData.length === 0) return;

        const firstDay = weekData[0];
        const lastDay = weekData[weekData.length - 1];
        
        weeklyData.push({
          date: firstDay.date,
          openPrice: firstDay.openPrice,
          closePrice: lastDay.closePrice,
          highPrice: Math.max(...weekData.map(d => d.highPrice)),
          lowPrice: Math.min(...weekData.map(d => d.lowPrice)),
          volume: weekData.reduce((sum, d) => sum + d.volume, 0),
          volatility: weekData.reduce((sum, d) => sum + d.volatility, 0) / weekData.length,
          liquidity: weekData.reduce((sum, d) => sum + d.liquidity, 0) / weekData.length,
          performance: ((lastDay.closePrice - firstDay.openPrice) / firstDay.openPrice) * 100,
          rsi: weekData.reduce((sum, d) => sum + d.rsi, 0) / weekData.length,
          movingAverage: weekData.reduce((sum, d) => sum + d.movingAverage, 0) / weekData.length,
        });
      });

      return weeklyData;
    }

    if (timeframe === 'monthly') {
      const monthlyData: FinancialData[] = [];
      const months = new Map<string, FinancialData[]>();

      // Group data by month
      data.forEach(item => {
        const date = new Date(item.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        
        if (!months.has(monthKey)) {
          months.set(monthKey, []);
        }
        months.get(monthKey)!.push(item);
      });

      // Aggregate monthly data
      months.forEach((monthData) => {
        if (monthData.length === 0) return;

        const firstDay = monthData[0];
        const lastDay = monthData[monthData.length - 1];
        
        monthlyData.push({
          date: firstDay.date,
          openPrice: firstDay.openPrice,
          closePrice: lastDay.closePrice,
          highPrice: Math.max(...monthData.map(d => d.highPrice)),
          lowPrice: Math.min(...monthData.map(d => d.lowPrice)),
          volume: monthData.reduce((sum, d) => sum + d.volume, 0),
          volatility: monthData.reduce((sum, d) => sum + d.volatility, 0) / monthData.length,
          liquidity: monthData.reduce((sum, d) => sum + d.liquidity, 0) / monthData.length,
          performance: ((lastDay.closePrice - firstDay.openPrice) / firstDay.openPrice) * 100,
          rsi: monthData.reduce((sum, d) => sum + d.rsi, 0) / monthData.length,
          movingAverage: monthData.reduce((sum, d) => sum + d.movingAverage, 0) / monthData.length,
        });
      });

      return monthlyData;
    }

    return data;
  }, [data, timeframe]);

  return { data: processedData, loading };
};