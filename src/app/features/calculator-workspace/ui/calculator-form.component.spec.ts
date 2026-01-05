import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CalculatorFormComponent } from './calculator-form.component';
import { Component, Input } from '@angular/core';
import { CalculatorConfig } from '@entities/calculator/model/types';
import { LucideAngularModule, Calculator } from 'lucide-angular';
import { InputComponent } from '@shared/ui/input.component';

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
      imports: [CalculatorFormComponent, LucideAngularModule.pick({ Calculator })],
      providers: [] // Remove zoneless for now to test if Zone.js handles effects better in test env
    })
      .overrideComponent(CalculatorFormComponent, {
        remove: { imports: [InputComponent] },
        add: { imports: [StubInputComponent] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(CalculatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Initial CD
  });

  it('renders and displays the Principal label', fakeAsync(() => {
    // Assign the `input()` backed functions directly to avoid setInput issues in this test env
    fixture.componentRef.setInput('config', mockConfig);
    fixture.componentRef.setInput('data', { principal: 1000, rate: 5, type: 'a' });
    fixture.detectChanges();

    // Advance time to allow effect to run (scheduled as microtask/timer)
    tick(100);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const label = root.querySelector('label[for="principal"]');
    expect(label?.textContent?.trim()).toMatch(/Principal/i);
  }));

  it('initializes calcForm and localData signals', fakeAsync(() => {
    fixture.componentRef.setInput('config', mockConfig);
    fixture.componentRef.setInput('data', { principal: 1000, rate: 5, type: 'a' });
    fixture.detectChanges();

    tick(100);
    fixture.detectChanges();

    expect((component as any).formGroup()).toBeTruthy();
  }));
});
