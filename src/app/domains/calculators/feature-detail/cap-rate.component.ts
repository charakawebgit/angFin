import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
  selector: 'app-cap-rate',
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
              id="noi"
              label="Net Operating Income (NOI)"
              [field]="capForm.noi"
              type="number"
              placeholder="e.g. 50000"
              prefix="$"
            />
            <app-input
              id="propertyValue"
              label="Property Value"
              [field]="capForm.propertyValue"
              type="number"
              placeholder="e.g. 1000000"
              prefix="$"
            />
          </div>
        </app-card>

        <app-card title="Capitalization Rate">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (capForm().valid()) {
              <div class="space-y-2">
                <span class="text-5xl font-black text-blue-600">
                  {{ result() | number: '1.2-2' }}%
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  The expected rate of return on a real estate investment property.
                </p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="building" class="w-12 h-12 mx-auto opacity-20" />
                <p>Enter valid values to see the cap rate</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Formula">
        <div class="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg font-mono text-sm text-center">
          Cap Rate = NOI / Property Value
        </div>
      </app-card>
    </div>
  `,
})
export class CapRateComponent {
  private financialService = inject(FinancialService);

  data = signal({
    noi: 50000,
    propertyValue: 1000000,
  });

  capForm = form(this.data, (schema) => {
    required(schema.noi);
    min(schema.noi, 0);
    required(schema.propertyValue);
    min(schema.propertyValue, 1);
  });

  result = computed(() => {
    if (this.capForm().invalid()) return 0;
    const d = this.data();

    return this.financialService.calculateCapRate({
      noi: d.noi,
      propertyValue: d.propertyValue,
    }) * 100;
  });
}
