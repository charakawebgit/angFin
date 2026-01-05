import { CalculatorConfig } from '../model/types';
import { calculatePortfolioReturn } from '@shared/lib/math/investment.utils';

const CONFIG: CalculatorConfig = {
    id: 'portfolio-return',
    title: 'Portfolio Return',
    subtitle: 'Weighted average return',
    description: 'Calculate the overall return of a portfolio based on the weights and returns of individual assets.',
    icon: 'briefcase',
    category: 'Portfolio',
    fields: [
        { key: 'weights', label: 'Asset Weights (%)', type: 'list', defaultValue: [40, 60], required: true },
        { key: 'returns', label: 'Asset Returns (%)', type: 'list', defaultValue: [8, 12], required: true },
    ],
    results: [
        {
            label: 'Total Portfolio Return',
            type: 'percent',
            themeColor: 'sky',
            calculate: (d) => calculatePortfolioReturn({
                weights: (d['weights'] as number[] || []).map((v) => Number(v) / 100),
                returns: (d['returns'] as number[] || []).map((v) => Number(v) / 100)
            })
        }
    ],
    insights: 'The return of a portfolio is the weighted average of the returns of its components. Rebalancing is necessary to maintain target weights.',
    formula: 'Rp = ∑ (wi * Ri)'
};

export default CONFIG;
