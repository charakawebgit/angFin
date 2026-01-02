import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, required, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
  selector: 'app-capm',
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
        <app-card title="Systemic Risk Parameters" subtitle="Market conditions and asset sensitivity">
          <div class="space-y-5">
            <app-input
              id="riskFreeRate"
              label="Risk-Free Rate (%)"
              [field]="capmForm.riskFreeRate"
              type="number"
              placeholder="e.g. 2"
              suffix="%"
            />
            <app-input
              id="marketReturn"
              label="Expected Market Return (%)"
              [field]="capmForm.marketReturn"
              type="number"
              placeholder="e.g. 8"
              suffix="%"
            />
            <app-input
              id="beta"
              label="Asset Beta (β)"
              [field]="capmForm.beta"
              type="number"
              placeholder="e.g. 1.2"
              prefix="β"
            />
          </div>
        </app-card>

        <app-card title="Expected Return" subtitle="Market Equilibrium valuation">
          <div class="flex flex-col items-center justify-center h-full py-10 text-center">
            @if (capmForm().valid()) {
               <div class="space-y-6 w-full">
                <div class="relative inline-block">
                   <div class="absolute -inset-4 bg-rose-500/10 blur-2xl rounded-full"></div>
                   <div class="relative">
                      <span class="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-rose-600 to-pink-700 dark:from-rose-400 dark:to-pink-500 tracking-tight">
                        {{ result() | number: '1.2-4' }}%
                      </span>
                      <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-3">Required Return</p>
                   </div>
                </div>

                <div class="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex flex-col gap-1 items-center bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-2xl">
                   <p class="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      Market Risk Premium: <span class="text-rose-600 font-bold">{{ data().marketReturn - data().riskFreeRate | number: '1.1-2' }}%</span>
                   </p>
                   <p class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Risk-adjusted for β = {{ data().beta }}</p>
                </div>
              </div>
            } @else {
              <div class="text-slate-300 dark:text-slate-700 space-y-4 py-4">
                <lucide-icon name="target" class="w-16 h-16 mx-auto opacity-20" />
                <p class="text-sm font-medium italic">Fill parameters to see expected return</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Financial Insights">
         <div class="flex gap-4 items-start">
            <div class="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400">
               <lucide-icon name="lightbulb" class="w-5 h-5" />
            </div>
            <div class="space-y-3">
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                 The **Capital Asset Pricing Model (CAPM)** describes the relationship between systematic risk and expected return for assets, particularly stocks. 
                 It is widely used throughout finance for pricing risky securities and generating expected returns for assets given the risk of those assets and cost of capital.
              </p>
              <div class="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 font-mono text-xs text-center text-slate-500 dark:text-slate-400">
                Formula: E(Ri) = Rf + β * (Rm - Rf)
              </div>
            </div>
         </div>
      </app-card>
    </div>
  `,
})
export class CapmComponent {
  private financialService = inject(FinancialService);

  data = signal({
    riskFreeRate: 2,
    marketReturn: 8,
    beta: 1.2,
  });

  capmForm = form(this.data, (schema) => {
    required(schema.riskFreeRate);
    required(schema.marketReturn);
    required(schema.beta);
  });

  result = computed(() => {
    if (this.capmForm().invalid()) return 0;

    const d = this.data();
    return (
      this.financialService.calculateCapm({
        riskFreeRate: d.riskFreeRate / 100,
        marketReturn: d.marketReturn / 100,
        beta: d.beta,
      }) * 100
    );
  });
}
