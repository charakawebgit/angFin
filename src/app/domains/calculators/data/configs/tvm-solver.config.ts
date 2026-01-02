import { CalculatorConfig } from '../models';
import { FinancialService } from '@core/math/financial.service';

const financialService = new FinancialService();

export const TVM_SOLVER_CONFIG: CalculatorConfig = {
    id: 'tvm-solver',
    title: 'TVM Solver',
    subtitle: 'Five-key financial solver',
    description: 'Solve for any variable in the Time Value of Money equation: N, I/Y, PV, PMT, or FV.',
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
                    solveFor: d['solveFor'] as any,
                    n: Number(d['n']),
                    iy: Number(d['iy']),
                    pv: Number(d['pv']),
                    pmt: Number(d['pmt']),
                    fv: Number(d['fv']),
                    cpy: Number(d['cpy'])
                };
                return financialService.solveTvm(params);
            }
        }
    ],
    insights: 'The TVM Solver allows you to find one variable when the other four are known. Remember that cash outflows (like investments) are usually negative, and inflows are positive.',
    formula: 'FV + PV*(1+i)^n + PMT*[((1+i)^n - 1)/i] = 0'
};
