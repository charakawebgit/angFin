import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const CV_CONFIG: CalculatorConfig = {
    id: 'cv',
    title: 'Coeff. of Variation',
    subtitle: 'Relative measure of dispersion',
    description: 'Calculate the ratio of the standard deviation to the mean to compare variability across different scales.',
    icon: 'divide',
    category: 'Statistics',
    fields: [
        { key: 'values', label: 'Data Points', type: 'list', defaultValue: [10, 20, 30], required: true },
    ],
    results: [
        {
            label: 'Coefficient of Variation',
            type: 'number',
            themeColor: 'indigo',
            calculate: (d) => financialService.calculateCoefficientOfVariation({ values: d['values'].map(Number) })
        }
    ],
    insights: 'CV is used to compare the degree of variation from one data series to another, even if their means are drastically different.',
    formula: 'CV = (s / x̄) * 100'
};
