import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CalculatorService } from '@entities/calculator/model/calculator.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, LucideAngularModule],
  template: `
    <header class="glass sticky top-0 z-50 border-b border-slate-200/50 dark:border-white/5 transition-all duration-500">
      <div class="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <a routerLink="/" class="group flex items-center gap-4 active:scale-95 transition-all outline-none">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
             <lucide-icon name="trending-up" class="text-white w-6 h-6" />
            </div>
            <div class="flex flex-col -space-y-1.5">
              <span class="text-2xl font-black tracking-tighter dark:text-white uppercase transition-colors group-hover:text-blue-600 font-display">angFin</span>
              <span class="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.25em]">Professional Suite</span>
            </div>
          </a>

          <!-- Breadcrumbs -->
          @if (!isRoot() && config()) {
            <div class="hidden md:flex items-center gap-3 animate-breadcrumb duration-700">
              <div class="h-8 w-px bg-slate-200 dark:bg-white/10 mx-2"></div>
              <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                <span>{{ config()?.category }}</span>
                <lucide-icon name="chevron-right" class="w-3 h-3 opacity-50" />
                <span class="text-slate-900 dark:text-white">{{ config()?.title }}</span>
              </div>
            </div>
          }
        </div>

        <div class="flex items-center gap-8">
          @if (!isRoot()) {
            <a routerLink="/" class="shimmer-button group flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all bg-white/50 dark:bg-slate-900/50 px-5 py-3 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-blue-500/10">
              <lucide-icon name="layout-dashboard" class="w-4 h-4 group-hover:rotate-12 transition-transform" />
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
  private calcService = inject(CalculatorService);

  config = this.calcService.activeConfig;

  isRoot(): boolean {
    return this.router.url === '/' || this.router.url === '';
  }
}
