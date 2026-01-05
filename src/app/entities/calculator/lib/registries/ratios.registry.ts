import { CalculatorRegistryItem } from '../../model/types';

export const RATIOS_REGISTRY: CalculatorRegistryItem[] = [
    {
        id: 'financial-ratios',
        title: 'Financial Ratios',
        description: 'Liquidity, leverage, and other key ratios.',
        icon: 'bar-chart-3',
        category: 'Ratios',
        load: () => import('../../config/ratios/financial-ratios.config')
    },
    {
        id: 'dupont',
        title: 'DuPont Analysis',
        description: 'Breaking down Return on Equity.',
        icon: 'layers',
        category: 'Ratios',
        load: () => import('../../config/ratios/dupont.config')
    },
    {
        id: 'roi',
        title: 'ROI',
        description: 'Return on Investment.',
        icon: 'trending-up',
        category: 'Ratios',
        load: () => import('../../config/ratios/roi.config')
    },
    {
        id: 'geometric-mean',
        title: 'Geometric Mean',
        description: 'Average rate of return.',
        icon: 'mountain',
        category: 'Ratios',
        load: () => import('../../config/ratios/geometric-mean.config')
    },
    {
        id: 'variance-stddev',
        title: 'Variance & StdDev',
        description: 'Measure data dispersion.',
        icon: 'git-compare-arrows',
        category: 'Ratios',
        load: () => import('../../config/ratios/variance-stddev.config')
    },
    {
        id: 'mad',
        title: 'MAD',
        description: 'Mean Absolute Deviation.',
        icon: 'bar-chart-horizontal',
        category: 'Ratios',
        load: () => import('../../config/ratios/mad.config')
    },
    {
        id: 'cv',
        title: 'Coefficient of Variation',
        description: 'Relative variability.',
        icon: 'percent',
        category: 'Ratios',
        load: () => import('../../config/ratios/cv.config')
    },
    {
        id: 'skew-kurt',
        title: 'Skewness & Kurtosis',
        description: 'Distribution shape analysis.',
        icon: 'pyramid',
        category: 'Ratios',
        load: () => import('../../config/ratios/skew-kurt.config')
    },
    {
        id: 'sharpe-ratio',
        title: 'Sharpe Ratio',
        description: 'Risk-adjusted return.',
        icon: 'scatter-chart',
        category: 'Ratios',
        load: () => import('../../config/ratios/sharpe-ratio.config')
    },
    {
        id: 'portfolio-risk',
        title: 'Portfolio Risk',
        description: 'Risk of a two-asset portfolio.',
        icon: 'shield-check',
        category: 'Ratios',
        load: () => import('../../config/ratios/portfolio-risk.config')
    },
    {
        id: 'portfolio-return',
        title: 'Portfolio Return',
        description: 'Weighted average return.',
        icon: 'target',
        category: 'Ratios',
        load: () => import('../../config/ratios/portfolio-return.config')
    }
];
