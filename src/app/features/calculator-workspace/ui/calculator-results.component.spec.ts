import { render, screen } from '@testing-library/angular';
import { describe, it, expect } from 'vitest';
import { CalculatorResultsComponent } from './calculator-results.component';
import { CalculatorConfig, ResultValue } from '@entities/calculator/model/types';
import { provideZonelessChangeDetection } from '@angular/core';

describe('CalculatorResultsComponent', () => {
    const mockConfig: CalculatorConfig = {
        id: 'test',
        title: 'Test Calc',
        description: 'Test Description',
        category: 'Test',
        icon: 'calculator',
        fields: [],
        results: [
            { label: 'Monthly Payment', type: 'currency', themeColor: 'indigo', calculate: () => 0 },
            { label: 'Total Interest', type: 'currency', themeColor: 'red', calculate: () => 0 },
            { label: 'Score', type: 'percent', themeColor: 'emerald', calculate: () => 0 }
        ],
    };

    it('should render empty state when invalid', async () => {
        await render(CalculatorResultsComponent, {
            inputs: {
                config: mockConfig,
                results: [],
                isValid: false
            },
            providers: [provideZonelessChangeDetection()]
        });

        expect(screen.getByText(/Awaiting Input/i)).toBeTruthy();
    });

    it('should render results when valid', async () => {
        const mockResults: ResultValue[] = [500, 1000, 0.5];
        await render(CalculatorResultsComponent, {
            inputs: {
                config: mockConfig,
                results: mockResults,
                isValid: true
            },
            providers: [provideZonelessChangeDetection()]
        });

        expect(screen.getByText(/Monthly Payment/i)).toBeTruthy();
        expect(screen.getByText(/50.00%/i)).toBeTruthy(); // Check formatted percent
    });
});
