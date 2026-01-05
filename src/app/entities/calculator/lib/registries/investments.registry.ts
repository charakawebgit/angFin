import { CalculatorRegistryItem } from '../../model/types';

export const INVESTMENTS_REGISTRY: CalculatorRegistryItem[] = [
    {
        id: 'capm',
        title: 'CAPM',
        description: 'Capital Asset Pricing Model.',
        icon: 'shield-check',
        category: 'Equities',
        load: () => import('../../config/capm.config')
    },
    {
        id: 'ddm',
        title: 'Dividend Discount Model',
        description: 'Stock valuation based on dividends.',
        icon: 'ratio',
        category: 'Equities',
        load: () => import('../../config/ddm.config')
    },
    {
        id: 'bond-valuation',
        title: 'Bond Valuation',
        description: 'Calculate fair value of a bond.',
        icon: 'banknote',
        category: 'Fixed Income',
        load: () => import('../../config/bond-valuation.config')
    },
    {
        id: 'ytm',
        title: 'Yield to Maturity',
        description: 'Total return anticipated on a bond.',
        icon: 'calendar-check',
        category: 'Fixed Income',
        load: () => import('../../config/ytm.config')
    },
    {
        id: 'duration',
        title: 'Bond Duration',
        description: 'Macaulay and Modified duration.',
        icon: 'baseline',
        category: 'Fixed Income',
        load: () => import('../../config/duration.config')
    },
    {
        id: 'convexity',
        title: 'Bond Convexity',
        description: 'Price sensitivity adjustment.',
        icon: 'baseline',
        category: 'Fixed Income',
        load: () => import('../../config/convexity.config')
    }
];
