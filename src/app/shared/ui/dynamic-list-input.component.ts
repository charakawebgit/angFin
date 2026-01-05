import { Component, input, ChangeDetectionStrategy, signal, forwardRef } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-dynamic-list-input',
  imports: [LucideAngularModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicListInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="space-y-3">
      <div class="flex items-center justify-between px-1" aria-live="polite">
        <label [for]="id()" class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
          {{ label() }}
        </label>
          {{ items().length }} Items
      </div>

      <div class="flex gap-2">
        <input
          #newItemInput
          type="number"
          [id]="id()"
          class="flex-grow h-11 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium shadow-sm dark:text-slate-100 placeholder:text-slate-400"
          placeholder="Add value..."
          (keyup.enter)="addItem(newItemInput)"
          (blur)="markTouched()"
          [disabled]="disabled()"
        />
        <button
          type="button"
          (click)="addItem(newItemInput)"
          class="h-11 w-11 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
          [attr.aria-label]="'Add item to ' + label()"
          [disabled]="disabled()"
        >
          <lucide-icon name="plus" class="w-5 h-5 group-active:scale-90 transition-transform" />
        </button>
      </div>

      <div class="flex flex-wrap gap-2 min-h-[44px] p-2 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/50" aria-live="polite">
        @for (item of items(); track $index) {
          <div class="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm group hover:border-blue-500 transition-all animate-in zoom-in duration-200">
            <span class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ item }}</span>
            <button
              (click)="removeItem($index)"
              class="text-slate-400 hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
              [attr.aria-label]="'Remove ' + item + ' from list'"
              [disabled]="disabled()"
            >
              <lucide-icon name="trash-2" class="w-3.5 h-3.5" />
            </button>
          </div>
        } @empty {
          <div class="w-full flex items-center justify-center py-2">
            <span class="text-[11px] font-medium text-slate-400 italic">No values added yet</span>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicListInputComponent implements ControlValueAccessor {
  id = input.required<string>();
  label = input<string>('');

  protected items = signal<(string | number)[]>([]);
  protected disabled = signal(false);

  private onChange: (value: (string | number)[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: (string | number)[] | null): void {
    this.items.set(Array.isArray(value) ? value : []);
  }

  registerOnChange(fn: (value: (string | number)[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  addItem(input: HTMLInputElement) {
    if (this.disabled()) return;

    const raw = input.value.trim();
    if (!raw.length) return;

    const parsed = Number(raw);
    const value = Number.isNaN(parsed) ? raw : parsed;
    const updated = [...this.items(), value];

    this.items.set(updated);
    this.onChange(updated);
    this.onTouched();
    input.value = '';
  }

  removeItem(index: number) {
    if (this.disabled()) return;

    const current = this.items();
    const updated = current.filter((_, i) => i !== index);
    this.items.set(updated);
    this.onChange(updated);
    this.onTouched();
  }

  markTouched() {
    this.onTouched();
  }
}
