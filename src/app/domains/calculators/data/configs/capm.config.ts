import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const CAPM_CONFIG: CalculatorConfig = {
    id: 'capm',
    title: 'CAPM',
    subtitle: 'Market Equilibrium valuation',
    description: 'Calculate the expected return of an asset based on its risk relative to the market.',
    icon: 'target',
    category: 'Analysis',
    fields: [
        { key: 'riskFreeRate', label: 'Risk-Free Rate (%)', type: 'number', defaultValue: 2, suffix: '%', required: true },
        { key: 'marketReturn', label: 'Expected Market Return (%)', type: 'number', defaultValue: 8, suffix: '%', required: true },
        { key: 'beta', label: 'Asset Beta (β)', type: 'number', defaultValue: 1.2, required: true },
    ],
    results: [
        {
            label: 'Required Return',
            type: 'percent',
            themeColor: 'rose',
            calculate: (d) => financialService.calculateCapm({
                riskFreeRate: d.riskFreeRate / 100,
                marketReturn: d.marketReturn / 100,
                beta: d.beta
            })
        }
    ],
    insights: 'The **Capital Asset Pricing Model (CAPM)** describes the relationship between systematic risk and expected return for assets, particularly stocks.',
    formula: 'E(Ri) = Rf + β * (Rm - Rf)'
};
