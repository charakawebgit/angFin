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
        console.log(`[CalculatorService] Loading config for: ${id}`);
        this.loading.set(true);
        this.currentConfig.set(null);

        const item = this.calculators().find((c) => c.id === id);
        if (item) {
            try {
                const result = await item.load() as { config: CalculatorConfig };

                if (result && result.config) {
                    this.configCache.set(id, result.config); // Cache it
                    this.currentConfig.set(result.config);
                    this.loading.set(false);
                    return result.config;
                } else {
                    console.error(`[CalculatorService] Loaded result for ${id} missing 'config' key:`, result);
                }
            } catch (error) {
                console.error(`[CalculatorService] Error loading calculator config for ${id}:`, error);
            }
        } else {
            console.warn(`[CalculatorService] No registry item found for id: ${id}`);
        }

        this.currentConfig.set(null);
        this.loading.set(false);
        return null;
    }
}
