import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const DUPONT_CONFIG: CalculatorConfig = {
    id: 'dupont',
    title: 'DuPont Analysis',
    subtitle: 'Decompose Return on Equity (ROE)',
    description: 'Break down ROE into three components: Profit Margin, Asset Turnover, and Financial Leverage.',
    icon: 'layers',
    category: 'Equity',
    fields: [
        { key: 'netIncome', label: 'Net Income', type: 'number', defaultValue: 50000, prefix: '$', required: true },
        { key: 'revenue', label: 'Total Revenue', type: 'number', defaultValue: 200000, prefix: '$', required: true },
        { key: 'assets', label: 'Total Assets', type: 'number', defaultValue: 500000, prefix: '$', required: true },
        { key: 'equity', label: 'Total Equity', type: 'number', defaultValue: 300000, prefix: '$', required: true },
    ],
    results: [
        {
            label: 'Return on Equity (ROE)',
            type: 'percent',
            themeColor: 'indigo',
            calculate: (d) => financialService.calculateDupont({
                netIncome: d.netIncome,
                revenue: d.revenue,
                assets: d.assets,
                equity: d.equity
            }).roe
        },
        {
            label: 'Profit Margin',
            type: 'percent',
            calculate: (d) => financialService.calculateDupont({
                netIncome: d.netIncome,
                revenue: d.revenue,
                assets: d.assets,
                equity: d.equity
            }).profitMargin
        }
    ],
    insights: 'DuPont analysis is useful for understanding the different levers a company uses to drive its Return on Equity.',
    formula: 'ROE = Profit Margin × Asset Turnover × Equity Multiplier'
};
