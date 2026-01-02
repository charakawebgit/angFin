import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
  selector: 'app-ear',
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
        <app-card title="Compounding Details" subtitle="Enter your nominal rate and compounding frequency">
          <div class="space-y-5">
            <app-input
              id="nominalRate"
              label="Nominal Annual Rate (%)"
              [field]="earForm.rate"
              type="number"
              placeholder="e.g. 5"
              suffix="%"
            />
            <app-input
              id="compoundingPeriods"
              label="Compounding Periods per Year"
              [field]="earForm.periods"
              type="number"
              placeholder="e.g. 12 for monthly"
            />
          </div>
        </app-card>

        <app-card title="Effective Annual Return" subtitle="Actual yield after compounding">
          <div class="flex flex-col items-center justify-center h-full py-10 text-center">
            @if (earForm().valid()) {
               <div class="space-y-6 w-full">
                <div class="relative inline-block">
                   <div class="absolute -inset-4 bg-amber-500/10 blur-2xl rounded-full"></div>
                   <div class="relative">
                      <span class="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-amber-600 to-orange-700 dark:from-amber-400 dark:to-orange-500 tracking-tight">
                        {{ result() | number: '1.2-4' }}%
                      </span>
                      <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-3">Actual Annual Yield</p>
                   </div>
                </div>

                <div class="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex flex-col gap-1 items-center bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-2xl">
                   <p class="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      Compounded <span class="text-amber-600 font-bold">{{ data().periods }} times</span> per year
                   </p>
                   <p class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Nominal rate of {{ data().rate }}%</p>
                </div>
              </div>
            } @else {
              <div class="text-slate-300 dark:text-slate-700 space-y-4 py-4">
                <lucide-icon name="percent" class="w-16 h-16 mx-auto opacity-20" />
                <p class="text-sm font-medium italic">Enter valid inputs to see the effective yield</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Financial Insights">
         <div class="flex gap-4 items-start">
            <div class="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
               <lucide-icon name="lightbulb" class="w-5 h-5" />
            </div>
            <div class="space-y-3">
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                 The **Effective Annual Return (EAR)** is the real return on a savings account or any interest-paying investment when compounding is taken into account. 
                 The more frequent the compounding, the higher the EAR compared to the nominal rate.
              </p>
              <div class="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 font-mono text-xs text-center text-slate-500 dark:text-slate-400">
                Formula: EAR = (1 + Nominal Rate / m)^m - 1
              </div>
            </div>
         </div>
      </app-card>
    </div>
  `,
})
export class EarComponent {
  private financialService = inject(FinancialService);

  data = signal({
    rate: 5,
    periods: 12,
  });

  earForm = form(this.data, (schema) => {
    required(schema.rate);
    min(schema.rate, 0);
    required(schema.periods);
    min(schema.periods, 1);
  });

  result = computed(() => {
    if (this.earForm().invalid()) return 0;

    const d = this.data();
    return (
      this.financialService.calculateEffectiveAnnualReturn({
        rate: d.rate / 100,
        periods: d.periods,
      }) * 100
    );
  });
}
