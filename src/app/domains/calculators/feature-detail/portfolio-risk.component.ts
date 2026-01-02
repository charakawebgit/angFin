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
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card title="Asset Parameters">
          <div class="space-y-4">
             <div class="grid grid-cols-2 gap-4">
                <app-input id="weight1" label="Weight 1 (%)" [field]="riskForm.w1" type="number" suffix="%" />
                <app-input id="stdDev1" label="Std Dev 1 (%)" [field]="riskForm.s1" type="number" suffix="%" />
             </div>
             <div class="grid grid-cols-2 gap-4">
                <app-input id="weight2" label="Weight 2 (%)" [field]="riskForm.w2" type="number" suffix="%" />
                <app-input id="stdDev2" label="Std Dev 2 (%)" [field]="riskForm.s2" type="number" suffix="%" />
             </div>
             <app-input id="correlation" label="Correlation (-1 to 1)" [field]="riskForm.corr" type="number" />
          </div>
        </app-card>

        <app-card title="Portfolio Risk (σ)">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (riskForm().valid()) {
              <div class="space-y-4 w-full">
                <div class="space-y-1">
                   <span class="text-5xl font-black text-blue-600">
                     {{ result() | number: '1.2-4' }}%
                   </span>
                   <p class="text-sm text-slate-500">Portfolio Standard Deviation</p>
                </div>

                <div class="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                   <span>Diversification Effect</span>
                   <span class="text-emerald-500">{{ diversification() | number: '1.2-4' }}%</span>
                </div>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="scatter-chart" class="w-12 h-12 mx-auto opacity-20" />
                <p>Provide weights, risks, and correlation</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Insights">
         <p class="text-sm text-slate-600 leading-relaxed">
            The portfolio standard deviation measures the total volatility of a two-asset portfolio. 
            Because assets are rarely perfectly correlated (Correlation = 1), the portfolio risk is 
            typically lower than the weighted average of individual risks—this is the benefit of diversification.
         </p>
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
