import { describe, it, expect, vi } from 'vitest';
import { exportToCSV } from '../exportUtils';
import { FinancialData } from '../../types/financial';

// Mock Papa.unparse
vi.mock('papaparse', () => ({
  default: {
    unparse: vi.fn(() => 'mocked,csv,data'),
  },
}));

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock document.createElement and related methods
const mockLink = {
  setAttribute: vi.fn(),
  click: vi.fn(),
  style: {},
};

global.document.createElement = vi.fn(() => mockLink as any);
global.document.body.appendChild = vi.fn();
global.document.body.removeChild = vi.fn();

describe('exportUtils', () => {
  const mockData: FinancialData[] = [
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
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exportToCSV', () => {
    it('should create CSV export with correct filename', () => {
      exportToCSV(mockData, 'test-export');

      expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'test-export.csv');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'mock-url');
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should use default filename when not provided', () => {
      exportToCSV(mockData);

      expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'market-data.csv');
    });

    it('should create blob with CSV data', () => {
      exportToCSV(mockData);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('should clean up DOM elements', () => {
      exportToCSV(mockData);

      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
    });
  });
});