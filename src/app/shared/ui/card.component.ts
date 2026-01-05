import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="surface-panel overflow-hidden group">
      @if (title()) {
        <div class="px-7 py-6 border-b border-white/5 flex items-start justify-between gap-3">
          <div>
            <h2 class="text-xl font-bold text-white tracking-tight font-display">
              {{ title() }}
            </h2>
            @if (subtitle()) {
              <p class="text-xs text-slate-400 mt-1 font-medium">{{ subtitle() }}</p>
            }
          </div>
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400/30 via-indigo-500/30 to-fuchsia-400/30 border border-white/10 shadow-inner"></div>
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
