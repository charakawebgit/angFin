import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-800">
      @if (title()) {
        <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-950/30">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {{ title() }}
          </h2>
          @if (subtitle()) {
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{{ subtitle() }}</p>
          }
        </div>
      }
      <div class="p-6">
        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  title = input<string>();
  subtitle = input<string>();
}
