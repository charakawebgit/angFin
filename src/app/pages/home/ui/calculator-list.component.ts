import { Component, computed, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '@shared/ui/card.component';
import { SkeletonComponent } from '@shared/ui/skeleton.component';
import { CalculatorService } from '@entities/calculator/model/calculator.service';
import { MetaService } from '@shared/lib/meta.service';

@Component({
  selector: 'app-calculator-list',
  imports: [LucideAngularModule, RouterLink, CardComponent, FormsModule, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-16 pb-20 overflow-hidden">
      <!-- Hero Section -->
      <section class="relative py-20 px-6 overflow-hidden rounded-[3rem] glass">
        <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>
        <div class="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] -z-10"></div>

        <div class="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest animate-in fade-in zoom-in duration-700">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Professional Intelligence Suite
          </div>
          
          <h1 class="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Precision <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 font-display">Calculus</span> <br class="hidden md:block"> for Finance
          </h1>
          
          <p class="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Over 30+ enterprise-grade tools for TVM, Fixed Income, Equity Valuations, and Advanced Statistics.
          </p>

          <!-- Search & Filter Bar -->
          <div class="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto pt-8 animate-in slide-in-from-bottom-5 duration-1000">
            <div class="relative flex-grow group">
              <lucide-icon name="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                [(ngModel)]="searchQuery"
                placeholder="Search tools (e.g. NPV, IRR, Black Scholes...)" 
                class="w-full h-14 pl-12 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium shadow-xl shadow-blue-500/5 dark:text-white"
              />
            </div>
            
            <div class="flex flex-wrap items-center justify-center gap-2">
              <button 
                (click)="selectedCategory.set('All')" 
                [class]="selectedCategory() === 'All' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'"
                class="px-5 h-14 rounded-2xl text-xs font-bold transition-all active:scale-95"
              >
                All
              </button>
              @for (cat of categories(); track cat) {
                <button 
                  (click)="selectedCategory.set(cat)"
                  [class]="selectedCategory() === cat ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'"
                  class="px-5 h-14 rounded-2xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap"
                >
                  {{ cat }}
                </button>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- Calculations Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        @if (isLoading()) {
          @for (i of [1,2,3,4,5,6]; track $index) {
            <div class="glass-card p-8 rounded-[2rem] space-y-4 animate-card-entry" [class]="'stagger-' + ($index + 1)">
              <app-skeleton height="48px" width="48px" borderRadius="1rem" />
              <app-skeleton height="24px" width="60%" />
              <app-skeleton height="16px" width="90%" />
              <div class="pt-4 flex gap-2">
                <app-skeleton height="32px" width="80px" borderRadius="2rem" />
              </div>
            </div>
          }
        } @else {
          @for (calc of filteredCalculators(); track calc.id) {
          <a [routerLink]="['/calculator', calc.id]" 
             class="group block h-full animate-card-entry" 
             [class]="'stagger-' + (($index % 9) + 1)">
            <app-card class="h-full transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)]">
              <div class="p-4 flex flex-col h-full">
                <div class="flex items-start justify-between mb-8">
                  <div class="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform duration-500 font-display">
                    <lucide-icon [name]="calc.icon" class="w-7 h-7" />
                  </div>
                  <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] bg-slate-50/50 dark:bg-slate-950/50 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800/50">
                    {{ calc.category }}
                  </span>
                </div>
                
                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-display">
                  {{ calc.title }}
                </h3>
                
                <p class="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mb-8 flex-grow font-medium">
                  {{ calc.description }}
                </p>

                <div class="flex items-center text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                  Execute Tool
                  <lucide-icon name="arrow-right" class="w-3.5 h-3.5 ml-2" />
                </div>
              </div>
            </app-card>
          </a>
        } @empty {
          <div class="col-span-full py-20 text-center animate-in fade-in duration-500">
            <div class="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <lucide-icon name="search-x" class="w-10 h-10 text-slate-300 dark:text-slate-700" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">No matching tools found</h3>
            <p class="text-slate-500 dark:text-slate-400">Try adjusting your search or category filters.</p>
          </div>
        }
      }
    </div>
  `,
})
export class CalculatorListComponent implements OnInit {
  private calcService = inject(CalculatorService);
  private metaService = inject(MetaService);

  calculators = this.calcService.calculatorsList;
  selectedCategory = signal<string>('All');
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(true);

  categories = computed(() => {
    const cats = new Set(this.calculators().map((c) => c.category));
    return Array.from(cats).sort();
  });

  filteredCalculators = computed(() => {
    const selected = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();

    let list = this.calculators();
    if (selected !== 'All') {
      list = list.filter((c) => c.category === selected);
    }

    if (query) {
      list = list.filter(c =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query)
      );
    }

    return list;
  });

  ngOnInit() {
    this.metaService.updateTitle('Dashboard');
    this.metaService.updateMeta('Professional financial intelligence toolkit for calculations in TVM, Stats, Fixed Income, and Equity.');

    // Simulate premium loading feel
    setTimeout(() => this.isLoading.set(false), 800);
  }
}
