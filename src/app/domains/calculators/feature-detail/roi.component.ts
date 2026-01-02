import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, required, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
    selector: 'app-roi',
    standalone: true,
    imports: [
        LucideAngularModule,
        CardComponent,
        InputComponent,
        Field,
        DecimalPipe,
    ],
    template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card title="Investment Details">
          <div class="space-y-4">
            <app-input
              label="Amount Gained (Gain)"
              [field]="roiForm.amountGained"
              type="number"
              prefix="$"
            />
            <app-input
              label="Amount Invested (Cost)"
              [field]="roiForm.amountSpent"
              type="number"
              prefix="$"
            />
          </div>
        </app-card>

        <app-card title="Return on Investment">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (roiForm().valid) {
              <div class="space-y-2">
                <span class="text-5xl font-black" [class]="result() >= 0 ? 'text-emerald-600' : 'text-red-600'">
                  {{ result() | decimal: '1.2-2' }}%
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  Profitability metric relative to the cost of investment.
                </p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="trending-up" class="w-12 h-12 mx-auto opacity-20" />
                <p>Enter gain and cost values</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Formula">
        <div class="bg-slate-50 p-4 rounded-lg font-mono text-sm text-center">
           ROI = (Net Profit / Cost of Investment) * 100
        </div>
      </app-card>
    </div>
  `,
})
export class RoiComponent {
    private financialService = inject(FinancialService);

    roiForm = form(() => ({
        amountGained: signal<number>(1200, { validators: [required] }),
        amountSpent: signal<number>(1000, { validators: [required] }),
    }));

    result = computed(() => {
        const f = this.roiForm();
        if (f.invalid || f.amountSpent.value() === 0) return 0;

        return this.financialService.calculateRoi({
            amountGained: f.amountGained.value(),
            amountSpent: f.amountSpent.value(),
        }) * 100;
    });
}
