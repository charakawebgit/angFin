import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
    selector: 'app-black-scholes',
    standalone: true,
    imports: [
        LucideAngularModule,
        CardComponent,
        InputComponent,
        Field,
        CurrencyPipe,
    ],
    template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card title="Model Inputs">
          <div class="space-y-4">
            <app-input
              label="Asset Price"
              [field]="bsForm.stockPrice"
              type="number"
              prefix="$"
            />
            <app-input
              label="Strike Price"
              [field]="bsForm.strikePrice"
              type="number"
              prefix="$"
            />
            <app-input
              label="Time to Expiration (Years)"
              [field]="bsForm.time"
              type="number"
            />
            <app-input
              label="Risk-Free Rate (%)"
              [field]="bsForm.riskFreeRate"
              type="number"
              suffix="%"
            />
            <app-input
              label="Volatility (%)"
              [field]="bsForm.volatility"
              type="number"
              suffix="%"
            />
          </div>
        </app-card>

        <div class="space-y-6">
           <app-card title="Call Option Price">
             <div class="flex flex-col items-center justify-center py-4 text-center">
                @if (bsForm().valid) {
                  <span class="text-4xl font-black text-blue-600">{{ result().callPrice | currency }}</span>
                } @else {
                  <span class="text-slate-300">--</span>
                }
             </div>
           </app-card>

           <app-card title="Put Option Price">
             <div class="flex flex-col items-center justify-center py-4 text-center">
                @if (bsForm().valid) {
                  <span class="text-4xl font-black text-indigo-600">{{ result().putPrice | currency }}</span>
                } @else {
                  <span class="text-slate-300">--</span>
                }
             </div>
           </app-card>
        </div>
      </div>
    </div>
  `,
})
export class BlackScholesComponent {
    private financialService = inject(FinancialService);

    bsForm = form(() => ({
        stockPrice: signal<number>(100, { validators: [required, min(0.01)] }),
        strikePrice: signal<number>(100, { validators: [required, min(0.01)] }),
        time: signal<number>(1, { validators: [required, min(0.0001)] }),
        riskFreeRate: signal<number>(5, { validators: [required] }),
        volatility: signal<number>(20, { validators: [required, min(0.0001)] }),
    }));

    result = computed(() => {
        const f = this.bsForm();
        if (f.invalid) return { callPrice: 0, putPrice: 0 };

        return this.financialService.calculateBlackScholes({
            stockPrice: f.stockPrice.value(),
            strikePrice: f.strikePrice.value(),
            time: f.time.value(),
            riskFreeRate: f.riskFreeRate.value() / 100,
            volatility: f.volatility.value() / 100,
        });
    });
}
