import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root',
})
export class MetaService {
    private title = inject(Title);
    private meta = inject(Meta);

    private readonly appName = 'angFin Pro';

    updateTitle(title: string) {
        this.title.setTitle(`${title} | ${this.appName}`);
    }

    updateMeta(description: string) {
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ property: 'og:title', content: this.title.getTitle() });
    }

    resetTitle() {
        this.title.setTitle(this.appName);
    }
}
