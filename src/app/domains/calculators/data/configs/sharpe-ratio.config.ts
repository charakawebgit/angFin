import { CalculatorConfig } from '../models';
import { calculateSharpeRatio } from '@core/math/investment.utils';

export const CONFIG: CalculatorConfig = {
    id: 'sharpe-ratio',
    title: 'Sharpe Ratio',
    subtitle: 'Risk-adjusted return',
    description: 'Measure the excess return per unit of deviation in an investment asset or a trading strategy.',
    icon: 'shantell-sans',
    category: 'Analysis',
    fields: [
        { key: 'portfolioReturn', label: 'Expected Return (%)', type: 'number', defaultValue: 12, suffix: '%', required: true },
        { key: 'riskFreeRate', label: 'Risk-Free Rate (%)', type: 'number', defaultValue: 2, suffix: '%', required: true },
        { key: 'stdDev', label: 'Standard Deviation (%)', type: 'number', defaultValue: 15, suffix: '%', required: true },
    ],
    results: [
        {
            label: 'Sharpe Ratio',
            type: 'number',
            themeColor: 'amber',
            calculate: (d) => calculateSharpeRatio({
                portfolioReturn: (d['portfolioReturn'] as number) / 100,
                riskFreeRate: (d['riskFreeRate'] as number) / 100,
                stdDev: (d['stdDev'] as number) / 100
            })
        }
    ],
    insights: 'The Sharpe ratio helps investors understand the return of an investment compared to its risk.',
    formula: 'S = (Rp - Rf) / σp'
};
