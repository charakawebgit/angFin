import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Field } from '@angular/forms/signals';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule, Field],
  template: `
    <div class="flex flex-col gap-1.5">
      @if (label()) {
        <label [for]="id()" class="text-sm font-medium text-slate-700 dark:text-slate-300">
          {{ label() }}
        </label>
      }
      <div class="relative group">
        @if (prefix()) {
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
            {{ prefix() }}
          </span>
        }
        <input
          [id]="id()"
          [type]="type()"
          [placeholder]="placeholder()"
          [field]="field()"
          (focus)="focused.emit()"
          (blur)="blurred.emit()"
          [class]="inputClasses()"
        />
        @if (suffix()) {
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
            {{ suffix() }}
          </span>
        }
      </div>
      @if (state().invalid() && state().touched()) {
        <div class="text-xs text-red-500 font-medium mt-1">
          @for (error of state().errors(); track $index) {
            <span>{{ error.message || error.kind }}</span>
          }
        </div>
      }
    </div>
  `,
})
export class InputComponent {
  id = input.required<string>();
  label = input<string>();
  placeholder = input<string>('');
  type = input<'text' | 'number'>('text');
  prefix = input<string>();
  suffix = input<string>();

  // Accept the FieldTree
  field = input.required<any>();

  focused = output<void>();
  blurred = output<void>();

  // Helper to access field state in template
  protected get state() {
    return (this.field() as any)();
  }

  protected inputClasses() {
    const fieldState = this.state;
    let classes = 'w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all';
    if (this.prefix()) classes += ' pl-8';
    if (this.suffix()) classes += ' pr-8';
    if (fieldState.invalid() && fieldState.touched()) {
      classes += ' border-red-500 focus:ring-red-500/20 focus:border-red-500';
    }
    return classes;
  }
}
