import { Injectable, signal } from '@angular/core';
import { CalculatorDef, CalculatorConfig } from './models';
import { CALCULATORS_REGISTRY } from './calculators.registry';

@Injectable({
    providedIn: 'root',
})
export class CalculatorService {
    private calculators = signal<CalculatorConfig[]>(CALCULATORS_REGISTRY);

    get calculatorsList() {
        return this.calculators.asReadonly();
    }

    getById(id: string): CalculatorDef | undefined {
        return this.calculators().find((c) => c.id === id);
    }

    getConfigById(id: string): CalculatorConfig | undefined {
        return this.calculators().find((c) => c.id === id);
    }
}
