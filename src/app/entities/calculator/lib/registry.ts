import { CalculatorRegistryItem } from '../model/types';

export const CALCULATORS_REGISTRY: CalculatorRegistryItem[] = [
    {
        id: 'future-value',
        title: 'Future Value',
        description: 'Calculate the future value of an investment.',
        icon: 'trending-up',
        category: 'TVM',
        load: () => import('../config/future-value.config')
    },
    {
        id: 'present-value',
        title: 'Present Value',
        description: 'Calculate the current worth of a future sum.',
        icon: 'hourglass',
        category: 'TVM',
        load: () => import('../config/present-value.config')
    },
    {
        id: 'perpetuity',
        title: 'Perpetuity',
        description: 'Value of an endless stream of cash flows.',
        icon: 'percent',
        category: 'Valuation',
        load: () => import('../config/perpetuity.config')
    },
    {
        id: 'ear',
        title: 'Effective Annual Rate',
        description: 'The true interest rate of an investment.',
        icon: 'bar-chart',
        category: 'Rates',
        load: () => import('../config/ear.config')
    },
    {
        id: 'roi',
        title: 'ROI',
        description: 'Measure the efficiency of an investment.',
        icon: 'trending-up',
        category: 'Basics',
        load: () => import('../config/roi.config')
    },
    {
        id: 'irr',
        title: 'IRR',
        description: 'Internal Rate of Return for cash flows.',
        icon: 'move-horizontal',
        category: 'Capital Budgeting',
        load: () => import('../config/irr.config')
    },
    {
        id: 'npv',
        title: 'NPV',
        description: 'Net Present Value of cash flows.',
        icon: 'bar-chart-4',
        category: 'Capital Budgeting',
        load: () => import('../config/npv.config')
    },
    {
        id: 'capm',
        title: 'CAPM',
        description: 'Capital Asset Pricing Model.',
        icon: 'shield-check',
        category: 'Equities',
        load: () => import('../config/capm.config')
    },
    {
        id: 'cap-rate',
        title: 'Cap Rate',
        description: 'Real estate capitalization rate.',
        icon: 'building',
        category: 'Real Estate',
        load: () => import('../config/cap-rate.config')
    },
    {
        id: 'bond-valuation',
        title: 'Bond Valuation',
        description: 'Calculate fair value of a bond.',
        icon: 'banknote',
        category: 'Fixed Income',
        load: () => import('../config/bond-valuation.config')
    },
    {
        id: 'ytm',
        title: 'Yield to Maturity',
        description: 'Total return anticipated on a bond.',
        icon: 'calendar-check',
        category: 'Fixed Income',
        load: () => import('../config/ytm.config')
    },
    {
        id: 'duration',
        title: 'Bond Duration',
        description: 'Macaulay and Modified duration.',
        icon: 'baseline',
        category: 'Fixed Income',
        load: () => import('../config/duration.config')
    },
    {
        id: 'amortization',
        title: 'Amortization',
        description: 'Loan payment schedule.',
        icon: 'table',
        category: 'Basics',
        load: () => import('../config/amortization.config')
    },
    {
        id: 'wacc',
        title: 'WACC',
        description: 'Weighted Average Cost of Capital.',
        icon: 'variable',
        category: 'Valuation',
        load: () => import('../config/wacc.config')
    },
    {
        id: 'ddm',
        title: 'Dividend Discount Model',
        description: 'Stock valuation based on dividends.',
        icon: 'ratio',
        category: 'Equities',
        load: () => import('../config/ddm.config')
    },
    {
        id: 'dupont',
        title: 'DuPont Analysis',
        description: 'Breaking down ROE.',
        icon: 'pyramid',
        category: 'Ratios',
        load: () => import('../config/dupont.config')
    },
    {
        id: 'black-scholes',
        title: 'Black-Scholes',
        description: 'Option pricing model.',
        icon: 'sigma',
        category: 'Derivatives',
        load: () => import('../config/black-scholes.config')
    },
    {
        id: 'financial-ratios',
        title: 'Financial Ratios',
        description: 'Key performance indicators.',
        icon: 'activity',
        category: 'Ratios',
        load: () => import('../config/financial-ratios.config')
    },
    {
        id: 'sharpe-ratio',
        title: 'Sharpe Ratio',
        description: 'Risk-adjusted return.',
        icon: 'scatter-chart',
        category: 'Risk',
        load: () => import('../config/sharpe-ratio.config')
    },
    {
        id: 'geometric-mean',
        title: 'Geometric Mean',
        description: 'Average rate of return.',
        icon: 'mountain',
        category: 'Stats',
        load: () => import('../config/geometric-mean.config')
    },
    {
        id: 'variance-stddev',
        title: 'Variance & StdDev',
        description: 'Measure data dispersion.',
        icon: 'git-compare-arrows',
        category: 'Stats',
        load: () => import('../config/variance-stddev.config')
    },
    {
        id: 'portfolio-return',
        title: 'Portfolio Return',
        description: 'Weighted average return.',
        icon: 'target',
        category: 'Portfolio',
        load: () => import('../config/portfolio-return.config')
    },
    {
        id: 'portfolio-risk',
        title: 'Portfolio Risk',
        description: 'Risk of a two-asset portfolio.',
        icon: 'shield-check',
        category: 'Risk',
        load: () => import('../config/portfolio-risk.config')
    },
    {
        id: 'mad',
        title: 'MAD',
        description: 'Mean Absolute Deviation.',
        icon: 'bar-chart-horizontal',
        category: 'Stats',
        load: () => import('../config/mad.config')
    },
    {
        id: 'cv',
        title: 'Coefficient of Variation',
        description: 'Relative variability.',
        icon: 'percent',
        category: 'Stats',
        load: () => import('../config/cv.config')
    },
    {
        id: 'skew-kurt',
        title: 'Skewness & Kurtosis',
        description: 'Distribution shape analysis.',
        icon: 'pyramid',
        category: 'Stats',
        load: () => import('../config/skew-kurt.config')
    },
    {
        id: 'hpr',
        title: 'Holding Period Return',
        description: 'Total return over a period.',
        icon: 'hand-coins',
        category: 'Rates',
        load: () => import('../config/hpr.config')
    },
    {
        id: 'rbd-eay',
        title: 'RBD & EAY',
        description: 'Discount and Annual Yields.',
        icon: 'zap',
        category: 'Rates',
        load: () => import('../config/rbd-eay.config')
    },
    {
        id: 'convexity',
        title: 'Bond Convexity',
        description: 'Price sensitivity adjustment.',
        icon: 'baseline',
        category: 'Fixed Income',
        load: () => import('../config/convexity.config')
    },
    {
        id: 'tvm-solver',
        title: 'TVM Solver',
        description: 'Universal financial calculator.',
        icon: 'calculator',
        category: 'Basics',
        load: () => import('../config/tvm-solver.config')
    }
];
