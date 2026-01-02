import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-disclaimer',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="prose dark:prose-invert mx-auto">
      <h1>Disclaimer</h1>
      <p>This tool is for educational purposes only. Please consult a financial advisor.</p>
    </div>
  `
})
export class DisclaimerComponent { }
