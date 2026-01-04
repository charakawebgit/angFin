import { describe, it, expect } from 'vitest';
import * as Fi from './fixed-income.utils';

describe('Fixed Income Utilities', () => {
  const bondParams = {
    faceValue: 1000,
    couponRate: 0.05,
    marketRate: 0.04,
    years: 10,
    frequency: 2
  };

  it('should calculate bond price correctly', () => {
    const result = Fi.calculateBondPrice(bondParams);
    expect(result).toBeCloseTo(1081.76, 2);
  });

  it('should calculate YTM correctly', () => {
    const result = Fi.calculateYtm({
      currentPrice: 950,
      faceValue: 1000,
      couponRate: 0.05,
      years: 10,
      frequency: 2
    });
    expect(result * 100).toBeCloseTo(5.66, 1);
  });

  it('should calculate duration correctly', () => {
    const result = Fi.calculateDuration(bondParams);
    expect(result.macaulay).toBeCloseTo(8.11, 2);
    expect(result.modified).toBeCloseTo(7.95, 2);
  });
});
