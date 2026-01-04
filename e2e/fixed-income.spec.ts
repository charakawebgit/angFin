import { test, expect } from '@playwright/test';

test.describe('Fixed Income Calculators E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should calculate Bond Valuation', async ({ page }) => {
        // Navigate
        const searchInput = page.getByPlaceholder('Search tools');
        await searchInput.fill('Bond Valuation');
        await page.getByRole('link', { name: 'Bond Valuation' }).click();

        // Verify Title
        await expect(page.getByRole('heading', { name: 'Bond Valuation' })).toBeVisible();

        // Interact
        // Defaults: Face 1000, Coupon 5%, Market 4%, Years 10, Freq 2
        // Calculation: Coupon > Market => Premium bond (> 1000).
        // Exact: 1081.76 (checked in unit tests).

        await page.getByLabel('Face Value').fill('1000');
        await page.getByLabel('Annual Coupon Rate (%)').fill('5');
        await page.getByLabel('Required Market Rate (%)').fill('4');
        await page.getByLabel('Years to Maturity').fill('10');
        await page.getByLabel('Payments per Year').fill('2');

        // Verify Result
        // Label: "Estimated Bond Price"
        await expect(page.getByText('Estimated Bond Price')).toBeVisible();
        await expect(page.getByText('$1,081.76')).toBeVisible();
    });
});
