import { CalculatorRegistryItem } from '../../model/types';

export const VALUATION_REGISTRY: CalculatorRegistryItem[] = [
    {
        id: 'capm',
        title: 'CAPM',
        description: 'Capital Asset Pricing Model.',
        icon: 'trending-up',
        category: 'Valuation',
        load: () => import('../../config/valuation/capm.config')
    },
    {
        id: 'ddm',
        title: 'Dividend Discount Model',
        description: 'Stock valuation based on dividends.',
        icon: 'coins',
        category: 'Valuation',
        load: () => import('../../config/valuation/ddm.config')
    },
    {
        id: 'bond-valuation',
        title: 'Bond Valuation',
        description: 'Price of a bond based on yield.',
        icon: 'banknote',
        category: 'Valuation',
        load: () => import('../../config/valuation/bond-valuation.config')
    },
    {
        id: 'black-scholes',
        title: 'Black-Scholes',
        description: 'Option pricing model.',
        icon: 'sigma',
        category: 'Valuation',
        load: () => import('../../config/valuation/black-scholes.config')
    },
    {
        id: 'hpr',
        title: 'Holding Period Return',
        description: 'Total return over a period.',
        icon: 'hand-coins',
        category: 'Valuation',
        load: () => import('../../config/valuation/hpr.config')
    }
];
