import { render, screen, fireEvent } from '@testing-library/angular';
import { describe, it, expect, vi } from 'vitest';
import { CalculatorListComponent } from './calculator-list.component';
import { CalculatorService } from '../data/calculator.service';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LucideAngularModule, Search } from 'lucide-angular';

describe('CalculatorListComponent', () => {
    const mockCalculators = [
        { id: '1', title: 'Future Value', description: 'desc1', category: 'TVM', icon: 'trending-up' },
        { id: '2', title: 'ROI', description: 'desc2', category: 'Basics', icon: 'coins' },
    ];

    it('should render the list of calculators', async () => {
        await render(CalculatorListComponent, {
            providers: [
                provideRouter([]),
                {
                    provide: CalculatorService,
                    useValue: {
                        calculatorsList: signal(mockCalculators)
                    }
                }
            ],
            imports: [LucideAngularModule.pick({ Search })]
        });

        expect(screen.getByText('Future Value')).toBeTruthy();
        expect(screen.getByText('ROI')).toBeTruthy();
    });

    it('should filter calculators by search query', async () => {
        const { fixture } = await render(CalculatorListComponent, {
            providers: [
                provideRouter([]),
                {
                    provide: CalculatorService,
                    useValue: {
                        calculatorsList: signal(mockCalculators)
                    }
                }
            ],
            imports: [LucideAngularModule.pick({ Search })]
        });

        const input = screen.getByPlaceholderText(/search tools/i);
        fireEvent.input(input, { target: { value: 'ROI' } });
        fixture.detectChanges();

        expect(screen.queryByText('Future Value')).toBeFalsy();
        expect(screen.getByText('ROI')).toBeTruthy();
    });
});
