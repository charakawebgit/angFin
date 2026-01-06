import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CardComponent } from '@shared/ui/card.component';
import { TableComponent } from '@shared/ui/table.component';
import { CalculatorConfig, ResultValue } from '@entities/calculator/model/types';
import { castToNumber, castToArray } from '@entities/finance/lib/casting.utils';

@Component({
  selector: 'app-calculator-results',
  imports: [CommonModule, LucideAngularModule, CardComponent, TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (viewMode() === 'full') {
      <app-card [title]="config().results[0]?.label || 'Results'" subtitle="Analysis Report">
        <div class="flex flex-col h-full py-2 text-left" aria-live="polite">
          @if (isValid()) {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 w-full animate-in fade-in slide-in-from-left-4 duration-500">
              @for (res of config().results; track res.label) {
                @let val = castToNumber(results()[$index]);
                 
                <!-- Only show scalar results in this grid, tables handles separately -->
                @if (res.type !== 'table') {
                  <div class="relative w-full group flex flex-col gap-2 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div class="flex items-center justify-between">
                         <p class="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]">{{ res.label }}</p>
                         <button 
                           (click)="copyToClipboard(results()[$index], res.label)"
                           class="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-[color:var(--accent-1)]"
                           [title]="'Copy ' + res.label"
                         >
                            @if (copiedField() === res.label) {
                                <lucide-icon name="check" class="w-3.5 h-3.5 text-emerald-500" />
                            } @else {
                                <lucide-icon name="copy" class="w-3.5 h-3.5" />
                            }
                         </button>
                      </div>

                      <div class="flex items-center gap-3">
                         <span class="text-2xl lg:text-3xl font-bold tracking-tight text-[color:var(--text-primary)]">
                          @switch (res.type) {
                            @case ('currency') { {{ val | currency:'USD':'symbol':'1.0-2' }} }
                            @case ('percent') { {{ val | percent:'1.2-2' }} }
                            @default { {{ val | number:'1.0-4' }} }
                          }
                        </span>
                      </div>
    
                      @if (res.type === 'percent') {
                        <div class="mt-1 w-full h-1 bg-[color:var(--surface-contrast)] rounded-full overflow-hidden" role="progressbar">
                          <div 
                            class="h-full rounded-full transition-all duration-1000 ease-out bg-[color:var(--color-success)]"
                            [style.width]="getProgressBarWidth(results()[$index])"
                          ></div>
                        </div>
                      }
                  </div>
                }
              }
            </div>
              
              <!-- Table Results take full width below -->
              @for (res of config().results; track res.label) {
                @if (res.type === 'table' && res.tableConfig) {
                  <div class="w-full mt-6 pt-4 border-t border-slate-100 animate-in fade-in duration-700">
                    <h3 class="text-sm font-semibold text-[color:var(--text-primary)] mb-4">{{ res.label }}</h3>
                    @let tableData = castToArray(results()[$index]);
                    <app-table [columns]="res.tableConfig.columns" [data]="tableData" />
                  </div>
                }
              }
          } @else {
            <!-- Empty State -->
            <div class="text-[color:var(--text-muted)] space-y-4 py-8 w-full flex flex-col items-start px-1">
               <div class="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                <lucide-icon [name]="config().icon" class="w-6 h-6 text-slate-400" />
              </div>
              <div class="space-y-1">
                <p class="text-sm font-semibold text-[color:var(--text-primary)]">Awaiting Configuration</p>
                <p class="text-sm text-[color:var(--text-muted)]">Adjust inputs to generate report.</p>
              </div>
            </div>
          }
        </div>
      </app-card>
    } @else {
        <!-- Compact Mode (Mobile Sticky) -->
        <div class="flex items-center justify-between w-full h-full px-4" aria-live="polite">
             @if (isValid() && results().length > 0) {
                 @let res = config().results[0];
                 @let val = castToNumber(results()[0]);

                 <span class="text-xs font-bold text-[color:var(--text-muted)] uppercase tracking-wider truncate mr-4">
                     {{ res.label }}
                 </span>
                 
                 <span class="text-xl font-black font-display bg-clip-text text-transparent bg-gradient-to-r" [class]="getGradientClass(res.themeColor)">
                      @switch (res.type) {
                          @case ('currency') { {{ val | currency:'USD':'symbol':'1.0-2' }} }
                          @case ('percent') { {{ val | percent:'1.2-2' }} }
                          @default { {{ val | number:'1.0-4' }} }
                      }
                 </span>
             } @else {
               <span class="text-sm font-medium text-[color:var(--text-muted)] italic">Enter parameters...</span>
               <lucide-icon name="more-horizontal" class="w-5 h-5 text-[color:var(--text-muted)] animate-pulse" />
             }
        </div>
    }
  `,
})
export class CalculatorResultsComponent {
  config = input.required<CalculatorConfig>();
  results = input.required<ResultValue[]>();
  isValid = input.required<boolean>();
  viewMode = input<'full' | 'compact'>('full');

  copiedField = signal<string | null>(null);

  async copyToClipboard(value: ResultValue, fieldId: string) {
    const text = value && typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');

    try {
      if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        this.fallbackCopy(text);
      }

      this.copiedField.set(fieldId);
      setTimeout(() => this.copiedField.set(null), 2000);
    } catch (error: unknown) {
      console.error('Copy failed', error);
    }
  }

  private fallbackCopy(value: string) {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  getProgressBarWidth(value: ResultValue): string {
    const numValue = Number(value as number);
    if (isNaN(numValue)) return '0%';
    const clamped = Math.min(Math.max(numValue, 0), 100);
    return `${clamped}%`;
  }

  getThemeClass(color?: string) {
    switch (color) {
      case 'emerald': return 'bg-emerald-500/10';
      case 'amber': return 'bg-amber-500/10';
      case 'rose': return 'bg-rose-500/10';
      case 'sky': return 'bg-sky-500/10';
      default: return 'bg-indigo-500/10';
    }
  }

  getGradientClass(color?: string) {
    switch (color) {
      case 'emerald': return 'from-emerald-600 to-teal-700 dark:from-emerald-400 dark:to-teal-500';
      case 'amber': return 'from-amber-600 to-orange-700 dark:from-amber-400 dark:to-orange-500';
      case 'rose': return 'from-rose-600 to-pink-700 dark:from-rose-400 dark:to-pink-500';
      case 'sky': return 'from-sky-600 to-blue-700 dark:from-sky-400 dark:to-blue-500';
      default: return 'from-indigo-600 to-blue-700 dark:from-indigo-400 dark:to-blue-500';
    }
  }

  protected castToNumber = castToNumber;
  protected castToArray = castToArray;
}
