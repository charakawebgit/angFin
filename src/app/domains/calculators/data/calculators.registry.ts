import { CalculatorRegistryItem } from './models';

export const CALCULATORS_REGISTRY: CalculatorRegistryItem[] = [
    {
        id: 'future-value',
        title: 'Future Value',
        description: 'Calculate the future value of an investment.',
        icon: 'trending-up',
        category: 'TVM',
        load: () => import('./configs/future-value.config').then(m => ({ config: m.FUTURE_VALUE_CONFIG }))
    },
    {
        id: 'present-value',
        title: 'Present Value',
        description: 'Calculate the current worth of a future sum.',
        icon: 'hourglass',
        category: 'TVM',
        load: () => import('./configs/present-value.config').then(m => ({ config: m.PRESENT_VALUE_CONFIG }))
    },
    {
        id: 'perpetuity',
        title: 'Perpetuity',
        description: 'Value of an endless stream of cash flows.',
        icon: 'percent',
        category: 'Valuation',
        load: () => import('./configs/perpetuity.config').then(m => ({ config: m.PERPETUITY_CONFIG }))
    },
    {
        id: 'ear',
        title: 'Effective Annual Rate',
        description: 'The true interest rate of an investment.',
        icon: 'bar-chart',
        category: 'Rates',
        load: () => import('./configs/ear.config').then(m => ({ config: m.EAR_CONFIG }))
    },
    {
        id: 'roi',
        title: 'ROI',
        description: 'Measure the efficiency of an investment.',
        icon: 'trending-up',
        category: 'Basics',
        load: () => import('./configs/roi.config').then(m => ({ config: m.ROI_CONFIG }))
    },
    {
        id: 'irr',
        title: 'IRR',
        description: 'Internal Rate of Return for cash flows.',
        icon: 'move-horizontal',
        category: 'Capital Budgeting',
        load: () => import('./configs/irr.config').then(m => ({ config: m.IRR_CONFIG }))
    },
    {
        id: 'npv',
        title: 'NPV',
        description: 'Net Present Value of cash flows.',
        icon: 'bar-chart-4',
        category: 'Capital Budgeting',
        load: () => import('./configs/npv.config').then(m => ({ config: m.NPV_CONFIG }))
    },
    {
        id: 'capm',
        title: 'CAPM',
        description: 'Capital Asset Pricing Model.',
        icon: 'shield-check',
        category: 'Equities',
        load: () => import('./configs/capm.config').then(m => ({ config: m.CAPM_CONFIG }))
    },
    {
        id: 'cap-rate',
        title: 'Cap Rate',
        description: 'Real estate capitalization rate.',
        icon: 'building',
        category: 'Real Estate',
        load: () => import('./configs/cap-rate.config').then(m => ({ config: m.CAP_RATE_CONFIG }))
    },
    {
        id: 'bond-valuation',
        title: 'Bond Valuation',
        description: 'Calculate fair value of a bond.',
        icon: 'banknote',
        category: 'Fixed Income',
        load: () => import('./configs/bond-valuation.config').then(m => ({ config: m.BOND_VALUATION_CONFIG }))
    },
    {
        id: 'ytm',
        title: 'Yield to Maturity',
        description: 'Total return anticipated on a bond.',
        icon: 'calendar-check',
        category: 'Fixed Income',
        load: () => import('./configs/ytm.config').then(m => ({ config: m.YTM_CONFIG }))
    },
    {
        id: 'duration',
        title: 'Bond Duration',
        description: 'Macaulay and Modified duration.',
        icon: 'baseline',
        category: 'Fixed Income',
        load: () => import('./configs/duration.config').then(m => ({ config: m.DURATION_CONFIG }))
    },
    {
        id: 'amortization',
        title: 'Amortization',
        description: 'Loan payment schedule.',
        icon: 'table',
        category: 'Basics',
        load: () => import('./configs/amortization.config').then(m => ({ config: m.AMORTIZATION_CONFIG }))
    },
    {
        id: 'wacc',
        title: 'WACC',
        description: 'Weighted Average Cost of Capital.',
        icon: 'variable',
        category: 'Valuation',
        load: () => import('./configs/wacc.config').then(m => ({ config: m.WACC_CONFIG }))
    },
    {
        id: 'ddm',
        title: 'Dividend Discount Model',
        description: 'Stock valuation based on dividends.',
        icon: 'ratio',
        category: 'Equities',
        load: () => import('./configs/ddm.config').then(m => ({ config: m.DDM_CONFIG }))
    },
    {
        id: 'dupont',
        title: 'DuPont Analysis',
        description: 'Breaking down ROE.',
        icon: 'pyramid',
        category: 'Ratios',
        load: () => import('./configs/dupont.config').then(m => ({ config: m.DUPONT_CONFIG }))
    },
    {
        id: 'black-scholes',
        title: 'Black-Scholes',
        description: 'Option pricing model.',
        icon: 'sigma',
        category: 'Derivatives',
        load: () => import('./configs/black-scholes.config').then(m => ({ config: m.BLACK_SCHOLES_CONFIG }))
    },
    {
        id: 'financial-ratios',
        title: 'Financial Ratios',
        description: 'Key performance indicators.',
        icon: 'activity',
        category: 'Ratios',
        load: () => import('./configs/financial-ratios.config').then(m => ({ config: m.FINANCIAL_RATIOS_CONFIG }))
    },
    {
        id: 'sharpe-ratio',
        title: 'Sharpe Ratio',
        description: 'Risk-adjusted return.',
        icon: 'scatter-chart',
        category: 'Risk',
        load: () => import('./configs/sharpe-ratio.config').then(m => ({ config: m.SHARPE_RATIO_CONFIG }))
    },
    {
        id: 'geometric-mean',
        title: 'Geometric Mean',
        description: 'Average rate of return.',
        icon: 'mountain',
        category: 'Stats',
        load: () => import('./configs/geometric-mean.config').then(m => ({ config: m.GEOMETRIC_MEAN_CONFIG }))
    },
    {
        id: 'variance-stddev',
        title: 'Variance & StdDev',
        description: 'Measure data dispersion.',
        icon: 'git-compare-arrows',
        category: 'Stats',
        load: () => import('./configs/variance-stddev.config').then(m => ({ config: m.VARIANCE_STDDEV_CONFIG }))
    },
    {
        id: 'portfolio-return',
        title: 'Portfolio Return',
        description: 'Weighted average return.',
        icon: 'target',
        category: 'Portfolio',
        load: () => import('./configs/portfolio-return.config').then(m => ({ config: m.PORTFOLIO_RETURN_CONFIG }))
    },
    {
        id: 'portfolio-risk',
        title: 'Portfolio Risk',
        description: 'Risk of a two-asset portfolio.',
        icon: 'shield-check',
        category: 'Risk',
        load: () => import('./configs/portfolio-risk.config').then(m => ({ config: m.PORTFOLIO_RISK_CONFIG }))
    },
    {
        id: 'mad',
        title: 'MAD',
        description: 'Mean Absolute Deviation.',
        icon: 'bar-chart-horizontal',
        category: 'Stats',
        load: () => import('./configs/mad.config').then(m => ({ config: m.MAD_CONFIG }))
    },
    {
        id: 'cv',
        title: 'Coefficient of Variation',
        description: 'Relative variability.',
        icon: 'percent',
        category: 'Stats',
        load: () => import('./configs/cv.config').then(m => ({ config: m.CV_CONFIG }))
    },
    {
        id: 'skew-kurt',
        title: 'Skewness & Kurtosis',
        description: 'Distribution shape analysis.',
        icon: 'pyramid',
        category: 'Stats',
        load: () => import('./configs/skew-kurt.config').then(m => ({ config: m.SKEW_KURT_CONFIG }))
    },
    {
        id: 'hpr',
        title: 'Holding Period Return',
        description: 'Total return over a period.',
        icon: 'hand-coins',
        category: 'Rates',
        load: () => import('./configs/hpr.config').then(m => ({ config: m.HPR_CONFIG }))
    },
    {
        id: 'rbd-eay',
        title: 'RBD & EAY',
        description: 'Discount and Annual Yields.',
        icon: 'zap',
        category: 'Rates',
        load: () => import('./configs/rbd-eay.config').then(m => ({ config: m.RBD_EAY_CONFIG }))
    },
    {
        id: 'convexity',
        title: 'Bond Convexity',
        description: 'Price sensitivity adjustment.',
        icon: 'baseline',
        category: 'Fixed Income',
        load: () => import('./configs/convexity.config').then(m => ({ config: m.CONVEXITY_CONFIG }))
    },
    {
        id: 'tvm-solver',
        title: 'TVM Solver',
        description: 'Universal financial calculator.',
        icon: 'calculator',
        category: 'Basics',
        load: () => import('./configs/tvm-solver.config').then(m => ({ config: m.TVM_SOLVER_CONFIG }))
    }
];
