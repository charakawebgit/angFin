import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const VARIANCE_STDDEV_CONFIG: CalculatorConfig = {
    id: 'variance-stddev',
    title: 'Variance & Std Dev',
    subtitle: 'Measure of dispersion',
    description: 'Calculate how spread out your data values are from the mean.',
    icon: 'bar-chart',
    category: 'Statistics',
    fields: [
        { key: 'values', label: 'Data Points', type: 'list', defaultValue: [10, 12, 23, 23, 16, 23], required: true },
    ],
    results: [
        {
            label: 'Standard Deviation (Sample)',
            type: 'number',
            themeColor: 'sky',
            calculate: (d) => financialService.calculateStandardDeviation({ values: d['values'].map(Number) })
        },
        {
            label: 'Variance (Sample)',
            type: 'number',
            calculate: (d) => financialService.calculateSampleVariance({ values: d['values'].map(Number) })
        }
    ],
    insights: 'Standard deviation is the square root of variance. It is used to quantify the amount of variation or dispersion of a set of data values.',
    formula: 's = √[∑(xi - x̄)² / (n - 1)]'
};
