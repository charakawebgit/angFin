import { test } from '@playwright/test';

test('dump html', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000); // Wait for hydration
    const content = await page.content();
    console.log('--- HTML DUMP START ---');
    console.log(content);
    console.log('--- HTML DUMP END ---');
});
