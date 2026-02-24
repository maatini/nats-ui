import { test, expect } from '@playwright/test';

test.describe('Functional Stream Creation', () => {
    test.beforeEach(async ({ page }) => {
        // Setup a connection in localStorage
        await page.goto('/');
        await page.evaluate(() => {
            const state = {
                state: {
                    connections: [
                        { id: '1', name: 'Real NATS', servers: ['localhost:4222'], authType: 'none' }
                    ],
                    activeConnectionId: '1'
                },
                version: 0
            };
            localStorage.setItem('cobra-nats-storage', JSON.stringify(state));
        });
        await page.reload();
    });

    test('should create a stream and verify it exists', async ({ page }) => {
        const streamName = `TEST_STREAM_${Date.now()}`;

        await page.getByRole('link', { name: 'Streams', exact: true }).click();
        await expect(page).toHaveURL(/\/streams/);

        // Open create dialog
        await page.getByRole('button', { name: 'Create Stream' }).click();

        // Fill form
        await page.getByLabel('Stream Name').fill(streamName);
        await page.getByLabel('Subjects').fill(`${streamName}.>`);

        // Submit - targeting the button inside the dialog
        const submitButton = page.locator('button[type="submit"]', { hasText: 'Create Stream' });
        await expect(submitButton).toBeEnabled();
        await submitButton.click();

        // Wait for EITHER success or failure toast
        const successToast = page.getByText(`Stream "${streamName}" created successfully`);
        const errorToast = page.getByText('Failed to create stream');

        await Promise.race([
            successToast.waitFor({ state: 'visible', timeout: 15000 }),
            errorToast.waitFor({ state: 'visible', timeout: 15000 })
        ]).catch(() => {
            throw new Error('Timed out waiting for success or error toast');
        });

        if (await errorToast.isVisible()) {
            const description = await page.locator('[data-sonner-toast] [data-description]').innerText().catch(() => 'No description found');
            throw new Error(`Stream creation failed: ${description}`);
        }

        await expect(successToast).toBeVisible();

        // Stream should appear in the list (Table)
        // Wait for loading to finish if it's showing
        await expect(page.getByText('Loading streams...')).not.toBeVisible({ timeout: 10000 });

        // Use getByText for the stream name in the table
        await expect(page.getByText(streamName, { exact: true })).toBeVisible({ timeout: 10000 });
    });
});
