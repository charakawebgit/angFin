import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, required, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
  selector: 'app-hpr',
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
              id="beginningValue"
              label="Beginning Value"
              [field]="hprForm.beginningValue"
              type="number"
              placeholder="e.g. 1000"
              prefix="$"
            />
            <app-input
              id="endingValue"
              label="Ending Value"
              [field]="hprForm.endingValue"
              type="number"
              placeholder="e.g. 1100"
              prefix="$"
            />
          </div>
        </app-card>

        <app-card title="Holding Period Return">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (hprForm().valid()) {
              <div class="space-y-2">
                <span class="text-5xl font-black" [class]="result() >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ result() | number: '1.2-2' }}%
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  The total return received from holding an asset over a specific period.
                </p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="hour-glass" class="w-12 h-12 mx-auto opacity-20" />
                <p>Enter valid values to see the return</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Formula">
        <div class="bg-slate-50 p-4 rounded-lg font-mono text-sm text-center">
          HPR = (Ending Value - Beginning Value) / Beginning Value
        </div>
      </app-card>
    </div>
  `,
})
export class HprComponent {
  private financialService = inject(FinancialService);

  data = signal({
    beginningValue: 1000,
    endingValue: 1100,
  });

  hprForm = form(this.data, (schema) => {
    required(schema.beginningValue);
    required(schema.endingValue);
  });

  result = computed(() => {
    if (this.hprForm().invalid()) return 0;

    const d = this.data();
    if (d.beginningValue === 0) return 0;

    return (
      this.financialService.calculateHoldingPeriodReturn({
        beginningValue: d.beginningValue,
        endingValue: d.endingValue,
      }) * 100
    );
  });
}
