
import { test, expect } from '@playwright/test';

test('User Login and Admin Dashboard Access', async ({ page }) => {
  // 1. Go to Login Page
  console.log('Navigating to Login Page...');
  await page.goto('http://localhost:3000/login', { timeout: 60000 });
  await expect(page).toHaveTitle(/CareerPath|Login/);

  // 2. Fill Credentials
  console.log('Waiting for email input...');
  await page.waitForSelector('input[type="email"]', { state: 'visible', timeout: 30000 });

  console.log('Filling Credentials...');
  await page.fill('input[type="email"]', 'kelompokpkmbisdig@gmail.com');
  await page.waitForTimeout(1000); // Small pause for visual confirmation
  await page.fill('input[type="password"]', '12345678');

  // 3. Submit
  console.log('Clicking Login...');
  await page.click('button[type="submit"]');

  // 4. Verify Redirect to Dashboard
  console.log('Waiting for Dashboard (max 60s)...');
  try {
    // Wait for URL to contain dashboard
    await page.waitForURL('**/dashboard', { timeout: 60000 });

    // Check for common dashboard elements
    await expect(page.locator('text=Selamat Datang')).toBeVisible({ timeout: 10000 });
    console.log('✅ Dashboard Accessed');
  } catch (error) {
    console.log('❌ Dashboard redirect failed!');
    // Check if still on login page and if error message is present
    if (page.url().includes('/login')) {
      const errorMsg = await page.locator('.text-red-600').textContent().catch(() => 'No error message found');
      console.log(`⚠️ Login Error Message on Screen: "${errorMsg}"`);
    }
    throw error;
  }

  // 5. Verify Admin Access
  console.log('Checking Admin Access...');
  // Try to navigate to admin
  await page.goto('http://localhost:3000/admin', { timeout: 30000 });

  // Should see Admin Panel text or unique element
  await expect(page.locator('text=Admin Panel')).toBeVisible();
  console.log('✅ Admin Panel Verified');
});
