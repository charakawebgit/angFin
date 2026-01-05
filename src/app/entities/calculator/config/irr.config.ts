import { CalculatorConfig } from '../model/types';
import { calculateIrr } from '@shared/lib/math/investment.utils';

const CONFIG: CalculatorConfig = {
    id: 'irr',
    title: 'Internal Rate of Return',
    subtitle: 'Find the break-even discount rate',
    description: 'Calculate the discount rate that makes the net present value of all cash flows equal to zero.',
    icon: 'percent',
    category: 'Analysis',
    fields: [
        { key: 'cashFlows', label: 'Cash Flows (Initial, T1, T2...)', type: 'list', defaultValue: [-1000, 300, 400, 500], required: true },
    ],
    results: [
        {
            label: 'Internal Rate of Return (IRR)',
            type: 'percent',
            themeColor: 'emerald',
            calculate: (d) => calculateIrr({
                cashFlows: (d['cashFlows'] as number[] || []).map(Number)
            })
        }
    ],
    insights: 'IRR is a key metric for capital budgeting. A project is generally considered acceptable if its IRR is higher than the company\'s cost of capital.',
    formula: '0 = ∑ [CFt / (1 + IRR)^t]'
};

export default CONFIG;
