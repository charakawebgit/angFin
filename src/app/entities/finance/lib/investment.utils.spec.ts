import { describe, it, expect } from 'vitest';
import * as Inv from './investment.utils';

describe('Investment Utilities', () => {
  it('should calculate future value correctly', () => {
    const result = Inv.calculateFutureValue({ pv: 1000, rate: 0.05, periods: 10 });
    expect(result).toBeCloseTo(1628.89, 2);
  });

  it('should calculate present value correctly', () => {
    const result = Inv.calculatePresentValue({ fv: 1628.89, rate: 0.05, periods: 10 });
    expect(result).toBeCloseTo(1000, 2);
  });

  it('should calculate NPV correctly', () => {
    const result = Inv.calculateNpv({
      initialInvestment: 1000,
      cashFlows: [300, 400, 500, 600],
      discountRate: 0.1
    });
    expect(result).toBeCloseTo(388.77, 2);
  });

  it('should calculate IRR correctly', () => {
    const result = Inv.calculateIrr({ cashFlows: [-1000, 300, 400, 500, 600] });
    expect(result * 100).toBeCloseTo(24.89, 1);
  });

  it('should calculate perpetuity correctly', () => {
    const result = Inv.calculatePerpetuity({ pmt: 100, rate: 0.05 });
    expect(result).toBe(2000);
  });

  it('should calculate ROI correctly', () => {
    const result = Inv.calculateRoi({ amountSpent: 1000, amountGained: 1200 });
    expect(result).toBe(0.2);
  });
});
