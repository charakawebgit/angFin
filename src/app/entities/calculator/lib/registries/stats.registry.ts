import { CalculatorRegistryItem } from '../../model/types';

export const STATS_REGISTRY: CalculatorRegistryItem[] = [
    {
        id: 'geometric-mean',
        title: 'Geometric Mean',
        description: 'Average rate of return.',
        icon: 'mountain',
        category: 'Stats',
        load: () => import('../../config/ratios/geometric-mean.config')
    },
    {
        id: 'variance-stddev',
        title: 'Variance & StdDev',
        description: 'Measure data dispersion.',
        icon: 'git-compare-arrows',
        category: 'Stats',
        load: () => import('../../config/ratios/variance-stddev.config')
    },
    {
        id: 'mad',
        title: 'MAD',
        description: 'Mean Absolute Deviation.',
        icon: 'bar-chart-horizontal',
        category: 'Stats',
        load: () => import('../../config/ratios/mad.config')
    },
    {
        id: 'cv',
        title: 'Coefficient of Variation',
        description: 'Relative variability.',
        icon: 'percent',
        category: 'Stats',
        load: () => import('../../config/ratios/cv.config')
    },
    {
        id: 'skew-kurt',
        title: 'Skewness & Kurtosis',
        description: 'Distribution shape analysis.',
        icon: 'pyramid',
        category: 'Stats',
        load: () => import('../../config/ratios/skew-kurt.config')
    }
];
