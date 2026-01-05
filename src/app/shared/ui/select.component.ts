import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-select',
  imports: [LucideAngularModule],
  template: `
    <div class="space-y-1.5 flex flex-col">
      @if (label()) {
        <label
          [for]="id()"
          class="text-xs font-semibold uppercase tracking-[0.18em] ml-1 text-[color:var(--text-muted)]"
        >
          {{ label() }}
        </label>
      }
      <div class="relative group">
        <select
          [id]="id()"
          [value]="value()"
          (change)="onValueChange($event)"
          class="w-full rounded-xl px-4 py-3 appearance-none focus:outline-none transition-all text-sm pr-10 font-medium shadow-sm"
          [class]="[
            'bg-[color:var(--surface-soft)] text-[color:var(--text-primary)]',
            'border border-[color:var(--panel-outline)]',
            'focus:ring-4 focus:ring-[color:var(--accent-1)]/15 focus:border-[color:var(--accent-1)]'
          ].join(' ')"
        >
          @for (option of options(); track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
        <div
          class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
          [class]="'text-[color:var(--text-muted)] group-focus-within:text-[color:var(--accent-1)]'"
        >
          <lucide-icon name="chevron-down" class="w-4 h-4" />
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent {
  id = input.required<string>();
  label = input<string>('');
  value = input.required<string | number>();
  options = input.required<{ label: string; value: string | number }[]>();

  changed = output<string>();

  onValueChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.changed.emit(select.value);
  }
}
