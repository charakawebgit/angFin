import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { DynamicListInputComponent } from '@shared/ui/dynamic-list-input.component';

@Component({
  selector: 'app-portfolio-return',
  standalone: true,
  imports: [
    LucideAngularModule,
    CardComponent,
    DynamicListInputComponent,
    DecimalPipe,
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 pb-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card title="Portfolio Composition">
          <div class="space-y-6">
            <app-dynamic-list-input
              id="portfolioWeights"
              label="Asset Weights (%)"
              [items]="weights()"
              (changed)="weights.set($event)"
              placeholderPrefix="Weight"
              suffix="%"
              [minItems]="1"
            />
            <app-dynamic-list-input
              id="portfolioReturns"
              label="Asset Returns (%)"
              [items]="returns()"
              (changed)="returns.set($event)"
              placeholderPrefix="Return"
              suffix="%"
              [minItems]="1"
            />
          </div>
        </app-card>

        <div class="space-y-6">
           <app-card title="Weighted Portfolio Return">
             <div class="flex flex-col items-center justify-center h-full py-8 text-center">
               @if (allValid() && isBalanced()) {
                 <div class="space-y-2">
                   <span class="text-5xl font-black text-blue-600">
                     {{ result() | number: '1.2-4' }}%
                   </span>
                   <p class="text-sm text-slate-500 max-w-[200px]">
                      The total expected return of the portfolio based on asset weights.
                   </p>
                 </div>
               } @else if (allValid() && !isBalanced()) {
                 <div class="text-amber-500 space-y-2">
                   <lucide-icon name="scale" class="w-12 h-12 mx-auto opacity-20" />
                   <p>Asset counts must match ({{ weights().length }} vs {{ returns().length }})</p>
                 </div>
               } @else {
                 <div class="text-slate-400 space-y-2">
                   <lucide-icon name="scale" class="w-12 h-12 mx-auto opacity-20" />
                   <p>Enter weights and returns</p>
                 </div>
               }
             </div>
           </app-card>

           @if (allValid() && isBalanced()) {
             <app-card class="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/50">
               <div class="flex justify-between items-center">
                 <span class="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">Total Weight</span>
                 <span class="text-xl font-black" [class]="totalWeight() === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'">
                   {{ totalWeight() | number: '1.0-2' }}%
                 </span>
               </div>
               <p class="text-xs text-blue-600 dark:text-blue-400 mt-1 opacity-70">Weights should ideally sum to 100%.</p>
             </app-card>
           }
        </div>
      </div>
    </div>
  `,
})
export class PortfolioReturnComponent {
  private financialService = inject(FinancialService);

  weights = signal<(number | string)[]>([40, 30, 30]);
  returns = signal<(number | string)[]>([12, 8, 4]);

  isBalanced = computed(() => this.weights().length === this.returns().length);

  allValid = computed(() => {
    const w = this.weights();
    const r = this.returns();
    return w.every(v => v !== null && v !== undefined && v !== '' && !isNaN(Number(v))) &&
      r.every(v => v !== null && v !== undefined && v !== '' && !isNaN(Number(v)));
  });

  totalWeight = computed(() => {
    return this.weights().reduce((sum, w) => sum + Number(w), 0);
  });

  result = computed(() => {
    if (!this.allValid() || !this.isBalanced()) return 0;
    return this.financialService.calculatePortfolioReturn({
      weights: this.weights().map(v => Number(v) / 100),
      returns: this.returns().map(v => Number(v) / 100),
    }) * 100;
  });
}
