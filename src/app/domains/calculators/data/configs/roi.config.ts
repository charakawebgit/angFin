import { CalculatorConfig } from '../models';

export const ROI_CONFIG: CalculatorConfig = {
    id: 'roi',
    title: 'ROI',
    subtitle: 'Simple Return on Investment',
    description: 'Calculate the percentage return on an investment relative to its cost.',
    icon: 'trending-up',
    category: 'Analysis',
    fields: [
        { key: 'amountGained', label: 'Amount Gained (Gain)', type: 'number', defaultValue: 1200, prefix: '$', required: true },
        { key: 'amountSpent', label: 'Amount Invested (Cost)', type: 'number', defaultValue: 1000, prefix: '$', required: true, min: 1 },
    ],
    results: [
        { mathFunction: 'calculateRoi', label: 'Return on Investment', type: 'percent' }
    ],
    insights: 'Return on Investment (ROI) is a performance measure used to evaluate the efficiency of an investment or compare the efficiencies of several different investments.',
    formula: 'ROI = (Net Profit / Cost of Investment) * 100'
};
