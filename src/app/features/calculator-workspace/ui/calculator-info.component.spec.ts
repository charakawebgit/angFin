import { render, screen } from '@testing-library/angular';
import { describe, it, expect } from 'vitest';
import { CalculatorInfoComponent } from './calculator-info.component';
import { CalculatorConfig } from '@entities/calculator/model/types';
import { provideZonelessChangeDetection } from '@angular/core';

describe('CalculatorInfoComponent', () => {
    const fullConfig: CalculatorConfig = {
        id: 'full',
        title: 'Full Info',
        name: 'Full Info',
        description: 'Test',
        category: 'Test',
        icon: 'test',
        fields: [],
        results: [],
        insights: 'This is a test insight.',
        formula: 'A + B = C',
        references: [
            { title: 'Learn React', url: 'https://react.dev' },
            { title: 'Learn Angular', url: 'https://angular.dev' }
        ],
        calculate: () => []
    };

    it('should render insights and formula when provided', async () => {
        await render(CalculatorInfoComponent, {
            inputs: { config: fullConfig },
            providers: [provideZonelessChangeDetection()]
        });

        expect(screen.getByText(/This is a test insight/i)).toBeTruthy();
        expect(screen.getByText(/A \+ B = C/i)).toBeTruthy();
    });

    it('should render references list when provided', async () => {
        await render(CalculatorInfoComponent, {
            inputs: { config: fullConfig },
            providers: [provideZonelessChangeDetection()]
        });

        expect(screen.getByText(/Learn Angular/i)).toBeTruthy();
        const link = screen.getByRole('link', { name: /Learn Angular/i });
        expect(link.getAttribute('href')).toBe('https://angular.dev');
    });

    it('should not render anything if no info is present', async () => {
        const emptyConfig: CalculatorConfig = {
            id: 'empty',
            title: 'Empty',
            name: 'Empty',
            description: '',
            category: 'Test',
            icon: 'test',
            fields: [],
            results: [],
            calculate: () => []
        };

        const { container } = await render(CalculatorInfoComponent, {
            inputs: { config: emptyConfig },
            providers: [provideZonelessChangeDetection()]
        });

        expect(container.textContent?.trim()).toBe('');
    });
});
