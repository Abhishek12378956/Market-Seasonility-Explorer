import { describe, it, expect } from 'vitest';
import { themes, getTheme } from '../themes';

describe('themes', () => {
  describe('themes array', () => {
    it('should contain all required themes', () => {
      expect(themes).toHaveLength(3);
      
      const themeIds = themes.map(theme => theme.id);
      expect(themeIds).toContain('default');
      expect(themeIds).toContain('high-contrast');
      expect(themeIds).toContain('colorblind-friendly');
    });

    it('should have valid theme structure', () => {
      themes.forEach(theme => {
        expect(theme).toHaveProperty('id');
        expect(theme).toHaveProperty('name');
        expect(theme).toHaveProperty('colors');
        expect(theme.colors).toHaveProperty('background');
        expect(theme.colors).toHaveProperty('surface');
        expect(theme.colors).toHaveProperty('primary');
        expect(theme.colors).toHaveProperty('volatility');
        expect(theme.colors.volatility).toHaveProperty('low');
        expect(theme.colors.volatility).toHaveProperty('medium');
        expect(theme.colors.volatility).toHaveProperty('high');
      });
    });
  });

  describe('getTheme', () => {
    it('should return correct theme by id', () => {
      const theme = getTheme('high-contrast');
      expect(theme.id).toBe('high-contrast');
      expect(theme.name).toBe('High Contrast');
    });

    it('should return default theme for invalid id', () => {
      const theme = getTheme('invalid-theme');
      expect(theme.id).toBe('default');
    });

    it('should return default theme for empty string', () => {
      const theme = getTheme('');
      expect(theme.id).toBe('default');
    });
  });
});