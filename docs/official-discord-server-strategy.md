# TON618 Official Discord Strategy

Base profesional para el Discord oficial de TON618, orientada a soporte, onboarding y crecimiento comercial.

## 1. Operating Principles

- Keep the server compact during soft launch. Public structure should feel clear in under 30 seconds.
- Use bilingual copy in read-only channels, but separate active support by language to avoid messy threads.
- Make Discord itself part of the product demo. If TON618 is strong in tickets, workflows and structured setup, the official server should visibly use that model.
- Route every interaction toward one of four outcomes: understand the product, complete setup, report friction, or request a pilot.
- Avoid channel sprawl early. Add more surfaces only after traffic proves the need.

## 2. Recommended Server Structure

### Category: START HERE

| Channel | Type | Purpose | Notes |
| --- | --- | --- | --- |
| `#welcome` | Text, read-only | First impression, what TON618 is, where to go next | Bilingual message pinned |
| `#choose-language` | Text or onboarding entry | Let users self-select `English` or `Español` roles | Prefer Discord onboarding if available |
| `#start-here` | Text, read-only | Fast path: invite -> choose bot language -> run `/setup` -> activate `/ticket` and `/verify` | Bilingual checklist |
| `#bot-status` | Text, read-only | Link status page, incidents, degraded modules | Helps reduce duplicate support questions |

### Category: PRODUCT

| Channel | Type | Purpose | Notes |
| --- | --- | --- | --- |
| `#announcements` | Text, read-only | Major launches, fixes, milestones, rollout notices | One post per update, EN first then ES |
| `#changelog` | Text, read-only | Smaller shipping updates and product changes | Short, factual, frequent |
| `#docs-and-guides` | Text, read-only | Link docs, onboarding, setup, troubleshooting | Pin the top 5 links only |
| `#why-ton618` | Text, read-only | Product positioning: tickets, verification, staff workflows, SLA/stats, structured config | Good for conversion and clarity |

### Category: SUPPORT

| Channel | Type | Purpose | Notes |
| --- | --- | --- | --- |
| `#setup-help` | Forum | Help with invite, permissions, `/setup`, language selection, initial rollout | Use tags: `setup`, `permissions`, `verification`, `tickets`, `dashboard` |
| `#support-en` | Forum or text + threads | English support | Use when users want conversational help |
| `#soporte-es` | Forum or text + threads | Soporte en español | Same workflow as EN |
| `#known-issues` | Text, read-only | Active bugs, workarounds, incident references | Updated by staff only |
| `#open-private-ticket` | Text with button/panel | Escalation path for sensitive cases | Good place to dogfood TON618 tickets |

### Category: FEEDBACK

| Channel | Type | Purpose | Notes |
| --- | --- | --- | --- |
| `#bug-reports` | Forum | Structured bug intake | Tags: `new`, `confirmed`, `needs-info`, `fixed`, `high-priority` |
| `#feature-requests` | Forum | Structured product requests | Tags: `under-review`, `planned`, `not-now`, `shipped` |
| `#community-feedback` | Text or forum | Broader qualitative feedback and friction reports | For opinions that are not bugs or features |

### Category: PILOTS & GROWTH

| Channel | Type | Purpose | Notes |
| --- | --- | --- | --- |
| `#pilot-servers` | Forum | Pilot applications from serious communities | Tags: `new`, `screening`, `accepted`, `active`, `closed` |
| `#case-studies` | Text, read-only | Wins, measurable outcomes, rollout examples | Social proof |
| `#contact-team` | Text | Sales, partnerships, enterprise or migration conversations | Route high-intent leads fast |

### Category: COMMUNITY

| Channel | Type | Purpose | Notes |
| --- | --- | --- | --- |
| `#introductions` | Text | Let server owners/admins describe their communities | Good for relationship building |
| `#show-your-setup` | Text | Share how servers use tickets, verification or workflows | Creates adoption pull |

### Category: STAFF OPS (Private)

