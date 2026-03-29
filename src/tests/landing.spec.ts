import { test, expect } from '@playwright/test';

test('La Landing Page carga correctamente y muestra el título', async ({ page }) => {
    // Navega a la ruta principal
    await page.goto('/');

    // Verifica que el título de la pestaña contenga "TON618"
    await expect(page).toHaveTitle(/TON618/);
});

test('El enrutador protege el Dashboard y carga la aplicación', async ({ page }) => {
    // Navega directamente al dashboard
    await page.goto('/dashboard');

    // Verifica que el navegador realmente se haya movido a la URL del panel
    await expect(page).toHaveURL(/.*dashboard/);
});

test('El cambio de idioma actualiza los textos correctamente', async ({ page }) => {
    await page.goto('/');

    // Simulamos que el usuario tiene preferencia de inglés guardada
    await page.evaluate(() => localStorage.setItem('i18nextLng', 'en'));
    await page.reload();
    await expect(page.getByText('Run Server Ops')).toBeVisible();

    // Simulamos el cambio a español y recargamos
    await page.evaluate(() => localStorage.setItem('i18nextLng', 'es'));
    await page.reload();
    await expect(page.getByText('Opera Tu Servidor')).toBeVisible();
});
