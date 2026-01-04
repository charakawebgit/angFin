import { render, screen, fireEvent } from '@testing-library/angular';
import { describe, it, expect } from 'vitest';
import { CalculatorListComponent } from './calculator-list.component';
import { CalculatorService } from '../data/calculator.service';
import { MetaService } from '@core/services/meta.service';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LucideAngularModule, Search, TrendingUp, HandCoins, ArrowRight, SearchX } from 'lucide-angular';

describe('CalculatorListComponent', () => {
    const mockCalculators = [
        { id: '1', title: 'Future Value', description: 'desc1', category: 'TVM', icon: 'trending-up' },
        { id: '2', title: 'ROI', description: 'desc2', category: 'Basics', icon: 'hand-coins' },
    ];

    it('should render the list of calculators', async () => {
        await render(CalculatorListComponent, {
            providers: [
                provideRouter([]),
                provideNoopAnimations(),
                {
                    provide: CalculatorService,
                    useValue: {
                        calculatorsList: signal(mockCalculators)
                    }
                },
                {
                    provide: MetaService,
                    useValue: {
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        updateTitle: () => { },
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        updateMeta: () => { }
                    }
                }
            ],
            imports: [LucideAngularModule.pick({ Search, TrendingUp, HandCoins, ArrowRight, SearchX })]
        });

        expect(screen.getByText('Future Value')).toBeTruthy();
        expect(screen.getByText('ROI')).toBeTruthy();
    });

    it('should filter calculators by search query', async () => {
        const { fixture } = await render(CalculatorListComponent, {
            providers: [
                provideRouter([]),
                provideNoopAnimations(),
                {
                    provide: CalculatorService,
                    useValue: {
                        calculatorsList: signal(mockCalculators)
                    }
                },
                {
                    provide: MetaService,
                    useValue: {
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        updateTitle: () => { },
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        updateMeta: () => { }
                    }
                }
            ],
            imports: [LucideAngularModule.pick({ Search, TrendingUp, HandCoins, ArrowRight, SearchX })]
        });

        const input = screen.getByPlaceholderText(/search tools/i);
        fireEvent.input(input, { target: { value: 'ROI' } });
        fixture.detectChanges();

        expect(screen.queryByText('Future Value')).toBeFalsy();
        expect(screen.getByText('ROI')).toBeTruthy();
    });
});
