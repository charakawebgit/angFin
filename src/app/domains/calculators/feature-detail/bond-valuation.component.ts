import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';
import { SelectComponent } from '@shared/ui/select.component';

@Component({
  selector: 'app-bond-valuation',
  standalone: true,
  imports: [
    LucideAngularModule,
    CardComponent,
    InputComponent,
    SelectComponent,
    Field,
    CurrencyPipe,
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card title="Bond Parameters">
          <div class="space-y-4">
            <app-input
              id="faceValue"
              label="Face Value"
              [field]="bondForm.faceValue"
              type="number"
              prefix="$"
            />
            <app-input
              id="couponRate"
              label="Coupon Rate (%)"
              [field]="bondForm.couponRate"
              type="number"
              suffix="%"
            />
            <app-input
              id="marketRate"
              label="Market Rate / YTM (%)"
              [field]="bondForm.marketRate"
              type="number"
              suffix="%"
            />
            <app-input
              id="years"
              label="Years to Maturity"
              [field]="bondForm.years"
              type="number"
            />
            <app-select
              id="frequency-select"
              label="Payment Frequency"
              [value]="frequency()"
              [options]="freqOptions"
              (changed)="frequency.set(+$event)"
            />
          </div>
        </app-card>

        <app-card title="Intrinsic Value">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (bondForm().valid()) {
              <div class="space-y-2">
                <span class="text-5xl font-black text-blue-600">
                  {{ result() | currency }}
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  Estimated fair price of the bond based on cash flows.
                </p>
                <div class="mt-4 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 inline-block uppercase tracking-wider">
                  @if (result() > data().faceValue) {
                     Premium Bond
                  } @else if (result() < data().faceValue) {
                     Discount Bond
                  } @else {
                     Par Bond
                  }
                </div>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="scroll-text" class="w-12 h-12 mx-auto opacity-20" />
                <p>Enter parameters to value the bond</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Formula">
        <div class="bg-slate-50 p-4 rounded-lg font-mono text-sm text-center">
          Bond Price = Σ [C / (1 + r)^t] + FV / (1 + r)^n
        </div>
      </app-card>
    </div>
  `,
})
export class BondValuationComponent {
  private financialService = inject(FinancialService);

  data = signal({
    faceValue: 1000,
    couponRate: 5,
    marketRate: 4,
    years: 10,
  });

  bondForm = form(this.data, (schema) => {
    required(schema.faceValue);
    min(schema.faceValue, 1);
    required(schema.couponRate);
    required(schema.marketRate);
    required(schema.years);
    min(schema.years, 0.1);
  });

  frequency = signal<number>(2);

  freqOptions = [
    { label: 'Annual', value: 1 },
    { label: 'Semi-Annual', value: 2 },
    { label: 'Quarterly', value: 4 },
    { label: 'Monthly', value: 12 },
  ];

  result = computed(() => {
    if (this.bondForm().invalid()) return 0;

    const d = this.data();
    return this.financialService.calculateBondPrice({
      faceValue: d.faceValue,
      couponRate: d.couponRate / 100,
      marketRate: d.marketRate / 100,
      years: d.years,
      frequency: this.frequency(),
    });
  });
}
