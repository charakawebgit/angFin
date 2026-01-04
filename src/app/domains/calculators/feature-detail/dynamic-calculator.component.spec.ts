import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicCalculatorComponent } from './dynamic-calculator.component';
import { CalculatorService } from '../data/calculator.service';
import { signal, importProvidersFrom } from '@angular/core';
import { CalculatorConfig } from '../data/models';
import { axe, toHaveNoViolations } from 'vitest-axe';
import { LucideAngularModule, Calculator, SearchX } from 'lucide-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

expect.extend(toHaveNoViolations);

describe('DynamicCalculatorComponent', () => {
    let component: DynamicCalculatorComponent;
    let fixture: ComponentFixture<DynamicCalculatorComponent>;

    // Mock CalculatorService
    const mockCalculatorService = {
        loadConfig: (_id: string) => { /* noop */ },
        activeConfig: signal<CalculatorConfig | null>({
            id: 'test-calc',
            title: 'Test Calculator',
            description: 'A test calculator',
            category: 'finance',
            fields: [
                { key: 'input1', type: 'number', label: 'Input 1', defaultValue: 10, required: true }
            ],
            results: [
                { key: 'result1', label: 'Result 1', calculate: (data) => (Number(data['input1']) || 0) * 2 }
            ]
        }),
        isLoading: signal(false)
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DynamicCalculatorComponent],
            providers: [
                { provide: CalculatorService, useValue: mockCalculatorService },
                provideAnimationsAsync(),
                importProvidersFrom(LucideAngularModule.pick({ Calculator, SearchX }))
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DynamicCalculatorComponent);
        component = fixture.componentInstance;

        // Set required input
        fixture.componentRef.setInput('id', 'test-calc');

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should pass accessibility checks', async () => {
        const results = await axe(fixture.nativeElement);
        expect(results).toHaveNoViolations();
    });

    it('should render calculator form and results when config is loaded', () => {
        const formElement = fixture.nativeElement.querySelector('app-calculator-form');
        const resultsElement = fixture.nativeElement.querySelector('app-calculator-results');

        expect(formElement).toBeTruthy();
        expect(resultsElement).toBeTruthy();
    });

    it('should update results when data changes', () => {
        // Simulate valid form
        component.setValid(true);
        fixture.detectChanges();

        // Initial calculation (Input 10 * 2 = 20)
        const results = component.results();
        expect(results[0]).toBe(20);

        // Update data
        component.updateData('input1', 20);
        fixture.detectChanges();

        // New calculation (Input 20 * 2 = 40)
        const updatedResults = component.results();
        expect(updatedResults[0]).toBe(40);
    });
});
