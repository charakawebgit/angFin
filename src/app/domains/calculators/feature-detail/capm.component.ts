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
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card title="Market Parameters">
          <div class="space-y-4">
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
          </div>
        </app-card>

        <app-card title="Asset Beta">
          <app-input
            id="beta"
            label="Beta (β)"
            [field]="capmForm.beta"
            type="number"
            placeholder="e.g. 1.2"
          />
        </app-card>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card title="Expected Return">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (capmForm().valid()) {
              <div class="space-y-2">
                <span class="text-5xl font-black text-blue-600">
                  {{ result() | number: '1.2-4' }}%
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  Estimated return based on the asset's systemic risk.
                </p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="target" class="w-12 h-12 mx-auto opacity-20" />
                <p>Fill parameters to see expected return</p>
              </div>
            }
          </div>
        </app-card>

        <app-card title="Formula">
          <div class="bg-slate-50 p-4 rounded-lg font-mono text-sm h-full flex items-center justify-center">
            E(Ri) = RFR + β * (RM - RFR)
          </div>
        </app-card>
      </div>
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
