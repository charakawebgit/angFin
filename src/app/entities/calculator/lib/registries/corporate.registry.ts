import { CalculatorRegistryItem } from '../../model/types';

export const CORPORATE_REGISTRY: CalculatorRegistryItem[] = [
    {
        id: 'irr',
        title: 'IRR',
        description: 'Internal Rate of Return for cash flows.',
        icon: 'move-horizontal',
        category: 'Capital Budgeting',
        load: () => import('../../config/corp-finance/irr.config')
    },
    {
        id: 'npv',
        title: 'NPV',
        description: 'Net Present Value of cash flows.',
        icon: 'bar-chart-4',
        category: 'Capital Budgeting',
        load: () => import('../../config/corp-finance/npv.config')
    },
    {
        id: 'wacc',
        title: 'WACC',
        description: 'Weighted Average Cost of Capital.',
        icon: 'variable',
        category: 'Valuation',
        load: () => import('../../config/corp-finance/wacc.config')
    },
    {
        id: 'dupont',
        title: 'DuPont Analysis',
        description: 'Breaking down ROE.',
        icon: 'pyramid',
        category: 'Ratios',
        load: () => import('../../config/ratios/dupont.config')
    },
    {
        id: 'financial-ratios',
        title: 'Financial Ratios',
        description: 'Key performance indicators.',
        icon: 'activity',
        category: 'Ratios',
        load: () => import('../../config/ratios/financial-ratios.config')
    }
];
