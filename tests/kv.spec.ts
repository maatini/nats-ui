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
            localStorage.setItem('nats-nexus-storage', JSON.stringify(state));
        });
        await page.reload();
    });

    test('should navigate to KV page', async ({ page }) => {
        await page.click('text=KV Stores');
        await expect(page).toHaveURL(/\/kv/);
        await expect(page.getByText('KeyValue Stores')).toBeVisible();
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
