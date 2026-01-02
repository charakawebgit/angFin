import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const SKEW_KURT_CONFIG: CalculatorConfig = {
    id: 'skew-kurt',
    title: 'Skewness & Kurtosis',
    subtitle: 'Shape of distribution',
    description: 'Measure the asymmetry (skewness) and "tailedness" (kurtosis) of your data distribution.',
    icon: 'waves',
    category: 'Statistics',
    fields: [
        { key: 'values', label: 'Data Points', type: 'list', defaultValue: [10, 12, 12, 13, 20, 25], required: true },
    ],
    results: [
        {
            label: 'Sample Skewness',
            type: 'number',
            themeColor: 'sky',
            calculate: (d) => financialService.calculateSampleSkewness({ values: d['values'].map(Number) })
        },
        {
            label: 'Excess Kurtosis',
            type: 'number',
            calculate: (d) => financialService.calculateExcessKurtosis({ values: d['values'].map(Number) })
        }
    ],
    insights: 'Skewness indicates if the data is biased to one side. Kurtosis indicates if the data has heavy tails or is peaked.',
    formula: 'Skew = [n / (n-1)(n-2)] * ∑[(xi - x̄)/s]³'
};