| Channel | Type | Purpose | Notes |
| --- | --- | --- | --- |
| `#triage` | Private text | Daily support triage and assignments | Staff only |
| `#bug-intake` | Private text | Internal bug review and escalation to engineering | Link to forum posts |
| `#pilot-review` | Private text | Review pilot applications and commercial fit | Product + community + founder |
| `#incident-room` | Private text/voice | High-priority issue coordination | Used only during incidents |

## 3. Recommended Roles

### Core team roles

- `@Founder / Product Lead`: owner voice, roadmap, public trust.
- `@TON618 Staff`: general staff badge for active team members.
- `@Support EN`: owns English support surfaces.
- `@Soporte ES`: owns Spanish support surfaces.
- `@Bug Triage`: confirms repro steps, severity and next action.
- `@Pilot Manager`: screens pilot servers and follows adoption.
- `@Engineering`: joins only when technical escalation is needed.
- `@Announcements`: optional ping role for users who want product updates.

### Community segmentation roles

- `@English`: unlocks or highlights English support areas.
- `@Español`: unlocks or highlights Spanish support areas.
- `@Server Owner`
- `@Admin / Mod`
- `@Pilot Server`
- `@Customer` or `@Active Server`

### Permissions guidance

- Keep `#welcome`, `#start-here`, `#announcements`, `#changelog`, `#docs-and-guides`, `#known-issues`, and `#case-studies` staff-post only.
- Let `@English` and `@Español` guide channel visibility only if the split helps navigation. Do not hide essential onboarding content behind language roles.
- Restrict pilot review and bug triage to staff. Public users should see outcome, not internal debate.

## 4. Official Server Onboarding Flow

### Recommended flow

1. User joins and lands in `#welcome`.
2. User chooses `English` or `Español` in `#choose-language` or via Discord onboarding.
3. User reads `#start-here` and follows the product path:
   - Invite TON618
   - Choose server language during onboarding
   - Run `/setup`
   - Activate `/ticket`
   - Activate `/verify`
   - Use `/staff`, `/stats`, `/config center`, `/audit`, `/debug` as needed
4. If blocked, user goes to `#setup-help`, `#support-en`, or `#soporte-es`.
5. If behavior looks broken, user posts in `#bug-reports`.
6. If the server is serious about rollout or migration, user applies in `#pilot-servers`.

### Language strategy

- For soft launch, keep one shared `#welcome`, `#start-here`, `#announcements`, and `#changelog` with EN + ES in the same post.
- Split live conversations by language only where it matters: support and open discussion.
- Once volume grows, you can duplicate read-only announcement surfaces, but do not start there unless activity already justifies it.

## 5. Tone, Rules and Service Guidelines

### Staff tone

- Calm, specific, professional.
- Friendly without sounding casual or improvised.
- Always give the next action, not just an answer.
- Mirror the user language whenever possible.
- Avoid blame, defensiveness or vague replies like "it should work."

### Staff response standards

- First response in public support: within 2 business hours ideal, within 12 hours maximum.
- First triage on bug reports: within 24 hours.
- Pilot application acknowledgement: within 1 business day.
- Pilot qualification decision: within 2 business days.
- Incident acknowledgement in `#announcements` or `#known-issues`: within 30 minutes of confirmed widespread impact.

### Support operating rules

- Start with clarification, then give steps, then confirm outcome.
- Move sensitive information to a private ticket quickly.
- If staff cannot reproduce a problem, say so clearly and request the exact missing data.
- Close loops publicly when possible so the server learns from solved issues.
- When a fix ships, link the original bug thread and the changelog entry.

### Bug report structure

Required fields:

- Summary
- What you expected
- What happened instead
- Steps to reproduce
- Server language
- Module or command affected
- Screenshots or logs
- Severity

Optional but high value:

- Server size
- Server ID
- Approximate timestamp and timezone
- Whether issue is consistent or intermittent

### Feature request structure

Required fields:

- Problem to solve
- Current workaround
- Desired behavior
- Who is impacted
- Why this matters now

Helpful additions:

- Example command or workflow
- Whether this is needed for one server or many
- Whether this would replace another tool

