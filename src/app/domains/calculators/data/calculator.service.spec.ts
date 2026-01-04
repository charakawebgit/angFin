import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
    let service: CalculatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CalculatorService]
        });
        service = TestBed.inject(CalculatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have a list of calculators initially', () => {
        expect(service.calculatorsList().length).toBeGreaterThan(0);
    });

    it('should load a config correctly', async () => {
        // Note: This tests the async loading flow
        // Future expansion: Mock the dynamic import if needed
        await service.loadConfig('future-value');

        expect(service.isLoading()).toBe(false);
        expect(service.activeConfig()).not.toBeNull();
        expect(service.activeConfig()?.id).toBe('future-value');
    });

    it('should handle loading errors gracefully', async () => {
        await service.loadConfig('non-existent-id');
        expect(service.activeConfig()).toBeNull();
        expect(service.isLoading()).toBe(false);
    });
});
