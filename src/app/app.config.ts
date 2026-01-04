import { ApplicationConfig, provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  LucideAngularModule,
  TrendingUp, BarChart, Percent, Hourglass, ListPlus, ShieldCheck,
  Banknote, CalendarCheck, BarChart4, MoveHorizontal, Baseline,
  Variable, Sigma, Ratio, GitCompareArrows, BarChartHorizontal, Mountain,
  Target, HandCoins, Scale, Zap, ScrollText, Pyramid, ClipboardList, Activity, ScatterChart,
  Table, BrainCircuit, Calculator, Gauge, Waves, Building, Plus, Trash2, ArrowLeft, ArrowUpRight, BarChart2,
  Copy, Check, Lightbulb, Search, SearchX, LayoutDashboard, ChevronDown, ArrowRight
} from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
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
