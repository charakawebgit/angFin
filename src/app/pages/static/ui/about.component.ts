import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  template: `
    <div class="prose dark:prose-invert mx-auto">
      <h1>About Us</h1>
      <p>Welcome to AngFin, your professional financial intelligence toolkit.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent { }
