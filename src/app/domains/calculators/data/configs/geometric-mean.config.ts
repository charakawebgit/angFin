import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const GEOMETRIC_MEAN_CONFIG: CalculatorConfig = {
    id: 'geometric-mean',
    title: 'Geometric Mean',
    subtitle: 'Time-weighted average return',
    description: 'Calculate the average rate of return for a set of values that are multiplied together.',
    icon: 'sigma',
    category: 'Statistics',
    fields: [
        { key: 'returns', label: 'Periodic Returns (%)', type: 'list', defaultValue: [10, 20, -10, 5], required: true },
    ],
    results: [
        {
            label: 'Geometric Mean Return',
            type: 'percent',
            themeColor: 'emerald',
            calculate: (d) => financialService.calculateGeometricMean({
                returns: d.returns.map((v: any) => Number(v) / 100)
            })
        }
    ],
    insights: 'Geometric mean is superior to arithmetic mean for investment returns because it accounts for compounding effects.',
    formula: 'G = [∏(1 + ri)]^{1/n} - 1'
};
