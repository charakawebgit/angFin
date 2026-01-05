import { Component, input, output, ChangeDetectionStrategy, effect, inject, Injector, runInInjectionContext, linkedSignal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, Field, FieldTree } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';
import { InputComponent } from '@shared/ui/input.component';
import { DynamicListInputComponent } from '@shared/ui/dynamic-list-input.component';
import { CardComponent } from '@shared/ui/card.component';
import { CalculatorConfig, CalculatorData } from '@entities/calculator/model/types';
import { buildFormSchema } from '@shared/lib/forms/field-to-schema.utils';

// The `form()` return shape is intentionally left loosely typed here.

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
    @if (calcForm(); as cForm) {
      @let cfg = config()!;
      <app-card [title]="cfg.subtitle || 'Parameters'" subtitle="Fill in the required fields">
        <div class="space-y-5">
          @for (field of cfg.fields; track field.key) {
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
  // Use optional inputs to make the component resilient in tests and host
  // environments; effects guard access until values are available.
  config = input<CalculatorConfig>();
  data = input<CalculatorData>();
  valid = output<boolean>();
  dataChanged = output<{ key: string; value: CalculatorData[string] }>();

  // Sync external data changes into local data using linkedSignal
  localData = linkedSignal<CalculatorData>(() => this.data() || {});

  // The form is derived from config and localData. 
  // We use a computed signal that handles the injection context.
  calcForm = computed(() => {
    const cfg = this.config();
    if (!cfg) return null;

    // We need an injection context for the form library
    return runInInjectionContext(this.injector, () => {
      // Build the schema using a centralized helper
      return form(this.localData, buildFormSchema(cfg.fields));
    });
  });

  private injector = inject(Injector);

  constructor() {
    // Emit validity changes using an effect
    effect(() => {
      const f = this.calcForm();
      if (f) {
        // Access validity from the form signal
        this.valid.emit(Boolean(f().valid?.()));
      }
    });
  }

  getField(key: string): FieldTree<string | number, string | number> {
    const f = this.calcForm();
    if (!f) return {} as FieldTree<string | number, string | number>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formObj = f() as any;
    return formObj[key] as FieldTree<string | number, string | number>;
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
