export interface FinancialData {
  date: string;
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  volatility: number;
  liquidity: number;
  performance: number;
  rsi: number;
  movingAverage: number;
}

export interface CalendarCellData extends FinancialData {
  dayOfMonth: number;
  isToday: boolean;
  isSelected: boolean;
  isInCurrentMonth: boolean;
}

export type TimeframeType = 'daily' | 'weekly' | 'monthly';
export type MetricType = 'volatility' | 'liquidity' | 'performance';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface TooltipData {
  x: number;
  y: number;
  data: CalendarCellData;
  visible: boolean;
}

export interface ColorTheme {
  id: string;
  name: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    volatility: {
      low: string;
      medium: string;
      high: string;
    };
    performance: {
      positive: string;
      negative: string;
      neutral: string;
    };
  };
}

export interface Alert {
  id: string;
  type: 'volatility' | 'performance' | 'volume';
  condition: 'above' | 'below';
  threshold: number;
  isActive: boolean;
  message: string;
  triggeredDates: string[];
}

export interface ComparisonPeriod {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  color: string;
}

export interface PatternMatch {
  type: 'seasonal' | 'anomaly' | 'trend';
  dates: string[];
  description: string;
  confidence: number;
}