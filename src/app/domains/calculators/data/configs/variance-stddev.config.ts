import { CalculatorConfig } from '../models';
import { calculateStandardDeviation, calculateSampleVariance } from '@core/math/stats.utils';

export const CONFIG: CalculatorConfig = {
    id: 'variance-stddev',
    title: 'Variance & Std Dev',
    subtitle: 'Measures of dispersion',
    description: 'Calculate standard deviation and variance for a sample dataset to measure its spread.',
    icon: 'binary',
    category: 'Statistics',
    fields: [
        { key: 'values', label: 'Data Points', type: 'list', defaultValue: [10, 12, 15, 18, 20], required: true },
    ],
    results: [
        {
            label: 'Standard Deviation (Sample)',
            type: 'number',
            themeColor: 'sky',
            calculate: (d) => calculateStandardDeviation({
                values: (d['values'] as number[] || []).map(Number)
            })
        },
        {
            label: 'Variance (Sample)',
            type: 'number',
            calculate: (d) => calculateSampleVariance({
                values: (d['values'] as number[] || []).map(Number)
            })
        }
    ],
    insights: 'Standard deviation is the square root of variance. It is used to quantify the amount of variation or dispersion of a set of data values.',
    formula: 's² = ∑(xi - x̄)² / (n - 1)'
};
