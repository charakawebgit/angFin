import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
  selector: 'app-eay',
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
              id="hpy"
              label="Holding Period Yield (HPY) %"
              [field]="eayForm.hpy"
              type="number"
              suffix="%"
            />
            <app-input
              id="daysToMaturity"
              label="Days to Maturity"
              [field]="eayForm.days"
              type="number"
            />
          </div>
        </app-card>

        <app-card title="Effective Annual Yield">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (eayForm().valid()) {
              <div class="space-y-2">
                <span class="text-5xl font-black text-blue-600">
                  {{ result() | number: '1.2-4' }}%
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  Annualized yield considering compounding over a 365-day year.
                </p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="calendar-check" class="w-12 h-12 mx-auto opacity-20" />
                <p>Provide HPY and maturity days</p>
              </div>
            }
          </div>
        </app-card>
      </div>
    </div>
  `,
})
export class EayComponent {
  private financialService = inject(FinancialService);

  data = signal({
    hpy: 1.52,
    days: 90,
  });

  eayForm = form(this.data, (schema) => {
    required(schema.hpy);
    required(schema.days);
    min(schema.days, 1);
  });

  result = computed(() => {
    if (this.eayForm().invalid()) return 0;
    const d = this.data();

    return this.financialService.calculateEffectiveAnnualYield({
      hpy: d.hpy / 100,
      days: d.days,
    }) * 100;
  });
}
