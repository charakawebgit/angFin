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
        // Optional: could redirect to 404 page here or let the component show the error state
        // For now, we let the component handle the null config state (showing "Calculator Not Found")
        return null;
    }

    return config;
};
