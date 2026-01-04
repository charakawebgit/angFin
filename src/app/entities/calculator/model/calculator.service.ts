import { Injectable, signal } from '@angular/core';
import { CalculatorDef, CalculatorConfig, CalculatorRegistryItem } from '@entities/calculator/model/types';
import { CALCULATORS_REGISTRY } from '@entities/calculator/lib/registry';

@Injectable({
    providedIn: 'root',
})
export class CalculatorService {
    private calculators = signal<CalculatorRegistryItem[]>(CALCULATORS_REGISTRY);

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

    async loadConfig(id: string): Promise<void> {
        console.log(`[CalculatorService] Loading config for: ${id}`);
        this.loading.set(true);
        this.currentConfig.set(null);

        const item = this.calculators().find((c) => c.id === id);
        if (item) {
            try {
                const result = await item.load();
                console.log(`[CalculatorService] Successfully loaded config for ${id}:`, result);

                // Every registry item returns an object with a 'config' key
                if (result && result['config']) {
                    this.currentConfig.set(result['config']);
                } else {
                    console.error(`[CalculatorService] Loaded result for ${id} missing 'config' key:`, result);
                    this.currentConfig.set(null);
                }
            } catch (error) {
                console.error(`[CalculatorService] Error loading calculator config for ${id}:`, error);
                this.currentConfig.set(null);
            }
        } else {
            console.warn(`[CalculatorService] No registry item found for id: ${id}`);
        }

        this.loading.set(false);
    }
}
