import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
  selector: 'app-perpetuity',
  standalone: true,
  imports: [
    LucideAngularModule,
    CardComponent,
    InputComponent,
    Field,
    CurrencyPipe,
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <app-card title="Cash Flow Parameters" subtitle="Define the infinite payment stream and rate">
          <div class="space-y-5">
            <app-input
              id="pmt"
              label="Periodic Payment"
              [field]="perpForm.pmt"
              type="number"
              placeholder="e.g. 100"
              prefix="$"
            />
            <app-input
              id="rate"
              label="Discount Rate (%)"
              [field]="perpForm.rate"
              type="number"
              placeholder="e.g. 5"
              suffix="%"
            />
          </div>
        </app-card>

        <app-card title="Present Value" subtitle="Infinite stream valuation">
          <div class="flex flex-col items-center justify-center h-full py-10 text-center">
            @if (perpForm().valid()) {
              <div class="space-y-6 w-full">
                <div class="relative inline-block">
                   <div class="absolute -inset-4 bg-emerald-500/10 blur-2xl rounded-full"></div>
                   <div class="relative">
                      <span class="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-400 dark:to-teal-500 tracking-tight">
                        {{ result() | currency }}
                      </span>
                      <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-3">Total Present Worth</p>
                   </div>
                </div>

                <div class="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex flex-col gap-1 items-center bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-2xl">
                   <p class="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      Infinite payments of <span class="text-emerald-600 font-bold">{{ data().pmt | currency }}</span>
                   </p>
                   <p class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Discounted indefinitely at {{ data().rate }}%</p>
                </div>
              </div>
            } @else {
              <div class="text-slate-300 dark:text-slate-700 space-y-4 py-4">
                <lucide-icon name="shield-check" class="w-16 h-16 mx-auto opacity-20" />
                <p class="text-sm font-medium italic">Enter valid values to see valuation</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Financial Insights">
         <div class="flex gap-4 items-start">
            <div class="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
               <lucide-icon name="lightbulb" class="w-5 h-5" />
            </div>
            <div class="space-y-3">
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                 A **Perpetuity** is an infinite series of equal payments made at regular intervals. Common examples include preferred stock dividends or British Consols.
              </p>
              <div class="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 font-mono text-xs text-center text-slate-500 dark:text-slate-400">
                Formula: PV = Payment / Rate
              </div>
            </div>
         </div>
      </app-card>
    </div>
  `,
})
export class PerpetuityComponent {
  private financialService = inject(FinancialService);

  data = signal({
    pmt: 100,
    rate: 5,
  });

  perpForm = form(this.data, (schema) => {
    required(schema.pmt);
    min(schema.pmt, 0);
    required(schema.rate);
    min(schema.rate, 0.0001);
  });

  result = computed(() => {
    if (this.perpForm().invalid()) return 0;

    const d = this.data();
    return this.financialService.calculatePerpetuity({
      pmt: d.pmt,
      rate: d.rate / 100,
    });
  });
}