### Handling hard feedback without losing brand trust

Use this framework:

1. Acknowledge the friction clearly.
2. Restate the issue in concrete terms.
3. Ask only for the missing evidence needed to move forward.
4. Commit to a next step with a timeframe.
5. Close the loop when there is an update.

Never do this:

- Argue in public over who is right.
- Dismiss feedback because it is emotional.
- Promise a ship date before the issue is scoped.
- Blame user setup without checking evidence.

Recommended phrasing:

- EN: "Thanks for flagging this. I can see why that rollout would feel risky. I want to verify the exact failure point and then give you a clear next step today."
- ES: "Gracias por señalarlo. Entiendo por qué ese rollout se siente riesgoso. Voy a validar el punto exacto de fallo y darte un siguiente paso claro hoy."

## 6. Ready-To-Paste Copy

### 6.1 `#welcome`

#### English

```md
# Welcome to TON618

TON618 is a bilingual Discord operations bot built for teams that need structure, not chaos.

What you can use today:
- Tickets
- Verification
- Staff workflows
- SLA and stats visibility
- Structured server configuration

Start here:
1. Pick your language in #choose-language
2. Read #start-here
3. Ask setup questions in #setup-help
4. Use #support-en or #soporte-es if you get blocked
5. Post bugs in #bug-reports
6. Apply in #pilot-servers if your community wants guided rollout

If you are testing TON618 for a real server, tell us what kind of community you run. That helps us guide you faster.
```

#### Español

```md
# Bienvenido a TON618

TON618 es un bot bilingüe de operaciones para Discord, pensado para equipos que necesitan estructura, no improvisación.

Lo que puedes usar hoy:
- Tickets
- Verificación
- Flujos de staff
- Visibilidad de SLA y métricas
- Configuración estructurada del servidor

Empieza aquí:
1. Elige tu idioma en #choose-language
2. Lee #start-here
3. Haz preguntas de setup en #setup-help
4. Usa #support-en o #soporte-es si te bloqueas
5. Reporta bugs en #bug-reports
6. Aplica en #pilot-servers si tu comunidad quiere un rollout guiado

Si estás evaluando TON618 para un servidor real, cuéntanos qué tipo de comunidad gestionas. Eso nos ayuda a orientarte mejor.
```

### 6.2 `#choose-language`

#### English

```md
# Choose your language

Pick the language you want to use in the official TON618 server:
- English
- Español

This helps us route support faster and keep discussions clear.

Important:
- TON618 also supports English and Spanish inside the bot
- During product onboarding, each server chooses its operating language
- You can still view shared announcements and product updates
```

#### Español

```md
# Elige tu idioma

Selecciona el idioma que quieres usar dentro del servidor oficial de TON618:
- English
- Español

Esto nos ayuda a enrutar el soporte más rápido y mantener las conversaciones claras.

Importante:
- TON618 también soporta English y Español dentro del bot
- Durante el onboarding del producto, cada servidor elige su idioma operativo
- Igual podrás ver anuncios y actualizaciones compartidas
```

### 6.3 `#start-here`

#### English

```md
# Start with TON618

TON618 works best with a simple rollout order:

1. Invite the bot to your server
2. Choose the server language during onboarding
3. Run `/setup`
4. Enable `/ticket`
5. Enable `/verify`
6. Use `/staff` for daily execution
7. Use `/stats`, `/config center`, `/audit`, and `/debug` when admins need visibility or control

Need help?
- Setup questions: #setup-help
- English support: #support-en
- Spanish support: #soporte-es
- Known issues: #known-issues
- Bug reports: #bug-reports

Best practice:
Do not publish member-facing flows until setup, permissions, and language are confirmed.
```

#### Español

