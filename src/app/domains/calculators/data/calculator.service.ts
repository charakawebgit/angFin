import { Injectable, signal } from '@angular/core';
import { CalculatorDef } from '../data/models';

@Injectable({
    providedIn: 'root',
})
export class CalculatorService {
    private calculators = signal<CalculatorDef[]>([
        { id: 'future-value', title: 'Future Value', description: 'Calculate the value of an investment at a future date based on a fixed interest rate.', icon: 'trending-up', category: 'TVM' },
        { id: 'present-value', title: 'Present Value', description: 'Determine the current value of a sum of money to be received in the future.', icon: 'hourglass', category: 'TVM' },
        { id: 'perpetuity', title: 'Perpetuity', description: 'Calculate the present value of an infinite stream of equal cash flows.', icon: 'shield-check', category: 'TVM' },
        { id: 'ear', title: 'Effective Annual Return', description: 'Find the actual annual interest rate when compounding occurs more than once a year.', icon: 'percent', category: 'Returns' },
        { id: 'hpr', title: 'Holding Period Return', description: 'Calculate the total return on an investment over the period it was held.', icon: 'calendar-check', category: 'Returns' },
        { id: 'cap-rate', title: 'Cap Rate', description: 'Estimate the expected rate of return on a real estate investment property.', icon: 'building', category: 'Real Estate' },
        { id: 'npv', title: 'Net Present Value', description: 'Evaluate the profitability of an investment by discounting its future cash flows.', icon: 'list-plus', category: 'Analysis' },
        { id: 'capm', title: 'CAPM Model', description: 'Calculate the expected return of an asset based on its risk relative to the market.', icon: 'target', category: 'Equity' },
        { id: 'ddm', title: 'Dividend Discount Model', description: 'Value a stock based on the present value of its future dividend payments.', icon: 'hand-coins', category: 'Equity' },
        { id: 'sharpe', title: 'Sharpe Ratio', description: 'Measure the risk-adjusted performance of an investment or portfolio.', icon: 'ratio', category: 'Analysis' },
        { id: 'cv', title: 'Coefficient of Variation', description: 'Assess the relative volatility of different investments.', icon: 'git-compare-arrows', category: 'Stats' },
        { id: 'tvm', title: 'TVM Solver', description: 'Comprehensive tool to solve for any variable in Time Value of Money equations.', icon: 'calculator', category: 'TVM' },
        { id: 'amortization', title: 'Amortization', description: 'Generate a complete loan repayment schedule with principal and interest breakdown.', icon: 'table', category: 'Fixed Income' },
        { id: 'bond-valuation', title: 'Bond Valuation', description: 'Calculate the fair market price of a bond based on its coupon payments and yield.', icon: 'scroll-text', category: 'Fixed Income' },
        { id: 'ytm', title: 'Yield to Maturity', description: 'Find the total expected return of a bond if held until it matures.', icon: 'activity', category: 'Fixed Income' },
        { id: 'duration', title: 'Bond Duration', description: 'Measure the sensitivity of a bond\'s price to changes in interest rates.', icon: 'gauge', category: 'Fixed Income' },
        { id: 'convexity', title: 'Bond Convexity', description: 'Refine the interest rate sensitivity estimate for larger yield movements.', icon: 'waves', category: 'Fixed Income' },
        { id: 'black-scholes', title: 'Black-Scholes', description: 'Calculate theoretical prices for European-style call and put options.', icon: 'brain-circuit', category: 'Pricing' },
        { id: 'geometric-mean', title: 'Geometric Mean', description: 'Calculate the average return of a series of values with compounding effects.', icon: 'bar-chart-4', category: 'Stats' },
        { id: 'mad', title: 'Mean Absolute Deviation', description: 'Determine the average distance between each data point and the mean.', icon: 'move-horizontal', category: 'Stats' },
        { id: 'variance-stddev', title: 'Variance & Std Dev', description: 'Analyze the dispersion and risk of a data set using standard statistical measures.', icon: 'sigma', category: 'Stats' },
        { id: 'skew-kurt', title: 'Skewness & Kurtosis', description: 'Examine the symmetry and tail behavior of a distribution.', icon: 'bar-chart-horizontal', category: 'Stats' },
        { id: 'rbd', title: 'Bank Discount Yield', description: 'Calculate the annualized return on short-term discount instruments like T-bills.', icon: 'banknote', category: 'Fixed Income' },
        { id: 'eay', title: 'Effective Annual Yield', description: 'Convert a holding period yield to an annualized return using 365 days.', icon: 'calendar-check', category: 'Fixed Income' },
        { id: 'wacc', title: 'WACC', description: 'Calculate the weighted average cost of capital for a firm\'s financing.', icon: 'scale', category: 'Corporate' },
        { id: 'dupont', title: 'Dupont Analysis', description: 'Decompose ROE into profit margin, asset turnover, and equity multiplier.', icon: 'pyramid', category: 'Corporate' },
        { id: 'financial-ratios', title: 'Financial Ratios', description: 'A comprehensive suite of ratios for liquidity, solvency, and valuation.', icon: 'clipboard-list', category: 'Corporate' },
        { id: 'irr', title: 'Internal Rate of Return', description: 'Calculate the profitability of a series of cash flows (IRR).', icon: 'zap', category: 'Analysis' },
        { id: 'roi', title: 'ROI', description: 'Simple return on investment calculation for basic profitability analysis.', icon: 'trending-up', category: 'Analysis' },
        { id: 'portfolio-return', title: 'Portfolio Return', description: 'Calculate the weighted average return of an investment portfolio.', icon: 'scale', category: 'Analysis' },
        { id: 'portfolio-risk', title: 'Portfolio Risk', description: 'Measure the total risk (volatility) of a two-asset portfolio.', icon: 'scatter-chart', category: 'Stats' },
    ]);

    get calculatorsList() {
        return this.calculators.asReadonly();
    }

    getById(id: string) {
        return this.calculators().find((c) => c.id === id);
    }
}
