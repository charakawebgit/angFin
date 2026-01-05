import { CalculatorConfig } from '../model/types';
import { calculateDupont } from '@shared/lib/math/equity.utils';

const CONFIG: CalculatorConfig = {
    id: 'dupont',
    title: 'DuPont Analysis',
    subtitle: 'Decomposition of ROE',
    description: 'Break down Return on Equity into profit margin, asset turnover, and financial leverage.',
    icon: 'layers',
    category: 'Analysis',
    fields: [
        { key: 'netIncome', label: 'Net Income', type: 'number', defaultValue: 50000, prefix: '$', required: true },
        { key: 'revenue', label: 'Revenue', type: 'number', defaultValue: 500000, prefix: '$', required: true },
        { key: 'assets', label: 'Total Assets', type: 'number', defaultValue: 1000000, prefix: '$', required: true },
        { key: 'equity', label: 'Total Equity', type: 'number', defaultValue: 400000, prefix: '$', required: true },
    ],
    results: [
        {
            label: 'Profit Margin',
            type: 'percent',
            themeColor: 'sky',
            calculate: (d) => calculateDupont({
                netIncome: d['netIncome'] as number,
                revenue: d['revenue'] as number,
                assets: d['assets'] as number,
                equity: d['equity'] as number
            }).profitMargin
        },
        {
            label: 'Asset Turnover',
            type: 'number',
            themeColor: 'amber',
            calculate: (d) => calculateDupont({
                netIncome: d['netIncome'] as number,
                revenue: d['revenue'] as number,
                assets: d['assets'] as number,
                equity: d['equity'] as number
            }).assetTurnover
        },
        {
            label: 'ROE',
            type: 'percent',
            themeColor: 'emerald',
            calculate: (d) => calculateDupont({
                netIncome: d['netIncome'] as number,
                revenue: d['revenue'] as number,
                assets: d['assets'] as number,
                equity: d['equity'] as number
            }).roe
        }
    ],
    insights: 'The DuPont formula shows that a company can increase its ROE by having high profit margins, turning over its assets quickly, or using more leverage.',
    formula: 'ROE = Net Profit Margin × Asset Turnover × Equity Multiplier'
};

export default CONFIG;
