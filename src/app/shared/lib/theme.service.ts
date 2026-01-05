import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private platformId = inject(PLATFORM_ID);
    private themeKey = 'angfin-theme-preference';

    // Primary signal for the current theme
    theme = signal<Theme>('light');

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            // Initialize from localStorage or system preference
            const saved = localStorage.getItem(this.themeKey) as Theme | null;
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            this.theme.set(saved || (prefersDark ? 'dark' : 'light'));

            // Sync theme to document body whenever it changes
            effect(() => {
                const current = this.theme();
                if (current === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                localStorage.setItem(this.themeKey, current);
            });
        }
    }

    toggleTheme() {
        this.theme.update(t => t === 'light' ? 'dark' : 'light');
    }

    isDark() {
        return this.theme() === 'dark';
    }
}
