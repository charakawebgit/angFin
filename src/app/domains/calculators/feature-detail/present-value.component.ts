import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { form, required, min } from '@angular/forms/signals';
import { FinancialService } from '@core/math/financial.service';
import { InputComponent } from '@shared/ui/input.component';
import { CardComponent } from '@shared/ui/card.component';

@Component({
    selector: 'app-present-value',
    standalone: true,
    imports: [CommonModule, InputComponent, CardComponent, CurrencyPipe],
    template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="header flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Present Value (PV)</h1>
          <p class="text-slate-600 dark:text-slate-400">Determine the current value of a future cash flow.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card title="Inputs">
          <div class="space-y-4">
            <app-input
              id="fv"
              label="Future Value (FV)"
              type="number"
              prefix="$"
              placeholder="e.g., 1000"
              [field]="pvForm.fv"
            />
            <app-input
              id="rate"
              label="Discount Rate per Period (%)"
              type="number"
              suffix="%"
              placeholder="e.g., 5"
              [field]="pvForm.rate"
            />
            <app-input
              id="periods"
              label="Number of Periods"
              type="number"
              placeholder="e.g., 10"
              [field]="pvForm.periods"
            />
          </div>
        </app-card>

        <app-card title="Result">
          @if (result() !== null) {
            <div class="flex flex-col items-center justify-center h-full py-8 text-center"
                 [class.opacity-50]="pvForm().invalid()">
              <span class="text-sm font-medium text-slate-500 uppercase tracking-wider">Present Value</span>
              <span class="text-5xl font-black text-blue-600 dark:text-blue-400 my-2">
                {{ result() | currency }}
              </span>
              @if (pvForm().invalid()) {
                <p class="text-xs text-red-500 font-medium mt-2">Please fix form errors</p>
              } @else {
                <p class="text-sm text-slate-500 max-w-[200px]">
                  Discounted value of {{ pvForm.fv().value() | currency }} after {{ pvForm.periods().value() }} periods at {{ pvForm.rate().value() }}% return.
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
export class PresentValueComponent {
    private readonly financialService = inject(FinancialService);

    // Model signal
    protected readonly data = signal({
        fv: 1000,
        rate: 5,
        periods: 10,
    });

    // Signal Form
    protected readonly pvForm = form(this.data, (schema) => {
        required(schema.fv);
        min(schema.fv, 0);
        required(schema.rate);
        min(schema.rate, 0);
        required(schema.periods);
        min(schema.periods, 1);
    });

    protected readonly result = computed(() => {
        if (this.pvForm().invalid()) return null;

        const fv = this.pvForm.fv().value();
        const rate = this.pvForm.rate().value();
        const periods = this.pvForm.periods().value();

        return this.financialService.calculatePresentValue({
            fv: Number(fv),
            rate: Number(rate) / 100,
            periods: Number(periods),
        });
    });
}
