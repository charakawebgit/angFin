import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { DynamicListInputComponent } from '@shared/ui/dynamic-list-input.component';

@Component({
  selector: 'app-variance-stddev',
  standalone: true,
  imports: [
    LucideAngularModule,
    CardComponent,
    DynamicListInputComponent,
    DecimalPipe,
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card title="Data Series">
          <app-dynamic-list-input
            id="variance-values-list"
            label="Values"
            [items]="values()"
            (changed)="values.set($event)"
            placeholderPrefix="Value"
            [minItems]="2"
          />
        </app-card>

        <div class="space-y-6">
          <app-card title="Standard Deviation">
            <div class="text-center py-2">
              @if (allValid()) {
                <span class="text-4xl font-black text-blue-600">{{ result().stdDev | number: '1.2-4' }}</span>
                <p class="text-xs text-slate-500 mt-1">Average spread from the mean (σ).</p>
              } @else {
                <span class="text-slate-300">--</span>
              }
            </div>
          </app-card>

          <app-card title="Variance">
             <div class="grid grid-cols-2 gap-4 text-center py-2">
               <div>
                 <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Population (σ²)</p>
                 @if (allValid()) {
                   <span class="text-xl font-bold text-slate-700">{{ result().popVar | number: '1.2-4' }}</span>
                 } @else {
                   <span class="text-slate-300 text-xl font-bold">--</span>
                 }
               </div>
               <div>
                 <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Sample (s²)</p>
                 @if (allValid()) {
                   <span class="text-xl font-bold text-slate-700">{{ result().sampVar | number: '1.2-4' }}</span>
                 } @else {
                   <span class="text-slate-300 text-xl font-bold">--</span>
                 }
               </div>
             </div>
          </app-card>
        </div>
      </div>
    </div>
  `,
})
export class VarianceStdDevComponent {
  private financialService = inject(FinancialService);

  values = signal<(number | string)[]>([10, 20, 30, 40, 50]);

  allValid = computed(() => {
    const v = this.values();
    return (
      v.length >= 2 &&
      v.every((val) => val !== null && val !== undefined && val !== '' && !isNaN(Number(val)))
    );
  });

  result = computed(() => {
    if (!this.allValid()) return { stdDev: 0, popVar: 0, sampVar: 0 };
    const v = this.values().map(Number);
    return {
      stdDev: this.financialService.calculateStandardDeviation({ values: v }),
      popVar: this.financialService.calculatePopulationVariance({ values: v }),
      sampVar: this.financialService.calculateSampleVariance({ values: v }),
    };
  });
}
