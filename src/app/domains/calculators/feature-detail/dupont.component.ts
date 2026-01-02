import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { form, required, min, Field } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { InputComponent } from '@shared/ui/input.component';

@Component({
   selector: 'app-dupont',
   standalone: true,
   imports: [
      LucideAngularModule,
      CardComponent,
      InputComponent,
      Field,
      DecimalPipe,
   ],
   template: `
    <div class="max-w-4xl mx-auto space-y-6 pb-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card title="Financial Data">
          <div class="space-y-4">
            <app-input
              id="netIncome"
              label="Net Income"
              [field]="dupontForm.netIncome"
              type="number"
              prefix="$"
            />
            <app-input
              id="revenue"
              label="Revenue"
              [field]="dupontForm.revenue"
              type="number"
              prefix="$"
            />
            <app-input
              id="totalAssets"
              label="Total Assets"
              [field]="dupontForm.assets"
              type="number"
              prefix="$"
            />
            <app-input
              id="totalEquity"
              label="Total Equity"
              [field]="dupontForm.equity"
              type="number"
              prefix="$"
            />
          </div>
        </app-card>

        <div class="space-y-4">
           <app-card class="bg-blue-600 text-white border-none shadow-blue-500/20">
              <p class="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Return on Equity (ROE)</p>
              <h4 class="text-4xl font-black">
                @if (dupontForm().valid()) {
                  {{ result().roe * 100 | number: '1.2-2' }}%
                } @else { -- }
              </h4>
           </app-card>

           <div class="grid grid-cols-1 gap-4">
              <div class="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                 <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profit Margin</p>
                    <p class="text-xl font-black text-slate-900">
                       @if (dupontForm().valid()) { {{ result().profitMargin * 100 | number: '1.2-2' }}% } @else { -- }
                    </p>
                 </div>
                 <lucide-icon name="percent" class="w-6 h-6 text-emerald-500" />
              </div>

              <div class="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                 <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset Turnover</p>
                    <p class="text-xl font-black text-slate-900">
                       @if (dupontForm().valid()) { {{ result().assetTurnover | number: '1.2-4' }}x } @else { -- }
                    </p>
                 </div>
                 <lucide-icon name="git-compare-arrows" class="w-6 h-6 text-blue-500" />
              </div>

              <div class="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                 <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Equity Multiplier</p>
                    <p class="text-xl font-black text-slate-900">
                       @if (dupontForm().valid()) { {{ result().equityMultiplier | number: '1.2-4' }}x } @else { -- }
                    </p>
                 </div>
                 <lucide-icon name="scale" class="w-6 h-6 text-amber-500" />
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
})
export class DupontComponent {
   private financialService = inject(FinancialService);

   data = signal({
      netIncome: 50000,
      revenue: 500000,
      assets: 1000000,
      equity: 400000,
   });

   dupontForm = form(this.data, (schema) => {
      required(schema.netIncome);
      required(schema.revenue);
      min(schema.revenue, 1);
      required(schema.assets);
      min(schema.assets, 1);
      required(schema.equity);
      min(schema.equity, 1);
   });

   result = computed(() => {
      if (this.dupontForm().invalid())
         return { roe: 0, profitMargin: 0, assetTurnover: 0, equityMultiplier: 0 };

      const d = this.data();
      return this.financialService.calculateDupont({
         netIncome: d.netIncome,
         revenue: d.revenue,
         assets: d.assets,
         equity: d.equity,
      });
   });
}
