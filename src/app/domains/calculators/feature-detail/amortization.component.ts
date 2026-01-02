import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
    selector: 'app-amortization',
    standalone: true,
    imports: [
        LucideAngularModule,
        CardComponent,
        InputComponent,
        Field,
        CurrencyPipe,
        DecimalPipe,
    ],
    template: `
    <div class="max-w-6xl mx-auto space-y-6 pb-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <app-card title="Loan Details" class="md:col-span-1">
          <div class="space-y-4">
            <app-input
              label="Loan Amount"
              [field]="amortForm.loanAmount"
              type="number"
              prefix="$"
            />
            <app-input
              label="Interest Rate (%)"
              [field]="amortForm.interestRate"
              type="number"
              suffix="%"
            />
            <app-input
              label="Loan Term (Years)"
              [field]="amortForm.loanTerm"
              type="number"
            />
          </div>
        </app-card>

        <div class="md:col-span-3 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
             <app-card class="bg-blue-50/50 border-blue-100">
                <p class="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Monthly Payment</p>
                <h4 class="text-2xl font-black text-slate-900">{{ result().summary.monthlyPayment | currency }}</h4>
             </app-card>
             <app-card class="bg-amber-50/50 border-amber-100">
                <p class="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Total Interest</p>
                <h4 class="text-2xl font-black text-slate-900">{{ result().summary.totalInterest | currency }}</h4>
             </app-card>
             <app-card class="bg-emerald-50/50 border-emerald-100">
                <p class="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Total Cost</p>
                <h4 class="text-2xl font-black text-slate-900">{{ result().summary.totalPayment | currency }}</h4>
             </app-card>
          </div>

          <app-card title="Amortization Schedule">
            <div class="overflow-x-auto -mx-6 sm:mx-0">
              <table class="w-full text-sm text-left">
                <thead class="text-xs text-slate-500 uppercase bg-slate-50/50 border-y border-slate-100">
                  <tr>
                    <th class="px-6 py-4 font-semibold">Month</th>
                    <th class="px-6 py-4 font-semibold text-right">Payment</th>
                    <th class="px-6 py-4 font-semibold text-right">Principal</th>
                    <th class="px-6 py-4 font-semibold text-right">Interest</th>
                    <th class="px-6 py-4 font-semibold text-right">Balance</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (row of displayedRows(); track row.month) {
                    <tr class="hover:bg-slate-50/50 transition-colors">
                      <td class="px-6 py-4 font-medium text-slate-700">{{ row.month }}</td>
                      <td class="px-6 py-4 text-right tabular-nums">{{ row.payment | currency }}</td>
                      <td class="px-6 py-4 text-right tabular-nums text-emerald-600">{{ row.principal | currency }}</td>
                      <td class="px-6 py-4 text-right tabular-nums text-amber-600">{{ row.interest | currency }}</td>
                      <td class="px-6 py-4 text-right tabular-nums font-semibold">{{ row.balance | currency }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            @if (result().schedule.length > 240) {
              <div class="p-4 text-center text-slate-400 text-xs italic border-t border-slate-100">
                Schedule truncated. Showing first 240 of {{ result().schedule.length }} payments.
              </div>
            }
          </app-card>
        </div>
      </div>
    </div>
  `,
})
export class AmortizationComponent {
    private financialService = inject(FinancialService);

    amortForm = form(() => ({
        loanAmount: signal<number>(250000, { validators: [required, min(1)] }),
        interestRate: signal<number>(6.5, { validators: [required, min(0)] }),
        loanTerm: signal<number>(30, { validators: [required, min(1)] }),
    }));

    result = computed(() => {
        const f = this.amortForm();
        if (f.invalid) return { schedule: [], summary: { monthlyPayment: 0, totalInterest: 0, totalPayment: 0 } };

        return this.financialService.calculateAmortization({
            loanAmount: f.loanAmount.value(),
            interestRate: f.interestRate.value() / 100,
            loanTerm: f.loanTerm.value(),
        });
    });

    displayedRows = computed(() => {
        return this.result().schedule.slice(0, 240);
    });
}
