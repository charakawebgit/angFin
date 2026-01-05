import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/angular';
import { axe } from 'vitest-axe';

describe('AppComponent', () => {
  const setup = async () => {
    return render(AppComponent, {
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([])
      ]
    });
  };

  it('should create the app', async () => {
    const view = await setup();
    expect(view.fixture.componentInstance).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const { container } = await setup();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
