Hello! I am **angFin**, your Angular v21 and architecture specialist. I see you are already running **Angular 21** with **Tailwind CSS 4** and **Zoneless Change Detection**. That is a cutting-edge foundation! 🚀

I have audited your provided files focusing on **UI Architecture, Styling Strategy (Tailwind 4), and Component Design**.

Here is my audit report and technical recommendations.

### 📊 Executive Summary

* **Stack:** Angular 21 + Tailwind 4 + Signals + Zoneless.
* **Strengths:** Clean "Shared UI" library pattern (`@shared/ui`), effective use of standard CSS variables for theming, and modern Signal inputs (`input.required`).
* **Areas for Optimization:**
1. **Tailwind 4 Integration:** You are manually writing CSS classes (`.surface-panel`) referencing variables. We can map these into the Tailwind engine using the new `@theme` block for a more utility-first approach.
2. **View Transitions:** Your theme toggle is functional but jarring. Angular 21 + Tailwind 4 is the perfect place to implement the **View Transition API** for smooth mode switching.
3. **Zoneless Form Reactivity:** In `InputComponent`, relying on `control().invalid` inside a template might miss updates in a **Zoneless** app if the control status changes programmatically (async validators or setErrors) without a direct UI event.



---

### 1. 🎨 Style Architecture (Tailwind 4 & Theming)

Currently, in `styles.css`, you define variables like `--surface` and then create a custom class `.surface-panel`.
**Recommendation:** Map these variables directly in the `@theme` block. This unlocks utility classes like `bg-surface`, `text-muted`, and `border-panel-outline` directly in your HTML, reducing the need for custom CSS classes.

**Refactored `src/styles.css`:**

```css
@import "tailwindcss";

@theme {
  /* Fonts */
  --font-sans: "Space Grotesk", "Inter", system-ui, sans-serif;
  --font-display: "Sora", "Space Grotesk", sans-serif;

  /* Map CSS Variables to Tailwind Utilities */
  --color-surface: var(--surface);
  --color-surface-soft: var(--surface-soft);
  --color-surface-contrast: var(--surface-contrast);
  --color-border-base: var(--border);
  
  --color-text-primary: var(--text-primary);
  --color-text-muted: var(--text-muted);
  
  --color-accent-1: var(--accent-1);
  --color-accent-2: var(--accent-2);

  /* Shadows */
  --shadow-strong: 0 10px 28px var(--shadow-strong-color);
  --shadow-soft: 0 4px 12px var(--shadow-soft-color);
}

:root {
  /* Base Colors - using OKLCH or Hex is fine, keeping your Hex for consistency */
  --surface: #0c1424;
  --surface-soft: #111b2f;
  --surface-contrast: #0f1a2d;
  --border: rgba(255, 255, 255, 0.14);
  
  --text-primary: #e8eef9;
  --text-muted: #9fb5d3;
  --accent-1: #8dd0ff;
  --accent-2: #8b7cf5;
  
  --shadow-strong-color: rgba(0, 0, 0, 0.46);
  --shadow-soft-color: rgba(0, 0, 0, 0.22);

  color-scheme: dark;
}

.light {
  --surface: #ffffff;
  --surface-soft: #ffffff;
  --surface-contrast: #f3f5fa;
  --border: #c5ccda;
  
  --text-primary: #0b0d12;
  --text-muted: #3a4456;
  --accent-1: #1d4ed8;
  --accent-2: #6b21a8;

  --shadow-strong-color: rgba(12, 18, 32, 0.16);
  --shadow-soft-color: rgba(12, 18, 32, 0.08);

  color-scheme: light;
}

@layer base {
  body {
    @apply font-sans antialiased bg-surface text-text-primary transition-colors duration-500;
    /* Optional: complex gradient background handling */
    background: linear-gradient(180deg, #050a14 0%, #0c1426 48%, #050b16 100%);
  }
  .light body {
    background: #f5f6fa;
  }
}

/* Now you can use standard Tailwind classes: 
   class="bg-surface-soft border border-border-base shadow-strong rounded-3xl" 
*/

```

