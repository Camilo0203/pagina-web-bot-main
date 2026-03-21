import type { GuildInventory } from '../types';

export function getRoleOptions(inventory: GuildInventory) {
  return inventory.roles
    .map((role) => ({
      value: role.id,
      label: role.name,
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

export function getChannelOptions(inventory: GuildInventory, allowedTypes?: string[]) {
  const allowed = allowedTypes ? new Set(allowedTypes) : null;

  return inventory.channels
    .filter((channel) => !allowed || allowed.has(channel.type))
    .map((channel) => ({
      value: channel.id,
      label: `#${channel.name}`,
      type: channel.type,
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

export function getCategoryOptions(inventory: GuildInventory) {
  return inventory.categories
    .map((category) => ({
      value: category.id,
      label: category.label,
      description: category.description,
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

export function getCommandOptions(inventory: GuildInventory) {
  return inventory.commands
    .map((command) => ({
      value: command.name,
      label: command.label,
      category: command.category,
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
}
