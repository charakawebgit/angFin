import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const CAP_RATE_CONFIG: CalculatorConfig = {
    id: 'cap-rate',
    title: 'Cap Rate',
    subtitle: 'Real estate return metric',
    description: 'Calculate the expected rate of return on a real estate investment property.',
    icon: 'building',
    category: 'Real Estate',
    fields: [
        { key: 'noi', label: 'Net Operating Income (NOI)', type: 'number', defaultValue: 50000, prefix: '$', required: true },
        { key: 'propertyValue', label: 'Property Value', type: 'number', defaultValue: 1000000, prefix: '$', required: true, min: 1 },
    ],
    results: [
        {
            label: 'Estimated Cap Rate',
            type: 'percent',
            themeColor: 'sky',
            calculate: (d) => financialService.calculateCapRate({
                noi: d.noi,
                propertyValue: d.propertyValue
            })
        }
    ],
    insights: 'The **Capitalization Rate (Cap Rate)** is the ratio of Net Operating Income (NOI) to property asset value, used to compare different real estate investments.',
    formula: 'Cap Rate = NOI / Property Value'
};
