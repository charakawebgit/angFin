import { CalculatorConfig } from '../models';
import { calculateCapRate } from '@core/math/amortization.utils';

export const CONFIG: CalculatorConfig = {
    id: 'cap-rate',
    title: 'Cap Rate',
    subtitle: 'Real estate investment metric',
    description: 'Calculate the capitalization rate of a property to estimate its potential return.',
    icon: 'home',
    category: 'Real Estate',
    fields: [
        { key: 'noi', label: 'Net Operating Income (NOI)', type: 'number', defaultValue: 50000, prefix: '$', required: true },
        { key: 'propertyValue', label: 'Current Property Value', type: 'number', defaultValue: 750000, prefix: '$', required: true },
    ],
    results: [
        {
            label: 'Capitalization Rate',
            type: 'percent',
            themeColor: 'sky',
            calculate: (d) => calculateCapRate({
                noi: d['noi'] as number,
                propertyValue: d['propertyValue'] as number
            })
        }
    ],
    insights: 'The cap rate provides a quick way to compare different real estate investments, but does not account for financing or property appreciation.',
    formula: 'Cap Rate = NOI / Property Value'
};
