import { CalculatorConfig } from '../../model/types';
import { calculateMeanAbsoluteDeviation } from '@entities/finance/lib/stats.utils';

const CONFIG: CalculatorConfig = {
    id: 'mad',
    title: 'Mean Absolute Deviation',
    subtitle: 'Average distance from mean',
    description: 'Calculate the average of the absolute differences between each data point and the mean.',
    icon: 'hash',
    category: 'Statistics',
    fields: [
        { key: 'values', label: 'Data Points', type: 'list', defaultValue: [10, 15, 20], required: true },
    ],
    results: [
        {
            label: 'MAD',
            type: 'number',
            themeColor: 'amber',
            calculate: (d) => calculateMeanAbsoluteDeviation({
                values: (d['values'] as number[] || []).map(Number)
            })
        }
    ],
    insights: 'MAD provides a measure of variability in a dataset that is less sensitive to outliers than standard deviation.',
    formula: 'MAD = [∑|xi - x̄|] / n'
};

export default CONFIG;
