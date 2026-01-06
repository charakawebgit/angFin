import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule, LucideAngularModule, CommonModule],
  template: `
    <div class="flex flex-col gap-1.5">
        <div class="flex items-center gap-2 mb-1">
          <label
            [for]="id()"
            class="text-sm font-medium ml-1 text-[color:var(--text-primary)]"
          >
            {{ label() }}
          </label>
          @if (description()) {
            <div class="group/tooltip relative flex items-center justify-center cursor-help">
              <lucide-icon name="info" class="w-4 h-4 text-[color:var(--text-muted)] hover:text-[color:var(--accent-1)] transition-colors" />
              <div class="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-48 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 pointer-events-none text-center">
                {{ description() }}
                <div class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
              </div>
            </div>
          }
        </div>
      <div class="relative group">
        @if (prefix()) {
          <span
            class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none font-medium transition-colors"
            [class]="'text-[color:var(--text-muted)] group-focus-within:text-[color:var(--accent-1)]'"
          >
            {{ prefix() }}
          </span>
        }
        <input
          [id]="id()"
          [type]="type()"
          [placeholder]="placeholder()"
          [formControl]="control()"
          (focus)="focused.emit()"
          (blur)="blurred.emit()"
          [class]="inputClasses()"
        />
        @if (suffix()) {
          <span
            class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none font-medium transition-colors"
            [class]="'text-[color:var(--text-muted)] group-focus-within:text-[color:var(--accent-1)]'"
          >
            {{ suffix() }}
          </span>
        }
      </div>
      @if (control().invalid && control().touched) {
        <div class="text-[11px] text-red-500 font-bold mt-1 px-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
          <lucide-icon name="alert-circle" class="w-3 h-3" />
          @if (control().errors; as errors) {
            @for (error of errors | keyvalue; track $index) {
              <span>{{ error.key }}</span>
            }
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
  description = input<string>();
  placeholder = input<string>('');
  type = input<'text' | 'number'>('text');
  prefix = input<string>();
  suffix = input<string>();

  control = input.required<FormControl>();

  focused = output<void>();
  blurred = output<void>();

  // State accessors
  protected get hasError(): boolean {
    return this.control().invalid && this.control().touched;
  }

  protected inputClasses() {
    return [
      'input-standard shadow-sm font-medium text-sm',
      this.prefix() ? 'pl-10' : 'px-4', // Standardized: 10 (2.5rem) for icon, 4 (1rem) for text
      this.suffix() ? 'pr-10' : 'pr-4',
      this.hasError
        ? 'border-red-400/80 focus:ring-red-400/40'
        : ''
    ];
  }
}
