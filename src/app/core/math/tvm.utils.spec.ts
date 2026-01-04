import { describe, it, expect } from 'vitest';
import { solveTvm } from './tvm.utils';

describe('TVM Utilities', () => {
    describe('solveTvm', () => {
        it('should solve for Future Value (FV)', () => {
            const result = solveTvm({
                solveFor: 'FV',
                pv: -1000,
                iy: 5,
                n: 10,
                pmt: 0,
                cpy: 1
            });
            expect(result).toBeCloseTo(1628.89, 2);
        });

        it('should solve for Present Value (PV)', () => {
            const result = solveTvm({
                solveFor: 'PV',
                fv: 1628.89,
                iy: 5,
                n: 10,
                pmt: 0,
                cpy: 1
            });
            expect(result).toBeCloseTo(-1000, 2);
        });

        it('should solve for Payment (PMT)', () => {
            const result = solveTvm({
                solveFor: 'PMT',
                pv: -250000,
                fv: 0,
                iy: 4.5,
                n: 360,
                cpy: 12
            });
            expect(result).toBeCloseTo(1266.71, 2);
        });

        it('should solve for Periods (N)', () => {
            const result = solveTvm({
                solveFor: 'N',
                pv: -1000,
                fv: 2000,
                iy: 7,
                pmt: 0,
                cpy: 1
            });
            expect(result).toBeCloseTo(10.24, 2);
        });

        it('should solve for Interest Rate (IY)', () => {
            const result = solveTvm({
                solveFor: 'IY',
                pv: -1000,
                fv: 1500,
                n: 5,
                pmt: 0,
                cpy: 1
            });
            expect(result).toBeCloseTo(8.45, 2);
        });
    });
});
