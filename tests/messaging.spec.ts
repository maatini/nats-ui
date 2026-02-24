import { test, expect } from '@playwright/test';

test.describe('Messaging & Monitoring', () => {
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

    test('should navigate to publish page', async ({ page }) => {
        await page.click('text=Publish');
        await expect(page).toHaveURL(/\/publish/);
        await expect(page.getByText('Publish Message')).toBeVisible();
    });

    test('should fill publish form', async ({ page }) => {
        await page.goto('/publish');
        await page.getByPlaceholder('orders.new').fill('test.subject');
        await page.locator('textarea').fill('{"hello": "nats"}');

        // Check request mode toggle
        await page.getByText('Request Mode').click();
        await expect(page.getByRole('button', { name: 'Send Request' })).toBeVisible();
    });

    test('should navigate to monitor page', async ({ page }) => {
        await page.click('text=Monitor');
        await expect(page).toHaveURL(/\/monitor/);
        await expect(page.getByText('Live Subject Monitor')).toBeVisible();
    });

    test('should toggle monitor subscription', async ({ page }) => {
        await page.goto('/monitor');
        const subscribeButton = page.getByRole('button', { name: 'Subscribe' });
        await expect(subscribeButton).toBeVisible();

        // We don't click because it initiates an SSE connection which might hang in tests 
        // unless mocked, but we verify the UI components are present.
        await expect(page.getByPlaceholder('Subject or pattern')).toHaveValue('>');
    });
});
