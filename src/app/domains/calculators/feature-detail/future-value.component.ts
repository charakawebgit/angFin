import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { InputComponent } from '@shared/ui/input.component';
import { CardComponent } from '@shared/ui/card.component';

@Component({
  selector: 'app-future-value',
  standalone: true,
  imports: [
    LucideAngularModule,
    InputComponent,
    CardComponent,
    CurrencyPipe,
    Field,
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card title="Inputs">
          <div class="space-y-4">
            <app-input
              id="presentValue"
              label="Present Value (PV)"
              [field]="fvForm.pv"
              type="number"
              prefix="$"
            />
            <app-input
              id="annualInterestRate"
              label="Annual Interest Rate (%)"
              [field]="fvForm.rate"
              type="number"
              suffix="%"
            />
            <app-input
              id="periods"
              label="Periods (Years)"
              [field]="fvForm.periods"
              type="number"
            />
          </div>
        </app-card>

        <app-card title="Future Value">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (fvForm().valid()) {
              <div class="space-y-2">
                <span class="text-5xl font-black text-blue-600">
                  {{ result() | currency }}
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  Estimated value of your investment after {{ data().periods }} years.
                </p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="trending-up" class="w-12 h-12 mx-auto opacity-20" />
                <p>Enter values to see future projections</p>
              </div>
            }
          </div>
        </app-card>
      </div>
    </div>
  `,
})
export class FutureValueComponent {
  private readonly financialService = inject(FinancialService);

  data = signal({
    pv: 1000,
    rate: 5,
    periods: 10,
  });

  fvForm = form(this.data, (schema) => {
    required(schema.pv);
    min(schema.pv, 0);
    required(schema.rate);
    min(schema.rate, 0);
    required(schema.periods);
    min(schema.periods, 1);
  });

  result = computed(() => {
    if (this.fvForm().invalid()) return 0;

    const d = this.data();
    return this.financialService.calculateFutureValue({
      pv: d.pv,
      rate: d.rate / 100,
      periods: d.periods,
    });
  });
}
