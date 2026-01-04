import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CalculatorService } from './calculator.service';
import { CalculatorConfig, CalculatorRegistryItem } from './models';

const mocks = vi.hoisted(() => {
    const mockConfig: CalculatorConfig = {
        id: 'future-value',
        title: 'Future Value',
        description: 'Test Description',
        icon: 'test-icon',
        category: 'Test Category',
        fields: [],
        results: []
    };

    const mockRegistry: CalculatorRegistryItem[] = [
        {
            id: 'future-value',
            title: 'Future Value',
            description: 'Test',
            icon: 'test',
            category: 'Test',
            load: vi.fn().mockResolvedValue({ config: mockConfig })
        }
    ];

    return {
        mockConfig,
        mockRegistry
    };
});

vi.mock('./calculators.registry', () => ({
    CALCULATORS_REGISTRY: mocks.mockRegistry
}));

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
        expect(service.calculatorsList()[0].id).toBe('future-value');
    });

    it('should load a config correctly', async () => {
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
