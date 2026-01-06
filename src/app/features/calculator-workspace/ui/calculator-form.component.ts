import { Component, input, output, ChangeDetectionStrategy, inject, signal, OnDestroy, effect, untracked, computed } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, NonNullableFormBuilder, ValidatorFn } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { InputComponent } from '@shared/ui/input.component';
import { DynamicListInputComponent } from '@shared/ui/dynamic-list-input.component';

import { CalculatorConfig, CalculatorData } from '@entities/calculator/model/types';
import { asList } from '@entities/finance/lib/casting.utils';

type ControlValue = number | string | (string | number)[];

@Component({
  selector: 'app-calculator-form',
  imports: [
    CommonModule,
    LucideAngularModule,
    InputComponent,
    DynamicListInputComponent,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (formGroup(); as fg) {

      <div class="space-y-6">
        <form [formGroup]="fg" class="space-y-6">
          <div class="space-y-8">
            @for (group of groupedFields(); track group.name) {
              <div class="space-y-4">
                @if (group.name !== 'default') {
                   <div class="flex items-center gap-4">
                     <h3 class="text-sm font-semibold text-[color:var(--text-primary)] whitespace-nowrap">{{ group.name }}</h3>
                     <div class="h-px bg-[color:var(--border)] w-full"></div>
                   </div>
                }
                
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  @for (field of group.fields; track field.key) {
                    <div [class]="field.type === 'list' ? 'col-span-full' : ''">
                      @if (field.type === 'number') {
                        <app-input
                          [id]="field.key"
                          [label]="field.label"
                          [description]="field.description"
                          [control]="getControl(field.key)"
                          type="number"
                          [prefix]="field.prefix"
                          [suffix]="field.suffix"
                          [placeholder]="field.placeholder || ''"
                        />
                      } @else if (field.type === 'list') {
                        <app-dynamic-list-input
                          [id]="field.key"
                          [label]="field.label"
                          [formControlName]="field.key"
                        />
                      } @else if (field.type === 'select') {
                          <div class="space-y-1.5 flex flex-col">
                              <label [for]="field.key" class="text-sm font-medium ml-1 text-[color:var(--text-primary)]">
                              {{ field.label }}
                              </label>
                              <select
                              [id]="field.key"
                              [formControlName]="field.key"
                              class="input-standard appearance-none cursor-pointer"
                              [class]="'bg-[color:var(--surface-soft)]'"
                              >
                              @for (opt of field.options; track opt.value) {
                                  <option [value]="opt.value">{{ opt.label }}</option>
                              }
                              </select>
                          </div>
                      }
                    </div>
                  }
                </div>
              </div>
            }
          </div>
          
          <div class="flex justify-end pt-2">
            <button 
                type="button" 
                (click)="fg.reset()"
                class="text-xs font-bold text-slate-400 hover:text-red-500 dark:hover:text-red-400 uppercase tracking-widest flex items-center gap-2 transition-colors group"
            >
                <lucide-icon name="trash-2" class="w-4 h-4 transition-transform group-hover:scale-110" />
                Clear Inputs
            </button>
          </div>
        </form>
      </div>
    }
  `,
  host: {
    '(window:keydown.escape)': 'handleEscape()',
    '(window:keydown.enter)': 'handleEnter($any($event))'
  }
})
export class CalculatorFormComponent implements OnDestroy {
  config = input<CalculatorConfig>();
  data = input<CalculatorData>();
  valid = output<boolean>();
  dataChanged = output<{ key: string; value: CalculatorData[string] }>();

  groupedFields = computed(() => {
    const cfg = this.config();
    if (!cfg) return [];

    const groups = new Map<string, CalculatorConfig['fields']>();
    if (cfg.fields.some(f => !f.group || f.group === 'default')) {
      groups.set('default', []);
    }

    cfg.fields.forEach(f => {
      const gName = f.group || 'default';
      if (!groups.has(gName)) groups.set(gName, []);
      groups.get(gName)!.push(f);
    });

    return Array.from(groups.entries()).map(([name, fields]) => ({ name, fields }));
  });

  protected formGroup = signal<FormGroup<Record<string, FormControl<ControlValue>>> | null>(null);

  private fb = inject(NonNullableFormBuilder);
  private sub = new Subscription();

  private getInitialValue(field: CalculatorConfig['fields'][number]): ControlValue {
    const external = untracked(() => this.data()?.[field.key]);
    if (field.type === 'list') return asList(external ?? field.defaultValue);
    if (field.type === 'select') {
      const first = field.options?.[0]?.value ?? '';
      return (external ?? field.defaultValue ?? first) as ControlValue;
    }
    // number fallback
    return Number(external ?? field.defaultValue ?? 0);
  }

  private buildValidators(field: CalculatorConfig['fields'][number]): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (field.required) validators.push(Validators.required);
    if (typeof field.min === 'number') validators.push(Validators.min(field.min));
    if (typeof field.max === 'number') validators.push(Validators.max(field.max));
    return validators;
  }

  constructor() {
    effect((onCleanup) => {
      const cfg = this.config();
      if (!cfg) {
        untracked(() => this.formGroup.set(null));
        return;
      }

      const controls: Record<string, FormControl<ControlValue>> = {};
      cfg.fields.forEach(field => {
        const validators = this.buildValidators(field);
        const initial = this.getInitialValue(field);

        if (field.type === 'list') {
          controls[field.key] = this.fb.control(asList(initial), { validators });
          return;
        }

        if (field.type === 'select') {
          controls[field.key] = this.fb.control(String(initial), { validators });
          return;
        }

        controls[field.key] = this.fb.control(Number(initial), { validators });
      });

      const fg = this.fb.group(controls);

      const sub = fg.valueChanges.pipe(debounceTime(50)).subscribe(vals => {
        Object.keys(vals).forEach(key => {
          this.updateData(key, vals[key] as CalculatorData[string]);
        });
        this.valid.emit(fg.valid);
      });

      this.sub.add(sub);

      onCleanup(() => {
        sub.unsubscribe();
      });

      untracked(() => {
        this.formGroup.set(fg);
        this.valid.emit(fg.valid);
      });
    });

    // Robust Sync: If the parent updates data() externally (e.g. via a Route State or Reset),
    // sync it into the formGroup without re-emitting through valueChanges event.
    effect(() => {
      const externalData = this.data();
      const fg = this.formGroup();
      if (fg && externalData) {
        untracked(() => {
          fg.patchValue(externalData, { emitEvent: false });
          this.valid.emit(fg.valid);
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getControl(key: string): FormControl<ControlValue> {
    return this.formGroup()?.get(key) as FormControl<ControlValue>;
  }

  updateData(key: string, value: CalculatorData[string]) {
    this.dataChanged.emit({ key, value });
  }

  handleEscape() {
    this.formGroup()?.reset();
  }

  handleEnter(event: Event) {
    // If not in a textarea, blur the focus to "Submit" the value
    // This gives the feeling of "Calculating" and hides mobile keyboard
    if (event.target instanceof HTMLTextAreaElement) return;
    (event.target as HTMLElement).blur();
  }
}
