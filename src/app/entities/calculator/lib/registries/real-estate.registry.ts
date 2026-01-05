import { CalculatorRegistryItem } from '../../model/types';

export const REAL_ESTATE_REGISTRY: CalculatorRegistryItem[] = [
    {
        id: 'amortization',
        title: 'Amortization',
        description: 'Loan payment schedule.',
        icon: 'table',
        category: 'Real Estate',
        load: () => import('../../config/real-estate/amortization.config')
    },
    {
        id: 'cap-rate',
        title: 'Cap Rate',
        description: 'Real estate capitalization rate.',
        icon: 'building',
        category: 'Real Estate',
        load: () => import('../../config/real-estate/cap-rate.config')
    }
];
