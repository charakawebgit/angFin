import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { form, required, min } from '@angular/forms/signals';
import { FinancialService } from '@core/math/financial.service';
import { InputComponent } from '@shared/ui/input.component';
import { CardComponent } from '@shared/ui/card.component';

@Component({
    selector: 'app-future-value',
    standalone: true,
    imports: [CommonModule, InputComponent, CardComponent, CurrencyPipe],
    template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="header">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Future Value (FV)</h1>
        <p class="text-slate-600 dark:text-slate-400">Calculate the value of an asset at a future date.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card title="Inputs">
          <div class="space-y-4">
            <app-input
              id="pv"
              label="Present Value (PV)"
              type="number"
              prefix="$"
              placeholder="e.g., 1000"
              [field]="fvForm.pv"
            />
            <app-input
              id="rate"
              label="Annual Interest Rate (%)"
              type="number"
              suffix="%"
              placeholder="e.g., 5"
              [field]="fvForm.rate"
            />
            <app-input
              id="periods"
              label="Periods (Years)"
              type="number"
              placeholder="e.g., 10"
              [field]="fvForm.periods"
            />
          </div>
        </app-card>

        <app-card title="Result">
          @if (result()) {
            <div class="flex flex-col items-center justify-center h-full py-8 text-center"
                 [class.opacity-50]="fvForm().invalid()">
              <span class="text-sm font-medium text-slate-500 uppercase tracking-wider">Future Value</span>
              <span class="text-5xl font-black text-blue-600 dark:text-blue-400 my-2">
                {{ result() | currency }}
              </span>
              @if (fvForm().invalid()) {
                <p class="text-xs text-red-500 font-medium mt-2">Please fix form errors</p>
              } @else {
                <p class="text-sm text-slate-500 max-w-[200px]">
                  Value after {{ fvForm.periods().value() }} periods at {{ fvForm.rate().value() }}% interest.
                </p>
              }
            </div>
          } @else {
            <div class="flex items-center justify-center h-full text-slate-400 italic">
              Enter values to see results
            </div>
          }
        </app-card>
      </div>
    </div>
  `,
})
export class FutureValueComponent {
    private readonly financialService = inject(FinancialService);

    // Model-first Signal Forms
    protected readonly data = signal({
        pv: 1000,
        rate: 5,
        periods: 10,
    });

    protected readonly fvForm = form(this.data, (schema) => {
        required(schema.pv);
        min(schema.pv, 0);
        required(schema.rate);
        min(schema.rate, 0);
        required(schema.periods);
        min(schema.periods, 1);
    });

    protected readonly result = computed(() => {
        // Accessing values from the tree state directly
        if (this.fvForm().invalid()) return null;

        const pv = this.fvForm.pv().value();
        const rate = this.fvForm.rate().value();
        const periods = this.fvForm.periods().value();

        return this.financialService.calculateFutureValue({
            pv: Number(pv),
            rate: Number(rate) / 100,
            periods: Number(periods),
        });
    });
}
