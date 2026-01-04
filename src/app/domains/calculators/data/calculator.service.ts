import { Injectable, signal } from '@angular/core';
import { CalculatorDef, CalculatorConfig, CalculatorRegistryItem } from './models';
import { CALCULATORS_REGISTRY } from './calculators.registry';

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
        this.loading.set(true);
        this.currentConfig.set(null);

        const item = this.calculators().find((c) => c.id === id);
        if (item) {
            try {
                const result = await item.load();
                // Every registry item returns an object with a 'config' key
                this.currentConfig.set(result['config']);
            } catch (error) {
                console.error(`Error loading calculator config for ${id}:`, error);
                this.currentConfig.set(null);
            }
        }

        this.loading.set(false);
    }
}
