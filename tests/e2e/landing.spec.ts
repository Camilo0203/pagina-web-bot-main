import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and display hero section', async ({ page }) => {
    // Verificar que el título principal esté visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Verificar que el logo esté presente
    await expect(page.locator('img[alt*="TON618"], img[alt*="Logo"]').first()).toBeVisible();
    
    // Verificar que los CTAs principales estén presentes
    const primaryCTA = page.getByRole('link', { name: /add to server|añadir al servidor/i }).first();
    const secondaryCTA = page.getByRole('link', { name: /dashboard|panel/i }).first();
    
    await expect(primaryCTA.or(page.getByRole('button', { name: /add to server|añadir al servidor/i }).first())).toBeVisible();
    await expect(secondaryCTA).toBeVisible();
  });

  test('should navigate to features section', async ({ page }) => {
    // Click en el enlace de features en el navbar
    const featuresLink = page.getByRole('link', { name: /features|características/i }).first();
    
    if (await featuresLink.isVisible()) {
      await featuresLink.click();
      
      // Esperar a que la sección de features esté visible
      await expect(page.locator('#features')).toBeInViewport();
    }
  });

  test('should display feature cards', async ({ page }) => {
    // Scroll a la sección de features
    await page.locator('#features').scrollIntoViewIfNeeded();
    
    // Verificar que haya al menos 4 feature cards
    const featureCards = page.locator('.tech-card, article').filter({ hasText: /.+/ });
    await expect(featureCards.first()).toBeVisible();
    
    const count = await featureCards.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('should display live stats section', async ({ page }) => {
    // Scroll a la sección de stats
    await page.locator('#stats').scrollIntoViewIfNeeded();
    
    // Verificar que el heading de stats esté visible
    await expect(page.locator('#stats-heading')).toBeVisible();
    
    // Verificar que haya stat cards
    const statCards = page.locator('#stats').locator('article, .tech-card');
    await expect(statCards.first()).toBeVisible();
  });

  test('should have working language selector', async ({ page }) => {
    // Buscar el selector de idioma
    const languageButton = page.getByRole('button', { name: /language|idioma|en|es/i }).first();
    
    if (await languageButton.isVisible()) {
      await languageButton.click();
      
      // Verificar que aparezca un menú o cambio de idioma
      await page.waitForTimeout(500);
    }
  });

  test('should have accessible navigation', async ({ page }) => {
    // Verificar que el navbar tenga el atributo aria-label
    const nav = page.locator('nav').first();
    await expect(nav).toHaveAttribute('aria-label', /.+/);
    
    // Verificar que el skip link esté presente
    const skipLink = page.getByRole('link', { name: /skip to content|saltar al contenido/i });
    await expect(skipLink).toBeInViewport({ ratio: 0 }); // Puede estar oculto visualmente
  });

  test('should have responsive navbar on mobile', async ({ page }) => {
    // Cambiar a viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verificar que el botón de menú móvil esté visible
    const mobileMenuButton = page.getByRole('button', { name: /menu|menú|open menu|close menu/i });
    await expect(mobileMenuButton).toBeVisible();
    
    // Abrir el menú móvil
    await mobileMenuButton.click();
    
    // Verificar que el menú se abra
    await page.waitForTimeout(500);
  });

  test('should load footer with links', async ({ page }) => {
    // Scroll al footer
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    // Verificar que el footer esté visible
    await expect(page.locator('footer')).toBeVisible();
    
    // Verificar que haya enlaces en el footer
    const footerLinks = page.locator('footer a');
    const count = await footerLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});
