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
        <label [for]="id()" class="text-xs font-semibold uppercase tracking-[0.18em] ml-1 text-[color:var(--text-muted)]">
          {{ label() }}
        </label>
          {{ items().length }} Items
      </div>

      <div class="flex gap-2">
        <input
          #newItemInput
          type="number"
          [id]="id()"
          class="flex-grow h-11 px-4 rounded-2xl bg-[color:var(--surface-soft)] border border-[color:var(--panel-outline)] text-[color:var(--text-primary)] placeholder:[color:var(--text-muted)] outline-none focus:ring-2 focus:ring-[color:var(--accent-1)] focus:border-[color:var(--accent-1)] transition-all text-sm font-medium shadow-sm"
          placeholder="Add value..."
          (keyup.enter)="addItem(newItemInput)"
          (blur)="markTouched()"
          [disabled]="disabled()"
        />
        <button
          type="button"
          (click)="addItem(newItemInput)"
          class="h-11 w-11 flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 text-white hover:scale-105 transition-all shadow-lg shadow-cyan-500/30 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
          [attr.aria-label]="'Add item to ' + label()"
          [disabled]="disabled()"
        >
          <lucide-icon name="plus" class="w-5 h-5 group-active:scale-90 transition-transform" />
        </button>
      </div>

      <div class="flex flex-wrap gap-2 min-h-[44px] p-2 rounded-2xl border border-dashed border-[color:var(--panel-outline)] bg-[color:var(--surface-soft)]" aria-live="polite">
        @for (item of items(); track $index) {
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[color:var(--surface-contrast)] border border-[color:var(--panel-outline)] shadow-sm group hover:border-[color:var(--accent-1)] transition-all animate-in zoom-in duration-200">
            <span class="text-sm font-bold text-[color:var(--text-primary)]">{{ item }}</span>
            <button
              (click)="removeItem($index)"
              class="text-[color:var(--text-muted)] hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
              [attr.aria-label]="'Remove ' + item + ' from list'"
              [disabled]="disabled()"
            >
              <lucide-icon name="trash-2" class="w-3.5 h-3.5" />
            </button>
          </div>
        } @empty {
          <div class="w-full flex items-center justify-center py-2">
            <span class="text-[11px] font-medium text-[color:var(--text-muted)] italic">No values added yet</span>
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

  private onChange: (value: (string | number)[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

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
