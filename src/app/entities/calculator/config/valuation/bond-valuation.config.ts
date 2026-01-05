import { CalculatorConfig } from '../../model/types';
import { calculateBondPrice } from '@entities/finance/lib/fixed-income.utils';

const CONFIG: CalculatorConfig = {
    id: 'bond-valuation',
    title: 'Bond Valuation',
    subtitle: 'Intrinsic value of a bond',
    description: 'Calculate the present value of a bond based on its future coupon payments and face value.',
    icon: 'badge-dollar-sign',
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
            label: 'Estimated Bond Price',
            type: 'currency',
            themeColor: 'emerald',
            calculate: (d) => calculateBondPrice({
                faceValue: d['faceValue'] as number,
                couponRate: (d['couponRate'] as number) / 100,
                marketRate: (d['marketRate'] as number) / 100,
                years: d['years'] as number,
                frequency: d['frequency'] as number
            })
        }
    ],
    insights: 'When the market interest rate is lower than the coupon rate, the bond sells at a premium. When it is higher, the bond sells at a discount.',
    formula: 'V0 = ∑ [C / (1 + r)^t] + [F / (1 + r)^n]'
};

export default CONFIG;
