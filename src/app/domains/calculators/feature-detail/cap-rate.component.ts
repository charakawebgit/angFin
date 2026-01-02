import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
  selector: 'app-cap-rate',
  standalone: true,
  imports: [
    LucideAngularModule,
    CardComponent,
    InputComponent,
    Field,
    DecimalPipe,
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <app-card title="Property Income" subtitle="Define the annual net income and property market value">
          <div class="space-y-5">
            <app-input
              id="noi"
              label="Net Operating Income (NOI)"
              [field]="capForm.noi"
              type="number"
              placeholder="e.g. 50000"
              prefix="$"
            />
            <app-input
              id="propertyValue"
              label="Property Value"
              [field]="capForm.propertyValue"
              type="number"
              placeholder="e.g. 1000000"
              prefix="$"
            />
          </div>
        </app-card>

        <app-card title="Capitalization Rate" subtitle="Real estate return metric">
          <div class="flex flex-col items-center justify-center h-full py-10 text-center">
            @if (capForm().valid()) {
               <div class="space-y-6 w-full">
                <div class="relative inline-block">
                   <div class="absolute -inset-4 bg-sky-500/10 blur-2xl rounded-full"></div>
                   <div class="relative">
                      <span class="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-sky-600 to-blue-700 dark:from-sky-400 dark:to-blue-500 tracking-tight">
                        {{ result() | number: '1.2-2' }}%
                      </span>
                      <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-3">Estimated Cap Rate</p>
                   </div>
                </div>

                <div class="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex flex-col gap-1 items-center bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-2xl">
                   <p class="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      Generating <span class="text-sky-600 font-bold">{{ data().noi | number }}</span> annual income
                   </p>
                   <p class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">On a {{ data().propertyValue | number }} property valuation</p>
                </div>
              </div>
            } @else {
              <div class="text-slate-300 dark:text-slate-700 space-y-4 py-4">
                <lucide-icon name="building" class="w-16 h-16 mx-auto opacity-20" />
                <p class="text-sm font-medium italic">Enter valid values to see the cap rate</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Financial Insights">
         <div class="flex gap-4 items-start">
            <div class="p-2 rounded-xl bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400">
               <lucide-icon name="lightbulb" class="w-5 h-5" />
            </div>
            <div class="space-y-3">
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                 The **Capitalization Rate (Cap Rate)** is the ratio of Net Operating Income (NOI) to property asset value. 
                 It is used to compare different real estate investments and estimate the return on a property without considering financing.
              </p>
              <div class="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 font-mono text-xs text-center text-slate-500 dark:text-slate-400">
                Formula: Cap Rate = (NOI / Property Value) * 100
              </div>
            </div>
         </div>
      </app-card>
    </div>
  `,
})
export class CapRateComponent {
  private financialService = inject(FinancialService);

  data = signal({
    noi: 50000,
    propertyValue: 1000000,
  });

  capForm = form(this.data, (schema) => {
    required(schema.noi);
    min(schema.noi, 0);
    required(schema.propertyValue);
    min(schema.propertyValue, 1);
  });

  result = computed(() => {
    if (this.capForm().invalid()) return 0;
    const d = this.data();

    return this.financialService.calculateCapRate({
      noi: d.noi,
      propertyValue: d.propertyValue,
    }) * 100;
  });
}
