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
              id="loanAmount"
              label="Loan Amount"
              [field]="amortForm.loanAmount"
              type="number"
              prefix="$"
            />
            <app-input
              id="interestRate"
              label="Interest Rate (%)"
              [field]="amortForm.interestRate"
              type="number"
              suffix="%"
            />
            <app-input
              id="loanTerm"
              label="Loan Term (Years)"
              [field]="amortForm.loanTerm"
              type="number"
            />
          </div>
        </app-card>

        <div class="md:col-span-3 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
             <app-card class="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/50">
                <p class="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Monthly Payment</p>
                <h4 class="text-2xl font-black text-slate-900 dark:text-white">{{ result().summary.monthlyPayment | currency }}</h4>
             </app-card>
             <app-card class="bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/50">
                <p class="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Total Interest</p>
                <h4 class="text-2xl font-black text-slate-900 dark:text-white">{{ result().summary.totalInterest | currency }}</h4>
             </app-card>
             <app-card class="bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/50">
                <p class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Total Cost</p>
                <h4 class="text-2xl font-black text-slate-900 dark:text-white">{{ result().summary.totalPayment | currency }}</h4>
             </app-card>
          </div>

          <app-card title="Amortization Schedule">
            <div class="overflow-x-auto -mx-6 sm:mx-0">
              <table class="w-full text-sm text-left">
                <thead class="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-950/50 border-y border-slate-100 dark:border-slate-800">
                  <tr>
                    <th class="px-6 py-4 font-semibold">Month</th>
                    <th class="px-6 py-4 font-semibold text-right">Payment</th>
                    <th class="px-6 py-4 font-semibold text-right">Principal</th>
                    <th class="px-6 py-4 font-semibold text-right">Interest</th>
                    <th class="px-6 py-4 font-semibold text-right">Balance</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  @for (row of displayedRows(); track row.month) {
                    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-colors">
                      <td class="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{{ row.month }}</td>
                      <td class="px-6 py-4 text-right tabular-nums dark:text-slate-200">{{ row.payment | currency }}</td>
                      <td class="px-6 py-4 text-right tabular-nums text-emerald-600 dark:text-emerald-400">{{ row.principal | currency }}</td>
                      <td class="px-6 py-4 text-right tabular-nums text-amber-600 dark:text-amber-400">{{ row.interest | currency }}</td>
                      <td class="px-6 py-4 text-right tabular-nums font-semibold dark:text-white">{{ row.balance | currency }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            @if (result().schedule.length > 240) {
              <div class="p-4 text-center text-slate-400 dark:text-slate-500 text-xs italic border-t border-slate-100 dark:border-slate-800">
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

  data = signal({
    loanAmount: 250000,
    interestRate: 6.5,
    loanTerm: 30,
  });

  amortForm = form(this.data, (schema) => {
    required(schema.loanAmount);
    min(schema.loanAmount, 1);
    required(schema.interestRate);
    min(schema.interestRate, 0);
    required(schema.loanTerm);
    min(schema.loanTerm, 1);
  });

  result = computed(() => {
    if (this.amortForm().invalid()) {
      return { schedule: [], summary: { monthlyPayment: 0, totalInterest: 0, totalPayment: 0 } };
    }
    const d = this.data();

    return this.financialService.calculateAmortization({
      loanAmount: d.loanAmount,
      interestRate: d.interestRate / 100,
      loanTerm: d.loanTerm,
    });
  });

  displayedRows = computed(() => {
    return this.result().schedule.slice(0, 240);
  });
}
