import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { DynamicListInputComponent } from '@shared/ui/dynamic-list-input.component';

@Component({
  selector: 'app-skew-kurt',
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
        <app-card title="Inputs">
          <app-dynamic-list-input
            id="skew-values-list"
            label="Values"
            [items]="values()"
            (changed)="values.set($event)"
            placeholderPrefix="Value"
            [minItems]="4"
          />
        </app-card>

        <div class="space-y-6">
          <app-card title="Sample Skewness">
            <div class="text-center py-4">
              @if (allValid()) {
                <span class="text-4xl font-black" [class]="result().skew >= 0 ? 'text-blue-600' : 'text-amber-600'">
                  {{ result().skew | number: '1.2-4' }}
                </span>
                <p class="text-xs text-slate-500 mt-2">
                  {{ getSkewDesc(result().skew) }}
                </p>
              } @else {
                <span class="text-slate-300">--</span>
              }
            </div>
          </app-card>

          <app-card title="Excess Kurtosis">
            <div class="text-center py-4">
              @if (allValid()) {
                <span class="text-4xl font-black" [class]="result().kurt >= 0 ? 'text-indigo-600' : 'text-emerald-600'">
                  {{ result().kurt | number: '1.2-4' }}
                </span>
                <p class="text-xs text-slate-500 mt-2">
                   {{ getKurtDesc(result().kurt) }}
                </p>
              } @else {
                <span class="text-slate-300">--</span>
              }
            </div>
          </app-card>
        </div>
      </div>
    </div>
  `,
})
export class SkewKurtComponent {
  private financialService = inject(FinancialService);

  values = signal<(number | string)[]>([10, 11, 10, 12, 10, 13, 20]); // Skewed series

  allValid = computed(() => {
    // Skewness needs n >= 3, Kurtosis needs n >= 4
    const v = this.values();
    return (
      v.length >= 4 &&
      v.every((val) => val !== null && val !== undefined && val !== '' && !isNaN(Number(val)))
    );
  });

  result = computed(() => {
    if (!this.allValid()) return { skew: 0, kurt: 0 };
    const v = this.values().map(Number);
    try {
      return {
        skew: this.financialService.calculateSampleSkewness({ values: v }),
        kurt: this.financialService.calculateExcessKurtosis({ values: v }),
      };
    } catch {
      return { skew: 0, kurt: 0 };
    }
  });

  getSkewDesc(val: number) {
    if (Math.abs(val) < 0.1) return 'Relatively Symmetrical';
    return val > 0 ? 'Positively Skewed (Long Right Tail)' : 'Negatively Skewed (Long Left Tail)';
  }

  getKurtDesc(val: number) {
    if (Math.abs(val) < 0.1) return 'Mesokurtic (Normal-like tails)';
    return val > 0 ? 'Leptokurtic (Fat Tails)' : 'Platykurtic (Thin Tails)';
  }
}
