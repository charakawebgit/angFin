import { Component, computed, inject, signal, OnInit, ChangeDetectionStrategy, ElementRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CardComponent } from '@shared/ui/card.component';
import { SkeletonComponent } from '@shared/ui/skeleton.component';
import { CalculatorService } from '@entities/calculator/model/calculator.service';
import { MetaService } from '@shared/lib/meta.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-calculator-list',
  imports: [LucideAngularModule, RouterLink, ReactiveFormsModule, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // host binding for keyboard shortcuts
  host: {
    '(window:keydown)': 'handleKeydown($event)'
  },
  template: `
    <div class="space-y-16 pb-20 overflow-hidden">
      <!-- Hero Section -->
      <section class="relative py-20 px-6 overflow-hidden rounded-[3rem] glass border-0 bg-white/40 dark:bg-slate-900/40">
        <!-- Ambient Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
        <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -z-10 animate-float"></div>
        <div class="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 animate-float stagger-2"></div>

        <div class="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-slate-200/50 dark:border-slate-700/50 text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest animate-in fade-in zoom-in duration-700 shadow-sm">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Professional Intelligence Suite
            <span class="mx-1 text-slate-300 dark:text-slate-600">|</span>
            <span class="text-blue-600 dark:text-blue-400">v21.0</span>
          </div>
          
          <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
            Precision <br class="hidden md:block">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 font-display">Calculus</span>
          </h1>
          
          <p class="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed text-balance">
            Enterprise-grade financial tools for TVM, Valuation, and Statistical Analysis.
          </p>

          <!-- Search & Filter Bar -->
          <div class="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto pt-10 animate-in slide-in-from-bottom-5 duration-1000">
            <div class="relative flex-grow group z-20">
              <lucide-icon name="search" class="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                #searchInput
                type="text" 
                [formControl]="searchControl"
                placeholder="Search 30+ tools..." 
                class="w-full h-16 pl-14 pr-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg font-medium shadow-2xl shadow-blue-900/5 dark:text-white placeholder:text-slate-400"
              />
              <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                 <kbd class="hidden md:inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2.5 font-sans text-[11px] font-bold text-slate-500 dark:text-slate-400 transition-opacity group-focus-within:opacity-0">
                   ⌘ K
                 </kbd>
              </div>
            </div>
            
            <div class="flex flex-wrap items-center justify-center gap-2">
              <button 
                (click)="selectedCategory.set('All')" 
                [class]="selectedCategory() === 'All' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl' : 'bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50'"
                class="px-6 h-16 rounded-3xl text-sm font-bold transition-all active:scale-95 backdrop-blur-md"
              >
                All
              </button>
              @for (cat of categories(); track cat) {
                <button 
                  (click)="selectedCategory.set(cat)"
                  [class]="selectedCategory() === cat ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl' : 'bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50'"
                  class="px-6 h-16 rounded-3xl text-sm font-bold transition-all active:scale-95 whitespace-nowrap backdrop-blur-md"
                >
                  {{ cat }}
                </button>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
        @if (isLoading()) {
          @for (i of [1,2,3,4,5,6,7,8]; track $index) {
            <div [class]="'glass-card p-6 rounded-[2rem] space-y-4 animate-card-entry stagger-' + ($index + 1) + ' ' + ($index === 0 ? 'md:col-span-2 md:row-span-2' : '')">
              <app-skeleton height="48px" width="48px" borderRadius="1rem" />
              <app-skeleton height="24px" width="60%" />
              <div class="pt-4 flex gap-2">
                <app-skeleton height="32px" width="80px" borderRadius="2rem" />
              </div>
            </div>
          }
        } @else {
          @for (calc of filteredCalculators(); track calc.id) {
          <a [routerLink]="['/calculator', calc.id]" 
             [class]="'group block relative overflow-hidden rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] animate-card-entry stagger-' + (($index % 9) + 1) + ' ' + (isFeatured(calc) ? 'md:col-span-2' : '')">
            
            <div class="absolute inset-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors duration-500"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div class="relative h-full p-8 flex flex-col z-10">
              <div class="flex items-start justify-between mb-6">
                <div class="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 font-display shadow-sm">
                  <lucide-icon [name]="calc.icon" class="w-7 h-7" />
                </div>
                
                <div class="flex items-center gap-2">
                     <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1">
                        {{ calc.category }}
                     </span>
                     @if (isFeatured(calc)) {
                         <span class="flex h-2 w-2 relative">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                     }
                </div>
              </div>
              
              <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-display">
                {{ calc.title }}
              </h3>
              
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-2 mb-6">
                {{ calc.description }}
              </p>

              <div class="mt-auto flex items-center text-xs font-bold text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-widest translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                Launch Tool
                <lucide-icon name="arrow-right" class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </a>
        } @empty {
          <div class="col-span-full py-24 text-center animate-in fade-in duration-500 glass rounded-[3rem]">
            <div class="w-24 h-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-slate-800">
              <lucide-icon name="search-x" class="w-10 h-10 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-display">No tools found</h3>
            <p class="text-slate-500 dark:text-slate-400">We couldn't find any calculators matching "{{ searchQuery() }}"</p>
            <button (click)="clearSearch()" class="mt-8 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform">
              Clear Filters
            </button>
          </div>
        }
      }
    </div>
    </div>
  `,
})
export class CalculatorListComponent implements OnInit {
  private calcService = inject(CalculatorService);
  private metaService = inject(MetaService);

  // ViewChild for focus management
  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  calculators = this.calcService.calculatorsList;
  selectedCategory = signal<string>('All');

  // Reactive Form Control for Search
  searchControl = new FormControl('');

  // Convert stream to signal with debounce
  searchQuery = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  isLoading = signal<boolean>(true);

  categories = computed(() => {
    const cats = new Set(this.calculators().map((c) => c.category));
    return Array.from(cats).sort();
  });

  filteredCalculators = computed(() => {
    const selected = this.selectedCategory();
    const query = (this.searchQuery() || '').toLowerCase().trim();

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
    this.metaService.updateTitle('Dashboard - Professional Suite');
    // Simulate premium loading feel
    setTimeout(() => this.isLoading.set(false), 800);
  }

  handleKeydown(event: KeyboardEvent) {
    // CMD/CTRL + K to focus search
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.searchInput()?.nativeElement.focus();
    }
    // Forward slash to focus search (if not already typing)
    if (event.key === '/' && document.activeElement !== this.searchInput()?.nativeElement) {
      event.preventDefault();
      this.searchInput()?.nativeElement.focus();
    }
    // ESC to blur
    if (event.key === 'Escape') {
      this.searchInput()?.nativeElement.blur();
    }
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.selectedCategory.set('All');
  }

  isFeatured(calc: import('@entities/calculator/model/types').CalculatorDef): boolean {
    // Feature key calculators or random logic for visual variance in grid
    return ['tvm-solver', 'dcf-analysis', 'black-scholes'].includes(calc.id);
  }
}
