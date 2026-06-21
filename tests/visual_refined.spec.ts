import { test } from '@playwright/test';

test('visual verification desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 3000 });
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(2000); // Wait for animations
  await page.screenshot({ path: 'verification/desktop_refined_v2.png', fullPage: true });
});

test('visual verification mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 3000 });
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(2000); // Wait for animations
  await page.screenshot({ path: 'verification/mobile_refined_v2.png', fullPage: true });
});
