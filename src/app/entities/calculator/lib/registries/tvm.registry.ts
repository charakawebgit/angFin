import { CalculatorRegistryItem } from '../../model/types';

export const TVM_REGISTRY: CalculatorRegistryItem[] = [
    {
        id: 'future-value',
        title: 'Future Value',
        description: 'Calculate the future value of an investment.',
        icon: 'trending-up',
        category: 'TVM',
        load: () => import('../../config/future-value.config')
    },
    {
        id: 'present-value',
        title: 'Present Value',
        description: 'Calculate the current worth of a future sum.',
        icon: 'hourglass',
        category: 'TVM',
        load: () => import('../../config/present-value.config')
    },
    {
        id: 'perpetuity',
        title: 'Perpetuity',
        description: 'Value of an endless stream of cash flows.',
        icon: 'percent',
        category: 'Valuation',
        load: () => import('../../config/perpetuity.config')
    }
];
