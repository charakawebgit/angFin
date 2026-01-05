import { CalculatorConfig } from '../model/types';
import { calculateFinancialRatios } from '@shared/lib/math/amortization.utils';

const CONFIG: CalculatorConfig = {
    id: 'financial-ratios',
    title: 'Financial Ratios',
    subtitle: 'Liquidity and Valuations',
    description: 'Assess a company\'s financial health using key liquidity, leverage, and valuation ratios.',
    icon: 'bar-chart-3',
    category: 'Analysis',
    fields: [
        { key: 'currentAssets', label: 'Current Assets', type: 'number', defaultValue: 500000, prefix: '$' },
        { key: 'currentLiabilities', label: 'Current Liabilities', type: 'number', defaultValue: 250000, prefix: '$' },
        { key: 'inventory', label: 'Inventory', type: 'number', defaultValue: 100000, prefix: '$' },
        { key: 'totalDebt', label: 'Total Debt', type: 'number', defaultValue: 1000000, prefix: '$' },
        { key: 'totalEquity', label: 'Total Equity', type: 'number', defaultValue: 1500000, prefix: '$' },
    ],
    results: [
        {
            label: 'Current Ratio',
            type: 'number',
            themeColor: 'sky',
            calculate: (d) => calculateFinancialRatios({
                currentAssets: d['currentAssets'] as number,
                currentLiabilities: d['currentLiabilities'] as number
            }).currentRatio || 0
        },
        {
            label: 'Quick Ratio (Acid Test)',
            type: 'number',
            calculate: (d) => calculateFinancialRatios({
                currentAssets: d['currentAssets'] as number,
                currentLiabilities: d['currentLiabilities'] as number,
                inventory: d['inventory'] as number
            }).quickRatio || 0
        },
        {
            label: 'Debt-to-Equity',
            type: 'number',
            calculate: (d) => calculateFinancialRatios({
                totalDebt: d['totalDebt'] as number,
                totalEquity: d['totalEquity'] as number
            }).debtToEquity || 0
        }
    ],
    insights: 'Liquidity ratios measure a company\'s ability to pay off short-term debt, while leverage ratios assess long-term solvency.',
    formula: 'Varies by ratio (e.g., Current Ratio = Assets / Liabilities)'
};

export default CONFIG;
