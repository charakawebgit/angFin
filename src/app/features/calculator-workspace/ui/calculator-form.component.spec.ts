import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

import { CalculatorFormComponent } from './calculator-form.component';
import { CalculatorConfig } from '@entities/calculator/model/types';
import { provideRouter } from '@angular/router';
import { LucideAngularModule, Calculator } from 'lucide-angular';

describe('CalculatorFormComponent', () => {
    let component: CalculatorFormComponent;
    let fixture: ComponentFixture<CalculatorFormComponent>;

    // Mock Config
    const mockConfig: CalculatorConfig = {
        id: 'test-calc',
        title: 'Test Calculator',
        description: 'Testing form rendering',
        category: 'Test',
        icon: 'calculator',
        fields: [
            { key: 'principal', label: 'Principal', type: 'number', defaultValue: 1000, required: true, min: 0 },
            { key: 'rate', label: 'Rate', type: 'number', defaultValue: 5, required: true },
            { key: 'type', label: 'Type', type: 'select', options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }], defaultValue: 'a' }
        ],
        results: []
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CalculatorFormComponent, LucideAngularModule.pick({ Calculator })],
            providers: [
                provideRouter([]),
                provideZonelessChangeDetection()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CalculatorFormComponent);
        component = fixture.componentInstance;

        // Set required inputs
        fixture.componentRef.setInput('config', mockConfig);
        fixture.componentRef.setInput('data', { principal: 1000, rate: 5, type: 'a' });

        fixture.detectChanges();
        // Allow effects to run
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the local form signal', () => {
        expect(component.calcForm()).toBeTruthy();
        expect(component.localData()).toEqual({ principal: 1000, rate: 5, type: 'a' });
    });

    it('should update data when inputs change', () => {
        let emittedData: { key: string, value: unknown } | undefined;
        component.dataChanged.subscribe(d => emittedData = d);

        component.updateData('principal', 2000);

        expect(emittedData).toEqual({ key: 'principal', value: 2000 });
    });
});
