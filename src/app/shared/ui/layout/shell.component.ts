import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';

@Component({
    selector: 'app-shell',
    standalone: true,
    imports: [RouterOutlet, HeaderComponent, FooterComponent],
    template: `
    <app-header />
    
    <main class="min-h-[calc(100vh-10rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-6 sm:px-10">
      <router-outlet />
    </main>
    
    <app-footer />
  `,
})
export class ShellComponent { }
