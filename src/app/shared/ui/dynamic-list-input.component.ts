import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-list-input',
  imports: [LucideAngularModule, FormsModule],
  template: `
    <div class="space-y-3">
      <div class="flex items-center justify-between px-1">
        <label [for]="id()" class="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {{ label() }}
        </label>
        <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-md">
          {{ items()?.length || 0 }} Items
        </span>
      </div>

      <div class="flex gap-2">
        <input
          #newItemInput
          type="number"
          [id]="id()"
          class="flex-grow h-11 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium shadow-sm dark:text-slate-100 placeholder:text-slate-400"
          placeholder="Add value..."
          (keyup.enter)="addItem(newItemInput)"
        />
        <button
          type="button"
          (click)="addItem(newItemInput)"
          class="h-11 w-11 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 group"
        >
          <lucide-icon name="plus" class="w-5 h-5 group-active:scale-90 transition-transform" />
        </button>
      </div>

      <div class="flex flex-wrap gap-2 min-h-[44px] p-2 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/50">
        @for (item of items(); track $index) {
          <div class="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm group hover:border-blue-500 transition-all animate-in zoom-in duration-200">
            <span class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ item }}</span>
            <button
              (click)="removeItem($index)"
              class="text-slate-400 hover:text-red-500 transition-colors"
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
export class DynamicListInputComponent {
  id = input.required<string>();
  label = input<string>('');
  items = input.required<(string | number)[]>();

  changed = output<(string | number)[]>();

  addItem(input: HTMLInputElement) {
    const val = input.value.trim();
    if (val) {
      const current = this.items() || [];
      this.changed.emit([...current, Number(val)]);
      input.value = '';
    }
  }

  removeItem(index: number) {
    const current = this.items() || [];
    this.changed.emit(current.filter((_, i) => i !== index));
  }
}
