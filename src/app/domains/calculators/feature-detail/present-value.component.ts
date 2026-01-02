import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { InputComponent } from '@shared/ui/input.component';
import { CardComponent } from '@shared/ui/card.component';

@Component({
  selector: 'app-present-value',
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
        <app-card title="Valuation Parameters" subtitle="Specify future cash flow and discounting rate">
          <div class="space-y-5">
            <app-input
              id="futureValue"
              label="Future Value (FV)"
              [field]="pvForm.fv"
              type="number"
              prefix="$"
              placeholder="e.g. 1000"
            />
            <app-input
              id="discountRate"
              label="Discount Rate per Period (%)"
              [field]="pvForm.rate"
              type="number"
              suffix="%"
              placeholder="e.g. 5"
            />
            <app-input
              id="numberOfPeriods"
              label="Number of Periods"
              [field]="pvForm.periods"
              type="number"
              placeholder="e.g. 10"
            />
          </div>
        </app-card>

        <app-card title="Present Value" subtitle="Estimated current worth">
          <div class="flex flex-col items-center justify-center h-full py-10 text-center">
            @if (pvForm().valid()) {
               <div class="space-y-6 w-full">
                <div class="relative inline-block">
                   <div class="absolute -inset-4 bg-indigo-500/10 blur-2xl rounded-full"></div>
                   <div class="relative">
                      <span class="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-blue-700 dark:from-indigo-400 dark:to-blue-500 tracking-tight">
                        {{ result() | currency }}
                      </span>
                      <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-3">Current Valuation</p>
                   </div>
                </div>

                <div class="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex flex-col gap-1 items-center bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-2xl">
                   <p class="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      Value of <span class="text-indigo-600 font-bold">{{ data().fv | currency }}</span> received in <span class="text-indigo-600 font-bold">{{ data().periods }} periods</span>
                   </p>
                   <p class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Discounted at {{ data().rate }}% per period</p>
                </div>
              </div>
            } @else {
              <div class="text-slate-300 dark:text-slate-700 space-y-4 py-4">
                <lucide-icon name="hourglass" class="w-16 h-16 mx-auto opacity-20" />
                <p class="text-sm font-medium italic">Enter parameters to calculate present value</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Financial Insights">
         <div class="flex gap-4 items-start">
            <div class="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
               <lucide-icon name="lightbulb" class="w-5 h-5" />
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
               **Present Value (PV)** represents the current value of a future sum of money or stream of cash flows given a specified rate of return. 
               This is a fundamental concept in finance, used to evaluate investments, loans, and other financial instruments by accounting for the **Time Value of Money**.
            </p>
         </div>
      </app-card>
    </div>
  `,
})
export class PresentValueComponent {
  private readonly financialService = inject(FinancialService);

  data = signal({
    fv: 1000,
    rate: 5,
    periods: 10,
  });

  pvForm = form(this.data, (schema) => {
    required(schema.fv);
    min(schema.fv, 0);
    required(schema.rate);
    min(schema.rate, 0);
    required(schema.periods);
    min(schema.periods, 1);
  });

  result = computed(() => {
    if (this.pvForm().invalid()) return 0;

    const d = this.data();
    return this.financialService.calculatePresentValue({
      fv: d.fv,
      rate: d.rate / 100,
      periods: d.periods,
    });
  });
}
