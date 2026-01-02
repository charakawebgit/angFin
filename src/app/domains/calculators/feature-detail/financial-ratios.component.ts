import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
    selector: 'app-financial-ratios',
    standalone: true,
    imports: [
        LucideAngularModule,
        CardComponent,
        InputComponent,
        Field,
        DecimalPipe,
    ],
    template: `
    <div class="max-w-6xl mx-auto space-y-6 pb-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <app-card title="Balance Sheet & Income Statement" class="md:col-span-1">
          <div class="space-y-4">
            <app-input label="Current Assets" [field]="ratioForm.currentAssets" type="number" prefix="$" />
            <app-input label="Current Liabilities" [field]="ratioForm.currentLiabilities" type="number" prefix="$" />
            <app-input label="Inventory" [field]="ratioForm.inventory" type="number" prefix="$" />
            <app-input label="Total Debt" [field]="ratioForm.totalDebt" type="number" prefix="$" />
            <app-input label="Total Equity" [field]="ratioForm.totalEquity" type="number" prefix="$" />
            <app-input label="Stock Price" [field]="ratioForm.stockPrice" type="number" prefix="$" />
            <app-input label="Earnings Per Share (EPS)" [field]="ratioForm.eps" type="number" prefix="$" />
          </div>
        </app-card>

        <div class="md:col-span-2 space-y-6">
           <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <app-card title="Liquidity Ratios">
                 <div class="space-y-4">
                    <div class="flex justify-between items-center">
                       <span class="text-sm text-slate-500">Current Ratio</span>
                       <span class="text-xl font-black text-blue-600">{{ result().currentRatio | decimal: '1.2-2' }}x</span>
                    </div>
                    <div class="flex justify-between items-center">
                       <span class="text-sm text-slate-500">Quick Ratio</span>
                       <span class="text-xl font-black text-emerald-600">{{ result().quickRatio | decimal: '1.2-2' }}x</span>
                    </div>
                 </div>
              </app-card>

              <app-card title="Solvency & Valuation">
                 <div class="space-y-4">
                    <div class="flex justify-between items-center">
                       <span class="text-sm text-slate-500">Debt-to-Equity</span>
                       <span class="text-xl font-black text-amber-600">{{ result().debtToEquity | decimal: '1.2-2' }}x</span>
                    </div>
                    <div class="flex justify-between items-center">
                       <span class="text-sm text-slate-500">P/E Ratio</span>
                       <span class="text-xl font-black text-indigo-600">{{ result().peRatio | decimal: '1.2-2' }}x</span>
                    </div>
                 </div>
              </app-card>
           </div>

           <app-card title="Ratio Breakdown">
              <div class="grid grid-cols-1 gap-3">
                 <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                       <lucide-icon name="activity" class="w-4 h-4" />
                    </div>
                    <div>
                       <p class="text-sm font-bold text-slate-700">Current Ratio Analysis</p>
                       <p class="text-xs text-slate-500 mt-0.5">
                          @if (result().currentRatio! > 2) {
                            Strong liquidity position. Assets cover liabilities more than twice.
                          } @else if (result().currentRatio! > 1) {
                            Adequate liquidity. Assets cover current liabilities.
                          } @else {
                            Potential liquidity risk. Liabilities exceed current assets.
                          }
                       </p>
                    </div>
                 </div>
              </div>
           </app-card>
        </div>
      </div>
    </div>
  `,
})
export class FinancialRatiosComponent {
    private financialService = inject(FinancialService);

    ratioForm = form(() => ({
        currentAssets: signal<number | string>(150000),
        currentLiabilities: signal<number | string>(100000),
        inventory: signal<number | string>(30000),
        totalDebt: signal<number | string>(400000),
        totalEquity: signal<number | string>(600000),
        stockPrice: signal<number | string>(45.5),
        eps: signal<number | string>(3.2),
    }));

    result = computed(() => {
        const f = this.ratioForm();
        return this.financialService.calculateFinancialRatios({
            currentAssets: f.currentAssets.value() ? Number(f.currentAssets.value()) : undefined,
            currentLiabilities: f.currentLiabilities.value() ? Number(f.currentLiabilities.value()) : undefined,
            inventory: f.inventory.value() ? Number(f.inventory.value()) : undefined,
            totalDebt: f.totalDebt.value() ? Number(f.totalDebt.value()) : undefined,
            totalEquity: f.totalEquity.value() ? Number(f.totalEquity.value()) : undefined,
            stockPrice: f.stockPrice.value() ? Number(f.stockPrice.value()) : undefined,
            eps: f.eps.value() ? Number(f.eps.value()) : undefined,
        });
    });
}
