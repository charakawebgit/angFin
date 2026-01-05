import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private title = inject(Title);
  private meta = inject(Meta);
  private defaultTitle = 'angFin';

  updateTitle(title: string | undefined) {
    const t = title && title.length ? `${title} | ${this.defaultTitle}` : this.defaultTitle;
    this.title.setTitle(t);
  }

  updateMeta(description: string | undefined) {
    const desc = description || '';
    this.meta.updateTag({ name: 'description', content: desc });
  }

  resetTitle() {
    this.title.setTitle(this.defaultTitle);
    this.updateMeta('Professional Financial Calculators and Investment Tools');
  }
}
