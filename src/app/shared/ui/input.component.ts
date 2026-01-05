import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule, LucideAngularModule, CommonModule],
  template: `
    <div class="flex flex-col gap-1.5">
      @if (label()) {
        <label
          [for]="id()"
          class="text-xs font-semibold uppercase tracking-[0.18em] ml-1 text-[color:var(--text-muted)]"
        >
          {{ label() }}
        </label>
      }
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
      'w-full px-4 py-3 rounded-2xl outline-none transition-all text-sm font-medium shadow-sm',
      'bg-[color:var(--surface-soft)] text-[color:var(--text-primary)] placeholder:[color:var(--text-muted)]',
      'border border-[color:var(--panel-outline)]',
      'focus:ring-2 focus:ring-[color:var(--accent-1)] focus:border-[color:var(--accent-1)]',
      this.prefix() ? 'pl-9' : 'pl-4',
      this.suffix() ? 'pr-9' : 'pr-4',
      this.hasError
        ? 'border-red-400/80 focus:ring-red-400/40'
        : ''
    ];
  }
}
