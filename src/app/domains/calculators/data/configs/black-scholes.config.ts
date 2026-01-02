import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const BLACK_SCHOLES_CONFIG: CalculatorConfig = {
    id: 'black-scholes',
    title: 'Black-Scholes',
    subtitle: 'Options Pricing Model',
    description: 'Estimate the theoretical price of European-style call and put options.',
    icon: 'cpu',
    category: 'Derivatives',
    fields: [
        { key: 'stockPrice', label: 'Current Stock Price', type: 'number', defaultValue: 100, prefix: '$', required: true },
        { key: 'strikePrice', label: 'Strike Price', type: 'number', defaultValue: 95, prefix: '$', required: true },
        { key: 'time', label: 'Time to Expiration (Years)', type: 'number', defaultValue: 1, required: true },
        { key: 'riskFreeRate', label: 'Risk-Free Rate (%)', type: 'number', defaultValue: 2, suffix: '%', required: true },
        { key: 'volatility', label: 'Volatility / Sigma (%)', type: 'number', defaultValue: 20, suffix: '%', required: true },
    ],
    results: [
        {
            label: 'Call Option Price',
            type: 'currency',
            themeColor: 'emerald',
            calculate: (d) => financialService.calculateBlackScholes({
                stockPrice: d.stockPrice,
                strikePrice: d.strikePrice,
                time: d.time,
                riskFreeRate: d.riskFreeRate / 100,
                volatility: d.volatility / 100
            }).callPrice
        },
        {
            label: 'Put Option Price',
            type: 'currency',
            themeColor: 'rose',
            calculate: (d) => financialService.calculateBlackScholes({
                stockPrice: d.stockPrice,
                strikePrice: d.strikePrice,
                time: d.time,
                riskFreeRate: d.riskFreeRate / 100,
                volatility: d.volatility / 100
            }).putPrice
        }
    ],
    insights: 'The Black-Scholes model uses stock price, strike price, time to expiration, risk-free rate, and volatility to provide a fair price for options.',
    formula: 'C = S0N(d1) - Xe^{-rT}N(d2)'
};
