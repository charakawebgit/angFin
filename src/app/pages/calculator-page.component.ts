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
      <div class="w-full max-w-[1920px] mx-auto animate-in fade-in duration-700">
        
        <!-- Desktop: Split Pane Layout -->
        <div class="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
           
           <!-- Left Pane: Inputs (Scrollable independent of results if needed, but here we keep it simple) -->
           <div class="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 p-6 lg:p-8 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 z-10">
              <div class="lg:sticky lg:top-24 space-y-8">
                 <div class="mb-6">
                    <h1 class="text-2xl font-bold text-slate-900 tracking-tight">{{ config()?.title }}</h1>
                    <p class="text-slate-500 mt-1 text-sm">{{ config()?.subtitle }}</p>
                 </div>

                 <app-calculator-form 
                   [config]="config()!" 
                   [data]="data()" 
                   (valid)="setValid($event)"
                   (dataChanged)="updateData($event.key, $event.value)" 
                 />
              </div>
           </div>

           <!-- Right Pane: Results (Main Content Area) -->
           <div class="flex-grow bg-white p-6 lg:p-8">
             <div class="max-w-5xl mx-auto space-y-8">
               <app-calculator-results 
                 [config]="config()!" 
                 [results]="results()" 
                 [isValid]="isValid()" 
               />
               
               <app-calculator-info [config]="config()!" />
             </div>
           </div>

        </div>

        <!-- Mobile Sticky Result Bar (Only visible on small screens) -->
        <div class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] h-16 safe-area-bottom px-4">
             <app-calculator-results 
               [config]="config()!" 
               [results]="results()" 
               [isValid]="isValid()"
               viewMode="compact"
             />
        </div>
      </div>
    } @else {
      <div class="max-w-4xl mx-auto flex flex-col items-center justify-center py-20 text-center space-y-4">
        <lucide-icon name="search-x" class="w-16 h-16 text-slate-300" />
        <div>
          <h2 class="text-xl font-bold text-slate-900">Calculator Not Found</h2>
          <p class="text-slate-500">The calculator you are looking for might have been moved or doesn't exist.</p>
        </div>
        <a href="/" class="px-6 h-12 inline-flex items-center justify-center bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
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
      } catch (e: unknown) {
        console.error('Calculation Error:', e);
        return 0;
      }
    });
  });

  updateData(key: string, value: CalculatorData[string]) {
    this.data.update(d => ({ ...d, [key]: value }));
  }

  setValid(v: boolean) {
    this.isValid.set(v);
  }
}
