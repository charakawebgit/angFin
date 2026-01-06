import { Component, computed, inject, signal, OnInit, ChangeDetectionStrategy, ElementRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { SkeletonComponent } from '@shared/ui/skeleton.component';
import { CalculatorService } from '@entities/calculator/model/calculator.service';
import { MetaService } from '@shared/lib/meta.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-calculator-list',
  imports: [LucideAngularModule, RouterLink, ReactiveFormsModule, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:keydown)': 'handleKeydown($event)'
  },
  template: `
    <div class="space-y-14 pb-16">
      <section class="relative overflow-hidden surface-panel px-8 py-16">
        <div class="absolute inset-0 pointer-events-none" style="background: var(--glow-accent);"></div>
        <div class="relative flex flex-col gap-10">
          <div class="flex flex-col gap-4">
            <span class="nav-chip w-fit">Financial Intelligence - Zoneless</span>
            <div class="flex flex-wrap items-center gap-4">
              <h1 class="text-5xl md:text-6xl font-black leading-[1.05]">
                Reimagined tools for <span class="text-transparent bg-clip-text" style="background: var(--glow-primary);">capital strategy</span>
              </h1>
              <div class="badge-soft animate-pulse-glow">
                <lucide-icon name="activity" class="w-4 h-4" />
                Live Analytics
              </div>
            </div>
            <p class="text-lg md:text-xl text-[color:var(--text-muted)] max-w-3xl">
              Curated calculators for valuation, risk, and cashflow modeling with a refreshed interface built for focus and speed.
            </p>
          </div>

          <div class="flex flex-col lg:flex-row gap-4 items-start">
            <div class="relative flex-grow w-full group">
              <lucide-icon name="search" class="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[color:var(--text-muted)]" />
              <input
                #searchInput
                type="text"
                [formControl]="searchControl"
                placeholder="Find a calculator by name, domain, or category"
                class="input-premium"
              />
              <div class="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] text-xs font-semibold uppercase tracking-[0.22em] hidden md:inline-flex">
                ⌘ K
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
               <button
                 (click)="selectedCategory.set('All')"
                 [class]="selectedCategory() === 'All' ? 'bg-[color:var(--accent-1)] text-[color:var(--surface)] shadow-lg' : 'cta-ghost text-[color:var(--text-muted)]'"
                 class="px-5 h-12 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition"
               >
                 All
               </button>
              @for (cat of categories(); track cat) {
                <button
                  (click)="selectedCategory.set(cat)"
                  [class]="selectedCategory() === cat ? 'bg-[color:var(--accent-1)] text-[color:var(--surface)] shadow-lg' : 'cta-ghost text-[color:var(--text-muted)]'"
                  class="px-5 h-12 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition"
                >
                  {{ cat }}
                </button>
              }
            </div>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[minmax(200px,auto)]">
        @if (isLoading()) {
          @for (i of [1,2,3,4,5,6,7,8]; track $index) {
            <div class="surface-panel p-6 rounded-3xl animate-pulse space-y-4">
              <app-skeleton height="48px" width="48px" borderRadius="1rem" />
              <app-skeleton height="22px" width="70%" />
              <app-skeleton height="16px" width="90%" />
            </div>
          }
        } @else {
          @for (calc of filteredCalculators(); track calc.id) {
            <a [routerLink]="['/calculator', calc.id]" class="surface-panel p-6 rounded-3xl flex flex-col gap-4 group hover:translate-y-[-4px] transition duration-300">
              <div class="flex items-start justify-between">
                <div class="w-12 h-12 rounded-2xl bg-[image:var(--glow-primary)] border border-[color:var(--panel-outline)] flex items-center justify-center text-[color:var(--surface)] shadow-lg group-hover:scale-105 transition">
                  <lucide-icon [name]="calc.icon" class="w-6 h-6" />
                </div>
                <div class="badge-soft">{{ calc.category }}</div>
              </div>

              <div class="space-y-2">
                <h3 class="text-xl font-black tracking-tight">{{ calc.title }}</h3>
                <p class="text-sm text-[color:var(--text-muted)] leading-relaxed line-clamp-3">{{ calc.description }}</p>
              </div>

              <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--accent-1)] group-hover:text-[color:var(--text-primary)] transition">
                Launch
                <lucide-icon name="arrow-up-right" class="w-4 h-4" />
              </div>
            </a>
          } @empty {
            <div class="col-span-full surface-panel rounded-3xl p-12 text-center">
              <lucide-icon name="search-x" class="w-10 h-10 text-[color:var(--text-muted)] mx-auto mb-4" />
              <h3 class="text-2xl font-black mb-2">No tools found</h3>
              <p class="text-[color:var(--text-muted)]">Nothing matches "{{ searchQuery() }}". Try another phrase.</p>
              <button (click)="clearSearch()" class="mt-6 px-6 py-3 rounded-2xl bg-[color:var(--surface-soft)] text-[color:var(--text-primary)] font-bold uppercase tracking-[0.2em] border border-[color:var(--panel-outline)]">Reset</button>
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
