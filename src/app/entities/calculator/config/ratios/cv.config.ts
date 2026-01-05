import { CalculatorConfig } from '../../model/types';
import { calculateCoefficientOfVariation } from '@entities/finance/lib/stats.utils';

const CONFIG: CalculatorConfig = {
    id: 'cv',
    title: 'Coefficient of Variation',
    subtitle: 'Relative risk measure',
    description: 'Calculate the ratio of the standard deviation to the mean to compare relative variability.',
    icon: 'percent',
    category: 'Statistics',
    fields: [
        { key: 'values', label: 'Data Points', type: 'list', defaultValue: [100, 150, 200], required: true },
    ],
    results: [
        {
            label: 'Coefficient of Variation',
            type: 'number',
            themeColor: 'indigo',
            calculate: (d) => calculateCoefficientOfVariation({
                values: (d['values'] as number[] || []).map(Number)
            })
        }
    ],
    insights: 'CV is used to compare the degree of variation from one data series to another, even if their means are drastically different.',
    formula: 'CV = σ / μ'
};

export default CONFIG;
