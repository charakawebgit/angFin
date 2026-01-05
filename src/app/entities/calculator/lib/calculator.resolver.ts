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
    return config || null;
};