```md
# Empieza con TON618

TON618 funciona mejor con un orden de rollout simple:

1. Invita el bot a tu servidor
2. Elige el idioma del servidor durante el onboarding
3. Ejecuta `/setup`
4. Activa `/ticket`
5. Activa `/verify`
6. Usa `/staff` para la operación diaria
7. Usa `/stats`, `/config center`, `/audit` y `/debug` cuando admins necesiten visibilidad o control

¿Necesitas ayuda?
- Preguntas de setup: #setup-help
- Soporte en inglés: #support-en
- Soporte en español: #soporte-es
- Problemas conocidos: #known-issues
- Reporte de bugs: #bug-reports

Buena práctica:
No publiques flujos visibles para miembros hasta confirmar setup, permisos e idioma.
```

### 6.4 `#announcements` intro

#### English

```md
# TON618 Announcements

This channel is for major product updates, launches, important fixes, rollout notices, and incident communication.

What to expect here:
- New features that change how teams operate
- Important bug fixes
- Rollout and migration guidance
- Public incident updates

For smaller product updates, check #changelog.
For active support, use #support-en or #soporte-es.
```

#### Español

```md
# Anuncios de TON618

Este canal es para actualizaciones importantes del producto, lanzamientos, fixes relevantes, avisos de rollout y comunicación de incidentes.

Qué verás aquí:
- Nuevas funciones que cambian la operación del equipo
- Fixes importantes
- Guías de rollout y migración
- Actualizaciones públicas sobre incidentes

Para cambios más pequeños, revisa #changelog.
Para soporte activo, usa #support-en o #soporte-es.
```

### 6.5 Support channel intro

#### English

```md
# Need help?

Use this area for setup questions, rollout blockers, permissions issues, command behavior, and troubleshooting.

Before posting:
1. Check #start-here
2. Review #docs-and-guides
3. Check #known-issues

When asking for help, include:
- What you are trying to do
- Which command or module is affected
- What you expected
- What happened instead
- Screenshots or logs if available
- Whether your server is using English or Spanish

If the case includes sensitive data, use #open-private-ticket.
```

#### Español

```md
# ¿Necesitas ayuda?

Usa esta zona para preguntas de setup, bloqueos de rollout, problemas de permisos, comportamiento de comandos y troubleshooting.

Antes de publicar:
1. Revisa #start-here
2. Mira #docs-and-guides
3. Consulta #known-issues

Cuando pidas ayuda, incluye:
- Qué estás intentando hacer
- Qué comando o módulo está afectado
- Qué esperabas
- Qué ocurrió en realidad
- Screenshots o logs si los tienes
- Si tu servidor está usando English o Español

Si el caso incluye información sensible, usa #open-private-ticket.
```

### 6.6 Bug report template

#### English

```md
## Bug Summary

Short description:

## Expected Behavior

What should have happened?

## Actual Behavior

What happened instead?

## Steps to Reproduce

1.
2.
3.

## Environment

- Server language:
- Affected module or command:
- Approximate time and timezone:
- Server size:

## Evidence

- Screenshots:
- Logs:
- Extra notes:

## Severity

- Low
- Medium
- High
- Critical
```

#### Español

```md
## Resumen del bug

Descripción breve:

## Comportamiento esperado

¿Qué debería haber pasado?

## Comportamiento real

¿Qué pasó en su lugar?

## Pasos para reproducir

1.
2.
3.

## Entorno

- Idioma del servidor:
- Módulo o comando afectado:
- Hora aproximada y zona horaria:
- Tamaño del servidor:

## Evidencia

- Screenshots:
- Logs:
- Notas adicionales:

## Severidad

- Baja
- Media
- Alta
- Crítica
```

### 6.7 Feature request template

#### English

```md
## Request Title

Short name for the request:

## Problem

What problem are you trying to solve?

## Current Workaround

How are you handling this today?

## Desired Behavior

What should TON618 do?

## Who Benefits

Which teams or server types would use this?

## Why Now

Why is this important for your rollout or operation?

## Extra Context

Examples, screenshots, competing tools, or command ideas:
```

#### Español

```md
## Título de la solicitud

Nombre corto de la solicitud:

## Problema

¿Qué problema estás intentando resolver?

## Solución actual

¿Cómo lo estás resolviendo hoy?

## Comportamiento deseado

¿Qué debería hacer TON618?

## Quién se beneficia

¿Qué equipos o tipos de servidor usarían esto?

## Por qué ahora

¿Por qué es importante para tu rollout u operación?

## Contexto extra

Ejemplos, screenshots, herramientas alternativas o ideas de comandos:
```

