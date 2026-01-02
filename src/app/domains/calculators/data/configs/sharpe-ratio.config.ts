import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const SHARPE_RATIO_CONFIG: CalculatorConfig = {
    id: 'sharpe-ratio',
    title: 'Sharpe Ratio',
    subtitle: 'Risk-adjusted return metric',
    description: 'Measure the performance of an investment compared to a risk-free asset, after adjusting for its risk.',
    icon: 'award',
    category: 'Analysis',
    fields: [
        { key: 'portfolioReturn', label: 'Portfolio Return (%)', type: 'number', defaultValue: 12, suffix: '%', required: true },
        { key: 'riskFreeRate', label: 'Risk-Free Rate (%)', type: 'number', defaultValue: 3, suffix: '%', required: true },
        { key: 'stdDev', label: 'Standard Deviation (%)', type: 'number', defaultValue: 15, suffix: '%', required: true, min: 0.001 },
    ],
    results: [
        {
            label: 'Sharpe Ratio',
            type: 'number',
            themeColor: 'amber',
            calculate: (d) => financialService.calculateSharpeRatio({
                portfolioReturn: d.portfolioReturn / 100,
                riskFreeRate: d.riskFreeRate / 100,
                stdDev: d.stdDev / 100
            })
        }
    ],
    insights: 'A higher Sharpe ratio indicates better risk-adjusted performance. A ratio above 1.0 is considered good.',
    formula: 'Sharpe = (Rp - Rf) / σp'
};
