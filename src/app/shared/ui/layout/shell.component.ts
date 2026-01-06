import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';
import { ThemeService } from '@shared/lib/theme.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0 mix-blend-screen opacity-70">
        <div class="absolute -left-24 -top-24 w-[520px] h-[520px] rounded-full blur-[120px] bg-gradient-to-br from-[color:var(--accent-1)]/20 via-blue-600/20 to-[color:var(--accent-2)]/20 animate-float"></div>
        <div class="absolute right-[-120px] top-10 w-[640px] h-[640px] rounded-full blur-[140px] bg-gradient-to-br from-indigo-500/20 via-blue-600/10 to-[color:var(--accent-1)]/10 animate-float" style="animation-delay: -2s"></div>
        <div class="absolute left-1/3 bottom-[-240px] w-[720px] h-[720px] rounded-full blur-[160px] bg-gradient-to-br from-[color:var(--accent-2)]/10 via-[color:var(--accent-1)]/5 to-blue-500/10"></div>
      </div>

      <app-header />

      <main class="flex-grow py-12 px-6 sm:px-10 relative z-10">
        <div class="max-w-7xl mx-auto animate-route-transition">
          <router-outlet />
        </div>
      </main>

      <app-footer />
    </div>
  `,
})
export class ShellComponent {
  // Inject to initialize and run the theme effect
  private themeService = inject(ThemeService);
}
