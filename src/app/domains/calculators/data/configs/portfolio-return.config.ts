import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const PORTFOLIO_RETURN_CONFIG: CalculatorConfig = {
    id: 'portfolio-return',
    title: 'Portfolio Return',
    subtitle: 'Weighted average return of assets',
    description: 'Calculate the expected return of a portfolio based on the weights and individual returns of its assets.',
    icon: 'briefcase',
    category: 'Portfolio',
    fields: [
        { key: 'weights', label: 'Asset Weights (%)', type: 'list', defaultValue: [40, 60], required: true },
        { key: 'returns', label: 'Asset Returns (%)', type: 'list', defaultValue: [8, 12], required: true },
    ],
    results: [
        {
            label: 'Portfolio Expected Return',
            type: 'percent',
            themeColor: 'sky',
            calculate: (d) => financialService.calculatePortfolioReturn({
                weights: d['weights'].map((v: any) => Number(v) / 100),
                returns: d['returns'].map((v: any) => Number(v) / 100)
            })
        }
    ],
    insights: 'The return of a portfolio is the weighted average of the returns of its individual components.',
    formula: 'Rp = ∑ (wi * Ri)'
};
