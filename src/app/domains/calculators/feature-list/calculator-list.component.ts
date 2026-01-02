import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CardComponent } from '@shared/ui/card.component';
import { CalculatorService } from '../data/calculator.service';

@Component({
  selector: 'app-calculator-list',
  standalone: true,
  imports: [LucideAngularModule, RouterLink, CardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-16 animate-in fade-in duration-1000">
      <!-- Hero Section -->
      <div class="relative mb-20">
        <div class="absolute -top-24 -left-20 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>
        <div class="absolute -bottom-24 -right-20 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>
        
        <div class="relative">
          <h1 class="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
            Professional <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Financial Intelligence</span><br/>
            at Your Fingertips.
          </h1>
          <p class="text-slate-500 dark:text-slate-400 max-w-2xl text-lg md:text-xl leading-relaxed font-medium">
            Master complex calculations with our suite of precision tools. From TVM to Portfolio Risk, angFin Pro provides the accuracy you need for informed decisions.
          </p>
          
          <div class="mt-10 flex flex-wrap gap-4">
            <div class="px-5 py-2.5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 text-sm hover:bg-blue-700 transition-all cursor-default">
              {{ calculators().length }}+ Pro Tools
            </div>
            <div class="px-5 py-2.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm shadow-sm">
              v21.0 Powered
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Filter -->
      <div class="mb-12 flex flex-wrap gap-2">
        <button
          (click)="selectedCategory.set('All')"
          [class]="selectedCategory() === 'All' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500'"
          class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
        >
          All Tools
        </button>
        @for (cat of categories(); track cat) {
          <button
            (click)="selectedCategory.set(cat)"
            [class]="selectedCategory() === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500'"
            class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
          >
            {{ cat }}
          </button>
        }
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        @for (calc of filteredCalculators(); track calc.id) {
          <a
            [routerLink]="['/' + calc.id]"
            class="group block h-full focus:outline-none"
          >
            <app-card
              class="h-full block transition-all duration-500"
            >
              <div class="flex flex-col h-full relative z-10">
                <div class="flex items-start justify-between mb-6">
                  <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/40 group-hover:scale-110 group-hover:-rotate-6">
                    <lucide-icon [name]="calc.icon" class="w-6 h-6" />
                  </div>
                  <span class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] bg-slate-50/50 dark:bg-slate-950/50 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800/50">
                    {{ calc.category }}
                  </span>
                </div>
                
                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {{ calc.title }}
                </h3>
                
                <p class="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mb-8 flex-grow font-medium">
                  {{ calc.description }}
                </p>

                <div class="flex items-center text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                  Open Tool
                  <lucide-icon name="arrow-right" class="w-3.5 h-3.5 ml-2" />
                </div>
              </div>
            </app-card>
          </a>
        }
      </div>
    </div>
  `,
})
export class CalculatorListComponent {
  private calcService = inject(CalculatorService);
  calculators = this.calcService.calculatorsList;

  selectedCategory = signal<string>('All');

  categories = computed(() => {
    const cats = new Set(this.calculators().map((c) => c.category));
    return Array.from(cats).sort();
  });

  filteredCalculators = computed(() => {
    const selected = this.selectedCategory();
    if (selected === 'All') return this.calculators();
    return this.calculators().filter((c) => c.category === selected);
  });
}
