import { Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dynamic-list-input',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between px-1">
        <label [for]="id() + '-0'" class="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {{ label() }}
        </label>
        <button
          type="button"
          (click)="addItem()"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 active:scale-95 transition-all bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800/50"
        >
          <lucide-icon name="plus" class="w-3.5 h-3.5" />
          Add Item
        </button>
      </div>

      <div class="space-y-3">
        @for (item of items(); track $index) {
          <div class="flex gap-2 items-center group/row">
            <div class="relative flex-1 group">
              @if (prefix()) {
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm font-medium select-none transition-colors group-focus-within:text-blue-500">
                  {{ prefix() }}
                </span>
              }
              <input
                [id]="id() + '-' + $index"
                type="number"
                [value]="item"
                (input)="updateItem($index, $event)"
                [placeholder]="placeholderPrefix() + ' ' + ($index + 1)"
                [attr.aria-label]="placeholderPrefix() + ' ' + ($index + 1)"
                class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium shadow-sm"
                [class.pl-8]="prefix()"
                [class.pr-8]="suffix()"
              />
              @if (suffix()) {
                <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm font-medium select-none transition-colors group-focus-within:text-blue-500">
                  {{ suffix() }}
                </span>
              }
            </div>
            
            <button
              type="button"
              (click)="removeItem($index)"
              class="p-3 text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all active:scale-90 opacity-0 group-hover/row:opacity-100 focus:opacity-100"
              [disabled]="items().length <= minItems()"
              [title]="'Remove ' + placeholderPrefix() + ' ' + ($index + 1)"
            >
              <lucide-icon name="trash-2" class="w-4.5 h-4.5" />
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
export class DynamicListInputComponent {
  id = input.required<string>();
  label = input<string>('Items');
  items = input.required<(number | string)[]>();
  prefix = input<string>('');
  suffix = input<string>('');
  placeholderPrefix = input<string>('Item');
  minItems = input<number>(1);

  changed = output<(number | string)[]>();

  addItem() {
    const current: (number | string)[] = [...this.items()];
    current.push('');
    this.changed.emit(current);
  }

  removeItem(index: number) {
    if (this.items().length <= this.minItems()) return;
    const current: (number | string)[] = [...this.items()];
    current.splice(index, 1);
    this.changed.emit(current);
  }

  updateItem(index: number, event: Event) {
    const inputEl = event.target as HTMLInputElement;
    const current: (number | string)[] = [...this.items()];
    current[index] = inputEl.value;
    this.changed.emit(current);
  }
}
