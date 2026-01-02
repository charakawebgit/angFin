import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
  selector: 'app-perpetuity',
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
        <app-card title="Inputs">
          <div class="space-y-4">
            <app-input
              id="pmt"
              label="Periodic Payment"
              [field]="perpForm.pmt"
              type="number"
              placeholder="e.g. 100"
              prefix="$"
            />
            <app-input
              id="rate"
              label="Discount Rate (%)"
              [field]="perpForm.rate"
              type="number"
              placeholder="e.g. 5"
              suffix="%"
            />
          </div>
        </app-card>

        <app-card title="Present Value">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (perpForm().valid()) {
              <div class="space-y-2">
                <span class="text-5xl font-black text-blue-600">
                  {{ result() | currency }}
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  The current worth of an infinite stream of equal cash flows.
                </p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="shield-check" class="w-12 h-12 mx-auto opacity-20" />
                <p>Enter valid values to see the valuation</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Formula">
        <div class="bg-slate-50 p-4 rounded-lg font-mono text-sm text-center">
          PV = Payment / Rate
        </div>
      </app-card>
    </div>
  `,
})
export class PerpetuityComponent {
  private financialService = inject(FinancialService);

  data = signal({
    pmt: 100,
    rate: 5,
  });

  perpForm = form(this.data, (schema) => {
    required(schema.pmt);
    min(schema.pmt, 0);
    required(schema.rate);
    min(schema.rate, 0.0001);
  });

  result = computed(() => {
    if (this.perpForm().invalid()) return 0;

    const d = this.data();
    return this.financialService.calculatePerpetuity({
      pmt: d.pmt,
      rate: d.rate / 100,
    });
  });
}
