# Manual QA Checklist

## Landing

- [ ] Navegar toda la landing con teclado solamente.
- [ ] Verificar skip link al cargar la pagina.
- [ ] Validar focus visible en navbar, selector de idioma, CTAs y footer.
- [ ] Confirmar que el hero no rompe layout en 320px, 768px y desktop.
- [ ] Confirmar que el poster del hero aparece si el video tarda o falla.
- [ ] Revisar seccion de estadisticas en modo live y en fallback.
- [ ] Revisar textos clave en ingles y espanol.

## Dashboard auth

- [ ] Iniciar sesion con Discord.
- [ ] Probar redirect a `/auth/callback`.
- [ ] Confirmar estados de loading, error y empty state.
- [ ] Confirmar logout y cambio de cuenta.

## Dashboard shell

- [ ] Abrir drawer lateral en mobile.
- [ ] Cerrar drawer por boton y por backdrop.
- [ ] Usar skip link del dashboard.
- [ ] Cambiar de guild desde header y sidebar.
- [ ] Cambiar de tema.

## Formularios

- [ ] Recorrer campos con teclado.
- [ ] Confirmar labels visibles y errores asociados.
- [ ] Confirmar estados disabled coherentes.
- [ ] Confirmar reset y save request.
- [ ] Verificar mensajes de validacion sin depender solo del color.

## Inbox

- [ ] Buscar tickets.
- [ ] Aplicar y limpiar filtros.
- [ ] Navegar la lista con flechas arriba/abajo.
- [ ] Abrir ticket y ejecutar una accion segura.
- [ ] Confirmar feedback de accion pending/success/error.
- [ ] Revisar notas internas, macros y respuesta manual.

## Activity y analytics

- [ ] Filtrar timeline por fuente y severidad.
- [ ] Revisar chart de analytics en mobile con scroll horizontal.
- [ ] Confirmar legibilidad de cards y snapshots en pantallas estrechas.

## Regresion final

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
