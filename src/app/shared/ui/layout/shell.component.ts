import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { trigger, transition, style, animate, query } from '@angular/animations';
import { filter } from 'rxjs';
import { CalculatorService } from '../../../domains/calculators/data/calculator.service';
import { MetaService } from '../../../core/services/meta.service';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col relative overflow-hidden">
      <!-- Ambient Background Elements -->
      <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-[120px] -z-10 animate-float"></div>
      <div class="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-[120px] -z-10 animate-float" style="animation-delay: -3s"></div>

      <app-header />
      
      <main class="flex-grow py-12 px-6 sm:px-10 relative z-10" [@routeAnimations]="prepareRoute(outlet)">
        <div class="max-w-7xl mx-auto">
          <router-outlet #outlet="outlet" />
        </div>
      </main>
      
      <app-footer />
    </div>
  `,
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            opacity: 0,
            transform: 'translateY(10px) scale(0.98)'
          })
        ], { optional: true }),
        query(':enter', [
          animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
        ], { optional: true })
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {
  // ... existing injects

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  private router = inject(Router);
  private calcService = inject(CalculatorService);
  private metaService = inject(MetaService);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const navEnd = event as NavigationEnd;
      const url = navEnd.urlAfterRedirects;
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
