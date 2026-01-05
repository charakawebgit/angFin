import { CalculatorConfig } from '../model/types';
import { calculateWacc } from '@shared/lib/math/equity.utils';

const CONFIG: CalculatorConfig = {
    id: 'wacc',
    title: 'WACC',
    subtitle: 'Weighted Average Cost of Capital',
    description: 'Calculate the average rate that a company is expected to pay to finance its assets.',
    icon: 'landmark',
    category: 'Equity',
    fields: [
        { key: 'equityValue', label: 'Market Value of Equity', type: 'number', defaultValue: 1000000, prefix: '$', required: true },
        { key: 'debtValue', label: 'Market Value of Debt', type: 'number', defaultValue: 500000, prefix: '$', required: true },
        { key: 'costOfEquity', label: 'Cost of Equity (%)', type: 'number', defaultValue: 10, suffix: '%', required: true },
        { key: 'costOfDebt', label: 'Pre-tax Cost of Debt (%)', type: 'number', defaultValue: 6, suffix: '%', required: true },
        { key: 'taxRate', label: 'Corporate Tax Rate (%)', type: 'number', defaultValue: 25, suffix: '%', required: true },
    ],
    results: [
        {
            label: 'WACC',
            type: 'percent',
            themeColor: 'rose',
            calculate: (d) => calculateWacc({
                equityValue: d['equityValue'] as number,
                debtValue: d['debtValue'] as number,
                costOfEquity: (d['costOfEquity'] as number) / 100,
                costOfDebt: (d['costOfDebt'] as number) / 100,
                taxRate: (d['taxRate'] as number) / 100
            })
        }
    ],
    insights: 'WACC is the minimum return that a company must earn on an existing asset base to satisfy its creditors, owners, and other providers of capital.',
    formula: 'WACC = (E/V * Re) + (D/V * Rd * (1 - Tc))'
};

export default CONFIG;
