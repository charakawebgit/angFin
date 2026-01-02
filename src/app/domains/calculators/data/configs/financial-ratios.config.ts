import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const FINANCIAL_RATIOS_CONFIG: CalculatorConfig = {
    id: 'financial-ratios',
    title: 'Financial Ratios',
    subtitle: 'Key business health metrics',
    description: 'Evaluate liquidity, solvency, and valuation ratios for any business.',
    icon: 'clipboard-list',
    category: 'Analysis',
    fields: [
        { key: 'currentAssets', label: 'Current Assets', type: 'number', defaultValue: 100000, prefix: '$' },
        { key: 'currentLiabilities', label: 'Current Liabilities', type: 'number', defaultValue: 50000, prefix: '$' },
        { key: 'inventory', label: 'Inventory', type: 'number', defaultValue: 20000, prefix: '$' },
        { key: 'totalDebt', label: 'Total Debt', type: 'number', defaultValue: 200000, prefix: '$' },
        { key: 'totalEquity', label: 'Total Equity', type: 'number', defaultValue: 300000, prefix: '$' },
    ],
    results: [
        {
            label: 'Current Ratio',
            type: 'number',
            themeColor: 'sky',
            calculate: (d) => financialService.calculateFinancialRatios({
                currentAssets: d['currentAssets'],
                currentLiabilities: d['currentLiabilities']
            }).currentRatio
        },
        {
            label: 'Quick Ratio',
            type: 'number',
            calculate: (d) => financialService.calculateFinancialRatios({
                currentAssets: d['currentAssets'],
                currentLiabilities: d['currentLiabilities'],
                inventory: d['inventory']
            }).quickRatio
        },
        {
            label: 'Debt to Equity',
            type: 'number',
            calculate: (d) => financialService.calculateFinancialRatios({
                totalDebt: d['totalDebt'],
                totalEquity: d['totalEquity']
            }).debtToEquity
        }
    ],
    insights: 'Financial ratios help compare a company against its peers and its own historical performance.',
    formula: 'Current Ratio = Current Assets / Current Liabilities'
};
