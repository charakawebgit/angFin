import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { CalculatorService } from '@entities/calculator/model/calculator.service';
import { CalculatorConfig } from '@entities/calculator/model/types';

export const CalculatorResolver: ResolveFn<CalculatorConfig | null> = async (route) => {
    const calcService = inject(CalculatorService);
    const router = inject(Router);
    const id = route.paramMap.get('id');

    if (!id) {
        router.navigate(['/']);
        return null;
    }

    const config = await calcService.loadConfig(id);

    if (!config) {
        // Redirect if calculator not found AND return null to satisfy type
        await router.navigate(['/']);
        return null;
    }

    return config;
};
