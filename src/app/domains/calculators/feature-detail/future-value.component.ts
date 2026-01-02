import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { InputComponent } from '@shared/ui/input.component';
import { CardComponent } from '@shared/ui/card.component';

@Component({
  selector: 'app-future-value',
  standalone: true,
  imports: [
    LucideAngularModule,
    InputComponent,
    CardComponent,
    CurrencyPipe,
    Field,
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <app-card title="Investment Parameters" subtitle="Define your starting capital and growth expectations">
          <div class="space-y-5">
            <app-input
              id="presentValue"
              label="Present Value (PV)"
              [field]="fvForm.pv"
              type="number"
              prefix="$"
              placeholder="e.g. 1000"
            />
            <app-input
              id="annualInterestRate"
              label="Annual Interest Rate (%)"
              [field]="fvForm.rate"
              type="number"
              suffix="%"
              placeholder="e.g. 7"
            />
            <app-input
              id="periods"
              label="Investment Period (Years)"
              [field]="fvForm.periods"
              type="number"
              placeholder="e.g. 10"
            />
          </div>
        </app-card>

        <app-card title="Growth Projection" subtitle="Estimated value at end of term">
          <div class="flex flex-col items-center justify-center h-full py-10 text-center">
            @if (fvForm().valid()) {
              <div class="space-y-6 w-full">
                <div class="relative inline-block">
                   <div class="absolute -inset-4 bg-blue-500/10 blur-2xl rounded-full"></div>
                   <div class="relative">
                      <span class="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500 tracking-tight">
                        {{ result() | currency }}
                      </span>
                      <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-3">Total Estimated Value</p>
                   </div>
                </div>

                <div class="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex flex-col gap-1 items-center bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-2xl">
                   <p class="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      Projection after <span class="text-blue-600 font-bold">{{ data().periods }} years</span>
                   </p>
                   <p class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Based on continuous compound interest assumptions</p>
                </div>
              </div>
            } @else {
              <div class="text-slate-300 dark:text-slate-700 space-y-4 py-4">
                <lucide-icon name="trending-up" class="w-16 h-16 mx-auto opacity-20" />
                <p class="text-sm font-medium italic">Enter valid parameters to see projections</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Financial Insights">
         <div class="flex gap-4 items-start">
            <div class="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
               <lucide-icon name="lightbulb" class="w-5 h-5" />
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
               The **Time Value of Money (TVM)** principle states that money available now is worth more than the same amount in the future due to its potential earning capacity. 
               This calculation assumes the annual interest is compounded. Small changes in the interest rate can significantly impact the final result over long periods.
            </p>
         </div>
      </app-card>
    </div>
  `,
})
export class FutureValueComponent {
  private readonly financialService = inject(FinancialService);

  data = signal({
    pv: 1000,
    rate: 5,
    periods: 10,
  });

  fvForm = form(this.data, (schema) => {
    required(schema.pv);
    min(schema.pv, 0);
    required(schema.rate);
    min(schema.rate, 0);
    required(schema.periods);
    min(schema.periods, 1);
  });

  result = computed(() => {
    if (this.fvForm().invalid()) return 0;

    const d = this.data();
    return this.financialService.calculateFutureValue({
      pv: d.pv,
      rate: d.rate / 100,
      periods: d.periods,
    });
  });
}
