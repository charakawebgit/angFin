import { CalculatorRegistryItem } from '../../model/types';

export const OTHER_REGISTRY: CalculatorRegistryItem[] = [
    {
        id: 'roi',
        title: 'ROI',
        description: 'Measure the efficiency of an investment.',
        icon: 'trending-up',
        category: 'Basics',
        load: () => import('../../config/roi.config')
    },
    {
        id: 'amortization',
        title: 'Amortization',
        description: 'Loan payment schedule.',
        icon: 'table',
        category: 'Basics',
        load: () => import('../../config/amortization.config')
    },
    {
        id: 'tvm-solver',
        title: 'TVM Solver',
        description: 'Universal financial calculator.',
        icon: 'calculator',
        category: 'Basics',
        load: () => import('../../config/tvm-solver.config')
    },
    {
        id: 'cap-rate',
        title: 'Cap Rate',
        description: 'Real estate capitalization rate.',
        icon: 'building',
        category: 'Real Estate',
        load: () => import('../../config/cap-rate.config')
    },
    {
        id: 'sharpe-ratio',
        title: 'Sharpe Ratio',
        description: 'Risk-adjusted return.',
        icon: 'scatter-chart',
        category: 'Risk',
        load: () => import('../../config/sharpe-ratio.config')
    },
    {
        id: 'portfolio-risk',
        title: 'Portfolio Risk',
        description: 'Risk of a two-asset portfolio.',
        icon: 'shield-check',
        category: 'Risk',
        load: () => import('../../config/portfolio-risk.config')
    },
    {
        id: 'portfolio-return',
        title: 'Portfolio Return',
        description: 'Weighted average return.',
        icon: 'target',
        category: 'Portfolio',
        load: () => import('../../config/portfolio-return.config')
    },
    {
        id: 'black-scholes',
        title: 'Black-Scholes',
        description: 'Option pricing model.',
        icon: 'sigma',
        category: 'Derivatives',
        load: () => import('../../config/black-scholes.config')
    }
];
