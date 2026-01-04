import { CalculatorConfig } from '../model/types';
import { calculatePerpetuity } from '@shared/lib/math/investment.utils';

export const CONFIG: CalculatorConfig = {
    id: 'perpetuity',
    title: 'Perpetuity',
    subtitle: 'Infinite stream of payments',
    description: 'Calculate the present value of a constant stream of cash flows that continues forever.',
    icon: 'infinity',
    category: 'TVM',
    fields: [
        { key: 'pmt', label: 'Periodic Payment', type: 'number', defaultValue: 100, prefix: '$', required: true },
        { key: 'rate', label: 'Discount Rate (%)', type: 'number', defaultValue: 5, suffix: '%', required: true },
    ],
    results: [
        {
            label: 'Present Value of Perpetuity',
            type: 'currency',
            themeColor: 'indigo',
            calculate: (d) => calculatePerpetuity({
                pmt: d['pmt'] as number,
                rate: (d['rate'] as number) / 100
            })
        }
    ],
    insights: 'A perpetuity is an annuity that has no end, or a stream of cash payments that continues forever.',
    formula: 'PV = PMT / r'
};
