import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { DynamicListInputComponent } from '@shared/ui/dynamic-list-input.component';

@Component({
  selector: 'app-cv',
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
        <app-card title="Calculated CV">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (allValuesValid() && result() !== null) {
              <div class="space-y-2">
                <span class="text-5xl font-black text-blue-600">
                  {{ result() | number: '1.2-4' }}
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  Relative measure of dispersion (SD / Mean).
                </p>
              </div>
            } @else if (allValuesValid() && result() === null) {
              <div class="text-amber-500 space-y-2">
                <lucide-icon name="git-compare-arrows" class="w-12 h-12 mx-auto opacity-20" />
                <p>Mean cannot be zero for CV</p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="git-compare-arrows" class="w-12 h-12 mx-auto opacity-20" />
                <p>Enter at least two values</p>
              </div>
            }
          </div>
        </app-card>

        <app-card title="Data Series">
          <app-dynamic-list-input
            id="cv-values"
            label="Values"
            [items]="values()"
            (changed)="values.set($event)"
            placeholderPrefix="Value"
            [minItems]="2"
          />
        </app-card>
      </div>

      <app-card title="Formula">
        <div class="bg-slate-50 p-4 rounded-lg font-mono text-sm text-center">
          CV = Standard Deviation / Mean
        </div>
      </app-card>
    </div>
  `,
})
export class CvComponent {
  private financialService = inject(FinancialService);

  values = signal<(number | string)[]>([10, 12, 11, 13, 15]);

  allValuesValid = computed(() => {
    const v = this.values() as (number | string)[];
    return v.length >= 2 && v.every((val) => val !== null && val !== undefined && String(val) !== '' && !isNaN(Number(val)));
  });

  result = computed(() => {
    if (!this.allValuesValid()) return 0;

    try {
      return this.financialService.calculateCoefficientOfVariation({
        values: this.values().map(Number),
      });
    } catch {
      return null;
    }
  });
}
