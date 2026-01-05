import { CalculatorRegistryItem } from '../../model/types';

export const FIXED_INCOME_REGISTRY: CalculatorRegistryItem[] = [
    {
        id: 'ytm',
        title: 'Yield to Maturity',
        description: 'Total expected return of a bond.',
        icon: 'activity',
        category: 'Fixed Income',
        load: () => import('../../config/fixed-income/ytm.config')
    },
    {
        id: 'duration',
        title: 'Bond Duration',
        description: 'Macaulay and Modified duration.',
        icon: 'baseline',
        category: 'Fixed Income',
        load: () => import('../../config/fixed-income/duration.config')
    },
    {
        id: 'convexity',
        title: 'Bond Convexity',
        description: 'Price sensitivity adjustment.',
        icon: 'baseline',
        category: 'Fixed Income',
        load: () => import('../../config/fixed-income/convexity.config')
    },
    {
        id: 'ear',
        title: 'Effective Annual Rate',
        description: 'The true interest rate of an investment.',
        icon: 'bar-chart',
        category: 'Fixed Income',
        load: () => import('../../config/fixed-income/ear.config')
    },
    {
        id: 'rbd-eay',
        title: 'RBD & EAY',
        description: 'Discount and Annual Yields.',
        icon: 'zap',
        category: 'Fixed Income',
        load: () => import('../../config/fixed-income/rbd-eay.config')
    }
];
