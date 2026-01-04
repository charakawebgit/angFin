import { describe, it, expect } from 'vitest';
import { App } from './app';

describe('App', () => {
  it('should construct', () => {
    const instance = new App();
    expect(instance).toBeTruthy();
  });
});
