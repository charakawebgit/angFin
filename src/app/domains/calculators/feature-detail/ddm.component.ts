import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { form, required, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
  selector: 'app-ddm',
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
        <app-card title="Stock Information">
          <div class="space-y-4">
            <app-input
              id="dividend"
              label="Annual Dividend (D1)"
              [field]="ddmForm.dividend"
              type="number"
              placeholder="e.g. 2.50"
              prefix="$"
            />
            <app-input
              id="returnRate"
              label="Required Return Rate (%)"
              [field]="ddmForm.returnRate"
              type="number"
              placeholder="e.g. 10"
              suffix="%"
            />
            <app-input
              id="growthRate"
              label="Constant Growth Rate (%)"
              [field]="ddmForm.growthRate"
              type="number"
              placeholder="e.g. 5"
              suffix="%"
            />
          </div>
        </app-card>

        <app-card title="Intrinsic Value">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (ddmForm().valid() && isValidGrowth()) {
              <div class="space-y-2">
                <span class="text-5xl font-black text-blue-600">
                  {{ result() | currency }}
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  Estimated fair value based on future dividends.
                </p>
              </div>
            } @else if (ddmForm().valid() && !isValidGrowth()) {
               <div class="text-red-500 space-y-2">
                <lucide-icon name="hand-coins" class="w-12 h-12 mx-auto opacity-20" />
                <p>Growth rate must be less than return rate</p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="hand-coins" class="w-12 h-12 mx-auto opacity-20" />
                <p>Enter valid inputs to value the stock</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Formula">
        <div class="bg-slate-50 p-4 rounded-lg font-mono text-sm text-center">
          Value = Dividend / (Return Rate - Growth Rate)
        </div>
      </app-card>
    </div>
  `,
})
export class DdmComponent {
  private financialService = inject(FinancialService);

  data = signal({
    dividend: 2.5,
    returnRate: 10,
    growthRate: 5,
  });

  ddmForm = form(this.data, (schema) => {
    required(schema.dividend);
    required(schema.returnRate);
    required(schema.growthRate);
  });

  isValidGrowth = computed(() => {
    const d = this.data();
    return d.returnRate > d.growthRate;
  });

  result = computed(() => {
    if (this.ddmForm().invalid() || !this.isValidGrowth()) return 0;

    const d = this.data();
    return this.financialService.calculateDdm({
      dividend: d.dividend,
      returnRate: d.returnRate / 100,
      growthRate: d.growthRate / 100,
    });
  });
}
