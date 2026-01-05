import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  imports: [CommonModule],
  template: `
    <div class="prose dark:prose-invert mx-auto">
      <h1>Privacy Policy</h1>
      <p>Your privacy is important to us. No data is stored on our servers.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyComponent { }
