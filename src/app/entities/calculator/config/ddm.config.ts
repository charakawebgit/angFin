import { CalculatorConfig } from '../model/types';
import { calculateDdm } from '@shared/lib/math/equity.utils';

const CONFIG: CalculatorConfig = {
    id: 'ddm',
    title: 'Dividend Discount Model',
    subtitle: 'Gordon Growth valuation',
    description: 'Value a stock based on its future dividend payments growing at a constant rate.',
    icon: 'line-chart',
    category: 'Equity',
    fields: [
        { key: 'dividend', label: 'Next Year Dividend (D1)', type: 'number', defaultValue: 2.50, prefix: '$', required: true },
        { key: 'returnRate', label: 'Required Return (%)', type: 'number', defaultValue: 10, suffix: '%', required: true },
        { key: 'growthRate', label: 'Constant Growth Rate (%)', type: 'number', defaultValue: 5, suffix: '%', required: true },
    ],
    results: [
        {
            label: 'Fair Stock Value',
            type: 'currency',
            themeColor: 'emerald',
            calculate: (d) => calculateDdm({
                dividend: d['dividend'] as number,
                returnRate: (d['returnRate'] as number) / 100,
                growthRate: (d['growthRate'] as number) / 100
            })
        }
    ],
    insights: 'The DDM assumes that the value of a stock is the sum of all its future dividend payments, discounted back to their present value.',
    formula: 'P0 = D1 / (k - g)'
};

export default CONFIG;
