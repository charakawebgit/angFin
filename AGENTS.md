
# Angular v21 Development Guidelines for angFin

You are an expert in **TypeScript**, **Angular v21**, **Feature-Sliced Design (FSD)**, and scalable financial web applications. You write functional, maintainable, performant, and accessible code following Angular v21 best practices.

## Project Architecture: Feature-Sliced Design (FSD)

This project follows **Feature-Sliced Design** architecture. All code MUST be organized into the following layers:

```
src/app/
├── entities/       # Business entities (calculator models, types, services)
├── features/       # Feature components (calculator-workspace)
├── pages/          # Page-level components (calculator, home, static)
└── shared/         # Reusable UI components and utilities
    ├── lib/        # Shared utilities and helper functions
    └── ui/         # Shared UI components
```

### FSD Layer Rules

- **entities/**: Domain models, types, services, and business logic. No UI components.
- **features/**: Isolated feature components that combine entities and shared components
- **pages/**: Route-level components that compose features
- **shared/**: Generic reusable code with no business logic

### Path Aliases

Always use TypeScript path aliases for imports:
```typescript
import { CalculatorService } from '@entities/calculator/model/calculator.service';
import { InputComponent } from '@shared/ui/input.component';
import { calculateNPV } from '@shared/lib/math/investment.utils';
import { environment } from '@env/environment';
```

## TypeScript Best Practices

- Use **strict type checking** (enabled in tsconfig.json)
- Prefer type inference when the type is obvious
- **NEVER** use `any` type; use `unknown` when type is uncertain
- Use **interfaces** for data models (see `@entities/calculator/model/types.ts`)
- Define clear parameter and return types for all functions
- Use **discriminated unions** for complex state management

## Angular v21 Core Principles

### 1. Zoneless Change Detection (MANDATORY)

This app uses **zoneless change detection**. Zone.js is disabled:

```typescript
// app.config.ts
provideZonelessChangeDetection()
```

**Rules:**
- All reactive state MUST use signals
- NEVER use Zone.js-dependent patterns
- Use `effect()` for side effects
- Use `computed()` for derived state

### 2. Standalone Components (Default)

- All components are standalone by default in Angular v21
- **NEVER** set `standalone: true` in decorators
- Import dependencies directly in the `imports` array
- No NgModules anywhere in the application

### 3. Signal-Based Reactive Programming

**ALWAYS** use signals for state management:

```typescript
// ✅ Correct
const count = signal(0);
const doubled = computed(() => count() * 2);

// ❌ Wrong
private count = 0;
get doubled() { return this.count * 2; }
```

### 4. Signal Forms (MANDATORY)

This app uses **Signal Forms** from `@angular/forms/signals`:

```typescript
import { form, required, min, max } from '@angular/forms/signals';

// Create a form with validation
const myForm = form(dataSignal, (schema) => {
  required(schema.fieldName);
  min(schema.amount, 0);
  max(schema.amount, 1000000);
});
```

**Rules:**
- NEVER use `FormGroup`, `FormControl`, or `FormBuilder`
- Use `form()` function to create forms
- Apply validators using `required()`, `min()`, `max()` functions
- Access form state through signal calls: `myForm().valid()`

## Component Guidelines

### Component Structure

```typescript
import { Component, ChangeDetectionStrategy, signal, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-my-component',
  imports: [CommonModule, OtherComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isVisible()) {
      <div>{{ data() }}</div>
    }
  `
})
export class MyComponent {
  // Inputs - use input() function
  data = input.required<string>();
  config = input<Config>();

  // Outputs - use output() function
  valueChanged = output<number>();
  
  // Local state - use signals
  private count = signal(0);
  
  // Derived state - use computed()
  doubledCount = computed(() => this.count() * 2);
  
  // Dependency injection - use inject()
  private myService = inject(MyService);
}
```

### Component Rules

- **ALWAYS** set `changeDetection: ChangeDetectionStrategy.OnPush`
- Use `input()` and `output()` functions, **NEVER** decorators
- Use `input.required<T>()` for required inputs
- Keep components small and focused (single responsibility)
- Prefer inline templates for components < 20 lines
- For external templates/styles, use relative paths from component TS file

### Host Bindings

**NEVER** use `@HostBinding` or `@HostListener` decorators. Use the `host` object:

```typescript
@Component({
  selector: 'app-card',
  host: {
    '[class.active]': 'isActive()',
    '(click)': 'handleClick()',
    '[attr.role]': '"button"'
  }
})
```

## Template Guidelines

### Native Control Flow (MANDATORY)

**ALWAYS** use native control flow. **NEVER** use structural directives:

```typescript
// ✅ Correct
@if (isVisible()) {
  <div>Content</div>
} @else {
  <div>Fallback</div>
}

@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

@switch (status()) {
  @case ('loading') { <spinner /> }
  @case ('success') { <data /> }
  @default { <error /> }
}

// ❌ Wrong - NEVER USE THESE
*ngIf="isVisible"
*ngFor="let item of items"
*ngSwitch="status"
```

### Styling in Templates

**NEVER** use `ngClass` or `ngStyle`. Use direct bindings:

```typescript
// ✅ Correct
[class.active]="isActive()"
[class]="dynamicClass()"
[style.color]="textColor()"
[style.width.px]="width()"

// ❌ Wrong
[ngClass]="{'active': isActive}"
[ngStyle]="{'color': textColor}"
```

### Template Best Practices

- Keep templates simple - move complex logic to component
- Use `async` pipe for observables (rare in signal-based app)
- **NEVER** use arrow functions in templates (not supported)
- **NEVER** assume globals like `new Date()` are available
- Use signal getters: `{{ mySignal() }}` not `{{ mySignal }}`

## State Management

### Local Component State

```typescript
export class MyComponent {
  // Writable signal for state
  private count = signal(0);
  
  // Computed for derived state
  doubled = computed(() => this.count() * 2);
  
  // Update state
  increment() {
    this.count.update(val => val + 1);
    // OR
    this.count.set(42);
  }
}
```

### State Rules

- Use `signal()` for mutable state
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from inputs
- **NEVER** use `.mutate()` - use `.update()` or `.set()` instead
- Keep transformations pure and predictable
- Use `asReadonly()` to expose signals from services

### Service State Management

```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  private _data = signal<Data[]>([]);
  
  // Expose as readonly
  data = this._data.asReadonly();
  
  updateData(newData: Data[]) {
    this._data.set(newData);
  }
}
```

## Services

### Service Structure

```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  private state = signal<State>(initialState);
  
  // Expose readonly signals
  get currentState() {
    return this.state.asReadonly();
  }
  
  // Methods for actions
  async loadData(id: string): Promise<void> {
    // async operations
  }
}
```

### Service Rules

- **ALWAYS** use `providedIn: 'root'` for singleton services
- **NEVER** use constructor injection - use `inject()` function
- Design around single responsibility
- Use signals for reactive state
- Expose state as readonly signals
- Keep business logic in entities, not features

## Routing and Lazy Loading

### Route Configuration

```typescript
export const routes: Routes = [
  {
    path: 'calculator/:id',
    loadComponent: () =>
      import('@pages/calculator/ui/calculator-page.component').then(
        (m) => m.CalculatorPageComponent
      ),
    data: { animation: 'detail' }
  }
];
```

### Routing Rules

- **ALWAYS** use lazy loading with `loadComponent()`
- Use path aliases in dynamic imports
- Use `withComponentInputBinding()` to bind route params to inputs
- Define route data for animations or metadata

## Forms (Signal Forms)

### Form Creation

```typescript
import { form, required, min, max, Field } from '@angular/forms/signals';

export class MyFormComponent {
  formData = signal<FormData>({ amount: 0, rate: 0 });
  
  myForm = form(this.formData, (schema) => {
    required(schema.amount);
    min(schema.amount, 0);
    max(schema.amount, 1000000);
    required(schema.rate);
  });
  
  // Access form state
  isValid = computed(() => this.myForm().valid());
}
```

### Form Field Template

```typescript
<input
  [id]="'amount'"
  type="number"
  [field]="myForm.amount"
  placeholder="Enter amount"
/>
```

### Form Rules

- **MANDATORY**: Use Signal Forms, not Reactive or Template-driven forms
- Use `form()` function to create forms
- Apply validators as functions: `required()`, `min()`, `max()`
- Import and use the `Field` directive for form controls
- Use `effect()` to react to form changes
- Use `untracked()` when creating forms inside effects

## Accessibility (MANDATORY)

All components **MUST** meet these requirements:

- ✅ Pass all **AXE accessibility checks**
- ✅ Follow **WCAG 2.1 AA standards**
- ✅ Proper focus management and keyboard navigation
- ✅ Sufficient color contrast (4.5:1 for text)
- ✅ ARIA attributes where needed (`role`, `aria-label`, etc.)
- ✅ Semantic HTML elements (`<button>`, `<nav>`, `<main>`)
- ✅ Form labels associated with inputs
- ✅ Alternative text for images (use `NgOptimizedImage`)

### Images

- Use `NgOptimizedImage` for all static images
- Note: `NgOptimizedImage` does NOT work with inline base64 images

## Performance Optimization

- Use `ChangeDetectionStrategy.OnPush` (enforced)
- Implement lazy loading for all routes
- Use `trackBy` in `@for` loops (use `track` syntax):
  ```typescript
  @for (item of items(); track item.id) { }
  ```
- Avoid heavy computations in templates
- Use `computed()` to memoize derived values

## Testing Guidelines

This project uses **Vitest** and **Testing Library**:

```typescript
import { render, screen } from '@testing-library/angular';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  it('should render', async () => {
    await render(MyComponent, {
      componentInputs: { data: 'test' }
    });
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
```

## Common Patterns in This App

### Calculator Config Pattern

```typescript
export interface CalculatorConfig {
  id: string;
  name: string;
  fields: FieldConfig[];
  calculate: (data: CalculatorData) => ResultItem[];
}
```

### Dynamic Form Field Pattern

```typescript
@for (field of config().fields; track field.key) {
  @if (field.type === 'number') {
    <app-input
      [id]="field.key"
      [label]="field.label"
      [field]="getField(field.key)"
      type="number"
    />
  }
}
```

### Effect with Injection Context

When creating signal forms inside effects, use `runInInjectionContext`:

```typescript
private injector = inject(Injector);

constructor() {
  effect(() => {
    const config = this.config();
    untracked(() => {
      const newForm = runInInjectionContext(this.injector, () => {
        return form(this.data, (schema) => {
          // validation
        });
      });
      this.calcForm.set(newForm);
    });
  });
}
```

## Things to NEVER Do

❌ Use `standalone: true` (it's default in v21)
❌ Use `@Input()` or `@Output()` decorators
❌ Use `@HostBinding()` or `@HostListener()` decorators
❌ Use `FormGroup`, `FormControl`, or `FormBuilder`
❌ Use `*ngIf`, `*ngFor`, `*ngSwitch`
❌ Use `ngClass` or `ngStyle`
❌ Use `any` type
❌ Use Zone.js patterns
❌ Use constructor injection
❌ Use `.mutate()` on signals
❌ Put business logic in page components

## Code Style

- Use **Prettier** for formatting (configured in project)
- Use **ESLint** for linting (Angular ESLint v21 configured)
- Use **functional programming** patterns where appropriate
- Prefer **composition** over inheritance
- Write **pure functions** for calculations (see `@shared/lib/math/`)

## File Naming Conventions

- Components: `*.component.ts`
- Services: `*.service.ts`
- Types/Interfaces: `types.ts` or `*.model.ts`
- Utils: `*.utils.ts`
- Tests: `*.spec.ts`
- Config: `*.config.ts`

## Summary

This is a **zoneless**, **signal-based**, **standalone** Angular v21 application using **Feature-Sliced Design** and **Signal Forms**. Always prioritize:

1. Signal-based reactivity
2. FSD architecture layers
3. Signal Forms (not Reactive Forms)
4. Native control flow
5. Zoneless patterns
6. Accessibility
7. Type safety
