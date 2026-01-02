import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { form, required, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';
import { DynamicListInputComponent } from '@shared/ui/dynamic-list-input.component';

@Component({
  selector: 'app-npv',
  standalone: true,
  imports: [
    LucideAngularModule,
    CardComponent,
    InputComponent,
    DynamicListInputComponent,
    Field,
    CurrencyPipe,
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card title="Project Details">
          <div class="space-y-4">
            <app-input
              id="initialInvestment"
              label="Initial Investment (CF0)"
              [field]="npvForm.initialInvestment"
              type="number"
              placeholder="e.g. 10000"
              prefix="$"
            />
            <app-input
              id="rate"
              label="Discount Rate (%)"
              [field]="npvForm.rate"
              type="number"
              placeholder="e.g. 8"
              suffix="%"
            />
          </div>
        </app-card>

        <app-card title="Net Present Value">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (npvForm().valid() && allCashFlowsValid()) {
              <div class="space-y-2">
                <span class="text-5xl font-black" [class]="result() >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ result() | currency }}
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  Positive NPV suggests the project is profitable.
                </p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="list-plus" class="w-12 h-12 mx-auto opacity-20" />
                <p>Enter initial cost, rate, and cash flows</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Cash Flows">
        <app-dynamic-list-input
          label="Future Cash Flows (CF1, CF2, ...)"
          [items]="cashFlows()"
          (changed)="cashFlows.set($event)"
          placeholderPrefix="Cash Flow"
          prefix="$"
        />
      </app-card>
    </div>
  `,
})
export class NpvComponent {
  private financialService = inject(FinancialService);

  data = signal({
    initialInvestment: 10000,
    rate: 8,
  });

  npvForm = form(this.data, (schema) => {
    required(schema.initialInvestment);
    required(schema.rate);
  });

  cashFlows = signal<number[]>([2000, 3000, 4000, 5000]);

  allCashFlowsValid = computed(() => {
    return this.cashFlows().every((cf) => cf !== null && cf !== undefined && cf !== '' && !isNaN(Number(cf)));
  });

  result = computed(() => {
    if (this.npvForm().invalid() || !this.allCashFlowsValid()) return 0;

    const d = this.data();
    return this.financialService.calculateNpv({
      initialInvestment: d.initialInvestment,
      discountRate: d.rate / 100,
      cashFlows: this.cashFlows().map(Number),
    });
  });
}
