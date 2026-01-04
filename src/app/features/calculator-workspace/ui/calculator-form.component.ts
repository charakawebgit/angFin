import { Component, input, output, ChangeDetectionStrategy, effect, signal, untracked, inject, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, required, min, max, Field, FieldTree } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { InputComponent } from '@shared/ui/input.component';
import { DynamicListInputComponent } from '@shared/ui/dynamic-list-input.component';
import { CardComponent } from '@shared/ui/card.component';
import { CalculatorConfig, CalculatorData, FieldConfig } from '@entities/calculator/model/types';

type FormSignal = (() => any) & { valid?: () => boolean };

@Component({
  selector: 'app-calculator-form',
  imports: [
    CommonModule,
    LucideAngularModule,
    InputComponent,
    DynamicListInputComponent,
    CardComponent,
    Field,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (calcForm()) {
      <app-card [title]="config().subtitle || 'Parameters'" subtitle="Fill in the required fields">
        <div class="space-y-5">
          @for (field of config().fields; track field.key) {
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
                [items]="asList(localData()[field.key])"
                (changed)="updateData(field.key, $event)"
              />
            } @else if (field.type === 'select') {
              <div class="space-y-1.5 flex flex-col">
                <label [for]="field.key" class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                  {{ field.label }}
                </label>
                <select
                  [id]="field.key"
                  [value]="localData()[field.key]"
                  (change)="onSelectChange(field.key, $event)"
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
    }
  `,
})

export class CalculatorFormComponent {
  config = input.required<CalculatorConfig>();
  data = input.required<CalculatorData>();
  valid = output<boolean>();
  dataChanged = output<{ key: string; value: CalculatorData[string] }>();

  // Use local writable signal for the form, initialized from the data input
  localData = signal<CalculatorData>({});

  // Use a writable signal initialized to null
  calcForm = signal<FormSignal | null>(null);

  private injector = inject(Injector);

  constructor() {
    // Initialize form when config changes
    effect(() => {
      const cfg = this.config();

      // Use untracked to escape the reactive context of the effect, 
      // allowing the internal effects of 'form()' to be created safely.
      untracked(() => {
        // We need an injection context for the form library
        const newForm = runInInjectionContext(this.injector, () => {
          // use any for the schema here because form's internal Schema types are complex
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return form(this.localData, (schema: any) => {
            cfg.fields.forEach((f: FieldConfig) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const field = schema[f.key] as any;
              if (f.required) required(field);
              if (f.min !== undefined) min(field, f.min);
              if (f.max !== undefined) max(field, f.max);
            });
          });
        });
        this.calcForm.set(newForm);
      });
    });

    // Sync external data changes into local data
    effect(() => {
      const d = this.data();
      untracked(() => {
        if (JSON.stringify(d) !== JSON.stringify(this.localData())) {
          this.localData.set(d);
        }
      });
    });

    // Emit validity changes
    effect(() => {
      const f = this.calcForm();
      if (f) {
        this.valid.emit(f().valid());
      }
    });
  }

  getField(key: string): FieldTree<string | number, string | number> {
    const f = this.calcForm();
    if (!f) return {} as FieldTree<string | number, string | number>;
    const formObj = f();
    return formObj[key];
  }

  updateData(key: string, value: CalculatorData[string]) {
    this.dataChanged.emit({ key, value: value as CalculatorData[string] });
  }

  asList(val: unknown): (string | number)[] {
    return Array.isArray(val) ? val as (string | number)[] : [];
  }

  onSelectChange(key: string, event: Event) {
    const select = event.target as HTMLSelectElement;
    this.updateData(key, select.value);
  }
}
