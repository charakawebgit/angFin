import { ApplicationConfig, provideZonelessChangeDetection, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import {
  LucideAngularModule,
  TrendingUp, BarChart, Percent, Hourglass, ListPlus, ShieldCheck,
  Banknote, CalendarCheck, BarChart4, MoveHorizontal, Baseline,
  Variable, Sigma, Ratio, GitCompareArrows, BarChartHorizontal, Mountain,
  Target, HandCoins, Scale, Zap, ScrollText, Pyramid, ClipboardList, Activity, ScatterChart,
  Table, BrainCircuit, Calculator, Gauge, Waves, Building, Plus, Trash2, ArrowLeft, ArrowUpRight, BarChart2,
  Copy, Check, Lightbulb, Search, SearchX, LayoutDashboard, ChevronDown, ArrowRight
} from 'lucide-angular';

import { TitleStrategy } from '@angular/router';
import { AppTitleStrategy } from '@shared/lib/title-strategy';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    importProvidersFrom(
      LucideAngularModule.pick({
        TrendingUp, BarChart, Percent, Hourglass, ListPlus, ShieldCheck,
        Banknote, CalendarCheck, BarChart4, MoveHorizontal, Baseline,
        Variable, Sigma, Ratio, GitCompareArrows, BarChartHorizontal, Mountain,
        Target, HandCoins, Scale, Zap, ScrollText, Pyramid, ClipboardList, Activity, ScatterChart,
        Table, BrainCircuit, Calculator, Gauge, Waves, Building, Plus, Trash2, ArrowLeft, ArrowUpRight, BarChart2,
        Copy, Check, Lightbulb, Search, SearchX, LayoutDashboard, ChevronDown, ArrowRight
      })
    ),
  ],
};
