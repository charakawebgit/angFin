import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';
import { SelectComponent } from '@shared/ui/select.component';

@Component({
  selector: 'app-duration',
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
        <app-card title="Bond Inputs">
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
              label="Market Yield (%)"
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

        <div class="space-y-6">
          <app-card title="Macaulay Duration">
            <div class="flex flex-col items-center justify-center py-4 text-center">
              @if (bondForm().valid()) {
                 <span class="text-4xl font-black text-blue-600">{{ result().macaulay | number: '1.2-4' }} Years</span>
                 <p class="text-xs text-slate-500 mt-1">Weighted-average time to cash flows.</p>
              } @else {
                 <span class="text-slate-300">--</span>
              }
            </div>
          </app-card>

          <app-card title="Modified Duration">
            <div class="flex flex-col items-center justify-center py-4 text-center">
              @if (bondForm().valid()) {
                 <span class="text-4xl font-black text-indigo-600">{{ result().modified | number: '1.2-4' }}%</span>
                 <p class="text-xs text-slate-500 mt-1">Price sensitivity to 1% yield change.</p>
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
export class DurationComponent {
  private financialService = inject(FinancialService);

  data = signal({
    faceValue: 1000,
    couponRate: 5,
    marketRate: 6,
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
    if (this.bondForm().invalid()) return { macaulay: 0, modified: 0 };

    const d = this.data();
    return this.financialService.calculateDuration({
      faceValue: d.faceValue,
      couponRate: d.couponRate / 100,
      marketRate: d.marketRate / 100,
      years: d.years,
      frequency: this.frequency(),
    });
  });
}
