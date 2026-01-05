import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CardComponent } from '@shared/ui/card.component';
import { CalculatorConfig } from '@entities/calculator/model/types';

@Component({
  selector: 'app-calculator-info',
  imports: [CommonModule, LucideAngularModule, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (config().insights || config().formula || (config().references && config().references!.length > 0)) {
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card title="Financial Insights">
          <div class="flex gap-4 items-start text-left">
            <div class="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/20 text-blue-600 dark:text-blue-400">
              <lucide-icon name="lightbulb" class="w-5 h-5" />
            </div>
            <div class="space-y-3 w-full">
              @if (config().insights) {
              <div class="relative pl-4 border-l-2 border-blue-500/30">
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">
                  "{{ config().insights }}"
                </p>
              </div>
            }
            @if (config().formula) {
              <div class="group relative overflow-hidden rounded-xl bg-slate-900 dark:bg-black border border-slate-800 p-4 shadow-lg">
                <div class="absolute top-0 right-0 p-2 opacity-50">
                    <lucide-icon name="sigma" class="w-4 h-4 text-slate-700" />
                </div>
                <div class="font-mono text-center text-sm font-medium text-emerald-400 tracking-wide">
                  {{ config().formula }}
                </div>
              </div>
            }
            </div>
          </div>
        </app-card>

        @if (config().references && config().references!.length > 0) {
          <app-card title="Educational Resources">
            <div class="space-y-4">
              <div class="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                <lucide-icon name="scroll-text" class="w-5 h-5" />
                <span class="text-xs font-black uppercase tracking-widest">Learn More</span>
              </div>
              <ul class="space-y-2">
                @for (ref of config().references; track ref.url) {
                  <li>
                    <a [href]="ref.url" target="_blank" class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-white/5 transition-all group overflow-hidden">
                      <span class="text-xs font-bold text-slate-700 dark:text-slate-300 truncate pr-4">{{ ref.title }}</span>
                      <lucide-icon name="arrow-up-right" class="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                    </a>
                  </li>
                }
              </ul>
            </div>
          </app-card>
        }
      </div>
    }
  `,
})
export class CalculatorInfoComponent {
  config = input.required<CalculatorConfig>();
}
