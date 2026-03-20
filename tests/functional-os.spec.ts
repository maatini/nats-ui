import { test, expect } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

test.describe('Functional Object Store CRUD', () => {
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

    test('should create a bucket, upload a file, and delete', async ({ page }) => {
        const bucketName = `TEST_OS_${Date.now()}`;

        // Navigate to OS page
        const osLink = page.getByRole('link', { name: 'Object Stores', exact: true });
        await expect(osLink).toBeVisible({ timeout: 10000 });
        await osLink.click();
        await expect(page).toHaveURL(/\/os/);

        // Open create dialog
        await page.getByRole('button', { name: 'Create Object Store' }).click();

        // Fill form
        await page.getByLabel('Bucket Name').fill(bucketName);

        // Submit
        const submitButton = page.locator('button[type="submit"]', { hasText: 'Create Object Store' });
        await expect(submitButton).toBeEnabled();
        await submitButton.click();

        // Wait for success or failure toast
        const successToast = page.getByText(`Object Store "${bucketName}" created successfully`);
        const errorToast = page.getByText('Failed to create Object Store');

        await Promise.race([
            successToast.waitFor({ state: 'visible', timeout: 15000 }),
            errorToast.waitFor({ state: 'visible', timeout: 15000 })
        ]).catch(() => {
            throw new Error('Timed out waiting for success or error toast');
        });

        if (await errorToast.isVisible()) {
            const description = await page.locator('[data-sonner-toast] [data-description]').innerText().catch(() => 'No description found');
            throw new Error(`Bucket creation failed: ${description}`);
        }

        await expect(successToast).toBeVisible();

        // Bucket should appear in the list — click "Browse Objects" to navigate
        const bucketLink = page.locator(`a[href="/os/${bucketName}"]`).first();
        await expect(bucketLink).toBeVisible({ timeout: 10000 });
        await bucketLink.click();

        // Should be on bucket detail page
        await expect(page).toHaveURL(new RegExp(`/os/${bucketName}`));
        await expect(page.getByRole('heading', { name: bucketName, exact: true })).toBeVisible({ timeout: 10000 });

        // Create a temporary test file to upload
        const tmpDir = path.join(__dirname, '..', 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
        const testFilePath = path.join(tmpDir, 'test-upload.txt');
        fs.writeFileSync(testFilePath, 'Hello from E2E test!');

        // Upload an object via the dialog
        await page.getByRole('button', { name: 'Upload' }).click();
        await expect(page.getByText('Upload Object')).toBeVisible();

        // Set file on input
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles(testFilePath);

        // Submit upload
        const uploadButton = page.getByRole('button', { name: 'Upload Object' });
        await expect(uploadButton).toBeEnabled();
        await uploadButton.click();

        // Wait for upload success
        const uploadSuccess = page.getByText('uploaded successfully');
        await expect(uploadSuccess).toBeVisible({ timeout: 15000 });

        // Object should appear in the list
        await expect(page.getByText('test-upload.txt')).toBeVisible({ timeout: 10000 });

        // Delete the bucket from the detail page
        page.once('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: 'Delete Bucket' }).click();

        // Wait for deletion and redirect
        const deletedToast = page.getByText('Bucket deleted');
        await expect(deletedToast).toBeVisible({ timeout: 10000 });
        await expect(page).toHaveURL(/\/os/);

        // Cleanup temp file
        if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
    });
});
