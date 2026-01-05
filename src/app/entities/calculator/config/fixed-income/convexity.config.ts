import { CalculatorConfig } from '../model/types';
import { calculateConvexity } from '@entities/finance/lib/fixed-income.utils';

const CONFIG: CalculatorConfig = {
    id: 'convexity',
    title: 'Bond Convexity',
    subtitle: 'Curvature of the price-yield curve',
    description: 'Calculate bond convexity to improve the accuracy of price change estimates during large yield shifts.',
    icon: 'trending-up',
    category: 'Fixed Income',
    fields: [
        { key: 'faceValue', label: 'Face Value', type: 'number', defaultValue: 1000, prefix: '$', required: true },
        { key: 'couponRate', label: 'Annual Coupon Rate (%)', type: 'number', defaultValue: 5, suffix: '%', required: true },
        { key: 'marketRate', label: 'Required Market Rate (%)', type: 'number', defaultValue: 4, suffix: '%', required: true },
        { key: 'years', label: 'Years to Maturity', type: 'number', defaultValue: 10, required: true },
        { key: 'frequency', label: 'Payments per Year', type: 'number', defaultValue: 2, required: true },
    ],
    results: [
        {
            label: 'Bond Convexity',
            type: 'number',
            themeColor: 'emerald',
            calculate: (d) => calculateConvexity({
                faceValue: d['faceValue'] as number,
                couponRate: (d['couponRate'] as number) / 100,
                marketRate: (d['marketRate'] as number) / 100,
                years: d['years'] as number,
                frequency: d['frequency'] as number
            })
        }
    ],
    insights: 'Convexity is a measure of the curvature in the relationship between bond prices and bond yields. Most bonds have positive convexity.',
    formula: 'C = [∑ (t*(t+1)*CFt/(1+r)^t)] / [P * (1+r)^2 * m^2]'
};

export default CONFIG;
