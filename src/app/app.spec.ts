import { render } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { describe, it, expect } from 'vitest';
import { App } from './app';

describe('App', () => {
  it('should render the title', async () => {
    const { fixture } = await render(App, {
      providers: [provideRouter([])]
    });
    expect(fixture.componentInstance).toBeTruthy();
  });
});
