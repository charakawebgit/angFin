import { CalculatorConfig } from '../model/types';
import { calculateSampleSkewness, calculateExcessKurtosis } from '@entities/finance/lib/stats.utils';

const CONFIG: CalculatorConfig = {
    id: 'skew-kurt',
    title: 'Skewness & Kurtosis',
    subtitle: 'Shape of distribution',
    description: 'Calculate the skewness and excess kurtosis of a dataset to understand its distribution shape.',
    icon: 'bar-chart',
    category: 'Statistics',
    fields: [
        { key: 'values', label: 'Data Points', type: 'list', defaultValue: [10, 12, 11, 14, 20, 15, 13], required: true },
    ],
    results: [
        {
            label: 'Sample Skewness',
            type: 'number',
            themeColor: 'sky',
            calculate: (d) => calculateSampleSkewness({
                values: (d['values'] as number[] || []).map(Number)
            })
        },
        {
            label: 'Excess Kurtosis',
            type: 'number',
            calculate: (d) => calculateExcessKurtosis({
                values: (d['values'] as number[] || []).map(Number)
            })
        }
    ],
    insights: 'Skewness indicates if the data is biased to one side. Kurtosis indicates if the data has heavy tails or is peaked.',
    formula: 'Skew = [n/(n-1)(n-2)] * ∑[(xi-x̄)/s]³, Kurt = [n(n+1)/(n-1)(n-2)(n-3)] * ∑[(xi-x̄)/s]⁴ - [3(n-1)²/(n-2)(n-3)]'
};

export default CONFIG;
