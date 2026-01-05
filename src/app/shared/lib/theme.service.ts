import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private platformId = inject(PLATFORM_ID);
    private themeKey = 'angfin-theme-preference';
    private themeState = signal<Theme>('dark');

    // Expose readonly theme signal for UI consumption
    theme = this.themeState.asReadonly();

    constructor() {
        if (!isPlatformBrowser(this.platformId)) return;

        // Initialize from localStorage or system preference
        const saved = localStorage.getItem(this.themeKey) as Theme | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        this.themeState.set(saved || (prefersDark ? 'dark' : 'light'));

        // Sync theme class and preference
        effect(() => {
            const current = this.themeState();
            const root = document.documentElement;

            if (current === 'light') {
                root.classList.add('light');
            } else {
                root.classList.remove('light');
            }

            localStorage.setItem(this.themeKey, current);
        });
    }

    toggleTheme() {
        this.themeState.update(t => (t === 'light' ? 'dark' : 'light'));
    }

    isDark() {
        return this.themeState() === 'dark';
    }
}
