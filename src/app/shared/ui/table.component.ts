import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export interface TableColumn {
    header: string;
    key: string;
    format?: 'currency' | 'percent' | 'number' | 'text';
    align?: 'left' | 'right' | 'center';
}

@Component({
    selector: 'app-table',
    imports: [CommonModule, LucideAngularModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="w-full overflow-hidden rounded-xl border border-[color:var(--panel-outline)] bg-[color:var(--surface)] shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-[color:var(--text-muted)] uppercase bg-[color:var(--surface-soft)] border-b border-[color:var(--panel-outline)]">
            <tr>
              @for (col of columns(); track col.key) {
                <th scope="col" class="px-6 py-4 font-bold tracking-wider whitespace-nowrap" [class.text-right]="col.align === 'right'" [class.text-center]="col.align === 'center'">
                  {{ col.header }}
                </th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-[color:var(--panel-outline)]">
            @for (row of data(); track $index) {
              <tr class="bg-[color:var(--surface)] hover:bg-[color:var(--surface-soft)] transition-colors group">
                @for (col of columns(); track col.key) {
                  <td class="px-6 py-4 whitespace-nowrap font-medium text-[color:var(--text-primary)]" [class.text-right]="col.align === 'right'" [class.text-center]="col.align === 'center'">
                    @switch (col.format) {
                      @case ('currency') { {{ $any(row[col.key]) | currency:'USD':'symbol':'1.0-2' }} }
                      @case ('percent') { {{ $any(row[col.key]) | percent:'1.2-2' }} }
                      @case ('number') { {{ $any(row[col.key]) | number:'1.0-4' }} }
                      @default { {{ row[col.key] }} }
                    }
                  </td>
                }
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="columns().length" class="px-6 py-8 text-center text-[color:var(--text-muted)] italic">
                  No data available
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class TableComponent {
    columns = input.required<TableColumn[]>();
    data = input.required<Record<string, unknown>[]>();
}
