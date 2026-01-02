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
            },
            {
                path: 'future-value',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/future-value.component').then(
                        (m) => m.FutureValueComponent
                    ),
            },
            {
                path: 'present-value',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/present-value.component').then(
                        (m) => m.PresentValueComponent
                    ),
            },
            {
                path: 'perpetuity',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/perpetuity.component').then(
                        (m) => m.PerpetuityComponent
                    ),
            },
            {
                path: 'ear',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/ear.component').then(
                        (m) => m.EarComponent
                    ),
            },
            {
                path: 'hpr',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/hpr.component').then(
                        (m) => m.HprComponent
                    ),
            },
            {
                path: 'cap-rate',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/cap-rate.component').then(
                        (m) => m.CapRateComponent
                    ),
            },
            {
                path: 'npv',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/npv.component').then(
                        (m) => m.NpvComponent
                    ),
            },
            {
                path: 'capm',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/capm.component').then(
                        (m) => m.CapmComponent
                    ),
            },
            {
                path: 'ddm',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/ddm.component').then(
                        (m) => m.DdmComponent
                    ),
            },
            {
                path: 'sharpe',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/sharpe.component').then(
                        (m) => m.SharpeComponent
                    ),
            },
            {
                path: 'cv',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/cv.component').then(
                        (m) => m.CvComponent
                    ),
            },
            {
                path: 'tvm',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/tvm.component').then(
                        (m) => m.TvmComponent
                    ),
            },
            {
                path: 'amortization',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/amortization.component').then(
                        (m) => m.AmortizationComponent
                    ),
            },
            {
                path: 'bond-valuation',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/bond-valuation.component').then(
                        (m) => m.BondValuationComponent
                    ),
            },
            {
                path: 'ytm',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/ytm.component').then(
                        (m) => m.YtmComponent
                    ),
            },
            {
                path: 'duration',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/duration.component').then(
                        (m) => m.DurationComponent
                    ),
            },
            {
                path: 'convexity',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/convexity.component').then(
                        (m) => m.ConvexityComponent
                    ),
            },
            {
                path: 'black-scholes',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/black-scholes.component').then(
                        (m) => m.BlackScholesComponent
                    ),
            },
            {
                path: 'geometric-mean',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/geometric-mean.component').then(
                        (m) => m.GeometricMeanComponent
                    ),
            },
            {
                path: 'mad',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/mad.component').then(
                        (m) => m.MadComponent
                    ),
            },
            {
                path: 'variance-stddev',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/variance-stddev.component').then(
                        (m) => m.VarianceStdDevComponent
                    ),
            },
            {
                path: 'skew-kurt',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/skew-kurt.component').then(
                        (m) => m.SkewKurtComponent
                    ),
            },
            {
                path: 'rbd',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/rbd.component').then(
                        (m) => m.RbdComponent
                    ),
            },
            {
                path: 'eay',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/eay.component').then(
                        (m) => m.EayComponent
                    ),
            },
            {
                path: 'wacc',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/wacc.component').then(
                        (m) => m.WaccComponent
                    ),
            },
            {
                path: 'dupont',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/dupont.component').then(
                        (m) => m.DupontComponent
                    ),
            },
            {
                path: 'financial-ratios',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/financial-ratios.component').then(
                        (m) => m.FinancialRatiosComponent
                    ),
            },
            {
                path: 'irr',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/irr.component').then(
                        (m) => m.IrrComponent
                    ),
            },
            {
                path: 'roi',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/roi.component').then(
                        (m) => m.RoiComponent
                    ),
            },
            {
                path: 'portfolio-return',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/portfolio-return.component').then(
                        (m) => m.PortfolioReturnComponent
                    ),
            },
            {
                path: 'portfolio-risk',
                loadComponent: () =>
                    import('./domains/calculators/feature-detail/portfolio-risk.component').then(
                        (m) => m.PortfolioRiskComponent
                    ),
            },
        ]
    },
    { path: '**', redirectTo: '' },
];
