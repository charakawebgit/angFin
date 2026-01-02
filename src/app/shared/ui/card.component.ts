import { Component, input } from '@angular/core';

@Component({
    selector: 'app-card',
    standalone: true,
    template: `
    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      @if (title()) {
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {{ title() }}
          </h2>
        </div>
      }
      <div class="p-6">
        <ng-content />
      </div>
    </div>
  `,
})
export class CardComponent {
    title = input<string>();
}
