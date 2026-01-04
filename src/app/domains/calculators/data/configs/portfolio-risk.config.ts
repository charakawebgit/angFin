import { CalculatorConfig } from '../models';
import { calculateTwoAssetPortfolioStdDev } from '@core/math/investment.utils';

export const PORTFOLIO_RISK_CONFIG: CalculatorConfig = {
    id: 'portfolio-risk',
    title: 'Portfolio Risk',
    subtitle: 'Two-asset portfolio variance',
    description: 'Calculate the risk (standard deviation) of a two-asset portfolio considering their correlation.',
    icon: 'shield-alert',
    category: 'Portfolio',
    fields: [
        { key: 'w1', label: 'Weight Asset 1 (%)', type: 'number', defaultValue: 50, suffix: '%', required: true },
        { key: 's1', label: 'Std Dev Asset 1 (%)', type: 'number', defaultValue: 15, suffix: '%', required: true },
        { key: 'w2', label: 'Weight Asset 2 (%)', type: 'number', defaultValue: 50, suffix: '%', required: true },
        { key: 's2', label: 'Std Dev Asset 2 (%)', type: 'number', defaultValue: 20, suffix: '%', required: true },
        { key: 'corr', label: 'Correlation (ρ)', type: 'number', defaultValue: 0.5, required: true, min: -1, max: 1 },
    ],
    results: [
        {
            label: 'Portfolio Risk (Std Dev)',
            type: 'percent',
            themeColor: 'rose',
            calculate: (d) => calculateTwoAssetPortfolioStdDev({
                w1: (d['w1'] as number) / 100,
                s1: (d['s1'] as number) / 100,
                w2: (d['w2'] as number) / 100,
                s2: (d['s2'] as number) / 100,
                corr: d['corr'] as number
            })
        }
    ],
    insights: 'Diversification reduces total portfolio risk by combining assets that are not perfectly positively correlated.',
    formula: 'σp = √[w1²σ1² + w2²σ2² + 2w1w2σ1σ2ρ12]'
};
