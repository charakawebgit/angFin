import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, required, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
  selector: 'app-portfolio-risk',
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
        <app-card title="Asset Parameters" subtitle="Specify weights and individual risks">
          <div class="space-y-5">
             <div class="grid grid-cols-2 gap-5">
                <app-input id="weight1" label="Weight 1" [field]="riskForm.w1" type="number" suffix="%" />
                <app-input id="stdDev1" label="Std Dev 1" [field]="riskForm.s1" type="number" suffix="%" />
             </div>
             <div class="grid grid-cols-2 gap-5">
                <app-input id="weight2" label="Weight 2" [field]="riskForm.w2" [field]="riskForm.w2" type="number" suffix="%" />
                <app-input id="stdDev2" label="Std Dev 2" [field]="riskForm.s2" type="number" suffix="%" />
             </div>
             <app-input id="correlation" label="Correlation (ρ)" [field]="riskForm.corr" type="number" placeholder="-1.0 to 1.0" />
          </div>
        </app-card>

        <app-card title="Portfolio Risk" subtitle="Calculated volatility (σp)">
          <div class="flex flex-col items-center justify-center h-full py-10 text-center">
            @if (riskForm().valid()) {
              <div class="space-y-6 w-full">
                <div class="relative inline-block">
                   <div class="absolute -inset-4 bg-blue-500/10 blur-2xl rounded-full"></div>
                   <div class="relative">
                      <span class="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500">
                        {{ result() | number: '1.2-4' }}%
                      </span>
                      <p class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">Standard Deviation</p>
                   </div>
                </div>

                <div class="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-2xl">
                   <div class="text-left">
                      <p class="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tighter">Diversification Effect</p>
                      <p class="text-sm font-semibold text-slate-600 dark:text-slate-400 italic">Risk reduction benefit</p>
                   </div>
                   <span class="text-xl font-bold text-emerald-500 dark:text-emerald-400">
                     -{{ diversification() | number: '1.2-4' }}%
                   </span>
                </div>
              </div>
            } @else {
              <div class="text-slate-300 dark:text-slate-700 space-y-4 py-4">
                <lucide-icon name="scatter-chart" class="w-16 h-16 mx-auto opacity-20" />
                <p class="text-sm font-medium italic">Provide valid parameters to calculate risk</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Insights & Analysis">
         <div class="flex gap-4 items-start">
            <div class="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
               <lucide-icon name="brain-circuit" class="w-5 h-5" />
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
               The portfolio standard deviation measures the total volatility. 
               Because assets are rarely perfectly correlated (Correlation < 1), the portfolio risk is 
               typically lower than the weighted average of individual risks—this is the **diversification benefit**. 
               Ideally, combining uncorrelated or negatively correlated assets maximizes this effect.
            </p>
         </div>
      </app-card>
    </div>
  `,
})
export class PortfolioRiskComponent {
  private financialService = inject(FinancialService);

  data = signal({
    w1: 60,
    s1: 15,
    w2: 40,
    s2: 10,
    corr: 0.3,
  });

  riskForm = form(this.data, (schema) => {
    required(schema.w1);
    required(schema.s1);
    required(schema.w2);
    required(schema.s2);
    required(schema.corr);
  });

  result = computed(() => {
    if (this.riskForm().invalid()) return 0;

    const d = this.data();
    return (
      this.financialService.calculateTwoAssetPortfolioStdDev({
        w1: d.w1 / 100,
        s1: d.s1 / 100,
        w2: d.w2 / 100,
        s2: d.s2 / 100,
        corr: d.corr,
      }) * 100
    );
  });

  diversification = computed(() => {
    if (this.riskForm().invalid()) return 0;

    const d = this.data();
    const weightedAvg = (d.w1 / 100) * d.s1 + (d.w2 / 100) * d.s2;
    return Math.max(0, weightedAvg - this.result());
  });
}
