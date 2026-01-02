import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { DynamicListInputComponent } from '@shared/ui/dynamic-list-input.component';

@Component({
  selector: 'app-geometric-mean',
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
            id="returns-list"
            label="Periodic Returns (%)"
            [items]="returns()"
            (changed)="returns.set($event)"
            placeholderPrefix="Return"
            suffix="%"
            [minItems]="1"
          />
        </app-card>

        <app-card title="Geometric Mean Return">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (allValid()) {
              <div class="space-y-2">
                <span class="text-5xl font-black text-blue-600">
                  {{ result() | number: '1.2-4' }}%
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  Compounded annual growth rate (CAGR) of the series.
                </p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="bar-chart-4" class="w-12 h-12 mx-auto opacity-20" />
                <p>Enter return values to see the mean</p>
              </div>
            }
          </div>
        </app-card>
      </div>
    </div>
  `,
})
export class GeometricMeanComponent {
  private financialService = inject(FinancialService);

  returns = signal<(number | string)[]>([10, 5, -2, 8]);

  allValid = computed(() => {
    const r = this.returns();
    return (
      r.length >= 1 &&
      r.every((v) => v !== null && v !== undefined && v !== '' && !isNaN(Number(v)))
    );
  });

  result = computed(() => {
    if (!this.allValid()) return 0;

    return (
      this.financialService.calculateGeometricMean({
        returns: this.returns().map((v) => Number(v) / 100),
      }) * 100
    );
  });
}
