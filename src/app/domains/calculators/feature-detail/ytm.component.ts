import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';
import { SelectComponent } from '@shared/ui/select.component';

@Component({
  selector: 'app-ytm',
  standalone: true,
  imports: [
    LucideAngularModule,
    CardComponent,
    InputComponent,
    SelectComponent,
    Field,
    DecimalPipe,
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card title="Bond Current state">
          <div class="space-y-4">
            <app-input
              id="currentPrice"
              label="Current Market Price"
              [field]="ytmForm.currentPrice"
              type="number"
              prefix="$"
            />
            <app-input
              id="faceValue"
              label="Face Value"
              [field]="ytmForm.faceValue"
              type="number"
              prefix="$"
            />
            <app-input
              id="couponRate"
              label="Coupon Rate (%)"
              [field]="ytmForm.couponRate"
              type="number"
              suffix="%"
            />
            <app-input
              id="years"
              label="Years to Maturity"
              [field]="ytmForm.years"
              type="number"
            />
            <app-select
              label="Payment Frequency"
              [value]="frequency()"
              [options]="freqOptions"
              (changed)="frequency.set(+$event)"
            />
          </div>
        </app-card>

        <app-card title="Yield to Maturity">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (ytmForm().valid() && result() !== null) {
              <div class="space-y-2">
                <span class="text-5xl font-black text-blue-600">
                  {{ result()! * 100 | number: '1.2-4' }}%
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  The internal rate of return (IRR) of a bond if held to maturity.
                </p>
              </div>
            } @else if (ytmForm().valid() && result() === null) {
              <div class="text-red-500 space-y-2">
                <lucide-icon name="activity" class="w-12 h-12 mx-auto opacity-20" />
                <p>Could not calculate YTM. Check price vs coupons.</p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="activity" class="w-12 h-12 mx-auto opacity-20" />
                <p>Enter current price and bond terms</p>
              </div>
            }
          </div>
        </app-card>
      </div>
    </div>
  `,
})
export class YtmComponent {
  private financialService = inject(FinancialService);

  data = signal({
    currentPrice: 950,
    faceValue: 1000,
    couponRate: 5,
    years: 10,
  });

  ytmForm = form(this.data, (schema) => {
    required(schema.currentPrice);
    min(schema.currentPrice, 1);
    required(schema.faceValue);
    min(schema.faceValue, 1);
    required(schema.couponRate);
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
    if (this.ytmForm().invalid()) return null;

    const d = this.data();
    return this.financialService.calculateYtm({
      currentPrice: d.currentPrice,
      faceValue: d.faceValue,
      couponRate: d.couponRate / 100,
      years: d.years,
      frequency: this.frequency(),
    });
  });
}
