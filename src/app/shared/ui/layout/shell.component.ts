import { Component, inject, effect } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';
import { filter } from 'rxjs';
import { CalculatorService } from '../../../domains/calculators/data/calculator.service';
import { MetaService } from '../../../core/services/meta.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header />
    
    <main class="min-h-[calc(100vh-10rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-6 sm:px-10">
      <div class="max-w-7xl mx-auto">
        <router-outlet />
      </div>
    </main>
    
    <app-footer />
  `,
})
export class ShellComponent {
  private router = inject(Router);
  private calcService = inject(CalculatorService);
  private metaService = inject(MetaService);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      const id = url.split('/')[1];

      if (id) {
        const calc = this.calcService.getById(id);
        if (calc) {
          this.metaService.updateTitle(calc.title);
          this.metaService.updateMeta(calc.description);
        }
      } else {
        this.metaService.updateTitle('Dashboard');
        this.metaService.updateMeta('Professional financial intelligence toolkit.');
      }
    });
  }
}
