import { CalculatorConfig } from '../model/types';
import { calculateNpv } from '@shared/lib/math/investment.utils';

export const CONFIG: CalculatorConfig = {
    id: 'npv',
    title: 'Net Present Value',
    subtitle: 'Assess investment profitability',
    description: 'Calculate the sum of the present values of incoming and outgoing cash flows over a period of time.',
    icon: 'circle-dollar-sign',
    category: 'Analysis',
    fields: [
        { key: 'initialInvestment', label: 'Initial Investment', type: 'number', defaultValue: 1000, prefix: '$', required: true, min: 0 },
        { key: 'cashFlows', label: 'Future Cash Flows (T1, T2...)', type: 'list', defaultValue: [300, 400, 500], required: true },
        { key: 'discountRate', label: 'Annual Discount Rate (%)', type: 'number', defaultValue: 10, suffix: '%', required: true, min: 0 },
    ],
    results: [
        {
            label: 'Net Present Value (NPV)',
            type: 'currency',
            themeColor: 'emerald',
            calculate: (d) => calculateNpv({
                initialInvestment: d['initialInvestment'] as number,
                cashFlows: (d['cashFlows'] as number[] || []).map(Number),
                discountRate: (d['discountRate'] as number) / 100
            })
        }
    ],
    insights: 'A positive NPV indicates that the projected earnings (in present dollars) exceed the anticipated costs (also in present dollars).',
    formula: 'NPV = ∑ [CFt / (1 + r)^t] - C0'
};
