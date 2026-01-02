import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [LucideAngularModule],
    template: `
    <footer class="bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800/60 py-12 px-6">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
              <lucide-icon name="trending-up" class="w-4 h-4" />
            </div>
            <span class="font-black text-lg text-slate-900 dark:text-white">angFin</span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs font-medium">
            Premium financial calculators and analysis tools built with Angular v21 and Signal Forms.
          </p>
        </div>

        <div class="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <a href="#" class="hover:text-blue-600 transition-colors">Privacy</a>
          <a href="#" class="hover:text-blue-600 transition-colors">Terms</a>
          <a href="#" class="hover:text-blue-600 transition-colors">Contact</a>
        </div>

        <p class="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
          © 2026 angFin Pro. All rights reserved.
        </p>
      </div>
    </footer>
  `,
})
export class FooterComponent { }
