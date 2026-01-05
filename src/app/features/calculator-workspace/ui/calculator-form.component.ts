import { Component, input, output, ChangeDetectionStrategy, inject, signal, OnDestroy, effect, untracked } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Subscription, asapScheduler } from 'rxjs';
import { observeOn, debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { InputComponent } from '@shared/ui/input.component';
import { DynamicListInputComponent } from '@shared/ui/dynamic-list-input.component';
import { CardComponent } from '@shared/ui/card.component';
import { CalculatorConfig, CalculatorData } from '@entities/calculator/model/types';
import { asList } from '@entities/finance/lib/casting.utils';

@Component({
  selector: 'app-calculator-form',
  imports: [
    CommonModule,
    LucideAngularModule,
    InputComponent,
    DynamicListInputComponent,
    CardComponent,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (formGroup(); as fg) {
      @let cfg = config()!;
      <app-card [title]="cfg.subtitle || 'Parameters'" subtitle="Fill in the required fields">
        <form [formGroup]="fg" class="space-y-5">
          @for (field of cfg.fields; track field.key) {
            @if (field.type === 'number') {
              <app-input
                [id]="field.key"
                [label]="field.label"
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
                [items]="asList(fg.get(field.key)?.value)"
                (changed)="updateData(field.key, $event)"
              />
            } @else if (field.type === 'select') {
              <div class="space-y-1.5 flex flex-col">
                <label [for]="field.key" class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                  {{ field.label }}
                </label>
                <select
                  [id]="field.key"
                  [formControlName]="field.key"
                  class="w-full h-12 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                >
                  @for (opt of field.options; track opt.value) {
                    <option [value]="opt.value">{{ opt.label }}</option>
                  }
                </select>
              </div>
            }
          }
        </form>
      </app-card>
    }
  `,
})
export class CalculatorFormComponent implements OnDestroy {
  config = input<CalculatorConfig>();
  data = input<CalculatorData>();
  valid = output<boolean>();
  dataChanged = output<{ key: string; value: CalculatorData[string] }>();

  protected formGroup = signal<FormGroup | null>(null);

  private fb = inject(FormBuilder);
  private sub = new Subscription();

  constructor() {
    this.sub.add(toObservable(this.config).pipe(observeOn(asapScheduler)).subscribe(cfg => {
      if (!cfg) {
        this.formGroup.set(null);
        return;
      }

      const group: Record<string, unknown> = {};
      cfg.fields.forEach(field => {
        const val = this.data()?.[field.key] ?? field.defaultValue ?? '';
        group[field.key] = [val, field.required ? [Validators.required] : []];
      });

      const fg = this.fb.group(group);

      this.sub.add(fg.valueChanges.pipe(debounceTime(50)).subscribe(vals => {
        Object.keys(vals).forEach(key => {
          this.updateData(key, vals[key] as CalculatorData[string]);
        });
        this.valid.emit(fg.valid);
      }));

      this.formGroup.set(fg);
      this.valid.emit(fg.valid);
    }));

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

  getControl(key: string): FormControl {
    return this.formGroup()?.get(key) as FormControl;
  }

  protected asList = asList;

  updateData(key: string, value: CalculatorData[string]) {
    this.dataChanged.emit({ key, value });
  }
}
