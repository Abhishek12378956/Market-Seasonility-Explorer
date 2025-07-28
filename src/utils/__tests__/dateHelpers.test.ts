import { describe, it, expect } from 'vitest';
import {
  formatDate,
  isSameDay,
  isToday,
  getMonthName,
  getWeekNumber,
  getDaysInMonth,
  getFirstDayOfMonth,
  addDays,
  addMonths,
} from '../dateHelpers';

describe('dateHelpers', () => {
  describe('formatDate', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('2024-01-15');
    });
  });

  describe('isSameDay', () => {
    it('should return true for same dates', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-15');
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-16');
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('getMonthName', () => {
    it('should return correct month name', () => {
      const date = new Date('2024-01-15');
      expect(getMonthName(date)).toBe('January');
    });
  });

  describe('getDaysInMonth', () => {
    it('should return correct number of days for January', () => {
      expect(getDaysInMonth(2024, 0)).toBe(31);
    });

    it('should return correct number of days for February in leap year', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29);
    });

    it('should return correct number of days for February in non-leap year', () => {
      expect(getDaysInMonth(2023, 1)).toBe(28);
    });
  });

  describe('addDays', () => {
    it('should add days correctly', () => {
      const date = new Date('2024-01-15');
      const result = addDays(date, 5);
      expect(formatDate(result)).toBe('2024-01-20');
    });
  });

  describe('addMonths', () => {
    it('should add months correctly', () => {
      const date = new Date('2024-01-15');
      const result = addMonths(date, 2);
      expect(result.getMonth()).toBe(2); // March (0-indexed)
    });
  });
});