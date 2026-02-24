import { test, expect } from '@playwright/test';

test.describe('KeyValue Stores', () => {
    test.beforeEach(async ({ page }) => {
        // Setup a connection in localStorage
        await page.goto('/');
        await page.evaluate(() => {
            const state = {
                state: {
                    connections: [
                        { id: '1', name: 'Local', servers: ['localhost:4222'], authType: 'none' }
                    ],
                    activeConnectionId: '1'
                },
                version: 0
            };
            localStorage.setItem('cobra-nats-storage', JSON.stringify(state));
        });
        await page.reload();
    });

    test('should navigate to KV page', async ({ page }) => {
        await page.getByRole('link', { name: 'KV Stores', exact: true }).click();
        await expect(page).toHaveURL(/\/kv/);
        await expect(page.getByRole('heading', { name: 'KeyValue Stores' })).toBeVisible();
    });

    test('should open create bucket dialog', async ({ page }) => {
        await page.goto('/kv');
        await page.getByRole('button', { name: 'Create KV Bucket' }).click();
        await expect(page.getByText('Create New KV Bucket')).toBeVisible();
    });

    test('should show empty state if no buckets', async ({ page }) => {
        await page.goto('/kv');
        // Assuming we have no buckets initially
        await expect(page.getByText('No buckets found')).toBeVisible();
    });
});
