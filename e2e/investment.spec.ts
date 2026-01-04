import { test, expect } from '@playwright/test';

test.describe('Investment Calculators E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should calculate Net Present Value (NPV)', async ({ page }) => {
        // Navigate via Search
        const searchInput = page.getByPlaceholder('Search tools');
        await searchInput.fill('NPV');
        await page.getByRole('link', { name: 'Net Present Value' }).click();

        // Verify Title
        await expect(page.getByRole('heading', { name: 'Net Present Value' })).toBeVisible();

        // Interact with form
        await page.getByLabel('Initial Investment').fill('1000');

        // Add Cash Flow explicitly to trigger list validation/update
        const cashFlowInput = page.getByLabel('Future Cash Flows (T1, T2...)');
        await cashFlowInput.fill('500');
        // Click the add button next to the input (using a locator strategy relative to the input or generic plus icon)
        await page.locator('button:has(lucide-icon[name="plus"])').click();

        await page.getByLabel('Annual Discount Rate (%)').fill('10');

        // Verify Result
        // Label checks
        await expect(page.getByText('Net Present Value (NPV)')).toBeVisible();
        // Check for currency formatted result (generic match for robustness)
        await expect(page.getByText(/-\$\d+/)).toBeVisible();
    });
});
