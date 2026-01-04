import { Component, computed, inject, signal, input, ChangeDetectionStrategy, linkedSignal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CalculatorService } from '../data/calculator.service';
import { CalculatorData } from '../data/models';
import { CalculatorFormComponent } from './ui/calculator-form.component';
import { CalculatorResultsComponent } from './ui/calculator-results.component';
import { CalculatorInfoComponent } from './ui/calculator-info.component';

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
    @if (isLoading()) {
      <div class="max-w-4xl mx-auto flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-700">
        <div class="relative">
          <div class="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
          <lucide-icon name="calculator" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-500 animate-pulse" />
        </div>
        <p class="mt-8 text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest animate-pulse">Initializing Engine...</p>
      </div>
    } @else if (config()) {
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

  config = this.calcService.activeConfig;
  isLoading = this.calcService.isLoading;
  isValid = signal(false);

  constructor() {
    effect(() => {
      const toolId = this.id();
      this.calcService.loadConfig(toolId);
    });
  }

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
    return cfg.results.map(res => {
      try {
        return res.calculate(d);
      } catch (e) {
        console.error('Calculation Error:', e);
        return 0;
      }
    });
  });

  updateData(key: string, value: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    this.data.update(d => ({ ...d, [key]: value }));
  }

  setValid(v: boolean) {
    this.isValid.set(v);
  }
}
