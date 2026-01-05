import { CalculatorRegistryItem } from '../../model/types';

export const RATES_REGISTRY: CalculatorRegistryItem[] = [
    {
        id: 'ear',
        title: 'Effective Annual Rate',
        description: 'The true interest rate of an investment.',
        icon: 'bar-chart',
        category: 'Rates',
        load: () => import('../../config/ear.config')
    },
    {
        id: 'hpr',
        title: 'Holding Period Return',
        description: 'Total return over a period.',
        icon: 'hand-coins',
        category: 'Rates',
        load: () => import('../../config/hpr.config')
    },
    {
        id: 'rbd-eay',
        title: 'RBD & EAY',
        description: 'Discount and Annual Yields.',
        icon: 'zap',
        category: 'Rates',
        load: () => import('../../config/rbd-eay.config')
    }
];
