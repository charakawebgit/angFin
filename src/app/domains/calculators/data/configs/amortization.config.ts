import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const AMORTIZATION_CONFIG: CalculatorConfig = {
    id: 'amortization',
    title: 'Amortization',
    subtitle: 'Loan repayment schedule',
    description: 'Calculate periodic loan payments and break down principal vs interest over time.',
    icon: 'calendar',
    category: 'Lending',
    fields: [
        { key: 'loanAmount', label: 'Loan Amount', type: 'number', defaultValue: 250000, prefix: '$', required: true },
        { key: 'interestRate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 4.5, suffix: '%', required: true },
        { key: 'loanTerm', label: 'Loan Term (Years)', type: 'number', defaultValue: 30, required: true },
    ],
    results: [
        {
            label: 'Monthly Payment',
            type: 'currency',
            themeColor: 'indigo',
            calculate: (d) => financialService.calculateAmortization({
                loanAmount: d.loanAmount,
                interestRate: d.interestRate / 100,
                loanTerm: d.loanTerm
            }).summary.monthlyPayment
        },
        {
            label: 'Total Interest',
            type: 'currency',
            calculate: (d) => financialService.calculateAmortization({
                loanAmount: d.loanAmount,
                interestRate: d.interestRate / 100,
                loanTerm: d.loanTerm
            }).summary.totalInterest
        }
    ],
    insights: 'Amortization is the process of spreading out a loan into a series of fixed payments. Early payments consist mostly of interest.',
    formula: 'Payment = P * [r(1+r)^n] / [(1+r)^n - 1]'
};
