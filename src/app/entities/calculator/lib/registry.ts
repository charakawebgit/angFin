import { CalculatorRegistryItem } from '../model/types';
import { TVM_REGISTRY } from './registries/tvm.registry';
import { RATES_REGISTRY } from './registries/rates.registry';
import { INVESTMENTS_REGISTRY } from './registries/investments.registry';
import { CORPORATE_REGISTRY } from './registries/corporate.registry';
import { STATS_REGISTRY } from './registries/stats.registry';
import { OTHER_REGISTRY } from './registries/other.registry';

export const CALCULATORS_REGISTRY: CalculatorRegistryItem[] = [
    ...TVM_REGISTRY,
    ...RATES_REGISTRY,
    ...INVESTMENTS_REGISTRY,
    ...CORPORATE_REGISTRY,
    ...STATS_REGISTRY,
    ...OTHER_REGISTRY
];
