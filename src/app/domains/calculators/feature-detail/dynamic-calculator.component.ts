import { Component, computed, inject, signal, input, effect, untracked } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { form, required, min, max, Field, FieldTree } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { InputComponent } from '@shared/ui/input.component';
import { CardComponent } from '@shared/ui/card.component';
import { DynamicListInputComponent } from '@shared/ui/dynamic-list-input.component';
import { CalculatorService } from '../data/calculator.service';
import { CalculatorConfig } from '../data/models';

@Component({
  selector: 'app-dynamic-calculator',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    InputComponent,
    CardComponent,
    DynamicListInputComponent,
    CardComponent,
    DynamicListInputComponent,
    Field,
    CurrencyPipe,
  ],
  template: `
    @if (config()) {
      <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <app-card [title]="config()!.subtitle || 'Parameters'" subtitle="Fill in the required fields">
            <div class="space-y-5">
              @for (field of config()!.fields; track field.key) {
                @if (field.type === 'number') {
                  <app-input
                    [id]="field.key"
                    [label]="field.label"
                    [field]="$any(getField(field.key))"
                    type="number"
                    [prefix]="field.prefix"
                    [suffix]="field.suffix"
                    [placeholder]="field.placeholder || ''"
                  />
                } @else if (field.type === 'list') {
                  <app-dynamic-list-input
                    [id]="field.key"
                    [label]="field.label"
                    [items]="data()[field.key]"
                    (changed)="updateList(field.key, $event)"
                  />
                } @else if (field.type === 'select') {
                  <div class="space-y-1.5">
                    <label [for]="field.key" class="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                      {{ field.label }}
                    </label>
                    <select
                      [id]="field.key"
                      [value]="data()[field.key]"
                      (change)="updateField(field.key, $any($event.target).value)"
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

          <app-card [title]="config()!.results[0]?.label || 'Results'" subtitle="Calculated output">
            <div class="flex flex-col items-center justify-center h-full py-10 text-center">
              @if (calcForm()().valid()) {
                <div class="space-y-6 w-full animate-in zoom-in duration-500">
                  @for (res of config()!.results; track res.label) {
                    <div class="relative inline-block">
                      <div class="absolute -inset-4 blur-2xl rounded-full opacity-10" [class]="getThemeClass(res.themeColor)"></div>
                      <div class="relative">
                        <span class="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br tracking-tight" [class]="getGradientClass(res.themeColor)">
                          {{ formatResult(results()[$index], res.type) }}
                        </span>
                        <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-3">{{ res.label }}</p>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="text-slate-300 dark:text-slate-700 space-y-4 py-4">
                  <lucide-icon [name]="config()!.icon" class="w-16 h-16 mx-auto opacity-20" />
                  <p class="text-sm font-medium italic">Enter parameters to see calculation</p>
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

  config = computed(() => this.calcService.getConfigById(this.id()));
  data = signal<any>({});

  // Initialize data when config changes
  constructor() {
    effect(() => {
      const cfg = this.config();
      if (cfg) {
        untracked(() => {
          const initialData: any = {};
          cfg.fields.forEach(f => {
            initialData[f.key] = f.defaultValue;
          });
          this.data.set(initialData);
        });
      }
    });
  }

  calcForm = computed(() => {
    const cfg = this.config();
    if (!cfg) return form(signal({}), () => { });

    return form(this.data, (schema: any) => {
      cfg.fields.forEach(f => {
        if (f.required) required(schema[f.key]);
        if (f.min !== undefined) min(schema[f.key], f.min);
        if (f.max !== undefined) max(schema[f.key], f.max);
      });
    });
  });

  getField(key: string): FieldTree<any, any> {
    return (this.calcForm() as any)[key];
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

  updateList(key: string, values: (string | number)[]) {
    this.data.update(d => ({ ...d, [key]: values }));
  }

  updateField(key: string, value: any) {
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
