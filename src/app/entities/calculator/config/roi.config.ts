import { CalculatorConfig } from '../model/types';
import { calculateRoi } from '@shared/lib/math/investment.utils';

const CONFIG: CalculatorConfig = {
    id: 'roi',
    title: 'ROI',
    subtitle: 'Return on Investment',
    description: 'Calculate the percentage return on an investment based on the amount spent and the amount gained.',
    icon: 'coins',
    category: 'Returns',
    fields: [
        { key: 'amountSpent', label: 'Amount Spent', type: 'number', defaultValue: 1000, prefix: '$', required: true },
        { key: 'amountGained', label: 'Amount Gained', type: 'number', defaultValue: 1200, prefix: '$', required: true },
    ],
    results: [
        {
            calculate: (d) => calculateRoi({
                amountGained: d['amountGained'] as number,
                amountSpent: d['amountSpent'] as number
            }),
            label: 'Return on Investment',
            type: 'percent',
            themeColor: 'emerald'
        }
    ],
    insights: 'ROI is a popular profitability metric used to evaluate the efficiency of an investment or to compare the efficiencies of several different investments.',
    formula: 'ROI = (Gains - Cost) / Cost'
};

export default CONFIG;
