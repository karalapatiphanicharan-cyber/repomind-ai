import { test, expect } from '@playwright/test';

test('verify minor UI fixes', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Verify GitHub Star button
  const githubStarLink = page.locator('a:has-text("Star on GitHub")');
  await expect(githubStarLink).toHaveAttribute('href', 'https://github.com/karalapatiphanicharan-cyber/repomind-ai');
  await expect(githubStarLink).toHaveAttribute('target', '_blank');
  await expect(githubStarLink).toHaveAttribute('rel', 'noopener noreferrer');

  // Verify New Scroll Cue
  const newScrollCue = page.locator('text=Explore How AI Agents Work');
  await expect(newScrollCue).toBeVisible();

  // Verify smooth scroll
  const howItWorksSection = page.locator('#how-it-works');
  await newScrollCue.click();
  await page.waitForTimeout(1000); // Wait for scroll

  const boundingBox = await howItWorksSection.boundingBox();
  expect(boundingBox?.y).toBeLessThan(100); // Should be at top of viewport

  await page.screenshot({ path: '/home/jules/verification/minor_fixes.png', fullPage: true });
});
