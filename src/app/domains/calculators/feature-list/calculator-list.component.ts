import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CardComponent } from '@shared/ui/card.component';
import { CalculatorDef } from '../data/models';

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
              31+ Pro Tools
            </div>
            <div class="px-5 py-2.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm shadow-sm">
              v21.0 Powered
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        @for (calc of calculators(); track calc.id) {
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
  calculators = signal<CalculatorDef[]>([
    { id: 'future-value', title: 'Future Value', description: 'Calculate the value of an investment at a future date based on a fixed interest rate.', icon: 'trending-up', category: 'TVM' },
    { id: 'present-value', title: 'Present Value', description: 'Determine the current value of a sum of money to be received in the future.', icon: 'hourglass', category: 'TVM' },
    { id: 'perpetuity', title: 'Perpetuity', description: 'Calculate the present value of an infinite stream of equal cash flows.', icon: 'shield-check', category: 'TVM' },
    { id: 'ear', title: 'Effective Annual Return', description: 'Find the actual annual interest rate when compounding occurs more than once a year.', icon: 'percent', category: 'Returns' },
    { id: 'hpr', title: 'Holding Period Return', description: 'Calculate the total return on an investment over the period it was held.', icon: 'calendar-check', category: 'Returns' },
    { id: 'cap-rate', title: 'Cap Rate', description: 'Estimate the expected rate of return on a real estate investment property.', icon: 'building', category: 'Real Estate' },
    { id: 'npv', title: 'Net Present Value', description: 'Evaluate the profitability of an investment by discounting its future cash flows.', icon: 'list-plus', category: 'Analysis' },
    { id: 'capm', title: 'CAPM Model', description: 'Calculate the expected return of an asset based on its risk relative to the market.', icon: 'target', category: 'Equity' },
    { id: 'ddm', title: 'Dividend Discount Model', description: 'Value a stock based on the present value of its future dividend payments.', icon: 'hand-coins', category: 'Equity' },
    { id: 'sharpe', title: 'Sharpe Ratio', description: 'Measure the risk-adjusted performance of an investment or portfolio.', icon: 'ratio', category: 'Analysis' },
    { id: 'cv', title: 'Coefficient of Variation', description: 'Assess the relative volatility of different investments.', icon: 'git-compare-arrows', category: 'Stats' },
    { id: 'tvm', title: 'TVM Solver', description: 'Comprehensive tool to solve for any variable in Time Value of Money equations.', icon: 'calculator', category: 'TVM' },
    { id: 'amortization', title: 'Amortization', description: 'Generate a complete loan repayment schedule with principal and interest breakdown.', icon: 'table', category: 'Fixed Income' },
    { id: 'bond-valuation', title: 'Bond Valuation', description: 'Calculate the fair market price of a bond based on its coupon payments and yield.', icon: 'scroll-text', category: 'Fixed Income' },
    { id: 'ytm', title: 'Yield to Maturity', description: 'Find the total expected return of a bond if held until it matures.', icon: 'activity', category: 'Fixed Income' },
    { id: 'duration', title: 'Bond Duration', description: 'Measure the sensitivity of a bond\'s price to changes in interest rates.', icon: 'gauge', category: 'Fixed Income' },
    { id: 'convexity', title: 'Bond Convexity', description: 'Refine the interest rate sensitivity estimate for larger yield movements.', icon: 'waves', category: 'Fixed Income' },
    { id: 'black-scholes', title: 'Black-Scholes', description: 'Calculate theoretical prices for European-style call and put options.', icon: 'brain-circuit', category: 'Pricing' },
    { id: 'geometric-mean', title: 'Geometric Mean', description: 'Calculate the average return of a series of values with compounding effects.', icon: 'bar-chart-4', category: 'Stats' },
    { id: 'mad', title: 'Mean Absolute Deviation', description: 'Determine the average distance between each data point and the mean.', icon: 'move-horizontal', category: 'Stats' },
    { id: 'variance-stddev', title: 'Variance & Std Dev', description: 'Analyze the dispersion and risk of a data set using standard statistical measures.', icon: 'sigma', category: 'Stats' },
    { id: 'skew-kurt', title: 'Skewness & Kurtosis', description: 'Examine the symmetry and tail behavior of a distribution.', icon: 'bar-chart-horizontal', category: 'Stats' },
    { id: 'rbd', title: 'Bank Discount Yield', description: 'Calculate the annualized return on short-term discount instruments like T-bills.', icon: 'banknote', category: 'Fixed Income' },
    { id: 'eay', title: 'Effective Annual Yield', description: 'Convert a holding period yield to an annualized return using 365 days.', icon: 'calendar-check', category: 'Fixed Income' },
    { id: 'wacc', title: 'WACC', description: 'Calculate the weighted average cost of capital for a firm\'s financing.', icon: 'scale', category: 'Corporate' },
    { id: 'dupont', title: 'Dupont Analysis', description: 'Decompose ROE into profit margin, asset turnover, and equity multiplier.', icon: 'pyramid', category: 'Corporate' },
    { id: 'financial-ratios', title: 'Financial Ratios', description: 'A comprehensive suite of ratios for liquidity, solvency, and valuation.', icon: 'clipboard-list', category: 'Corporate' },
    { id: 'irr', title: 'Internal Rate of Return', description: 'Calculate the profitability of a series of cash flows (IRR).', icon: 'zap', category: 'Analysis' },
    { id: 'roi', title: 'ROI', description: 'Simple return on investment calculation for basic profitability analysis.', icon: 'trending-up', category: 'Analysis' },
    { id: 'portfolio-return', title: 'Portfolio Return', description: 'Calculate the weighted average return of an investment portfolio.', icon: 'scale', category: 'Analysis' },
    { id: 'portfolio-risk', title: 'Portfolio Risk', description: 'Measure the total risk (volatility) of a two-asset portfolio.', icon: 'scatter-chart', category: 'Stats' },
  ]);
}
