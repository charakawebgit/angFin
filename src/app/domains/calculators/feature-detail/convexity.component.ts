import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';
import { SelectComponent } from '@shared/ui/select.component';

@Component({
  selector: 'app-convexity',
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

        <app-card title="Convexity">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (bondForm().valid()) {
              <div class="space-y-2">
                <span class="text-5xl font-black text-blue-600">
                  {{ result() | number: '1.2-6' }}
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  Refines the price sensitivity estimate provided by duration for larger yield shifts.
                </p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="waves" class="w-12 h-12 mx-auto opacity-20" />
                <p>Enter data to calculate convexity</p>
              </div>
            }
          </div>
        </app-card>
      </div>
    </div>
  `,
})
export class ConvexityComponent {
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
    if (this.bondForm().invalid()) return 0;

    const d = this.data();
    return this.financialService.calculateConvexity({
      faceValue: d.faceValue,
      couponRate: d.couponRate / 100,
      marketRate: d.marketRate / 100,
      years: d.years,
      frequency: this.frequency(),
    });
  });
}
