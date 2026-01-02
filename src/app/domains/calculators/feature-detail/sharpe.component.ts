import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
  selector: 'app-sharpe',
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
        <app-card title="Portfolio Parameters">
          <div class="space-y-4">
            <app-input
              id="portfolioReturn"
              label="Portfolio Return (%)"
              [field]="sharpeForm.portfolioReturn"
              type="number"
              placeholder="e.g. 12"
              suffix="%"
            />
            <app-input
              id="riskFreeRate"
              label="Risk-Free Rate (%)"
              [field]="sharpeForm.riskFreeRate"
              type="number"
              placeholder="e.g. 2"
              suffix="%"
            />
            <app-input
              id="stdDev"
              label="Standard Deviation"
              [field]="sharpeForm.stdDev"
              type="number"
              placeholder="e.g. 15"
            />
          </div>
        </app-card>

        <app-card title="Sharpe Ratio">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (sharpeForm().valid()) {
              <div class="space-y-2">
                <span class="text-5xl font-black text-blue-600">
                  {{ result() | number: '1.2-4' }}
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  Higher Sharpe ratio indicates better risk-adjusted performance.
                </p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="trending-up" class="w-12 h-12 mx-auto opacity-20" />
                <p>Provide return, risk-free rate, and risk</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Formula">
        <div class="bg-slate-50 p-4 rounded-lg font-mono text-sm text-center">
          Sharpe Ratio = (Portfolio Return - Risk-Free Rate) / Std Dev
        </div>
      </app-card>
    </div>
  `,
})
export class SharpeComponent {
  private financialService = inject(FinancialService);

  data = signal({
    portfolioReturn: 12,
    riskFreeRate: 2,
    stdDev: 15,
  });

  sharpeForm = form(this.data, (schema) => {
    required(schema.portfolioReturn);
    required(schema.riskFreeRate);
    required(schema.stdDev);
    min(schema.stdDev, 0.0001);
  });

  result = computed(() => {
    if (this.sharpeForm().invalid()) return 0;

    const d = this.data();
    return this.financialService.calculateSharpeRatio({
      portfolioReturn: d.portfolioReturn / 100,
      riskFreeRate: d.riskFreeRate / 100,
      stdDev: d.stdDev / 100,
    });
  });
}
