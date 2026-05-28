import { expect, test } from '@playwright/test';

test('redirects protected routes to sign in when unauthenticated', async ({
  page,
}) => {
  await page.goto('/main');

  await expect(page).toHaveURL(/\/signin$/);
  await expect(page.getByRole('heading', { name: '광산 어드민' })).toBeVisible();
});

test('renders password reset as a public route', async ({ page }) => {
  await page.goto('/password');

  await expect(page).toHaveURL(/\/password$/);
  await expect(
    page.getByRole('heading', { name: '비밀번호 재설정' }),
  ).toBeVisible();
});
