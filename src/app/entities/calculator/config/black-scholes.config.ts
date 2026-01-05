import { CalculatorConfig } from '../model/types';
import { calculateBlackScholes } from '@shared/lib/math/equity.utils';

const CONFIG: CalculatorConfig = {
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
            calculate: (d) => calculateBlackScholes({
                stockPrice: d['stockPrice'] as number,
                strikePrice: d['strikePrice'] as number,
                time: d['time'] as number,
                riskFreeRate: (d['riskFreeRate'] as number) / 100,
                volatility: (d['volatility'] as number) / 100
            }).callPrice
        },
        {
            label: 'Put Option Price',
            type: 'currency',
            themeColor: 'rose',
            calculate: (d) => calculateBlackScholes({
                stockPrice: d['stockPrice'] as number,
                strikePrice: d['strikePrice'] as number,
                time: d['time'] as number,
                riskFreeRate: (d['riskFreeRate'] as number) / 100,
                volatility: (d['volatility'] as number) / 100
            }).putPrice
        }
    ],
    insights: 'The Black-Scholes model uses stock price, strike price, time to expiration, risk-free rate, and volatility to provide a fair price for options.',
    formula: 'C = S0N(d1) - Xe^{-rT}N(d2)'
};

export default CONFIG;
