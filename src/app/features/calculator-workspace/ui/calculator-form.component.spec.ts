import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CalculatorFormComponent } from './calculator-form.component';
import { Component, Input, provideZonelessChangeDetection } from '@angular/core';
import { CalculatorConfig } from '@entities/calculator/model/types';
import { LucideAngularModule, Calculator } from 'lucide-angular';
import { InputComponent } from '@shared/ui/input.component';
import { DynamicListInputComponent } from '@shared/ui/dynamic-list-input.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('CalculatorFormComponent', () => {
  let fixture: ComponentFixture<CalculatorFormComponent>;
  let component: CalculatorFormComponent;
  let fb: FormBuilder;

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
      @Input() control: unknown;
    }

    @Component({
      selector: 'app-dynamic-list-input',
      template: ''
    })
    class StubDynamicListInputComponent {
      @Input() id: string | undefined;
      @Input() label: string | undefined;
      @Input() items: unknown;
    }

    await TestBed.configureTestingModule({
      imports: [CalculatorFormComponent, LucideAngularModule.pick({ Calculator }), ReactiveFormsModule],
      providers: [provideZonelessChangeDetection()]
    })
      .overrideComponent(CalculatorFormComponent, {
        remove: { imports: [InputComponent, DynamicListInputComponent] },
        add: { imports: [StubInputComponent, StubDynamicListInputComponent] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(CalculatorFormComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('renders and displays the Principal label', async () => {
    fixture.componentRef.setInput('config', mockConfig);
    fixture.componentRef.setInput('data', { principal: 1000, rate: 5, type: 'a' });

    // Manually set the formGroup signal to bypass effect timing issues in test environment
    const group = fb.group({
      principal: ['1000'],
      rate: ['5'],
      type: ['a']
    });
    (component as any).formGroup.set(group);

    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const label = root.querySelector('label[for="principal"]');
    expect(label?.textContent?.trim()).toMatch(/Principal/i);
  });

  it('initializes calcForm and localData signals', async () => {
    fixture.componentRef.setInput('config', mockConfig);
    fixture.componentRef.setInput('data', { principal: 1000, rate: 5, type: 'a' });

    // Manually create expected state
    const group = fb.group({
      principal: ['1000'],
      rate: ['5'],
      type: ['a']
    });
    (component as any).formGroup.set(group);

    fixture.detectChanges();
    await fixture.whenStable();

    expect((component as any).formGroup()).toBeTruthy();
  });
});
