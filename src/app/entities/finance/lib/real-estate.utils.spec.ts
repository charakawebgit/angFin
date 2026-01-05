import { describe, it, expect } from 'vitest';
import { calculateAmortization, calculateCapRate, AmortizationParams, CapRateParams } from './real-estate.utils';

describe('Real Estate Utils', () => {
    describe('calculateAmortization', () => {
        it('should calculate monthly payment correctly for a standard loan', () => {
            const params: AmortizationParams = {
                loanAmount: 100000,
                interestRate: 0.05, // 5%
                loanTerm: 30 // 30 Years
            };

            const result = calculateAmortization(params);
            // Expected monthly payment ~536.82
            expect(result.summary.monthlyPayment).toBeCloseTo(536.82, 2);
            expect(result.summary.totalInterest).toBeGreaterThan(0);
        });

        it('should handle zero interest rate (simple division)', () => {
            const params: AmortizationParams = {
                loanAmount: 120000,
                interestRate: 0,
                loanTerm: 10 // 120 months
            };

            const result = calculateAmortization(params);
            expect(result.summary.monthlyPayment).toBe(1000); // 120000 / 120
            expect(result.summary.totalInterest).toBe(0);
        });

        it('should handle zero loan term gracefully', () => {
            const params: AmortizationParams = {
                loanAmount: 100000,
                interestRate: 0.05,
                loanTerm: 0
            };
            const result = calculateAmortization(params);
            expect(result.summary.monthlyPayment).toBe(0);
        });
    });

    describe('calculateCapRate', () => {
        it('should calculate standard cap rate', () => {
            const params: CapRateParams = {
                noi: 10000,
                propertyValue: 100000
            };
            expect(calculateCapRate(params)).toBe(0.1); // 10%
        });

        it('should return 0 if property value is 0', () => {
            const params: CapRateParams = {
                noi: 10000,
                propertyValue: 0
            };
            expect(calculateCapRate(params)).toBe(0);
        });
    });
});
