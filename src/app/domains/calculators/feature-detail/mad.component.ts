import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { DynamicListInputComponent } from '@shared/ui/dynamic-list-input.component';

@Component({
  selector: 'app-mad',
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
            id="mad-values-list"
            label="Values"
            [items]="values()"
            (changed)="values.set($event)"
            placeholderPrefix="Value"
            [minItems]="2"
          />
        </app-card>

        <app-card title="Mean Absolute Deviation">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (allValid()) {
              <div class="space-y-2">
                <span class="text-5xl font-black text-blue-600">
                  {{ result() | number: '1.2-4' }}
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                   Average absolute difference from the mean.
                </p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="move-horizontal" class="w-12 h-12 mx-auto opacity-20" />
                <p>Enter at least two values</p>
              </div>
            }
          </div>
        </app-card>
      </div>
    </div>
  `,
})
export class MadComponent {
  private financialService = inject(FinancialService);

  values = signal<any[]>([10, 20, 30, 40, 50]);

  allValid = computed(() => {
    const v = this.values();
    return (
      v.length >= 2 &&
      v.every((val) => val !== null && val !== undefined && val !== '' && !isNaN(Number(val)))
    );
  });

  result = computed(() => {
    if (!this.allValid()) return 0;
    return this.financialService.calculateMeanAbsoluteDeviation({
      values: this.values().map(Number),
    });
  });
}
