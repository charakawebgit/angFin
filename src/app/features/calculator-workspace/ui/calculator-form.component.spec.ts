import { render, screen, waitFor } from '@testing-library/angular';
import { describe, it, expect } from 'vitest';
import { CalculatorFormComponent } from './calculator-form.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { CalculatorConfig } from '@entities/calculator/model/types';
import { LucideAngularModule, Calculator } from 'lucide-angular';
import { InputComponent } from '@shared/ui/input.component';
import { DynamicListInputComponent } from '@shared/ui/dynamic-list-input.component';

describe('CalculatorFormComponent', () => {
  const mockConfig: CalculatorConfig = {
    id: 'test-calc',
    title: 'Test Calculator',
    description: 'Testing form rendering',
    category: 'Test',
    icon: 'calculator',
    fields: [
      { key: 'principal', label: 'Principal', type: 'select', options: [{ label: '1000', value: '1000' }, { label: '2000', value: '2000' }], defaultValue: '1000', required: true },
      { key: 'rate', label: 'Rate', type: 'select', options: [{ label: '5', value: '5' }, { label: '10', value: '10' }], defaultValue: '5', required: true },
      { key: 'type', label: 'Type', type: 'select', options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }], defaultValue: 'a' }
    ],
    results: []
  };

  it('renders and displays the Principal label', async () => {
    await render(CalculatorFormComponent, {
      inputs: {
        config: mockConfig,
        data: { principal: 1000, rate: 5, type: 'a' }
      },
      providers: [provideZonelessChangeDetection()]
    });

    // Use findByText which waits for element to appear (handles zoneless async effects)
    const label = await screen.findByText('Principal', {}, { timeout: 5000 });
    expect(label).toBeTruthy();
  });

  it('initializes form group validation', async () => {
    const { fixture } = await render(CalculatorFormComponent, {
      inputs: {
        config: mockConfig,
        data: { principal: 1000, rate: 5, type: 'a' }
      },
      providers: [provideZonelessChangeDetection()]
    });

    // Wait for form to be initialized via effect
    await waitFor(() => {
      expect((fixture.componentInstance as any).formGroup()).toBeTruthy();
    }, { timeout: 5000 });
  });
});
