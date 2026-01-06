import { Component, computed, inject, signal, OnInit, ChangeDetectionStrategy, ElementRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CalculatorService } from '@entities/calculator/model/calculator.service';
import { MetaService } from '@shared/lib/meta.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-calculator-list',
  imports: [LucideAngularModule, RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:keydown)': 'handleKeydown($event)'
  },
  template: `
    <div class="min-h-screen bg-white">
      <!-- Hero Section -->
      <section class="border-b border-slate-200 bg-white pt-20 pb-16 px-6 lg:px-8">
        <div class="max-w-7xl mx-auto space-y-10">
          <div class="max-w-3xl space-y-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
               <lucide-icon name="terminal" class="w-3.5 h-3.5" />
               <span>Financial Terminal</span>
            </div>
            
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Capital strategy tools <br class="hidden lg:block"/> for modern finance.
            </h1>
            
            <p class="text-xl text-slate-500 max-w-2xl leading-relaxed">
              Professional-grade valuation models, risk analyzers, and cashflow engines. 
              Zero latency. Local execution.
            </p>
          </div>

          <!-- Search Bar -->
          <div class="relative max-w-2xl group">
             <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <lucide-icon name="search" class="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
             </div>
             <input
                #searchInput
                type="text"
                [formControl]="searchControl"
                placeholder="Search calculators (e.g. 'WACC', 'Amortization')..."
                class="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
             />
             <div class="absolute inset-y-0 right-4 flex items-center">
                <span class="text-xs font-bold text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-md hidden md:block">⌘ K</span>
             </div>
          </div>

          <!-- Categories -->
          <div class="flex flex-wrap gap-2 pt-2">
             <button
               (click)="selectedCategory.set('All')"
               class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 border"
               [class]="selectedCategory() === 'All' 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'"
             >
               All Tools
             </button>
             @for (cat of categories(); track cat) {
               <button
                 (click)="selectedCategory.set(cat)"
                 class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 border"
                 [class]="selectedCategory() === cat 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'"
               >
                 {{ cat }}
               </button>
             }
          </div>
        </div>
      </section>

      <!-- Directory Grid -->
      <section class="max-w-7xl mx-auto px-6 lg:px-8 py-12">
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @if (isLoading()) {
              @for (i of [1,2,3,4,5,6]; track $index) {
                <div class="h-48 rounded-xl bg-slate-50 border border-slate-100 animate-pulse"></div>
              }
            } @else {
              @for (calc of filteredCalculators(); track calc.id) {
                <a [routerLink]="['/calculator', calc.id]" 
                   class="group flex flex-col p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden"
                >
                   <div class="flex items-start justify-between mb-4">
                      <div class="p-3 rounded-lg bg-slate-50 text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 ring-1 ring-slate-100 group-hover:ring-blue-600">
                         <lucide-icon [name]="calc.icon" class="w-6 h-6" />
                      </div>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">
                        {{ calc.category }}
                      </span>
                   </div>

                   <h3 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                     {{ calc.title }}
                   </h3>
                   <p class="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
                     {{ calc.description }}
                   </p>

                   <div class="mt-auto flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                      Open Tool <lucide-icon name="arrow-right" class="w-4 h-4 ml-1" />
                   </div>
                </a>
              } @empty {
                <div class="col-span-full py-20 text-center">
                   <div class="inline-flex p-4 rounded-full bg-slate-50 mb-4">
                     <lucide-icon name="search-x" class="w-8 h-8 text-slate-400" />
                   </div>
                   <h3 class="text-lg font-semibold text-slate-900">No tools found</h3>
                   <p class="text-slate-500 mt-1">We couldn't find anything for "{{ searchQuery() }}"</p>
                   <button (click)="clearSearch()" class="mt-6 text-blue-600 font-bold hover:underline">Clear Search</button>
                </div>
              }
            }
         </div>
         
         <div class="mt-20 pt-8 border-t border-slate-100 text-center text-sm text-slate-400">
            <p>© 2026 AngFin Professional Suite. Local Execution Environment.</p>
         </div>
      </section>
    </div>
  `,
})
export class CalculatorListComponent implements OnInit {
  private calcService = inject(CalculatorService);
  private metaService = inject(MetaService);

  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  calculators = this.calcService.calculatorsList;
  selectedCategory = signal<string>('All');

  searchControl = new FormControl('');

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
    setTimeout(() => this.isLoading.set(false), 800);
  }

  handleKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.searchInput()?.nativeElement.focus();
    }
    if (event.key === '/' && document.activeElement !== this.searchInput()?.nativeElement) {
      event.preventDefault();
      this.searchInput()?.nativeElement.focus();
    }
    if (event.key === 'Escape') {
      this.searchInput()?.nativeElement.blur();
    }
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.selectedCategory.set('All');
  }

  isFeatured(calc: import('@entities/calculator/model/types').CalculatorDef): boolean {
    return ['tvm-solver', 'dcf-analysis', 'black-scholes'].includes(calc.id);
  }
}
