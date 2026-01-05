import { describe, it, expect } from 'vitest';
import * as Stat from './stats.utils';

describe('Stats Utilities', () => {
  const data = [10, 12, 15, 18, 20];

  it('should calculate standard deviation correctly', () => {
    const result = Stat.calculateStandardDeviation({ values: data });
    expect(result).toBeCloseTo(4.12, 2);
  });

  it('should calculate sample variance correctly', () => {
    const result = Stat.calculateSampleVariance({ values: data });
    expect(result).toBeCloseTo(17, 1);
  });

  it('should calculate geometric mean correctly', () => {
    const returns = [0.1, 0.2, -0.1, 0.05];
    const result = Stat.calculateGeometricMean({ returns });
    expect(result * 100).toBeCloseTo(5.68, 2);
  });

  it('should calculate MAD correctly', () => {
    const result = Stat.calculateMeanAbsoluteDeviation({ values: data });
    expect(result).toBe(3.2);
  });
});
