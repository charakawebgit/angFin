import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, LucideAngularModule],
  template: `
    <footer class="mt-auto px-6 pb-10 pt-14">
      <div class="max-w-7xl mx-auto surface-panel p-8 rounded-3xl relative overflow-hidden">
        <div class="absolute inset-0 opacity-30 pointer-events-none" style="background: var(--glow-accent);"></div>
        <div class="relative flex flex-col md:flex-row gap-10 items-start justify-between text-[color:var(--text-primary)]">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg">
              <lucide-icon name="sparkle" class="w-5 h-5" />
            </div>
            <div>
              <p class="text-sm text-[color:var(--text-muted)]">Precision analytics for modern finance</p>
              <p class="text-xl font-black tracking-tight">angFin Platform</p>
            </div>
          </div>

          <div class="flex gap-6 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
            <a routerLink="/about" class="hover:text-[color:var(--text-primary)] transition">About</a>
            <a routerLink="/privacy" class="hover:text-[color:var(--text-primary)] transition">Privacy</a>
            <a routerLink="/disclaimer" class="hover:text-[color:var(--text-primary)] transition">Legal</a>
          </div>

          <div class="flex flex-col items-start md:items-end gap-2 text-xs text-[color:var(--text-muted)]">
            <div class="badge-soft">
              <span>v21</span>
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Zoneless</span>
            </div>
            <span class="font-semibold tracking-[0.24em] text-[color:var(--text-primary)]">© {{ year }} angFin</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  year = new Date().getFullYear();
}
