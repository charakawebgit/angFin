import { CalculatorConfig } from '../model/types';
import { calculateHoldingPeriodReturn } from '@shared/lib/math/investment.utils';

const CONFIG: CalculatorConfig = {
    id: 'hpr',
    title: 'Holding Period Return',
    subtitle: 'Total return over a period',
    description: 'Calculate the total return on an investment for the entire period it was held.',
    icon: 'calendar-days',
    category: 'Returns',
    fields: [
        { key: 'beginningValue', label: 'Beginning Value', type: 'number', defaultValue: 1000, prefix: '$', required: true },
        { key: 'endingValue', label: 'Ending Value', type: 'number', defaultValue: 1100, prefix: '$', required: true },
    ],
    results: [
        {
            label: 'Holding Period Return (HPR)',
            type: 'percent',
            themeColor: 'emerald',
            calculate: (d) => calculateHoldingPeriodReturn({
                beginningValue: d['beginningValue'] as number,
                endingValue: d['endingValue'] as number
            })
        }
    ],
    insights: 'HPR is the simplest measure of investment performance, representing the total percentage growth/decline over a specific holding period.',
    formula: 'HPR = (Ending Value - Beginning Value) / Beginning Value'
};

export default CONFIG;
