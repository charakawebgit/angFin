import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/ui/layout/shell.component').then(m => m.ShellComponent),
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./domains/calculators/feature-list/calculator-list.component').then(
                        (m) => m.CalculatorListComponent
                    ),
                data: { animation: 'list' }
            },
            {
                path: 'calculator/:id',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/dynamic-calculator.component').then(
                        (m) => m.DynamicCalculatorComponent
                    ),
                data: { animation: 'detail' }
            },
            {
                path: 'about',
                loadComponent: () =>
                    import('./domains/static/about.component').then((m) => m.AboutComponent),
                data: { animation: 'about' }
            },
            {
                path: 'privacy',
                loadComponent: () =>
                    import('./domains/static/privacy.component').then((m) => m.PrivacyComponent),
                data: { animation: 'privacy' }
            },
            {
                path: 'disclaimer',
                loadComponent: () =>
                    import('./domains/static/disclaimer.component').then(
                        (m) => m.DisclaimerComponent
                    ),
                data: { animation: 'disclaimer' }
            },
        ],
    },
    { path: '**', redirectTo: '' },
];
