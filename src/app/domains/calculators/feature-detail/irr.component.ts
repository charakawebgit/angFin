import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { DynamicListInputComponent } from '@shared/ui/dynamic-list-input.component';

@Component({
  selector: 'app-irr',
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
        <app-card title="Cash Flow Series">
          <app-dynamic-list-input
            id="cash-flows-list"
            label="Cash Flows (CF0, CF1, ...)"
            [items]="cashFlows()"
            (changed)="cashFlows.set($event)"
            placeholderPrefix="CF"
            prefix="$"
            [minItems]="2"
          />
          <p class="text-[10px] text-slate-400 mt-2 px-1">
            Note: Initial investment (CF0) should usually be negative.
          </p>
        </app-card>

        <app-card title="Internal Rate of Return">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (allValid() && result() !== null) {
              <div class="space-y-2">
                <span class="text-5xl font-black text-blue-600">
                  {{ result()! * 100 | number: '1.2-4' }}%
                </span>
                <p class="text-sm text-slate-500 max-w-[200px]">
                  The discount rate that makes the NPV of all cash flows equal to zero.
                </p>
              </div>
            } @else if (allValid() && result() === null) {
              <div class="text-amber-500 space-y-2">
                <lucide-icon name="activity" class="w-12 h-12 mx-auto opacity-20" />
                <p>Could not find IRR for this series. Check signs of cash flows.</p>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="activity" class="w-12 h-12 mx-auto opacity-20" />
                <p>Enter at least two cash flows</p>
              </div>
            }
          </div>
        </app-card>
      </div>
    </div>
  `,
})
export class IrrComponent {
  private financialService = inject(FinancialService);

  cashFlows = signal<(number | string)[]>([-10000, 3000, 4200, 5800]);

  allValid = computed(() => {
    const cf = this.cashFlows();
    return (
      cf.length >= 2 &&
      cf.every((v) => v !== null && v !== undefined && v !== '' && !isNaN(Number(v)))
    );
  });

  result = computed(() => {
    if (!this.allValid()) return null;
    return this.financialService.calculateIrr({ cashFlows: this.cashFlows().map(Number) });
  });
}
