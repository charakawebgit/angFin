import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FinancialService } from '@core/math/financial.service';
import { CardComponent } from '@shared/ui/card.component';
import { SelectComponent } from '@shared/ui/select.component';
import { TVMVar } from '@domains/calculators/data/models';

@Component({
  selector: 'app-tvm',
  standalone: true,
  imports: [
    LucideAngularModule,
    CardComponent,
    SelectComponent,
    CurrencyPipe,
    DecimalPipe,
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 pb-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card title="Solve For">
          <div class="flex flex-wrap gap-2">
            @for (v of variables; track v) {
              <button
                (click)="solveFor.set(v)"
                [class]="solveFor() === v ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                class="px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
              >
                {{ v }}
              </button>
            }
          </div>
          <div class="mt-6">
            <app-select
              id="compounding-select"
              label="Compounding"
              [value]="compounding()"
              [options]="compoundingOptions"
              (changed)="compounding.set($event)"
            />
          </div>
        </app-card>

        <app-card title="Result">
          <div class="flex flex-col items-center justify-center h-full py-8 text-center">
            @if (result() !== null) {
              <div class="space-y-1">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Computed {{ solveFor() }}</p>
                <div class="text-5xl font-black text-blue-600">
                  @if (isCurrency(solveFor())) {
                    {{ result() | currency }}
                  } @else if (solveFor() === 'IY') {
                    {{ result() | number: '1.2-4' }}%
                  } @else {
                    {{ result() | number: '1.2-2' }}
                  }
                </div>
              </div>
            } @else {
              <div class="text-slate-400 space-y-2">
                <lucide-icon name="calculator" class="w-12 h-12 mx-auto opacity-20" />
                <p>Fill missing variables to solve</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <app-card title="Variables">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          @for (v of variables; track v) {
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-slate-700 ml-1" [for]="'tvm-' + v">{{ getLabel(v) }}</label>
              <div class="relative group">
                @if (isCurrency(v)) {
                   <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                }
                <input
                  [id]="'tvm-' + v"
                  type="number"
                  [value]="getValue(v)"
                  (input)="updateValue(v, $event)"
                  [disabled]="solveFor() === v"
                  class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm disabled:bg-slate-50 disabled:text-blue-600 disabled:font-bold"
                  [class.pl-7]="isCurrency(v)"
                  [class.pr-7]="v === 'IY'"
                  placeholder="0"
                />
                @if (v === 'IY') {
                   <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                }
              </div>
            </div>
          }
        </div>
        <div class="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 text-slate-500 text-xs">
           <lucide-icon name="zap" class="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
           <p>Note: Cash outflows (e.g., payments, investments) should be <strong>negative</strong>. Inflows should be <strong>positive</strong>.</p>
        </div>
      </app-card>
    </div>
  `,
})
export class TvmComponent {
  private financialService = inject(FinancialService);

  solveFor = signal<TVMVar>('FV');
  compounding = signal<string>('12');

  n = signal<string>('60');
  iy = signal<string>('5');
  pv = signal<string>('-100000');
  pmt = signal<string>('-500');
  fv = signal<string>('0');

  variables: TVMVar[] = ['N', 'IY', 'PV', 'PMT', 'FV'];

  compoundingOptions = [
    { label: 'Annual', value: '1' },
    { label: 'Semi-Annual', value: '2' },
    { label: 'Quarterly', value: '4' },
    { label: 'Monthly', value: '12' },
    { label: 'Weekly', value: '52' },
    { label: 'Daily', value: '365' },
  ];

  getLabel(v: TVMVar) {
    const labels: Record<TVMVar, string> = {
      N: 'Number of Periods (N)',
      IY: 'Interest Rate / Year (I/Y)',
      PV: 'Present Value (PV)',
      PMT: 'Payment (PMT)',
      FV: 'Future Value (FV)',
    };
    return labels[v];
  }

  isCurrency(v: TVMVar) {
    return ['PV', 'PMT', 'FV'].includes(v);
  }

  getValue(v: TVMVar) {
    const sMap: Record<TVMVar, WritableSignal<string>> = {
      N: this.n,
      IY: this.iy,
      PV: this.pv,
      PMT: this.pmt,
      FV: this.fv,
    };
    return sMap[v]();
  }

  updateValue(v: TVMVar, event: Event) {
    const input = event.target as HTMLInputElement;
    const sMap: Record<TVMVar, WritableSignal<string>> = {
      N: this.n,
      IY: this.iy,
      PV: this.pv,
      PMT: this.pmt,
      FV: this.fv,
    };
    sMap[v].set(input.value);
  }

  result = computed(() => {
    try {
      const params = {
        solveFor: this.solveFor(),
        n: this.solveFor() === 'N' ? undefined : parseFloat(this.n()),
        iy: this.solveFor() === 'IY' ? undefined : parseFloat(this.iy()),
        pv: this.solveFor() === 'PV' ? undefined : parseFloat(this.pv()),
        pmt: this.solveFor() === 'PMT' ? undefined : parseFloat(this.pmt()),
        fv: this.solveFor() === 'FV' ? undefined : parseFloat(this.fv()),
        cpy: parseInt(this.compounding()),
      };

      return this.financialService.solveTvm(params);
    } catch {
      return null;
    }
  });
}
