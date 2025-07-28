import { ColorTheme } from '../types/financial';

export const themes: ColorTheme[] = [
  {
    id: 'default',
    name: 'Default Dark',
    colors: {
      background: '#111827',
      surface: '#1F2937',
      primary: '#3B82F6',
      secondary: '#6B7280',
      accent: '#F59E0B',
      text: '#FFFFFF',
      textSecondary: '#9CA3AF',
      border: '#374151',
      volatility: {
        low: '#10B981',
        medium: '#F59E0B',
        high: '#EF4444',
      },
      performance: {
        positive: '#10B981',
        negative: '#EF4444',
        neutral: '#6B7280',
      },
    },
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    colors: {
      background: '#000000',
      surface: '#1A1A1A',
      primary: '#00FFFF',
      secondary: '#FFFFFF',
      accent: '#FFFF00',
      text: '#FFFFFF',
      textSecondary: '#CCCCCC',
      border: '#FFFFFF',
      volatility: {
        low: '#00FF00',
        medium: '#FFFF00',
        high: '#FF0000',
      },
      performance: {
        positive: '#00FF00',
        negative: '#FF0000',
        neutral: '#FFFFFF',
      },
    },
  },
  {
    id: 'colorblind-friendly',
    name: 'Colorblind Friendly',
    colors: {
      background: '#1E293B',
      surface: '#334155',
      primary: '#0EA5E9',
      secondary: '#64748B',
      accent: '#F97316',
      text: '#F8FAFC',
      textSecondary: '#CBD5E1',
      border: '#475569',
      volatility: {
        low: '#0EA5E9',
        medium: '#F97316',
        high: '#DC2626',
      },
      performance: {
        positive: '#0EA5E9',
        negative: '#DC2626',
        neutral: '#64748B',
      },
    },
  },
];

export const getTheme = (themeId: string): ColorTheme => {
  return themes.find(theme => theme.id === themeId) || themes[0];
};