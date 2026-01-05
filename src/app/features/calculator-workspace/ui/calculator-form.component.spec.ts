import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CalculatorFormComponent } from './calculator-form.component';
import { Component, Input } from '@angular/core';
import { CalculatorConfig } from '@entities/calculator/model/types';
import { LucideAngularModule, Calculator } from 'lucide-angular';
import { provideZonelessChangeDetection } from '@angular/core';

describe('CalculatorFormComponent', () => {
  let fixture: ComponentFixture<CalculatorFormComponent>;
  let component: CalculatorFormComponent;

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

  beforeEach(async () => {
    @Component({
      selector: 'app-input',
      template: `
        <label [for]="id">{{ label }}</label>
        <input [id]="id" />
      `
    })
    class StubInputComponent {
      @Input() id: string | undefined;
      @Input() label: string | undefined;
      @Input() field: unknown;
      @Input() type: string | undefined;
      @Input() placeholder: string | undefined;
      @Input() prefix: string | undefined;
      @Input() suffix: string | undefined;
    }

    await TestBed.configureTestingModule({
      imports: [StubInputComponent, CalculatorFormComponent, LucideAngularModule.pick({ Calculator })],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorFormComponent);
    component = fixture.componentInstance;
  });

  it('renders and displays the Principal label', async () => {
    // Assign the `input()` backed functions directly to avoid setInput issues in this test env
    (component as any).config = (() => mockConfig) as any;
    (component as any).data = (() => ({ principal: 1000, rate: 5, type: 'a' })) as any;
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const label = root.querySelector('label[for="principal"]');
    expect(label?.textContent?.trim()).toMatch(/Principal/i);
  });

  it('initializes calcForm and localData signals', async () => {
    (component as any).config = (() => mockConfig) as any;
    (component as any).data = (() => ({ principal: 1000, rate: 5, type: 'a' })) as any;
    fixture.detectChanges();
    await fixture.whenStable();

    // Wait until the calcForm signal is set (polling - effects are async)
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('calcForm not initialized')), 1000);
      const id = setInterval(() => {
        try {
          if (component.calcForm()) {
            clearInterval(id);
            clearTimeout(timeout);
            resolve();
          }
        } catch (err) {
          clearInterval(id);
          clearTimeout(timeout);
          reject(err);
        }
      }, 10);
    });

    expect(component.localData().principal).toBeTruthy();
  });
});
