import { z } from 'zod';

export const ticketWorkflowStatusSchema = z.enum([
  'new',
  'triage',
  'waiting_user',
  'waiting_staff',
  'escalated',
  'resolved',
  'closed',
]);

export const ticketQueueTypeSchema = z.enum(['support', 'community']);
export const ticketSlaStateSchema = z.enum(['healthy', 'warning', 'breached', 'paused', 'resolved']);
export const ticketEventVisibilitySchema = z.enum(['public', 'internal', 'system']);
export const ticketActorKindSchema = z.enum(['customer', 'staff', 'bot', 'system']);

export const ticketInboxItemSchema = z.object({
  guildId: z.string().min(1),
  ticketId: z.string().min(1),
  channelId: z.string().min(1),
  userId: z.string().min(1),
  userLabel: z.string().nullable(),
  workflowStatus: ticketWorkflowStatusSchema,
  queueType: ticketQueueTypeSchema,
  categoryId: z.string().nullable(),
  categoryLabel: z.string().min(1),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  subject: z.string().nullable(),
  claimedBy: z.string().nullable(),
  claimedByLabel: z.string().nullable(),
  assigneeId: z.string().nullable(),
  assigneeLabel: z.string().nullable(),
  claimedAt: z.string().nullable(),
  firstResponseAt: z.string().nullable(),
  resolvedAt: z.string().nullable(),
  closedAt: z.string().nullable(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  lastCustomerMessageAt: z.string().nullable(),
  lastStaffMessageAt: z.string().nullable(),
  lastActivityAt: z.string().nullable(),
  messageCount: z.number().int().nonnegative(),
  staffMessageCount: z.number().int().nonnegative(),
  reopenCount: z.number().int().nonnegative(),
  tags: z.array(z.string().min(1)),
  slaTargetMinutes: z.number().int().nonnegative(),
  slaDueAt: z.string().nullable(),
  slaState: ticketSlaStateSchema,
  isOpen: z.boolean(),
});

export const ticketConversationEventSchema = z.object({
  id: z.string().min(1),
  guildId: z.string().min(1),
  ticketId: z.string().min(1),
  channelId: z.string().nullable(),
  actorId: z.string().nullable(),
  actorKind: ticketActorKindSchema,
  actorLabel: z.string().nullable(),
  eventType: z.string().min(1),
  visibility: ticketEventVisibilitySchema,
  title: z.string().min(1),
  description: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.string().min(1),
});

export const ticketMacroSchema = z.object({
  macroId: z.string().min(1),
  guildId: z.string().min(1),
  label: z.string().min(1),
  content: z.string().min(1),
  visibility: z.enum(['public', 'internal']),
  sortOrder: z.number().int().nonnegative(),
  isSystem: z.boolean(),
});

export const ticketWorkspaceSchema = z.object({
  inbox: z.array(ticketInboxItemSchema),
  events: z.array(ticketConversationEventSchema),
  macros: z.array(ticketMacroSchema),
});
