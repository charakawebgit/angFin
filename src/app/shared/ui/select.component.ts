import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-select',
  template: `
    <div class="space-y-1.5 flex flex-col">
      @if (label()) {
        <label [for]="id()" class="text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
          {{ label() }}
        </label>
      }
      <div class="relative group">
        <select
          [id]="id()"
          [value]="value()"
          (change)="onValueChange($event)"
          class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 appearance-none focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm pr-10 font-medium shadow-sm"
        >
          @for (option of options(); track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
        <div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
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
