import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CalculatorConfig } from '@entities/calculator/model/types';

@Component({
  selector: 'app-calculator-info',
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (config().insights || config().formula || (config().references && config().references!.length > 0)) {
      <div class="flex flex-col gap-6 animate-in slide-in-from-bottom duration-700 delay-200">
        
        <!-- Insights Section -->
        <div class="space-y-6">
          <div class="flex items-center gap-4">
             <h3 class="text-sm font-semibold text-[color:var(--text-primary)] whitespace-nowrap">Financial Insights</h3>
             <div class="h-px bg-[color:var(--border)] w-full"></div>
          </div>

          <div class="flex gap-4 items-start text-left">
            <div class="p-2 rounded-xl border border-[color:var(--panel-outline)] bg-[color:var(--surface-soft)] text-[color:var(--accent-1)]">
              <lucide-icon name="lightbulb" class="w-5 h-5" />
            </div>
            <div class="space-y-3 w-full">
              @if (config().insights) {
              <div class="relative pl-4 border-l-2" [style.borderColor]="'var(--panel-outline)'">
                <p class="text-sm text-slate-600 leading-relaxed font-normal">
                  {{ config().insights }}
                </p>
              </div>
            }
            @if (config().formula) {
              <div class="group relative overflow-hidden rounded-xl bg-[color:var(--surface-contrast)] border border-[color:var(--panel-outline)] p-4 shadow-sm">
                <div class="absolute top-0 right-0 p-2 opacity-60 text-[color:var(--text-muted)]">
                    <lucide-icon name="sigma" class="w-4 h-4" />
                </div>
                <div class="font-mono text-center text-sm font-medium text-[color:var(--accent-1)] tracking-wide">
                  {{ config().formula }}
                </div>
              </div>
            }
            </div>
          </div>
        </div>
 
        @if (config().references && config().references!.length > 0) {
          <div class="space-y-6">
            <div class="flex items-center gap-4">
               <h3 class="text-sm font-semibold text-[color:var(--text-primary)] whitespace-nowrap">Educational Resources</h3>
               <div class="h-px bg-[color:var(--border)] w-full"></div>
            </div>

            <div class="space-y-4">
              <ul class="space-y-2">
                @for (ref of config().references; track ref.url) {
                  <li>
                    <a [href]="ref.url" target="_blank" class="flex items-center justify-between p-3 rounded-xl bg-[color:var(--surface-soft)] hover:bg-[color:var(--surface-contrast)] border border-[color:var(--panel-outline)] transition-all group overflow-hidden">
                      <span class="text-xs font-bold text-[color:var(--text-primary)] truncate pr-4">{{ ref.title }}</span>
                      <lucide-icon name="arrow-up-right" class="w-3.5 h-3.5 text-[color:var(--text-muted)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                    </a>
                  </li>
                }
              </ul>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class CalculatorInfoComponent {
  config = input.required<CalculatorConfig>();
}
