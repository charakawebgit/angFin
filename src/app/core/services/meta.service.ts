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
    const t = title && title.length ? title : this.defaultTitle;
    this.title.setTitle(t);
  }

  updateMeta(description: string | undefined) {
    const desc = description || '';
    const tag = this.meta.getTag('name="description"');
    if (tag) {
      this.meta.updateTag({ name: 'description', content: desc });
    } else {
      this.meta.addTag({ name: 'description', content: desc });
    }
  }

  resetTitle() {
    this.title.setTitle(this.defaultTitle);
    this.updateMeta('');
  }
}
