import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800/60 py-12 px-6">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex flex-col items-center md:items-start gap-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span class="text-white font-black text-xs italic">aF</span>
            </div>
            <span class="text-lg font-black tracking-tight dark:text-white">angFin <span class="text-blue-600">Pro</span></span>
          </div>
          <p class="text-xs font-medium text-slate-400 dark:text-slate-500">Precision financial calculus for professionals.</p>
        </div>

        <div class="flex gap-8">
          <a routerLink="/about" class="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">About</a>
          <a routerLink="/privacy" class="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Privacy</a>
          <a routerLink="/disclaimer" class="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">Disclaimer</a>
        </div>

        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-700">
          © {{ year }} Gastro-Endo Exchange
        </p>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  year = new Date().getFullYear();
}
