import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./domains/calculators/feature-list/calculator-list.component').then(m => m.CalculatorListComponent),
    },
    {
        path: 'calculators/fv',
        loadComponent: () => import('./domains/calculators/feature-detail/future-value.component').then(m => m.FutureValueComponent),
    },
    {
        path: '**',
        redirectTo: '',
    }
];
