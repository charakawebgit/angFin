import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
  selector: 'app-ear',
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
        <app-card title="Inputs">
          <div class="space-y-4">
            <app-input
              id="nominalRate"
              label="Nominal Annual Rate (%)"
              [field]="earForm.rate"
              type="number"
              placeholder="e.g. 5"
              suffix="%"
            />
            <app-input
              id="compoundingPeriods"
              label="Compounding Periods per Year"
              [field]="earForm.periods"
              type="number"
              placeholder="e.g. 12 for monthly"
            />
          </div>
        </app-card>

        <app-card title="Effective Annual Return">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (earForm().valid()) {
              <div class="space-y-2">
                <span class="text-5xl font-black text-blue-600">
                  {{ result() | number: '1.2-4' }}%
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  The actual annual interest rate when compounding is considered.
                </p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="percent" class="w-12 h-12 mx-auto opacity-20" />
                <p>Enter valid inputs to see the result</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Formula">
        <div class="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg font-mono text-sm text-center">
          EAR = (1 + Nominal Rate / m)^m - 1
        </div>
      </app-card>
    </div>
  `,
})
export class EarComponent {
  private financialService = inject(FinancialService);

  data = signal({
    rate: 5,
    periods: 12,
  });

  earForm = form(this.data, (schema) => {
    required(schema.rate);
    min(schema.rate, 0);
    required(schema.periods);
    min(schema.periods, 1);
  });

  result = computed(() => {
    if (this.earForm().invalid()) return 0;

    const d = this.data();
    return (
      this.financialService.calculateEffectiveAnnualReturn({
        rate: d.rate / 100,
        periods: d.periods,
      }) * 100
    );
  });
}
