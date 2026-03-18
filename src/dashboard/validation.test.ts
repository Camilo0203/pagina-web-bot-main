import { describe, expect, it, vi } from 'vitest';
import { findMissingSelections, flattenFormErrors, getInventoryState } from './validation';

describe('validation helpers', () => {
  it('flattenFormErrors deduplica mensajes anidados', () => {
    const errors = {
      generalSettings: {
        timezone: { message: 'La zona horaria es obligatoria' },
        prefix: { message: 'La zona horaria es obligatoria' },
      },
      dashboardPreferences: {
        defaultSection: { message: 'La seccion inicial no es valida' },
      },
    };

    expect(flattenFormErrors(errors as never)).toEqual([
      'La zona horaria es obligatoria',
      'La seccion inicial no es valida',
    ]);
  });

  it('detecta inventario ausente y snapshots stale', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-18T20:00:00.000Z'));

    const fresh = getInventoryState({
      roles: [{ id: '1', name: 'Admin', color: null, position: 1, managed: false }],
      channels: [],
      categories: [],
      commands: [],
      updatedAt: '2026-03-18T18:00:00.000Z',
    } as never);
    const stale = getInventoryState({
      roles: [],
      channels: [{ id: '10', name: 'general', type: 'text', position: 1, parentId: null }],
      categories: [],
      commands: [],
      updatedAt: '2026-03-18T01:00:00.000Z',
    } as never);

    expect(fresh).toEqual({ hasInventory: true, isStale: false });
    expect(stale).toEqual({ hasInventory: true, isStale: true });

    vi.useRealTimers();
  });

  it('reporta selecciones que ya no existen en el inventario', () => {
    expect(findMissingSelections(
      [
        { label: 'Canal de logs', value: '123' },
        { label: 'Rol soporte', value: '999' },
        { label: 'Opcional', value: null },
      ],
      [
        { value: '123', label: '#logs' },
        { value: '456', label: 'Support' },
      ],
    )).toEqual([
      'Rol soporte: el elemento seleccionado ya no existe en el inventario sincronizado.',
    ]);
  });
});
