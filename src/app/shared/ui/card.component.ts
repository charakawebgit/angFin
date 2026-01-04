import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="glass-card shadow-sm overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 group">
      @if (title()) {
        <div class="px-7 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/5">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight font-display">
            {{ title() }}
          </h2>
          @if (subtitle()) {
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium italic opacity-80">{{ subtitle() }}</p>
          }
        </div>
      }
      <div class="p-7">
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
