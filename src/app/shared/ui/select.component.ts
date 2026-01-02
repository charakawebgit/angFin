import { Component, input, output } from '@angular/core';

@Component({
    selector: 'app-select',
    standalone: true,
    template: `
    <div class="space-y-1.5">
      @if (label()) {
        <label class="text-sm font-medium text-slate-700 ml-1">
          {{ label() }}
        </label>
      }
      <div class="relative">
        <select
          [value]="value()"
          (change)="onValueChange($event)"
          class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm pr-10"
        >
          @for (option of options(); track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
        <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>
    </div>
  `,
})
export class SelectComponent {
    label = input<string>('');
    value = input.required<string | number>();
    options = input.required<{ label: string; value: string | number }[]>();

    changed = output<string>();

    onValueChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        this.changed.emit(select.value);
    }
}
