import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="prose dark:prose-invert mx-auto">
      <h1>About Us</h1>
      <p>Welcome to AngFin, your professional financial intelligence toolkit.</p>
    </div>
  `
})
export class AboutComponent { }
