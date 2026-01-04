import { test } from '@playwright/test';

test('capture console errors', async ({ page }) => {
    page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', err => console.log(`[BROWSER ERROR] ${err.message}`));

    await page.goto('/');
    // Wait a bit to ensure initialization happens
    await page.waitForTimeout(2000);
});