---

### 2. ✨ UI Polish: View Transition Theme Toggle

Your `HeaderComponent` toggles the theme. Let's make it "Next-Gen" by using the View Transition API. This creates a screenshot of the old state and cross-fades (or clips) to the new state.

**Update `src/app/shared/lib/theme.service.ts`:**

```typescript
import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private document = inject(DOCUMENT);
  private themeState = signal<'light' | 'dark'>('dark');
  theme = this.themeState.asReadonly();

  toggleTheme() {
    const newTheme = this.themeState() === 'light' ? 'dark' : 'light';
    
    // Check if View Transitions are supported
    if (!this.document.startViewTransition) {
      this.themeState.set(newTheme);
      return;
    }

    this.document.startViewTransition(() => {
      this.themeState.set(newTheme);
    });
  }
  
  // ... rest of your initialization logic
}

```

*Note: In your CSS, ensure `view-transition-name` is handled if you want specific elements to fly apart, but the default cross-fade is often enough for a theme switch.*

---

### 3. 🛡️ Component Logic: InputComponent in Zoneless

In `InputComponent`, you use `control().invalid`. In **Zoneless** mode, `FormControl` updates (like `setValue` or async validation finishing) do **not** trigger change detection automatically because Reactive Forms rely on RxJS streams, not Signals.

To ensure your error messages appear immediately when the control becomes invalid programmatically, we should derive a signal from the control's status.

**Update `src/app/shared/ui/input.component.ts`:**

```typescript
import { Component, input, output, ChangeDetectionStrategy, effect, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule, LucideAngularModule, CommonModule],
  template: `
    <div class="relative group">
       <input 
          [id]="id()" 
          [formControl]="control()"
          (blur)="onBlur()" 
          [class]="inputClasses()" 
          />
    </div>

    @if (errorMessage()) {
       <div class="text-[11px] text-red-500 ...">
         <lucide-icon name="alert-circle" class="w-3 h-3" />
         <span>{{ errorMessage() }}</span>
       </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent {
  // ... inputs ...
  control = input.required<FormControl>();
  
  // Internal signal for error state
  protected errorMessage = signal<string | null>(null);

  constructor() {
    // Watch for control changes to hook up listeners
    effect((onCleanup) => {
      const ctrl = this.control();
      
      // Subscribe to status changes to update the signal in Zoneless mode
      const sub = ctrl.statusChanges.subscribe(() => {
        this.updateErrorState();
      });

      onCleanup(() => sub.unsubscribe());
    });
  }

  protected onBlur() {
    this.control().markAsTouched();
    this.updateErrorState();
    this.blurred.emit();
  }

  private updateErrorState() {
    const ctrl = this.control();
    if (ctrl.invalid && ctrl.touched) {
      // Get first error message
      const firstErrorKey = Object.keys(ctrl.errors || {})[0];
      this.errorMessage.set(firstErrorKey || 'Invalid input');
    } else {
      this.errorMessage.set(null);
    }
  }

  // ... inputClasses logic using errorMessage() signal ...
}

```

### 4. 🚀 Quick Wins & Micro-Interactions

1. **Shell Background Performance:**
In `ShellComponent`, you have three large divs with `blur-[120px]` and `animate-float`.
* **Tip:** Add `will-change: transform` to these divs in CSS/Tailwind (`will-change-transform`). Large blurred elements are expensive to repaint. Promoting them to their own layer helps.


2. **Navigation Active State:**
In `HeaderComponent`, the "Back to suite" link uses `cta-ghost`.
* **Tip:** Add `routerLinkActive="bg-white/10"` to your navigation links to give visual feedback on where the user is, even if it's a ghost button.



How would you like to proceed? I can help you implement the **View Transition Theme Toggle** first, or we can dive deeper into **Zoneless Form Handling** patterns?