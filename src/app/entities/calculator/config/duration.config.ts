import { CalculatorConfig } from '../model/types';
import { calculateDuration } from '@shared/lib/math/fixed-income.utils';

const CONFIG: CalculatorConfig = {
    id: 'duration',
    title: 'Bond Duration',
    subtitle: 'Interest rate sensitivity',
    description: 'Calculate Macaulay and Modified Duration to estimate how bond prices react to interest rate changes.',
    icon: 'activity',
    category: 'Fixed Income',
    fields: [
        { key: 'faceValue', label: 'Face Value', type: 'number', defaultValue: 1000, prefix: '$', required: true },
        { key: 'couponRate', label: 'Annual Coupon Rate (%)', type: 'number', defaultValue: 5, suffix: '%', required: true },
        { key: 'marketRate', label: 'Required Market Rate (%)', type: 'number', defaultValue: 4, suffix: '%', required: true },
        { key: 'years', label: 'Years to Maturity', type: 'number', defaultValue: 10, required: true },
        { key: 'frequency', label: 'Payments per Year', type: 'number', defaultValue: 2, required: true, min: 1 },
    ],
    results: [
        {
            label: 'Modified Duration',
            type: 'number',
            themeColor: 'sky',
            calculate: (d) => calculateDuration({
                faceValue: d['faceValue'] as number,
                couponRate: (d['couponRate'] as number) / 100,
                marketRate: (d['marketRate'] as number) / 100,
                years: d['years'] as number,
                frequency: d['frequency'] as number
            }).modified
        },
        {
            label: 'Macaulay Duration',
            type: 'number',
            calculate: (d) => calculateDuration({
                faceValue: d['faceValue'] as number,
                couponRate: (d['couponRate'] as number) / 100,
                marketRate: (d['marketRate'] as number) / 100,
                years: d['years'] as number,
                frequency: d['frequency'] as number
            }).macaulay
        }
    ],
    insights: 'Duration measures the sensitivity of a bond\'s price to interest rate movements. A higher duration means higher price volatility.',
    formula: 'Modified D = Macaulay D / (1 + r/m)'
};

export default CONFIG;
