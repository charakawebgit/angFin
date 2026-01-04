import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, LucideAngularModule],
  template: `
    <footer class="glass border-t border-slate-200/60 dark:border-white/5 py-16 px-6 relative overflow-hidden">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div class="flex flex-col items-center md:items-start gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
              <lucide-icon name="trending-up" class="text-white w-5 h-5" />
            </div>
            <span class="text-xl font-black tracking-tighter dark:text-white font-display">angFin <span class="text-blue-600">Pro</span></span>
          </div>
          <p class="text-xs font-medium text-slate-400 dark:text-slate-500 max-w-[200px] text-center md:text-left leading-relaxed">
            Enterprise-grade financial intelligence and precision calculus suite.
          </p>
        </div>

        <div class="flex gap-10">
          <a routerLink="/about" class="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">About</a>
          <a routerLink="/privacy" class="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Privacy</a>
          <a routerLink="/disclaimer" class="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Legal</a>
        </div>

        <div class="flex flex-col items-center md:items-end gap-2">
           <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700">
            © {{ year }} GASTRO-ENDO EXCHANGE
          </p>
          <div class="flex items-center gap-2">
            <div class="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-600 uppercase">Live v21.0</div>
            <div class="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[8px] font-black text-blue-600 uppercase">Zoneless</div>
          </div>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  year = new Date().getFullYear();
}
