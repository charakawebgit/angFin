import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '@shared/ui/card.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-calculator-list',
    standalone: true,
    imports: [RouterLink, CardComponent, LucideAngularModule],
    template: `
    <div class="max-w-6xl mx-auto space-y-8">
      <div class="text-center space-y-2">
        <h1 class="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Financial Toolset
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400">
          Professional grade calculators built for scale.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (calc of calculators(); track calc.id) {
          <a [routerLink]="['/calculators', calc.id]" class="block group">
            <app-card class="h-full transition-transform group-hover:-translate-y-1">
              <div class="flex flex-col gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <lucide-icon [name]="calc.icon" class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {{ calc.name }}
                  </h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400">
                    {{ calc.description }}
                  </p>
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
    calculators = signal([
        {
            id: 'fv',
            name: 'Future Value',
            description: 'Calculate future wealth based on interest and time.',
            icon: 'trending-up',
        },
        {
            id: 'pv',
            name: 'Present Value',
            description: 'Determine the current value of future cash flows.',
            icon: 'bar-chart',
        },
    ]);
}
