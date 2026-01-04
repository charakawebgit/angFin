import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CardComponent } from '@shared/ui/card.component';
import { CalculatorConfig } from '../../data/models';

@Component({
    selector: 'app-calculator-info',
    imports: [CommonModule, LucideAngularModule, CardComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    @if (config().insights || config().formula) {
      <app-card title="Financial Insights">
        <div class="flex gap-4 items-start text-left">
          <div class="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/20 text-blue-600 dark:text-blue-400">
            <lucide-icon name="lightbulb" class="w-5 h-5" />
          </div>
          <div class="space-y-3 w-full">
            @if (config().insights) {
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {{ config().insights }}
              </p>
            }
            @if (config().formula) {
              <div class="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 font-mono text-xs text-center text-slate-500 dark:text-slate-400 w-full">
                Formula: {{ config().formula }}
              </div>
            }
          </div>
        </div>
      </app-card>
    }
  `,
})
export class CalculatorInfoComponent {
    config = input.required<CalculatorConfig>();
}
