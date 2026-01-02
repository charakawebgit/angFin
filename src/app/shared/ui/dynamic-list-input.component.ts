import { Component, input, output, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-dynamic-list-input',
    standalone: true,
    imports: [LucideAngularModule],
    template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <label class="text-sm font-medium text-slate-700">{{ label() }}</label>
        <button
          type="button"
          (click)="addItem()"
          class="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 active:scale-95 transition-all"
        >
          <lucide-icon name="plus" class="w-3 h-3" />
          Add Item
        </button>
      </div>

      <div class="space-y-3">
        @for (item of items(); track $index) {
          <div class="flex gap-2 items-center">
            <div class="relative flex-1 group">
              @if (prefix()) {
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">
                  {{ prefix() }}
                </span>
              }
              <input
                type="number"
                [value]="item"
                (input)="updateItem($index, $event)"
                [placeholder]="placeholderPrefix() + ' ' + ($index + 1)"
                class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                [class.pl-7]="prefix()"
                [class.pr-7]="suffix()"
              />
              @if (suffix()) {
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">
                  {{ suffix() }}
                </span>
              }
            </div>
            
            <button
              type="button"
              (click)="removeItem($index)"
              class="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
              [disabled]="items().length <= minItems()"
              [class.opacity-0]="items().length <= minItems()"
              [class.pointer-events-none]="items().length <= minItems()"
            >
              <lucide-icon name="trash-2" class="w-4 h-4" />
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
export class DynamicListInputComponent {
    label = input<string>('Items');
    items = input.required<number[] | string[]>();
    prefix = input<string>('');
    suffix = input<string>('');
    placeholderPrefix = input<string>('Item');
    minItems = input<number>(1);

    changed = output<any[]>();

    addItem() {
        const current = [...this.items()];
        (current as any).push('');
        this.changed.emit(current);
    }

    removeItem(index: number) {
        if (this.items().length <= this.minItems()) return;
        const current = [...this.items()];
        current.splice(index, 1);
        this.changed.emit(current);
    }

    updateItem(index: number, event: Event) {
        const inputEl = event.target as HTMLInputElement;
        const current = [...this.items()];
        (current as any)[index] = inputEl.value;
        this.changed.emit(current);
    }
}
