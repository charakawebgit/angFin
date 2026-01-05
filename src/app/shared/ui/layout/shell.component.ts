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
      <!-- Ambient Background Elements -->
      <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-[120px] -z-10 animate-float"></div>
      <div class="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-[120px] -z-10 animate-float" style="animation-delay: -3s"></div>

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
