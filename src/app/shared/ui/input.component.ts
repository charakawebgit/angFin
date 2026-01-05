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
          [formControl]="control()"
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
      'w-full px-4 py-3 bg-white dark:bg-slate-900 border rounded-xl outline-none transition-all text-sm font-medium shadow-sm dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600',
      'focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500',
      this.prefix() ? 'pl-9' : 'pl-4',
      this.suffix() ? 'pr-9' : 'pr-4',
      this.hasError
        ? 'border-red-500 focus:ring-red-500/10 focus:border-red-500'
        : 'border-slate-200 dark:border-slate-800'
    ];
  }
}
