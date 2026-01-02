import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const IRR_CONFIG: CalculatorConfig = {
    id: 'irr',
    title: 'Internal Rate of Return',
    subtitle: 'Analyze investment profitability over time',
    description: 'Calculate the rate of return at which the net present value of cash flows equals zero.',
    icon: 'activity',
    category: 'Analysis',
    fields: [
        { key: 'cashFlows', label: 'Periodic Cash Flows', type: 'list', defaultValue: [-10000, 3000, 4200, 5800], required: true },
    ],
    results: [
        {
            label: 'Annualized Return (IRR)',
            type: 'percent',
            calculate: (d) => financialService.calculateIrr({ cashFlows: d['cashFlows'].map(Number) })
        }
    ],
    insights: 'The **IRR** is a critical metric for capital budgeting. It represents the efficiency of an investment by finding the discount rate that makes NPV zero.',
    formula: '0 = ∑ [CFt / (1 + IRR)^t]'
};
