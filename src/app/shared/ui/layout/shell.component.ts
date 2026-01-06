import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';
import { ThemeService } from '@shared/lib/theme.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col relative overflow-hidden bg-[color:var(--surface-soft)] text-[color:var(--text-primary)]">
      
      <!-- Content -->
      <app-header />
      
      <main class="flex-grow py-12 px-6 sm:px-10 relative z-10">
        <div class="max-w-7xl mx-auto animate-in fade-in duration-700">
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
