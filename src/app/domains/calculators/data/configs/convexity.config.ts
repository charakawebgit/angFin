import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const CONVEXITY_CONFIG: CalculatorConfig = {
    id: 'convexity',
    title: 'Bond Convexity',
    subtitle: 'Measure of the curve in bond prices',
    description: 'Calculate bond convexity to improve the accuracy of price change estimates for larger interest rate shifts.',
    icon: 'trending-down',
    category: 'Fixed Income',
    fields: [
        { key: 'faceValue', label: 'Face Value (Par)', type: 'number', defaultValue: 1000, prefix: '$', required: true },
        { key: 'couponRate', label: 'Annual Coupon Rate (%)', type: 'number', defaultValue: 5, suffix: '%', required: true },
        { key: 'marketRate', label: 'Market Rate (%)', type: 'number', defaultValue: 4, suffix: '%', required: true },
        { key: 'years', label: 'Years to Maturity', type: 'number', defaultValue: 10, required: true },
        { key: 'frequency', label: 'Payments per Year', type: 'number', defaultValue: 2, required: true },
    ],
    results: [
        {
            label: 'Bond Convexity',
            type: 'number',
            themeColor: 'emerald',
            calculate: (d) => financialService.calculateConvexity({
                faceValue: d.faceValue,
                couponRate: d.couponRate / 100,
                marketRate: d.marketRate / 100,
                years: d.years,
                frequency: d.frequency
            })
        }
    ],
    insights: 'Convexity is a measure of the sensitivity of the duration of a bond to changes in interest rates. Positive convexity means bond price increases faster than it decreases.',
    formula: 'CX = [∑ (t*(t+1)*CFt / (1+y)^(t+2))] / [P * m²]'
};
