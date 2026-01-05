import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CardComponent } from '@shared/ui/card.component';
import { CalculatorConfig, ResultValue } from '@entities/calculator/model/types';
import { castToNumber } from '@entities/finance/lib/casting.utils';

@Component({
  selector: 'app-calculator-results',
  imports: [CommonModule, LucideAngularModule, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-card [title]="config().results[0]?.label || 'Results'" subtitle="Active Analysis">
      <div class="flex flex-col items-center justify-center h-full py-6 text-center" aria-live="polite">
        @if (isValid()) {
          <div class="space-y-10 w-full animate-in zoom-in duration-500">
            @for (res of config().results; track res.label) {
              <div class="group relative flex flex-col items-center px-4">
                <div class="absolute -inset-4 blur-3xl rounded-full opacity-10 group-hover:opacity-20 transition-opacity" [class]="getThemeClass(res.themeColor)"></div>
                
                <div class="relative w-full">
                    <div class="flex items-center justify-center gap-4 mb-2">
                       <span class="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br tracking-tighter font-display" [class]="getGradientClass(res.themeColor)">
                        @switch (res.type) {
                          @case ('currency') { {{ castToNumber(results()[$index]) | currency:'USD':'symbol':'1.0-2' }} }
                          @case ('percent') { {{ castToNumber(results()[$index]) | percent:'1.2-2' }} }
                          @default { {{ castToNumber(results()[$index]) | number:'1.0-4' }} }
                        }
                      </span>
                      
                      <button 
                        (click)="copyToClipboard(results()[$index], res.label)"
                        class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none focus:ring-2 focus:ring-blue-500/20"
                        [title]="'Copy ' + res.label"
                        [aria-label]="'Copy ' + res.label"
                      >
                        @if (copiedField() === res.label) {
                          <lucide-icon name="check" class="w-4 h-4 text-emerald-500" />
                        } @else {
                          <lucide-icon name="copy" class="w-4 h-4" />
                        }
                      </button>
                    </div>
                    
                    <p id="label-{{$index}}" class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{{ res.label }}</p>
  
                    @if (res.type === 'percent') {
                      <div class="mt-6 w-full max-w-[200px] mx-auto h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner" role="progressbar" [attr.aria-valuenow]="results()[$index]" aria-valuemin="0" aria-valuemax="100" [attr.aria-labelledby]="'label-' + $index">
                        <div 
                          class="h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out"
                          [class]="getGradientClass(res.themeColor)"
                          [style.width]="getProgressBarWidth(results()[$index])"
                        ></div>
                      </div>
                    }
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-slate-300 dark:text-slate-700 space-y-6 py-10 w-full flex flex-col items-center">
             <div class="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-100 dark:border-slate-800/50 animate-pulse">
              <lucide-icon [name]="config().icon" class="w-12 h-12 opacity-40" />
            </div>
            <div class="space-y-1">
              <p class="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">Awaiting Input</p>
              <p class="text-xs font-medium italic text-slate-400 dark:text-slate-500">Provide all parameters to calculate</p>
            </div>
          </div>
        }
      </div>
    </app-card>
  `,
})
export class CalculatorResultsComponent {
  config = input.required<CalculatorConfig>();
  results = input.required<ResultValue[]>();
  isValid = input.required<boolean>();

  copiedField = signal<string | null>(null);

  copyToClipboard(value: ResultValue, fieldId: string) {
    const text = value && typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
    navigator.clipboard.writeText(text).then(() => {
      this.copiedField.set(fieldId);
      setTimeout(() => this.copiedField.set(null), 2000);
    });
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
}
