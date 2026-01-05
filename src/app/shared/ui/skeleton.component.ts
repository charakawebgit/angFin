import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-skeleton',
    template: `
    <div 
      [style.width]="width()" 
      [style.height]="height()" 
      [style.border-radius]="borderRadius()"
      class="bg-slate-200/50 dark:bg-slate-800/30 overflow-hidden relative"
    >
      <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-shimmer"></div>
    </div>
  `,
    styles: [`
    .animate-shimmer {
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonComponent {
    width = input<string>('100%');
    height = input<string>('20px');
    borderRadius = input<string>('0.5rem');
}
