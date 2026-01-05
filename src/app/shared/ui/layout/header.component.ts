import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CalculatorService } from '@entities/calculator/model/calculator.service';
import { ThemeService } from '@shared/lib/theme.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [RouterLink, LucideAngularModule],
  template: `
    <header class="sticky top-0 z-50 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6 surface-panel">
        <div class="flex items-center gap-6">
          <a routerLink="/" class="group flex items-center gap-3">
            <div class="relative">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/50 via-indigo-500/50 to-fuchsia-400/50 blur-md opacity-75 group-hover:opacity-100 transition"></div>
              <div class="relative w-12 h-12 rounded-2xl flex items-center justify-center border border-[color:var(--panel-outline)] shadow-lg bg-[color:var(--surface-contrast)] text-[color:var(--text-primary)]">
                <lucide-icon name="atom" class="w-6 h-6" />
              </div>
            </div>
            <div class="flex flex-col leading-tight">
              <span class="text-lg font-black uppercase tracking-[0.12em] text-[color:var(--text-primary)]">angFin</span>
              <span class="text-[11px] font-semibold text-[color:var(--text-muted)]">Next-gen finance lab</span>
            </div>
          </a>

          @if (!isRoot() && config()) {
            <div class="hidden md:flex items-center gap-3 px-4 py-2 rounded-full border border-[color:var(--panel-outline)] bg-[color:var(--surface-soft)] text-[color:var(--text-primary)]">
              <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">{{ config()?.category }}</span>
              <lucide-icon name="chevron-right" class="w-3.5 h-3.5 text-[color:var(--text-muted)]" />
              <span class="text-sm font-bold">{{ config()?.title }}</span>
            </div>
          }
        </div>

        <div class="flex items-center gap-3">
          @if (!isRoot()) {
            <a routerLink="/" class="cta-ghost">
              <lucide-icon name="layout-dashboard" class="w-4 h-4" />
              <span class="relative z-10 text-xs tracking-[0.2em] uppercase">Back to suite</span>
            </a>
          }

          <button
            (click)="themeService.toggleTheme()"
            class="w-12 h-12 flex items-center justify-center rounded-2xl border border-[color:var(--panel-outline)] bg-[color:var(--surface-soft)] text-[color:var(--text-primary)] hover:border-[color:var(--accent-1)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-1)]"
            [title]="themeService.theme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <lucide-icon [name]="themeService.theme() === 'dark' ? 'sun' : 'moon'" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private router = inject(Router);
  private calcService = inject(CalculatorService);
  themeService = inject(ThemeService);

  config = this.calcService.activeConfig;

  // Signal-based URL tracking for robust UI state
  private url = toSignal<string>(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects),
      startWith(this.router.url)
    )
  );

  isRoot = computed(() => {
    const currentUrl = this.url();
    return currentUrl === '/' || currentUrl === '' || currentUrl?.startsWith('/?');
  });
}
