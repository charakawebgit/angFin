import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const BOND_VALUATION_CONFIG: CalculatorConfig = {
    id: 'bond-valuation',
    title: 'Bond Valuation',
    subtitle: 'Determine fair value of a fixed-income security',
    description: 'Calculate the present value of a bond based on its par value, coupon, and market interest rates.',
    icon: 'banknote',
    category: 'Fixed Income',
    fields: [
        { key: 'faceValue', label: 'Face Value (Par)', type: 'number', defaultValue: 1000, prefix: '$', required: true },
        { key: 'couponRate', label: 'Annual Coupon Rate (%)', type: 'number', defaultValue: 5, suffix: '%', required: true },
        { key: 'marketRate', label: 'Market Interest Rate (%)', type: 'number', defaultValue: 4, suffix: '%', required: true },
        { key: 'years', label: 'Years to Maturity', type: 'number', defaultValue: 10, required: true },
        { key: 'frequency', label: 'Payments per Year', type: 'number', defaultValue: 2, required: true, min: 1 },
    ],
    results: [
        {
            label: 'Intrinsic Bond Value',
            type: 'currency',
            themeColor: 'emerald',
            calculate: (d) => financialService.calculateBondPrice({
                faceValue: d.faceValue,
                couponRate: d.couponRate / 100,
                marketRate: d.marketRate / 100,
                years: d.years,
                frequency: d.frequency
            })
        }
    ],
    insights: 'Bond price is the present value of all future interest payments plus the present value of the par value at maturity.',
    formula: 'Price = ∑ [C / (1+r)^t] + [Par / (1+r)^n]'
};
