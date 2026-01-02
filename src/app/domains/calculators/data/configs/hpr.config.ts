import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const HPR_CONFIG: CalculatorConfig = {
    id: 'hpr',
    title: 'Holding Period Return',
    subtitle: 'Total return over a period',
    description: 'Calculate the total return on an asset or portfolio over the time it was held.',
    icon: 'clock',
    category: 'Returns',
    fields: [
        { key: 'beginningValue', label: 'Beginning Value', type: 'number', defaultValue: 1000, prefix: '$', required: true },
        { key: 'endingValue', label: 'Ending Value (Incl. Dividends)', type: 'number', defaultValue: 1200, prefix: '$', required: true },
    ],
    results: [
        {
            label: 'Total HPR',
            type: 'percent',
            themeColor: 'emerald',
            calculate: (d) => financialService.calculateHoldingPeriodReturn({
                beginningValue: d['beginningValue'],
                endingValue: d['endingValue']
            })
        }
    ],
    insights: 'HPR is the simplest measure of return, representing the percentage increase in value from the start to the end of the holding period.',
    formula: 'HPR = (Ending Value - Beginning Value) / Beginning Value'
};
