import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CalculatorInfoComponent } from './calculator-info.component';
import { CalculatorConfig } from '@entities/calculator/model/types';
import { LucideAngularModule, Lightbulb, ScrollText, ArrowUpRight } from 'lucide-angular';

describe('CalculatorInfoComponent', () => {
    let component: CalculatorInfoComponent;
    let fixture: ComponentFixture<CalculatorInfoComponent>;

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
            { title: 'Learn React', url: 'https://react.dev' }, // Irony intent
            { title: 'Learn Angular', url: 'https://angular.dev' }
        ],
        calculate: () => []
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CalculatorInfoComponent, LucideAngularModule.pick({ Lightbulb, ScrollText, ArrowUpRight })]
        }).compileComponents();

        fixture = TestBed.createComponent(CalculatorInfoComponent);
        component = fixture.componentInstance;
    });

    it('should render insights and formula when provided', () => {
        fixture.componentRef.setInput('config', fullConfig);
        fixture.detectChanges();

        const root = fixture.nativeElement as HTMLElement;
        expect(root.textContent).toContain('This is a test insight.');
        expect(root.textContent).toContain('A + B = C');
    });

    it('should render references list when provided', () => {
        fixture.componentRef.setInput('config', fullConfig);
        fixture.detectChanges();

        const root = fixture.nativeElement as HTMLElement;
        expect(root.textContent).toContain('Learn Angular');
        const links = root.querySelectorAll('a');
        expect(links.length).toBe(2);
        expect(links[1].getAttribute('href')).toBe('https://angular.dev');
    });

    it('should not render anything if no info is present', () => {
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

        fixture.componentRef.setInput('config', emptyConfig);
        fixture.detectChanges();

        const root = fixture.nativeElement as HTMLElement;
        expect(root.textContent).toBe('');
    });
});
