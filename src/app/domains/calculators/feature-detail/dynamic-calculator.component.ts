import { Component, computed, inject, signal, input, ChangeDetectionStrategy, linkedSignal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, required, min, max, Field, FieldTree } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { InputComponent } from '@shared/ui/input.component';
import { CardComponent } from '@shared/ui/card.component';
import { DynamicListInputComponent } from '@shared/ui/dynamic-list-input.component';
import { CalculatorService } from '../data/calculator.service';
import { CalculatorData } from '../data/models';

@Component({
  selector: 'app-dynamic-calculator',
  imports: [
    CommonModule,
    LucideAngularModule,
    InputComponent,
    CardComponent,
    DynamicListInputComponent,
    Field,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isLoading()) {
      <div class="max-w-4xl mx-auto flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-700">
        <div class="relative">
          <div class="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
          <lucide-icon name="calculator" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-500 animate-pulse" />
        </div>
        <p class="mt-8 text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest animate-pulse">Initializing Engine...</p>
      </div>
    } @else if (config()) {
      <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <app-card [title]="config()!.subtitle || 'Parameters'" subtitle="Fill in the required fields">
            <div class="space-y-5">
              @for (field of config()!.fields; track field.key) {
                @if (field.type === 'number') {
                  <app-input
                    [id]="field.key"
                    [label]="field.label"
                    [field]="getField(field.key)"
                    type="number"
                    [prefix]="field.prefix"
                    [suffix]="field.suffix"
                    [placeholder]="field.placeholder || ''"
                  />
                } @else if (field.type === 'list') {
                  <app-dynamic-list-input
                    [id]="field.key"
                    [label]="field.label"
                    [items]="$any(data()[field.key] || [])"
                    (changed)="updateData(field.key, $event)"
                  />
                } @else if (field.type === 'select') {
                  <div class="space-y-1.5 flex flex-col">
                    <label [for]="field.key" class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                      {{ field.label }}
                    </label>
                    <select
                      [id]="field.key"
                      [value]="data()[field.key]"
                      (change)="updateData(field.key, $any($event.target).value)"
                      class="w-full h-12 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                    >
                      @for (opt of field.options; track opt.value) {
                        <option [value]="opt.value">{{ opt.label }}</option>
                      }
                    </select>
                  </div>
                }

              }
            </div>
          </app-card>

          <app-card [title]="config()!.results[0]?.label || 'Results'" subtitle="Active Analysis">
            <div class="flex flex-col items-center justify-center h-full py-6 text-center" aria-live="polite">
              @if (calcForm()().valid()) {
                <div class="space-y-10 w-full animate-in zoom-in duration-500">
                  @for (res of config()!.results; track res.label) {
                    <div class="group relative flex flex-col items-center px-4">
                      <div class="absolute -inset-4 blur-3xl rounded-full opacity-10 group-hover:opacity-20 transition-opacity" [class]="getThemeClass(res.themeColor)"></div>
                      
                      <div class="relative w-full">
                        <div class="flex items-center justify-center gap-4 mb-2">
                           <span class="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br tracking-tighter font-display" [class]="getGradientClass(res.themeColor)">
                            {{ formatResult(results()[$index], res.type) }}
                          </span>
                          
                          <button 
                            (click)="copyToClipboard(results()[$index], res.label)"
                            class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all opacity-0 group-hover:opacity-100"
                            [title]="'Copy ' + res.label"
                          >
                            @if (copiedField() === res.label) {
                              <lucide-icon name="check" class="w-4 h-4 text-emerald-500" />
                            } @else {
                              <lucide-icon name="copy" class="w-4 h-4" />
                            }
                          </button>
                        </div>
                        
                        <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{{ res.label }}</p>

                        @if (res.type === 'percent') {
                          <div class="mt-6 w-full max-w-[200px] mx-auto h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                            <div 
                              class="h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out"
                              [class]="getGradientClass(res.themeColor)"
                              [style.width]="getProgressBarWidth($any(results()[$index]) * 100)"
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
                    <lucide-icon [name]="config()!.icon" class="w-12 h-12 opacity-40" />
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">Awaiting Input</p>
                    <p class="text-xs font-medium italic text-slate-400 dark:text-slate-500">Provide all parameters to calculate</p>
                  </div>
                </div>
              }
            </div>
          </app-card>
        </div>

        @if (config()!.insights || config()!.formula) {
          <app-card title="Financial Insights">
            <div class="flex gap-4 items-start text-left">
              <div class="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/20 text-blue-600 dark:text-blue-400">
                <lucide-icon name="lightbulb" class="w-5 h-5" />
              </div>
              <div class="space-y-3 w-full">
                @if (config()!.insights) {
                  <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {{ config()!.insights }}
                  </p>
                }
                @if (config()!.formula) {
                  <div class="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 font-mono text-xs text-center text-slate-500 dark:text-slate-400 w-full">
                    Formula: {{ config()!.formula }}
                  </div>
                }
              </div>
            </div>
          </app-card>
        }
      </div>
    }
  `,
})
export class DynamicCalculatorComponent {
  id = input.required<string>();

  private calcService = inject(CalculatorService);

  config = this.calcService.activeConfig;
  isLoading = this.calcService.isLoading;

  constructor() {
    effect(() => {
      const toolId = this.id();
      this.calcService.loadConfig(toolId);
    });
  }

  data = linkedSignal<CalculatorData>(() => {
    const cfg = this.config();
    if (!cfg) return {};

    const initialData: CalculatorData = {};
    cfg.fields.forEach(f => {
      initialData[f.key] = f.defaultValue as CalculatorData[string];
    });
    return initialData;
  });

  copiedField = signal<string | null>(null);

  copyToClipboard(value: unknown, fieldId: string) {
    const text = value?.toString() || '';
    navigator.clipboard.writeText(text).then(() => {
      this.copiedField.set(fieldId);
      setTimeout(() => this.copiedField.set(null), 2000);
    });
  }

  getProgressBarWidth(value: number): string {
    const clamped = Math.min(Math.max(value, 0), 100);
    return `${clamped}%`;
  }

  calcForm = computed(() => {
    const cfg = this.config();
    if (!cfg) return form(signal({}), () => ({}));

    return form(this.data, (schema: Record<string, any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      cfg.fields.forEach(f => {
        if (f.required) required(schema[f.key]);
        if (f.min !== undefined) min(schema[f.key], f.min);
        if (f.max !== undefined) max(schema[f.key], f.max);
      });
    });
  });

  getField(key: string): FieldTree<string | number, string | number> {
    return (this.calcForm() as unknown as Record<string, FieldTree<string | number, string | number>>)[key];
  }

  results = computed(() => {
    const cfg = this.config();
    if (!cfg || !this.calcForm()().valid()) return [];

    const d = this.data();
    return cfg.results.map(res => {
      try {
        return res.calculate(d);
      } catch (e) {
        console.error('Calculation Error:', e);
        return 0;
      }
    });
  });

  updateData(key: string, value: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    this.data.update(d => ({ ...d, [key]: value }));
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

  formatResult(val: unknown, type: string): string {
    if (val === undefined || val === null || (typeof val === 'number' && isNaN(val))) return '0';

    if (type === 'currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val as number);
    }
    if (type === 'percent') {
      return ((val as number) * 100).toFixed(2) + '%';
    }
    return Number(val).toLocaleString(undefined, { maximumFractionDigits: 4 });
  }
}
