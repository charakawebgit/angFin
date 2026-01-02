import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const WACC_CONFIG: CalculatorConfig = {
    id: 'wacc',
    title: 'WACC',
    subtitle: 'Weighted Average Cost of Capital',
    description: "Calculate a firm's average cost of capital after balancing debt and equity proportions.",
    icon: 'pie-chart',
    category: 'Equity',
    fields: [
        { key: 'equityValue', label: 'Market Value of Equity', type: 'number', defaultValue: 600000, prefix: '$', required: true },
        { key: 'debtValue', label: 'Market Value of Debt', type: 'number', defaultValue: 400000, prefix: '$', required: true },
        { key: 'costOfEquity', label: 'Cost of Equity (%)', type: 'number', defaultValue: 10, suffix: '%', required: true },
        { key: 'costOfDebt', label: 'Pre-tax Cost of Debt (%)', type: 'number', defaultValue: 5, suffix: '%', required: true },
        { key: 'taxRate', label: 'Corporate Tax Rate (%)', type: 'number', defaultValue: 25, suffix: '%', required: true },
    ],
    results: [
        {
            label: 'Calculated WACC',
            type: 'percent',
            themeColor: 'rose',
            calculate: (d) => financialService.calculateWacc({
                equityValue: d['equityValue'],
                debtValue: d['debtValue'],
                costOfEquity: d['costOfEquity'] / 100,
                costOfDebt: d['costOfDebt'] / 100,
                taxRate: d['taxRate'] / 100
            })
        }
    ],
    insights: "WACC represents the minimum return a company must earn on its existing asset base to satisfy its creditors, owners, and other providers of capital.",
    formula: 'WACC = (E/V * Re) + (D/V * Rd * (1-T))'
};
