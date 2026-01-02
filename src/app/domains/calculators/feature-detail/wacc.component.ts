import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
  selector: 'app-wacc',
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
        <app-card title="Capital Structure">
          <div class="space-y-4">
            <app-input
              id="equityValue"
              label="Market Value of Equity"
              [field]="waccForm.equityValue"
              type="number"
              prefix="$"
            />
            <app-input
              id="debtValue"
              label="Market Value of Debt"
              [field]="waccForm.debtValue"
              type="number"
              prefix="$"
            />
          </div>
        </app-card>

        <app-card title="Cost of Capital">
          <div class="space-y-4">
            <app-input
              id="costOfEquity"
              label="Cost of Equity (%)"
              [field]="waccForm.costOfEquity"
              type="number"
              suffix="%"
            />
            <app-input
              id="costOfDebt"
              label="Pre-Tax Cost of Debt (%)"
              [field]="waccForm.costOfDebt"
              type="number"
              suffix="%"
            />
            <app-input
              id="taxRate"
              label="Corporate Tax Rate (%)"
              [field]="waccForm.taxRate"
              type="number"
              suffix="%"
            />
          </div>
        </app-card>
      </div>

      <app-card title="WACC Result">
        <div class="flex flex-col items-center justify-center py-8 text-center">
          @if (waccForm().valid()) {
            <div class="space-y-2">
              <span class="text-6xl font-black text-blue-600">
                {{ result() | number: '1.2-4' }}%
              </span>
              <p class="text-sm text-slate-500 max-w-[300px] mx-auto">
                The average rate a company is expected to pay to all its security holders to finance its assets.
              </p>
            </div>
          } @else {
            <div class="text-slate-400 space-y-2">
              <lucide-icon name="scale" class="w-12 h-12 mx-auto opacity-20" />
              <p>Enter capital and cost details</p>
            </div>
          }
        </div>
      </app-card>
    </div>
  `,
})
export class WaccComponent {
  private financialService = inject(FinancialService);

  data = signal({
    equityValue: 600000,
    debtValue: 400000,
    costOfEquity: 10,
    costOfDebt: 5,
    taxRate: 25,
  });

  waccForm = form(this.data, (schema) => {
    required(schema.equityValue);
    min(schema.equityValue, 1);
    required(schema.debtValue);
    min(schema.debtValue, 0);
    required(schema.costOfEquity);
    required(schema.costOfDebt);
    required(schema.taxRate);
  });

  result = computed(() => {
    if (this.waccForm().invalid()) return 0;

    const d = this.data();
    return (
      this.financialService.calculateWacc({
        equityValue: d.equityValue,
        debtValue: d.debtValue,
        costOfEquity: d.costOfEquity / 100,
        costOfDebt: d.costOfDebt / 100,
        taxRate: d.taxRate / 100,
      }) * 100
    );
  });
}
