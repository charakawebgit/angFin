import { CalculatorConfig } from '../model/types';
import { calculatePresentValue } from '@shared/lib/math/investment.utils';

const CONFIG: CalculatorConfig = {
    id: 'present-value',
    title: 'Present Value',
    subtitle: 'Specify future cash flow and discounting rate',
    description: 'Determine the current value of a sum of money to be received in the future.',
    icon: 'hourglass',
    category: 'TVM',
    fields: [
        { key: 'fv', label: 'Future Value (FV)', type: 'number', defaultValue: 1000, prefix: '$', required: true, min: 0 },
        { key: 'rate', label: 'Discount Rate per Period (%)', type: 'number', defaultValue: 5, suffix: '%', required: true, min: 0 },
        { key: 'periods', label: 'Number of Periods', type: 'number', defaultValue: 10, required: true, min: 1 },
    ],
    results: [
        {
            label: 'Current Valuation',
            type: 'currency',
            calculate: (d) => calculatePresentValue({
                fv: d['fv'] as number,
                rate: (d['rate'] as number) / 100,
                periods: d['periods'] as number
            })
        }
    ],
    insights: '**Present Value (PV)** represents the current value of a future sum of money or stream of cash flows given a specified rate of return.',
    formula: 'PV = FV / (1 + r)^n'
};

export default CONFIG;
