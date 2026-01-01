import { render, screen } from '@testing-library/angular';
import { describe, it, expect } from 'vitest';
import { App } from './app';

describe('App', () => {
  it('should render the title', async () => {
    await render(App);
    expect(screen.getByText('angFin')).toBeTruthy();
  });
});
