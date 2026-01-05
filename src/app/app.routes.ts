import { Routes } from '@angular/router';
import { CalculatorResolver } from '@entities/calculator/lib/calculator.resolver';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/ui/layout/shell.component').then(m => m.ShellComponent),
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./pages/home/ui/calculator-list.component').then(
                        (m) => m.CalculatorListComponent
                    ),
                data: { animation: 'list' }
            },
            {
                path: 'calculator/:id',
                loadComponent: () =>
                    import('./pages/calculator/ui/calculator-page.component').then(
                        (m) => m.DynamicCalculatorComponent
                    ),
                resolve: { _unused: CalculatorResolver },
                data: { animation: 'detail' }
            },
            {
                path: 'about',
                title: 'About',
                loadComponent: () =>
                    import('./pages/static/ui/about.component').then((m) => m.AboutComponent),
                data: { animation: 'about' }
            },
            {
                path: 'privacy',
                title: 'Privacy Policy',
                loadComponent: () =>
                    import('./pages/static/ui/privacy.component').then((m) => m.PrivacyComponent),
                data: { animation: 'privacy' }
            },
            {
                path: 'disclaimer',
                title: 'Disclaimer',
                loadComponent: () =>
                    import('./pages/static/ui/disclaimer.component').then(
                        (m) => m.DisclaimerComponent
                    ),
                data: { animation: 'disclaimer' }
            },
        ],
    },
    { path: '**', redirectTo: '' },
];
