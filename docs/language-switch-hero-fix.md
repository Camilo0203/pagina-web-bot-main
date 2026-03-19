## Language Switch Hero Fix

- Causa raiz confirmada: el hueco visual venia principalmente del layout del `Hero`, no de `LanguageSelector`. El `Hero` combinaba `min-h-[92dvh]`, `items-center`, `justify-center` y `pt-36 md:pt-40`, asi que con navbar fijo el contenido quedaba demasiado abajo y dejaba visible una franja negra vacia al inicio.
- Fix aplicado: el `Hero` ahora alinea su contenido desde arriba con `items-start`, reduce el padding superior a `pt-28 md:pt-32 lg:pt-36` y deja el contenedor interno ocupando el alto disponible con un offset menor. Ademas, `LanguageSelector` guarda `scrollX/scrollY` antes de `i18n.changeLanguage()` y los restaura inmediatamente despues del cambio para evitar saltos visuales.
- Por que no rompe el layout: no se rehizo la estructura del hero ni se toco navbar, auth o dashboard. Solo se ajusto la alineacion vertical y el offset superior del bloque principal, manteniendo el mismo grid, overlays, CTA y comportamiento responsive existente.
