import { CalculatorConfig } from '../../model/types';
import { calculateAmortization } from '@entities/finance/lib/real-estate.utils';

const CONFIG: CalculatorConfig = {
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
            calculate: (d) => calculateAmortization({
                loanAmount: d['loanAmount'] as number,
                interestRate: (d['interestRate'] as number) / 100,
                loanTerm: d['loanTerm'] as number
            }).summary.monthlyPayment
        },
        {
            label: 'Total Interest',
            type: 'currency',
            calculate: (d) => calculateAmortization({
                loanAmount: d['loanAmount'] as number,
                interestRate: (d['interestRate'] as number) / 100,
                loanTerm: d['loanTerm'] as number
            }).summary.totalInterest
        },
        {
            label: 'Amortization Schedule',
            type: 'table',
            tableConfig: {
                columns: [
                    { header: 'Period', key: 'period', align: 'center' },
                    { header: 'Principal', key: 'principal', format: 'currency', align: 'right' },
                    { header: 'Interest', key: 'interest', format: 'currency', align: 'right' },
                    { header: 'Balance', key: 'balance', format: 'currency', align: 'right' }
                ]
            },
            calculate: (d) => {
                const res = calculateAmortization({
                    loanAmount: Number(d['loanAmount']),
                    interestRate: Number(d['interestRate']) / 100,
                    loanTerm: Number(d['loanTerm'])
                });
                return res.schedule || [];
            }
        }
    ],
    insights: 'Amortization is the process of spreading out a loan into a series of fixed payments. Early payments consist mostly of interest.',
    formula: 'Payment = P * [r(1+r)^n] / [(1+r)^n - 1]'
};

export default CONFIG;
