import { describe, it, expect } from 'vitest';
import { calculateAmortization, calculateCapRate, calculateFinancialRatios } from './amortization.utils';

describe('Amortization Utilities', () => {
    describe('calculateAmortization', () => {
        it('should calculate monthly payment correctly for a standard 30-year mortgage', () => {
            const result = calculateAmortization({
                loanAmount: 250000,
                interestRate: 0.045,
                loanTerm: 30
            });
            expect(result.summary.monthlyPayment).toBeCloseTo(1266.71, 2);
        });

        it('should calculate total interest correctly', () => {
            const result = calculateAmortization({
                loanAmount: 250000,
                interestRate: 0.045,
                loanTerm: 30
            });
            expect(result.summary.totalInterest).toBeCloseTo(206016.78, 2);
        });
    });

    describe('calculateCapRate', () => {
        it('should calculate cap rate correctly', () => {
            const result = calculateCapRate({ noi: 50000, propertyValue: 1000000 });
            expect(result).toBe(0.05);
        });
    });

    describe('calculateFinancialRatios', () => {
        it('should calculate current ratio correctly', () => {
            const result = calculateFinancialRatios({
                currentAssets: 100000,
                currentLiabilities: 50000,
                totalDebt: 200000,
                totalEquity: 300000,
                stockPrice: 50,
                eps: 5
            });
            expect(result.currentRatio).toBe(2);
            expect(result.debtToEquity).toBeCloseTo(0.67, 2);
            expect(result.peRatio).toBe(10);
        });
    });
});
