import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const EAR_CONFIG: CalculatorConfig = {
    id: 'ear',
    title: 'Effective Annual Return',
    subtitle: 'Actual yield after compounding',
    description: 'Find the actual annual interest rate when compounding occurs more than once a year.',
    icon: 'percent',
    category: 'Returns',
    fields: [
        { key: 'rate', label: 'Nominal Annual Rate (%)', type: 'number', defaultValue: 5, suffix: '%', required: true, min: 0 },
        { key: 'periods', label: 'Compounding Periods per Year', type: 'number', defaultValue: 12, required: true, min: 1 },
    ],
    results: [
        {
            calculate: (d) => financialService.calculateEffectiveAnnualReturn({ rate: d['rate'] / 100, periods: d['periods'] }),
            label: 'Effective Annual Return',
            type: 'percent',
            themeColor: 'emerald'
        }
    ],
    insights: 'The **Effective Annual Return (EAR)** is the real return on a savings account or any interest-paying investment when compounding is considered.',
    formula: 'EAR = (1 + Nominal Rate / m)^m - 1'
};
