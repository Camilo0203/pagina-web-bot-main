import type { FieldErrors, FieldValues } from 'react-hook-form';
import type { GuildInventory } from './types';

interface InventoryOption {
  value: string;
  label: string;
}

export function flattenFormErrors<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
): string[] {
  const messages = new Set<string>();

  function visit(value: unknown) {
    if (!value || typeof value !== 'object') {
      return;
    }

    if ('message' in value && typeof value.message === 'string' && value.message.trim()) {
      messages.add(value.message);
    }

    Object.values(value).forEach(visit);
  }

  visit(errors);
  return Array.from(messages);
}

export function getInventoryState(inventory: GuildInventory) {
  const hasInventory =
    inventory.roles.length > 0 ||
    inventory.channels.length > 0 ||
    inventory.categories.length > 0 ||
    inventory.commands.length > 0;

  return {
    hasInventory,
    isStale: Boolean(inventory.updatedAt && Date.now() - new Date(inventory.updatedAt).getTime() > 1000 * 60 * 60 * 12),
  };
}

export function findMissingSelections(
  selections: Array<{ label: string; value: string | null | undefined }>,
  options: InventoryOption[],
): string[] {
  const optionIds = new Set(options.map((option) => option.value));

  return selections
    .filter((selection) => Boolean(selection.value) && !optionIds.has(selection.value as string))
    .map((selection) => `${selection.label}: el elemento seleccionado ya no existe en el inventario sincronizado.`);
}
