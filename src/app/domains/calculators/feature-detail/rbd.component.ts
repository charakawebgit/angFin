import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
  selector: 'app-rbd',
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
              id="faceValue"
              label="Face Value"
              [field]="rbdForm.faceValue"
              type="number"
              prefix="$"
            />
            <app-input
              id="purchasePrice"
              label="Purchase Price"
              [field]="rbdForm.purchasePrice"
              type="number"
              prefix="$"
            />
            <app-input
              id="daysToMaturity"
              label="Days to Maturity"
              [field]="rbdForm.days"
              type="number"
            />
          </div>
        </app-card>

        <app-card title="Bank Discount Yield">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (rbdForm().valid()) {
              <div class="space-y-2">
                <span class="text-5xl font-black text-blue-600">
                  {{ result() | number: '1.2-4' }}%
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  Standard yield convention for T-bills using a 360-day year.
                </p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="banknote" class="w-12 h-12 mx-auto opacity-20" />
                <p>Provide price and maturity details</p>
              </div>
            }
          </div>
        </app-card>
      </div>
    </div>
  `,
})
export class RbdComponent {
  private financialService = inject(FinancialService);

  data = signal({
    faceValue: 1000,
    purchasePrice: 985,
    days: 90,
  });

  rbdForm = form(this.data, (schema) => {
    required(schema.faceValue);
    required(schema.purchasePrice);
    required(schema.days);
    min(schema.days, 1);
  });

  result = computed(() => {
    if (this.rbdForm().invalid()) return 0;

    const d = this.data();
    return (
      this.financialService.calculateBankDiscountYield({
        faceValue: d.faceValue,
        purchasePrice: d.purchasePrice,
        days: d.days,
      }) * 100
    );
  });
}
