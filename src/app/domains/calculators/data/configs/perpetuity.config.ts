import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const PERPETUITY_CONFIG: CalculatorConfig = {
    id: 'perpetuity',
    title: 'Perpetuity',
    subtitle: 'Define the infinite payment stream and rate',
    description: 'Calculate the present value of an infinite stream of equal cash flows.',
    icon: 'shield-check',
    category: 'TVM',
    fields: [
        { key: 'pmt', label: 'Periodic Payment', type: 'number', defaultValue: 100, prefix: '$', required: true, min: 0 },
        { key: 'rate', label: 'Discount Rate (%)', type: 'number', defaultValue: 5, suffix: '%', required: true, min: 0.0001 },
    ],
    results: [
        {
            calculate: (d) => financialService.calculatePerpetuity({ pmt: d['pmt'], rate: d['rate'] / 100 }),
            label: 'Total Present Value',
            type: 'currency',
            themeColor: 'emerald'
        }
    ],
    insights: 'A **Perpetuity** is an infinite series of equal payments made at regular intervals.',
    formula: 'PV = Payment / Rate'
};
