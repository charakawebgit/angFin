import { Injectable, signal } from '@angular/core';
import { CalculatorDef, CalculatorConfig, CalculatorRegistryItem } from '@entities/calculator/model/types';
import { CALCULATORS_REGISTRY } from '@entities/calculator/lib/registry';

@Injectable({
    providedIn: 'root',
})
export class CalculatorService {
    private calculators = signal<CalculatorRegistryItem[]>(CALCULATORS_REGISTRY); // Signal for potential future dynamic registry updates
    private configCache = new Map<string, CalculatorConfig>();

    private currentConfig = signal<CalculatorConfig | null>(null);
    private loading = signal(false);

    get calculatorsList() {
        return this.calculators.asReadonly();
    }

    get activeConfig() {
        return this.currentConfig.asReadonly();
    }

    get isLoading() {
        return this.loading.asReadonly();
    }

    getById(id: string): CalculatorDef | undefined {
        return this.calculators().find((c) => c.id === id);
    }

    async loadConfig(id: string): Promise<CalculatorConfig | null> {
        // 1. Check Cache
        if (this.configCache.has(id)) {
            const config = this.configCache.get(id)!;
            this.currentConfig.set(config);
            this.loading.set(false);
            return config;
        }

        // 2. Load from Registry
        this.loading.set(true);

        try {
            const item = this.calculators().find((c) => c.id === id);

            if (item) {
                // Strictly typed module loading expecting default export (angcF style)
                const module = await item.load() as { default: CalculatorConfig };
                const config = module.default;

                if (config) {
                    this.configCache.set(id, config);
                    this.currentConfig.set(config);
                    return config;
                } else {
                    console.error(`[CalculatorService] Module for ${id} missing default export:`, module);
                    throw new Error(`Module for ${id} missing default export`);
                }
            }

            // Only clear if load failed (item not found)
            this.currentConfig.set(null);
            return null;

        } catch (error: unknown) {
            console.error(`[CalculatorService] Failed to load ${id}:`, error);
            this.currentConfig.set(null);
            return null;
        } finally {
            this.loading.set(false);
        }
    }
}
