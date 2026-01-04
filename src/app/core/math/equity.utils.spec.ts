import { describe, it, expect } from 'vitest';
import { calculateBlackScholes, calculateCapm, calculateWacc, calculateDupont } from './equity.utils';

describe('Equity Utilities', () => {
    describe('calculateBlackScholes', () => {
        it('should calculate call and put prices correctly', () => {
            const params = {
                stockPrice: 100,
                strikePrice: 95,
                time: 1,
                riskFreeRate: 0.05,
                volatility: 0.2
            };
            const result = calculateBlackScholes(params);
            expect(result.callPrice).toBeCloseTo(13.70, 2);
            expect(result.putPrice).toBeCloseTo(4.06, 2);
        });
    });

    describe('calculateCapm', () => {
        it('should calculate expected return correctly', () => {
            const result = calculateCapm({ riskFreeRate: 0.03, beta: 1.2, marketReturn: 0.08 });
            expect(result).toBeCloseTo(0.09, 2);
        });
    });

    describe('calculateWacc', () => {
        it('should calculate WACC correctly', () => {
            const result = calculateWacc({
                marketValueEquity: 600000,
                marketValueDebt: 400000,
                costOfEquity: 0.1,
                costOfDebt: 0.05,
                taxRate: 0.25
            });
            expect(result).toBeCloseTo(0.075, 3);
        });
    });

    describe('calculateDupont', () => {
        it('should decompose ROE correctly', () => {
            const result = calculateDupont({
                netIncome: 50000,
                revenue: 500000,
                totalAssets: 1000000,
                totalEquity: 400000
            });
            expect(result.roe).toBe(0.125);
            expect(result.profitMargin).toBe(0.1);
            expect(result.assetTurnover).toBe(0.5);
            expect(result.equityMultiplier).toBe(2.5);
        });
    });
});
