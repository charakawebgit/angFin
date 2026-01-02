import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, LucideAngularModule],
    template: `
    <header class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <lucide-icon name="trending-up" class="w-6 h-6" />
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">angFin</span>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Pro Finance toolkit</span>
          </div>
        </div>

        @if (!isRoot()) {
          <a routerLink="/" class="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all group px-4 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-100 dark:hover:border-blue-800/50">
            <lucide-icon name="arrow-left" class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Dashboard
          </a>
        }
      </div>
    </header>
  `,
})
export class HeaderComponent {
    private router = inject(Router);

    isRoot(): boolean {
        return this.router.url === '/' || this.router.url === '';
    }
}
