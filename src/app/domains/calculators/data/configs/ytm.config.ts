import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const YTM_CONFIG: CalculatorConfig = {
    id: 'ytm',
    title: 'Yield to Maturity (YTM)',
    subtitle: 'Internal rate of return for a bond',
    description: 'Calculate the total return anticipated on a bond if it is held until its maturity date.',
    icon: 'trending-up',
    category: 'Fixed Income',
    fields: [
        { key: 'currentPrice', label: 'Current Market Price', type: 'number', defaultValue: 950, prefix: '$', required: true },
        { key: 'faceValue', label: 'Face Value (Par)', type: 'number', defaultValue: 1000, prefix: '$', required: true },
        { key: 'couponRate', label: 'Annual Coupon Rate (%)', type: 'number', defaultValue: 5, suffix: '%', required: true },
        { key: 'years', label: 'Years to Maturity', type: 'number', defaultValue: 10, required: true },
        { key: 'frequency', label: 'Payments per Year', type: 'number', defaultValue: 2, required: true, min: 1 },
    ],
    results: [
        {
            label: 'Yield to Maturity',
            type: 'percent',
            themeColor: 'amber',
            calculate: (d) => financialService.calculateYtm({
                currentPrice: d.currentPrice,
                faceValue: d.faceValue,
                couponRate: d.couponRate / 100,
                years: d.years,
                frequency: d.frequency
            })
        }
    ],
    insights: 'YTM is a comprehensive measure of return that includes interest income plus/minus any capital gain/loss at maturity.',
    formula: 'Approximation: C + (F-P)/n / (F+P)/2'
};
