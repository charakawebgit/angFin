import { describe, it, expect } from 'vitest';
import { calculateFinancialRatios, FinancialRatiosParams } from './ratios.utils';

describe('Ratios Utils', () => {
    describe('calculateFinancialRatios', () => {
        it('should calculate basic ratios correctly', () => {
            const params: FinancialRatiosParams = {
                currentAssets: 1000,
                currentLiabilities: 500,
                inventory: 200,
                totalDebt: 800,
                totalEquity: 400
            };

            const result = calculateFinancialRatios(params);

            // Current Ratio = 1000 / 500 = 2.0
            expect(result.currentRatio).toBe(2);

            // Quick Ratio = (1000 - 200) / 500 = 800 / 500 = 1.6
            expect(result.quickRatio).toBe(1.6);

            // Debt to Equity = 800 / 400 = 2.0
            expect(result.debtToEquity).toBe(2);
        });

        it('should handle missing optional parameters gracefully', () => {
            const params: FinancialRatiosParams = {
                currentAssets: 1000,
                currentLiabilities: 500
                // No debt/equity logic
            };

            const result = calculateFinancialRatios(params);

            expect(result.currentRatio).toBe(2);
            expect(result.quickRatio).toBe(2); // No inventory subtracted
            expect(result.debtToEquity).toBe(0);
        });

        it('should handle division by zero for basic ratios', () => {
            const params: FinancialRatiosParams = {
                currentAssets: 1000,
                currentLiabilities: 0,
                totalDebt: 500,
                totalEquity: 0
            };

            const result = calculateFinancialRatios(params);

            expect(result.currentRatio).toBe(0);
            expect(result.quickRatio).toBe(0);
            expect(result.debtToEquity).toBe(0);
        });

        it('should calculate debt to equity independently', () => {
            const params: FinancialRatiosParams = {
                totalDebt: 1000,
                totalEquity: 2000
            };

            const result = calculateFinancialRatios(params);
            expect(result.debtToEquity).toBe(0.5);
            expect(result.currentRatio).toBe(0);
        });
    });
});