### 6.8 Pilot application template

#### English

```md
## Server Overview

- Server name:
- Community type:
- Approximate member count:
- Primary language:

## What You Need

- Are you evaluating tickets, verification, staff workflows, stats, or structured configuration?
- What is the main problem you want to solve?

## Current Stack

- What bots or workflows are you using today?
- Are you migrating from another solution?

## Rollout Readiness

- Do you already have staff assigned?
- Do you have target channels and roles in mind?
- Are you ready to test within the next 7 days?

## Success Criteria

- What would make this pilot a success for your team?

## Contact

- Discord handle:
- Best timezone:
```

#### Español

```md
## Resumen del servidor

- Nombre del servidor:
- Tipo de comunidad:
- Número aproximado de miembros:
- Idioma principal:

## Qué necesitas

- ¿Estás evaluando tickets, verificación, flujos de staff, métricas o configuración estructurada?
- ¿Cuál es el principal problema que quieres resolver?

## Stack actual

- ¿Qué bots o workflows usan hoy?
- ¿Están migrando desde otra solución?

## Preparación para el rollout

- ¿Ya tienen staff asignado?
- ¿Ya tienen en mente canales y roles objetivo?
- ¿Pueden probar dentro de los próximos 7 días?

## Criterios de éxito

- ¿Qué tendría que pasar para que este piloto sea exitoso para tu equipo?

## Contacto

- Usuario de Discord:
- Mejor zona horaria:
```

## 7. Support Flow

### Public flow

1. User posts in `#setup-help`, `#support-en`, or `#soporte-es`.
2. Staff replies with:
   - acknowledgement
   - clarification question if needed
   - next action
3. If issue is reproducible and likely product-side, staff links or moves user to `#bug-reports`.
4. If issue is sensitive, staff moves case to `#open-private-ticket`.
5. Once solved, staff closes with a short public summary and docs link if relevant.

### Internal triage flow

1. Support assigns one owner in `#triage`.
2. If bug:
   - classify severity
   - check repro
   - update public forum tag
   - escalate to `#bug-intake` if needed
3. If high-intent lead:
   - tag `@Pilot Manager`
   - move to `#pilot-servers` if not already there
   - confirm next meeting or test milestone
4. If recurring question:
   - add doc or canned answer
   - link it in future support replies

## 8. Soft Launch Recommendations

- Launch with the compact structure above. Do not start with too many social channels.
- Seed the server before inviting traffic:
  - 1 welcome post
  - 1 start-here checklist
  - 3 to 5 docs links
  - 1 known-issues post
  - 2 example bug reports
  - 2 example feature requests
  - 1 pilot application example
- Use forum channels for `#setup-help`, `#bug-reports`, `#feature-requests`, and `#pilot-servers` so conversations stay organized.
- Dogfood TON618 by using a support ticket panel for escalations and private cases.
- Define a weekly review cadence:
  - top support blockers
  - top requested features
  - top reported bugs
  - pilot pipeline status
  - time-to-first-response
- Track conversion metrics from the server:
  - joins
  - language selection
  - invite clicks
  - setup help requests
  - bug reports
  - pilot applications
  - activated servers
- Keep one owner per area:
  - support
  - bugs
  - product feedback
  - pilots
- During soft launch, prioritize speed and clarity over perfection. A fast, consistent human response will build more trust than a large but empty server.

## 9. Suggested First Version

If you want the lightest high-signal setup for launch week, start with:

- `#welcome`
- `#choose-language`
- `#start-here`
- `#announcements`
- `#changelog`
- `#docs-and-guides`
- `#setup-help`
- `#support-en`
- `#soporte-es`
- `#known-issues`
- `#bug-reports`
- `#feature-requests`
- `#pilot-servers`
- `#open-private-ticket`

This gives TON618 a professional support and growth base without overbuilding too early.
