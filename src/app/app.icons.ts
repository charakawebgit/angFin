import { importProvidersFrom } from '@angular/core';
import {
    LucideAngularModule,
    TrendingUp, BarChart, Percent, Hourglass, ListPlus, ShieldCheck,
    Banknote, CalendarCheck, BarChart4, MoveHorizontal, Baseline,
    Variable, Sigma, Ratio, GitCompareArrows, BarChartHorizontal, Mountain,
    Target, HandCoins, Scale, Zap, ScrollText, Pyramid, ClipboardList, Activity, ScatterChart,
    Table, BrainCircuit, Calculator, Gauge, Waves, Building, Plus, Trash2, ArrowLeft, ArrowUpRight, BarChart2,
    Copy, Check, Lightbulb, Search, SearchX, LayoutDashboard, ChevronDown, ChevronRight, Infinity as InfinityIcon, ArrowRight, Sun, Moon
} from 'lucide-angular';

export const provideIcons = () => importProvidersFrom(
    LucideAngularModule.pick({
        TrendingUp, BarChart, Percent, Hourglass, ListPlus, ShieldCheck,
        Banknote, CalendarCheck, BarChart4, MoveHorizontal, Baseline,
        Variable, Sigma, Ratio, GitCompareArrows, BarChartHorizontal, Mountain,
        Target, HandCoins, Scale, Zap, ScrollText, Pyramid, ClipboardList, Activity, ScatterChart,
        Table, BrainCircuit, Calculator, Gauge, Waves, Building, Plus, Trash2, ArrowLeft, ArrowUpRight, BarChart2,
        Copy, Check, Lightbulb, Search, SearchX, LayoutDashboard, ChevronDown, ChevronRight, Infinity: InfinityIcon, ArrowRight, Sun, Moon
    })
);
