import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { DynamicListInputComponent } from '@shared/ui/dynamic-list-input.component';

@Component({
  selector: 'app-irr',
  standalone: true,
  imports: [
    LucideAngularModule,
    CardComponent,
    DynamicListInputComponent,
    DecimalPipe,
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <app-card title="Cash Flow Series" subtitle="Analyze investment profitability over time">
          <div class="space-y-6">
            <app-dynamic-list-input
              id="cash-flows-list"
              label="Periodic Cash Flows"
              [items]="cashFlows()"
              (changed)="cashFlows.set($event)"
              placeholderPrefix="Year"
              prefix="$"
              [minItems]="2"
            />
            
            <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 flex gap-3 items-start">
              <lucide-icon name="info" class="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p class="text-xs text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
                <span class="font-bold">Pro Tip:</span> Initial investment (Year 0) should typically be a negative value (cash outflow).
              </p>
            </div>
          </div>
        </app-card>

        <app-card title="Internal Rate of Return" subtitle="Calculated yield (IRR)">
          <div class="flex flex-col items-center justify-center h-full py-10 text-center">
            @if (allValid() && result() !== null) {
              <div class="space-y-6 w-full">
                <div class="relative inline-block">
                   <div class="absolute -inset-4 bg-blue-500/10 blur-2xl rounded-full"></div>
                   <div class="relative">
                      <span class="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500 tracking-tight">
                        {{ result()! * 100 | number: '1.2-4' }}%
                      </span>
                      <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-3">Annualized Return</p>
                   </div>
                </div>

                <div class="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex flex-col gap-1 items-center bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-2xl">
                   <p class="text-xs font-semibold text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                      The IRR is the discount rate that makes the <span class="text-blue-600 font-bold">NPV of all cash flows equal to zero</span>.
                   </p>
                </div>
              </div>
            } @else if (allValid() && result() === null) {
              <div class="text-amber-500 dark:text-amber-400 space-y-4 py-4">
                <lucide-icon name="alert-triangle" class="w-16 h-16 mx-auto opacity-30" />
                <p class="text-sm font-medium italic max-w-[200px] mx-auto">Could not find IRR for this series. Check the signs of your cash flows.</p>
              </div>
            } @else {
              <div class="text-slate-300 dark:text-slate-700 space-y-4 py-4">
                <lucide-icon name="activity" class="w-16 h-16 mx-auto opacity-20" />
                <p class="text-sm font-medium italic">Enter at least two cash flows to calculate IRR</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Expert Analysis">
         <div class="flex gap-4 items-start">
            <div class="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
               <lucide-icon name="brain" class="w-5 h-5" />
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
               The **IRR** is a critical metric for capital budgeting. It represents the efficiency of an investment. 
               However, it assumes that intermediate cash flows are reinvested at the same IRR, which might not always be realistic (Modified IRR is an alternative for such cases).
            </p>
         </div>
      </app-card>
    </div>
  `,
})
export class IrrComponent {
  private financialService = inject(FinancialService);

  cashFlows = signal<(number | string)[]>([-10000, 3000, 4200, 5800]);

  allValid = computed(() => {
    const cf = this.cashFlows();
    return (
      cf.length >= 2 &&
      cf.every((v) => v !== null && v !== undefined && v !== '' && !isNaN(Number(v)))
    );
  });

  result = computed(() => {
    if (!this.allValid()) return null;
    return this.financialService.calculateIrr({ cashFlows: this.cashFlows().map(Number) });
  });
}
