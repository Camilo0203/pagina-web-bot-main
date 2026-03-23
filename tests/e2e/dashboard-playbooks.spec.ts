import { expect, test } from '@playwright/test';

test.describe('Dashboard Ops Console Demo @smoke', () => {
  test.setTimeout(120000);

  test('permite confirmar una recomendacion de playbook desde la bandeja demo', async ({ page }) => {
    await page.goto('/dashboard?demo=ops-console', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: 'TON618 Ops Beta' })).toBeVisible({ timeout: 60000 });

    await page.getByRole('button', { name: /Bandeja de soporte|Support inbox/i }).click();

    const recommendationCard = page.locator('article').filter({ hasText: 'El riesgo SLA necesita escalado' }).first();
    await expect(recommendationCard).toBeVisible();

    await recommendationCard.getByRole('button', { name: /Confirmar|Confirm/i }).click();

    await expect(recommendationCard).toHaveCount(0);
  });
});
