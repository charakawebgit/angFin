import { inject } from '@angular/core';
import { ResolveFn, Router, RedirectCommand } from '@angular/router';
import { CalculatorService } from '@entities/calculator/model/calculator.service';
import { CalculatorConfig } from '@entities/calculator/model/types';

export const CalculatorResolver: ResolveFn<CalculatorConfig | null> = async (route) => {
    const calcService = inject(CalculatorService);
    const router = inject(Router);
    const id = route.paramMap.get('id');

    if (!id) {
        return new RedirectCommand(router.parseUrl('/'));
    }

    const config = await calcService.loadConfig(id);

    if (!config) {
        // Redirect if calculator not found AND return null to satisfy type
        return new RedirectCommand(router.parseUrl('/'));
    }

    return config;
};
