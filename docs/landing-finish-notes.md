# Landing finish notes

## Decisiones de UX y copy

- Se reescribió el copy de la landing en `src/i18n.ts` para que TON618 se entienda como un producto serio de Discord orientado a moderación, automatización, soporte, verificación y visibilidad operativa.
- Se consolidó el recorrido comercial con CTA principal hacia invitar el bot y CTA secundaria hacia dashboard, dejando docs y soporte como acciones de apoyo en puntos estratégicos.
- Se mantuvo la estética premium/cinemática existente, pero con mensajes más concretos sobre valor, casos de uso y confianza para evitar una sensación demasiado abstracta.
- Se reforzaron secciones intermedias para explicar mejor el dashboard, la operación diaria del staff y por qué el producto transmite fiabilidad.
- `LiveStats` ahora comunica mejor si está mostrando datos en vivo, sincronizando o usando fallback verificado, sin perder continuidad visual ni confianza.

## Mejoras SEO y accesibilidad

- Se ajustaron `Helmet`, `index.html` y `siteMetadata.ts` con título, descripción, `robots`, `og:site_name`, `keywords`, canonical y alternates de idioma.
- Se actualizó `public/site.webmanifest` para alinear la descripción del producto con el posicionamiento nuevo.
- Se añadieron landmarks y estructura más clara con `header`, `main`, `footer` y secciones con `aria-labelledby`.
- Se incorporó un skip link al contenido principal.
- Se mejoraron estados `focus-visible` globales y en controles clave para navegación por teclado.
- Se añadieron `aria-labels` y estados accesibles en navegación móvil, selector de idioma y bloques de métricas.
- En `LiveStats` se usó `aria-live="polite"` y `time` con `dateTime` para comunicar actualizaciones de forma robusta.

## Deuda pendiente

- No se modificaron assets gráficos como favicon o preview social; se reutilizaron los existentes y se reforzó la capa de metadatos alrededor de ellos.
- El árbol git ya tenía cambios previos no relacionados en `.env.example`, `eslint.config.js` y `src/dashboard/utils.test.ts`; no se tocaron.
- El build muestra la advertencia habitual de `caniuse-lite` desactualizado en Browserslist, pero no bloquea `build`, `typecheck` ni `lint`.
