import { CalculatorConfig } from '../model/types';
import { calculateYtm } from '@shared/lib/math/fixed-income.utils';

const CONFIG: CalculatorConfig = {
    id: 'ytm',
    title: 'Bond YTM',
    subtitle: 'Yield to Maturity',
    description: 'Calculate the total return anticipated on a bond if it is held until it matures.',
    icon: 'trending-up',
    category: 'Fixed Income',
    fields: [
        { key: 'currentPrice', label: 'Current Bond Price', type: 'number', defaultValue: 950, prefix: '$', required: true },
        { key: 'faceValue', label: 'Face Value', type: 'number', defaultValue: 1000, prefix: '$', required: true },
        { key: 'couponRate', label: 'Annual Coupon Rate (%)', type: 'number', defaultValue: 5, suffix: '%', required: true },
        { key: 'years', label: 'Years to Maturity', type: 'number', defaultValue: 10, required: true },
        { key: 'frequency', label: 'Payments per Year', type: 'number', defaultValue: 2, required: true, min: 1 },
    ],
    results: [
        {
            label: 'Yield to Maturity',
            type: 'percent',
            themeColor: 'amber',
            calculate: (d) => calculateYtm({
                currentPrice: d['currentPrice'] as number,
                faceValue: d['faceValue'] as number,
                couponRate: (d['couponRate'] as number) / 100,
                years: d['years'] as number,
                frequency: d['frequency'] as number
            })
        }
    ],
    insights: 'YTM is a comprehensive measure of return that includes interest income plus/minus any capital gain/loss at maturity.',
    formula: 'Approximation: C + (F-P)/n / (F+P)/2'
};

export default CONFIG;
