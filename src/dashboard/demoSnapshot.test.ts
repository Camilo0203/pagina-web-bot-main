import { describe, expect, it } from 'vitest';
import { applyDemoTicketAction, createDemoSnapshot } from './demoSnapshot';

describe('demoSnapshot', () => {
  it('marca una recomendacion como aplicada cuando se confirma desde el inbox demo', () => {
    const snapshot = createDemoSnapshot();

    const next = applyDemoTicketAction(snapshot, 'confirm_recommendation', {
      ticketId: '1042',
      recommendationId: '1042_sla_escalation',
      runId: 'run_1042_sla_escalation',
    });

    expect(
      next.playbooks.recommendations.find((recommendation) => recommendation.recommendationId === '1042_sla_escalation')?.status,
    ).toBe('applied');
    expect(
      next.playbooks.runs.find((run) => run.runId === 'run_1042_sla_escalation')?.status,
    ).toBe('applied');
  });

  it('actualiza el ticket demo al subir prioridad desde una recomendacion', () => {
    const snapshot = createDemoSnapshot();

    const next = applyDemoTicketAction(snapshot, 'set_priority', {
      ticketId: '1042',
      priority: 'urgent',
      recommendationId: '1042_sla_escalation',
    });

    expect(next.ticketWorkspace.inbox.find((ticket) => ticket.ticketId === '1042')?.priority).toBe('urgent');
    expect(
      next.playbooks.recommendations.find((recommendation) => recommendation.recommendationId === '1042_sla_escalation')?.status,
    ).toBe('applied');
  });
});
