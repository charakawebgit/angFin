import { CalculatorConfig, TVMVar } from '../model/types';
import { solveTvm } from '@entities/finance/lib/tvm.utils';

const CONFIG: CalculatorConfig = {
    id: 'tvm-solver',
    title: 'Financial Solver',
    subtitle: 'Comprehensive TVM Calculator',
    description: 'Solve for any variable in a time-value-of-money problem (PV, FV, PMT, N, or I/Y).',
    icon: 'calculator',
    category: 'TVM',
    fields: [
        {
            key: 'solveFor',
            label: 'Solve For',
            type: 'select',
            defaultValue: 'FV',
            options: [
                { label: 'Future Value (FV)', value: 'FV' },
                { label: 'Present Value (PV)', value: 'PV' },
                { label: 'Payment (PMT)', value: 'PMT' },
                { label: 'Periods (N)', value: 'N' },
                { label: 'Interest Rate (I/Y)', value: 'IY' },
            ],
            required: true
        },
        { key: 'n', label: 'Periods (N)', type: 'number', defaultValue: 10 },
        { key: 'iy', label: 'Annual Interest (I/Y) (%)', type: 'number', defaultValue: 5, suffix: '%' },
        { key: 'pv', label: 'Present Value (PV)', type: 'number', defaultValue: -1000, prefix: '$' },
        { key: 'pmt', label: 'Payment (PMT)', type: 'number', defaultValue: 0, prefix: '$' },
        { key: 'fv', label: 'Future Value (FV)', type: 'number', defaultValue: 0, prefix: '$' },
        { key: 'cpy', label: 'Compounding per Year', type: 'number', defaultValue: 1, required: true },
    ],
    results: [
        {
            label: 'Calculated Result',
            type: 'number',
            themeColor: 'indigo',
            calculate: (d) => {
                const params = {
                    solveFor: d['solveFor'] as TVMVar,
                    n: Number(d['n']),
                    iy: Number(d['iy']),
                    pv: Number(d['pv']),
                    pmt: Number(d['pmt']),
                    fv: Number(d['fv']),
                    cpy: Number(d['cpy'])
                };
                return solveTvm(params);
            }
        }
    ],
    insights: 'The TVM Solver allows you to find one variable when the other four are known. Remember that cash outflows (like investments) are usually negative, and inflows are positive.',
    formula: 'FV + PV*(1+i)^n + PMT*[((1+i)^n - 1)/i] = 0'
};

export default CONFIG;
