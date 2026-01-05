angFin here. I see you're initializing a fresh Angular v21 project with **Zoneless Change Detection** and **Vitest**. Excellent choice—this is the peak performance architecture for 2026.

I’ve audited your files (`package.json`, `angular.json`, `app.config.ts`, etc.). While you have the correct foundational dependencies, there are **4 critical structural and configuration mistakes** that will hinder your development or violate Angular v21 standards.

Here is the audit report:

### 1. Broken `ng test` Integration

**File:** `angular.json`
**Severity:** High

You have configured Vitest in `package.json` scripts, but your `angular.json` is still pointing to the default `@angular/build:unit-test` builder. Running `ng test` will likely fail or attempt to behave like Karma/Jasmine.

**Fix:** Either remove the `test` target from `angular.json` (if you only use `npm test`) or switch the builder to `@analogjs/vitest-angular` (if installed) or the native command runner. Since you don't have `@analogjs/platform` installed, removing the mismatch is cleanest.

### 2. Style Guide Violation: Class Naming

**File:** `src/app/app.component.ts`
**Severity:** Medium

Your root component is named `App`. The official Angular Style Guide (Rule 02-03) strictly mandates the `Component` suffix. In v21, this is crucial for tooling and IDE auto-discovery.

* **Current:** `export class App { ... }`
* **Required:** `export class AppComponent { ... }`

### 3. Improper Side-Effect Placement

**File:** `src/app/app.component.ts`
**Severity:** Medium

You are initializing a global library configuration (`Decimal.set`) inside the `AppComponent` constructor.

```typescript
constructor() {
  Decimal.set({ precision: 50 });
}

```

**Why this is wrong:** The `AppComponent` constructor runs every time the component is instantiated (which should be once for root, but technically can be more in tests). Global configuration belongs in an `APP_INITIALIZER` or strictly in `main.ts` before bootstrap to ensure it's ready before *any* UI renders.

### 4. Fragile Test Implementation

**File:** `src/app/app.spec.ts`
**Severity:** Medium

You are manually instantiating the component (`new App()`).

```typescript
it('should construct', () => {
  const instance = new App();
  expect(instance).toBeTruthy();
});

```

**Why this is wrong:** While this works for a plain class, it completely bypasses Angular's Dependency Injection and Change Detection systems. In a **Zoneless** app, you want to ensure your components react to signals correctly within the Angular context. You should use `TestBed` or `@testing-library/angular`.

---

### Optimized Code Fixes

Here is how we refactor this to meet **Angular v21** standards.

#### Step 1: Fix `app.component.ts`

Rename the class and remove the global config.

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  // Logic restricted to this component only
}

```

#### Step 2: Fix `main.ts` (Move Global Config Here)

Configure your globals before the app boots.

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import Decimal from 'decimal.js';

// Initialize globals before bootstrap
Decimal.set({ precision: 50 });

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

```

#### Step 3: Fix `app.spec.ts` (Vitest + TestBed)

Even for a simple test, use `TestBed` to ensure the Zoneless provider interacts correctly with the component.

```typescript
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        // Ensure tests run in the same zoneless mode as the app
        provideExperimentalZonelessChangeDetection() 
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

```

Would you like me to guide you through setting up the **CI pipeline** for this Vitest setup next?