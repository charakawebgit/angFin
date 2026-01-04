import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [RouterLink, LucideAngularModule],
  template: `
    <header class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a routerLink="/" class="group flex items-center gap-3 active:scale-95 transition-all">
          <div class="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform duration-500">
           <lucide-icon name="trending-up" class="text-white w-6 h-6" />
          </div>
          <div class="flex flex-col -space-y-1">
            <span class="text-xl font-black tracking-tighter dark:text-white uppercase transition-colors group-hover:text-blue-600">angFin</span>
            <span class="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest">Pro Finance</span>
          </div>
        </a>

        <div class="flex items-center gap-6">
          @if (!isRoot()) {
            <a routerLink="/" class="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors bg-slate-50 dark:bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800/50">
              <lucide-icon name="layout-dashboard" class="w-4 h-4" />
              Dashboard
            </a>
          }
        </div>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private router = inject(Router);

  isRoot(): boolean {
    return this.router.url === '/' || this.router.url === '';
  }
}
