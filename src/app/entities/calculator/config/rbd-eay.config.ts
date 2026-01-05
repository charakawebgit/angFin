import { CalculatorConfig } from '../model/types';
import { calculateBankDiscountYield, calculateEffectiveAnnualYield } from '@shared/lib/math/investment.utils';

const CONFIG: CalculatorConfig = {
    id: 'rbd-eay',
    title: 'Yield Conversions',
    subtitle: 'Money market yields',
    description: 'Calculate Bank Discount Yield (RBD) and Effective Annual Yield (EAY) for short-term instruments.',
    icon: 'repeat',
    category: 'Returns',
    fields: [
        { key: 'faceValue', label: 'Face Value', type: 'number', defaultValue: 1000, prefix: '$', required: true },
        { key: 'purchasePrice', label: 'Purchase Price', type: 'number', defaultValue: 980, prefix: '$', required: true },
        { key: 'days', label: 'Days to Maturity', type: 'number', defaultValue: 90, required: true, min: 1 },
    ],
    results: [
        {
            label: 'Bank Discount Yield (Rbd)',
            type: 'percent',
            themeColor: 'amber',
            calculate: (d) => calculateBankDiscountYield({
                faceValue: d['faceValue'] as number,
                purchasePrice: d['purchasePrice'] as number,
                days: d['days'] as number
            })
        },
        {
            label: 'Effective Annual Yield (Eay)',
            type: 'percent',
            calculate: (d) => {
                const hpy = ((d['faceValue'] as number) - (d['purchasePrice'] as number)) / (d['purchasePrice'] as number);
                return calculateEffectiveAnnualYield({ hpy, days: d['days'] as number });
            }
        }
    ],
    insights: 'RBD uses a 360-day year and par value, while EAY uses a 365-day year and purchase price with compounding.',
    formula: 'Rbd = (D/F) * (360/t), Eay = (1+HPY)^{365/t} - 1'
};

export default CONFIG;
