import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const MAD_CONFIG: CalculatorConfig = {
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
            calculate: (d) => financialService.calculateMeanAbsoluteDeviation({ values: d['values'].map(Number) })
        }
    ],
    insights: 'MAD provides a measure of variability in a dataset that is less sensitive to outliers than standard deviation.',
    formula: 'MAD = [∑|xi - x̄|] / n'
};
