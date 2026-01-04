import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Field, FieldTree } from '@angular/forms/signals';
import { LucideAngularModule } from 'lucide-angular';

interface FieldStateShape {
  invalid: () => boolean;
  touched: () => boolean;
  errors: () => { message?: string; kind: string }[];
}

@Component({
  selector: 'app-input',
  imports: [FormsModule, Field, LucideAngularModule],
  template: `
    <div class="flex flex-col gap-1.5">
      @if (label()) {
        <label [for]="id()" class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
          {{ label() }}
        </label>
      }
      <div class="relative group">
        @if (prefix()) {
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors pointer-events-none font-medium">
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
          <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors pointer-events-none font-medium">
            {{ suffix() }}
          </span>
        }
      </div>
      @if (state.invalid() && state.touched()) {
        <div class="text-[11px] text-red-500 font-bold mt-1 px-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
          <lucide-icon name="alert-circle" class="w-3 h-3" />
          @for (error of state.errors(); track $index) {
            <span>{{ error.message || error.kind }}</span>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent {
  id = input.required<string>();
  label = input<string>();
  placeholder = input<string>('');
  type = input<'text' | 'number'>('text');
  prefix = input<string>();
  suffix = input<string>();

  // Accept the FieldTree (which is a function returning state)
  field = input.required<FieldTree<string | number, string | number>>();

  focused = output<void>();
  blurred = output<void>();

  // Helper to access field state in template without 'any'
  protected get state(): FieldStateShape {
    return (this.field() as () => FieldStateShape)();
  }

  protected inputClasses() {
    const fieldState = this.state;
    let classes = 'w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium shadow-sm dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600';
    if (this.prefix()) classes += ' pl-9';
    if (this.suffix()) classes += ' pr-9';
    if (fieldState.invalid() && fieldState.touched()) {
      classes += ' border-red-500 focus:ring-red-500/10 focus:border-red-500';
    }
    return classes;
  }
}
