import { CalculatorConfig } from '../models';
import { calculateFutureValue } from '@core/math/investment.utils';

export const CONFIG: CalculatorConfig = {
    id: 'future-value',
    title: 'Future Value',
    subtitle: 'Define your starting capital and growth expectations',
    description: 'Calculate the value of an investment at a future date based on a fixed interest rate.',
    icon: 'trending-up',
    category: 'TVM',
    fields: [
        { key: 'pv', label: 'Present Value (PV)', type: 'number', defaultValue: 1000, prefix: '$', required: true, min: 0 },
        { key: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 5, suffix: '%', required: true, min: 0 },
        { key: 'periods', label: 'Investment Period (Years)', type: 'number', defaultValue: 10, required: true, min: 1 },
    ],
    results: [
        {
            label: 'Total Estimated Value',
            type: 'currency',
            themeColor: 'emerald',
            calculate: (d) => calculateFutureValue({
                pv: d['pv'] as number,
                rate: (d['rate'] as number) / 100,
                periods: d['periods'] as number
            })
        }
    ],
    insights: 'The **Time Value of Money (TVM)** principle states that money available now is worth more than the same amount in the future due to its potential earning capacity.',
    formula: 'FV = PV * (1 + r)^n'
};
