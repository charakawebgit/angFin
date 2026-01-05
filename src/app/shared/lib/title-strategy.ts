import { Injectable, inject } from '@angular/core';
import { TitleStrategy, RouterStateSnapshot } from '@angular/router';
import { MetaService } from './meta.service';
import { CalculatorService } from '@entities/calculator/model/calculator.service';

@Injectable({
    providedIn: 'root'
})
export class AppTitleStrategy extends TitleStrategy {
    private metaService = inject(MetaService);
    private calcService = inject(CalculatorService);

    override updateTitle(routerState: RouterStateSnapshot) {
        const url = routerState.url.split('?')[0]; // Strip query params
        const parts = url.split('/');
        const id = parts[parts.length - 1];

        if (id && url.includes('/calculator/')) {
            const cfg = this.calcService.getById(id);
            if (cfg) {
                this.metaService.updateTitle(cfg.title);
                this.metaService.updateMeta(cfg.description);
                return;
            }
        }

        // Default values for other pages or if calculator not found
        this.metaService.resetTitle();
    }
}
