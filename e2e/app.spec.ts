import { test, expect } from '@playwright/test';

test.describe('AngFin E2E Verification', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load dashboard and display title', async ({ page }) => {
        await expect(page.getByText('Professional Intelligence Suite')).toBeVisible();
        await expect(page.getByText('Precision Calculus')).toBeVisible();
    });

    test('should search and navigate to Mortgage Calculator', async ({ page }) => {
        // Search
        const searchInput = page.getByPlaceholder('Search tools');
        await searchInput.fill('Amortization');

        // Verify filter
        await expect(page.getByText('Mortgage Calculator')).toBeVisible();
        await expect(page.getByText('ROI')).not.toBeVisible();

        // Navigate
        await page.getByRole('link', { name: 'Mortgage Calculator' }).click();
        await expect(page.getByRole('heading', { name: 'Amortization' })).toBeVisible();

        // Interact
        await page.getByLabel('Loan Amount').fill('250000');
        // Note: Config has "Annual Interest Rate (%)"
        await page.getByLabel('Annual Interest Rate (%)').fill('4.5');
        // Note: Config has "Loan Term (Years)"
        await page.getByLabel('Loan Term (Years)').fill('30');

        // Verify Result details (assuming Monthly Payment is shown in results)
        // Note: ID attributes might be missing, so using text locators
        // Payment is approx 1266.71
        await expect(page.getByText('$1,266.71')).toBeVisible();
    });

    test('should verify TVM Investment Doubling (Edge Case)', async ({ page }) => {
        // Navigate via Search
        const searchInput = page.getByPlaceholder('Search tools');
        await searchInput.fill('TVM');
        await page.getByRole('link', { name: 'TVM Solver' }).click();

        // Setup TVM
        await page.getByLabel('Solve For').selectOption('N');

        await page.getByLabel('Present Value (PV)').fill('-1000');
        await page.getByLabel('Future Value (FV)').fill('2000');
        // Config has "Annual Interest (I/Y) (%)"
        await page.getByLabel('Annual Interest (I/Y) (%)').fill('10');
        await page.getByLabel('Payment (PMT)').fill('0');

        // Result should be 7.27
        await expect(page.getByText('7.27')).toBeVisible();
    });
});
