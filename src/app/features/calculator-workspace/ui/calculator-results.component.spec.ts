import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CalculatorResultsComponent } from './calculator-results.component';
import { CalculatorConfig, ResultValue } from '@entities/calculator/model/types';
import { LucideAngularModule, Copy, Check, Calculator } from 'lucide-angular';

describe('CalculatorResultsComponent', () => {
    let component: CalculatorResultsComponent;
    let fixture: ComponentFixture<CalculatorResultsComponent>;

    const mockConfig: CalculatorConfig = {
        id: 'test',
        name: 'Test Calc', // Changed title to name to match type definition if necessary, or just mock what's needed
        title: 'Test Calc',
        description: 'Test Description',
        category: 'Test',
        icon: 'calculator',
        fields: [],
        results: [
            { label: 'Monthly Payment', type: 'currency', themeColor: 'indigo' },
            { label: 'Total Interest', type: 'currency', themeColor: 'red' },
            { label: 'Score', type: 'percent', themeColor: 'emerald' }
        ],
        calculate: () => []
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CalculatorResultsComponent, LucideAngularModule.pick({ Copy, Check, Calculator })]
        }).compileComponents();

        fixture = TestBed.createComponent(CalculatorResultsComponent);
        component = fixture.componentInstance;
    });

    it('should render empty state when invalid', () => {
        fixture.componentRef.setInput('config', mockConfig);
        fixture.componentRef.setInput('results', []);
        fixture.componentRef.setInput('isValid', false);
        fixture.detectChanges();

        const root = fixture.nativeElement as HTMLElement;
        expect(root.textContent).toMatch(/Awaiting Input/i);
    });

    it('should render results when valid', () => {
        const mockResults: ResultValue[] = [500, 1000, 0.5];
        fixture.componentRef.setInput('config', mockConfig);
        fixture.componentRef.setInput('results', mockResults);
        fixture.componentRef.setInput('isValid', true);
        fixture.detectChanges();

        const root = fixture.nativeElement as HTMLElement;

        // Check labels
        expect(root.textContent).toMatch(/Monthly Payment/i);
        expect(root.textContent).toMatch(/Total Interest/i);
        expect(root.textContent).toMatch(/Score/i);
    });

    it('should format percent values correctly', () => {
        const mockResults: ResultValue[] = [500, 1000, 0.5];
        fixture.componentRef.setInput('config', mockConfig);
        fixture.componentRef.setInput('results', mockResults);
        fixture.componentRef.setInput('isValid', true);
        fixture.detectChanges();

        const root = fixture.nativeElement as HTMLElement;
        // 0.5 should be 50.00%
        expect(root.textContent).toContain('50.00%');
    });

    it('should copy to clipboard', async () => {
        // Mock clipboard API
        const writeTextSpy = vi.fn().mockResolvedValue(undefined);
        Object.assign(navigator, {
            clipboard: {
                writeText: writeTextSpy
            }
        });

        const mockResults: ResultValue[] = [500, 1000, 0.5];
        fixture.componentRef.setInput('config', mockConfig);
        fixture.componentRef.setInput('results', mockResults);
        fixture.componentRef.setInput('isValid', true);
        fixture.detectChanges();

        // Trigger copy on first item
        component.copyToClipboard(mockResults[0], 'Monthly Payment');

        expect(writeTextSpy).toHaveBeenCalledWith('500');
        expect(component.copiedField()).toBe('Monthly Payment');
    });
});
