import { Component, computed, inject, signal, input, ChangeDetectionStrategy, linkedSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CalculatorService } from '@entities/calculator/model/calculator.service';
import { CalculatorData } from '@entities/calculator/model/types';
import { CalculatorFormComponent } from '@features/calculator-workspace/ui/calculator-form.component';
import { CalculatorResultsComponent } from '@features/calculator-workspace/ui/calculator-results.component';
import { CalculatorInfoComponent } from '@features/calculator-workspace/ui/calculator-info.component';

@Component({
  selector: 'app-dynamic-calculator',
  imports: [
    CommonModule,
    LucideAngularModule,
    CalculatorFormComponent,
    CalculatorResultsComponent,
    CalculatorInfoComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (config()) {
      <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
           <app-calculator-form 
             [config]="config()!" 
             [data]="data()" 
             (valid)="setValid($event)"
             (dataChanged)="updateData($event.key, $event.value)" 
           />

           <app-calculator-results 
             [config]="config()!" 
             [results]="results()" 
             [isValid]="isValid()" 
           />
        </div>

        <app-calculator-info [config]="config()!" />
      </div>
    } @else {
      <div class="max-w-4xl mx-auto flex flex-col items-center justify-center py-20 text-center space-y-4">
        <lucide-icon name="search-x" class="w-16 h-16 text-slate-300 dark:text-slate-700" />
        <div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Calculator Not Found</h2>
          <p class="text-slate-500">The calculator you are looking for might have been moved or doesn't exist.</p>
        </div>
        <a href="/" class="px-6 h-12 inline-flex items-center justify-center bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
          Return to Dashboard
        </a>
      </div>
    }
  `,
})
export class DynamicCalculatorComponent {
  id = input.required<string>();

  private calcService = inject(CalculatorService);
  isValid = signal(false);

  // Single Source of Truth: Consume directly from the service
  config = this.calcService.activeConfig;

  data = linkedSignal<CalculatorData>(() => {
    const cfg = this.config();
    if (!cfg) return {};

    const initialData: CalculatorData = {};
    cfg.fields.forEach(f => {
      initialData[f.key] = f.defaultValue as CalculatorData[string];
    });
    return initialData;
  });

  results = computed(() => {
    const cfg = this.config();
    if (!cfg || !this.isValid()) return [];

    const d = this.data();
    // Optimization: The computation is fast, but if it becomes heavy, 
    // we can wrap this in a `toSignal` with debounce.
    return cfg.results.map(res => {
      try {
        return res.calculate(d);
      } catch (e) {
        console.error('Calculation Error:', e);
        return 0;
      }
    });
  });

  updateData(key: string, value: import('@entities/calculator/model/types').CalculatorData[string]) {
    this.data.update(d => ({ ...d, [key]: value }));
  }

  setValid(v: boolean) {
    this.isValid.set(v);
  }
}
