import { CalculatorConfig } from '../models';
import { calculateEffectiveAnnualReturn } from '@core/math/investment.utils';

export const EAR_CONFIG: CalculatorConfig = {
    id: 'ear',
    title: 'Effective Annual Rate',
    subtitle: 'Impact of compounding',
    description: 'Calculate the actual interest rate earned or paid on an investment after accounting for compounding frequency.',
    icon: 'refresh-cw',
    category: 'TVM',
    fields: [
        { key: 'rate', label: 'Nominal Annual Rate (%)', type: 'number', defaultValue: 5, suffix: '%', required: true },
        { key: 'periods', label: 'Compounding Periods per Year', type: 'number', defaultValue: 12, required: true, min: 1 },
    ],
    results: [
        {
            label: 'Effective Annual Rate (EAR)',
            type: 'percent',
            themeColor: 'emerald',
            calculate: (d) => calculateEffectiveAnnualReturn({ 
                rate: (d['rate'] as number) / 100, 
                periods: d['periods'] as number 
            })
        }
    ],
    insights: 'The more frequent the compounding periods, the higher the effective annual rate. This is why daily compounding is better for savers than annual compounding.',
    formula: 'EAR = (1 + r/n)^n - 1'
};
