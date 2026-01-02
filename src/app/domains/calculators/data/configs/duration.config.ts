import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const DURATION_CONFIG: CalculatorConfig = {
    id: 'duration',
    title: 'Bond Duration',
    subtitle: 'Measure of price sensitivity to rates',
    description: 'Calculate Macaulay and Modified duration to estimate bond price volatility.',
    icon: 'ruler',
    category: 'Fixed Income',
    fields: [
        { key: 'faceValue', label: 'Face Value', type: 'number', defaultValue: 1000, prefix: '$', required: true },
        { key: 'couponRate', label: 'Coupon Rate (%)', type: 'number', defaultValue: 5, suffix: '%', required: true },
        { key: 'marketRate', label: 'Market Rate (%)', type: 'number', defaultValue: 4, suffix: '%', required: true },
        { key: 'years', label: 'Years to Maturity', type: 'number', defaultValue: 10, required: true },
        { key: 'frequency', label: 'Payments per Year', type: 'number', defaultValue: 2, required: true },
    ],
    results: [
        {
            label: 'Modified Duration',
            type: 'number',
            themeColor: 'sky',
            calculate: (d) => financialService.calculateDuration({
                faceValue: d.faceValue,
                couponRate: d.couponRate / 100,
                marketRate: d.marketRate / 100,
                years: d.years,
                frequency: d.frequency
            }).modified
        },
        {
            label: 'Macaulay Duration',
            type: 'number',
            calculate: (d) => financialService.calculateDuration({
                faceValue: d.faceValue,
                couponRate: d.couponRate / 100,
                marketRate: d.marketRate / 100,
                years: d.years,
                frequency: d.frequency
            }).macaulay
        }
    ],
    insights: 'Duration measures the weighted average time until payment. Modified duration estimates the percentage change in price for a 1% change in yield.',
    formula: 'ModD = MacD / (1 + y/m)'
};
