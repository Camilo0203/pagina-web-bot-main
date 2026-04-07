# Pricing Page - UX/UI Design Specification
## TON618 Bot Premium Plans

**Fecha:** 2026-04-06  
**Objetivo:** Vender premium de forma clara, dar confianza, soportar i18n  
**Estado:** Especificación Completa para Implementación

---

## 📋 Tabla de Contenidos

1. [Estructura de la Página](#estructura-de-la-página)
2. [Secciones Detalladas](#secciones-detalladas)
3. [Copy Bilingüe](#copy-bilingüe)
4. [Tabla Comparativa](#tabla-comparativa)
5. [CTAs y Flujos](#ctas-y-flujos)
6. [FAQ](#faq)
7. [Trust Signals](#trust-signals)
8. [Mobile UX](#mobile-ux)
9. [Estados y Mensajes](#estados-y-mensajes)

---

## 1. Estructura de la Página

### **Layout General**

```
┌─────────────────────────────────────────────┐
│           NAVBAR (sticky)                   │
│  Logo | Features | Pricing | Dashboard      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         HERO SECTION                        │
│  - Headline principal                       │
│  - Subheadline                              │
│  - Trust badges                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         PRICING CARDS (3 columns)           │
│  [Pro Monthly] [Pro Yearly] [Lifetime]      │
│  - Badge "BEST VALUE" en Yearly             │
│  - Badge "UNLIMITED" en Lifetime            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         COMPARISON TABLE                    │
│  Feature-by-feature comparison              │
│  Free vs Pro Monthly vs Pro Yearly vs Life  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         DONATION SECTION                    │
│  - Separate CTA for donations               │
│  - Clear message: "No premium features"     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         TRUST SIGNALS                       │
│  - Secure checkout badge                    │
│  - Lemon Squeezy logo                       │
│  - Cancel anytime                           │
│  - Money-back guarantee                     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         FAQ SECTION                         │
│  - 8-10 common questions                    │
│  - Expandable accordion                     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         FINAL CTA                           │
│  - "Ready to upgrade?"                      │
│  - Button to scroll to pricing              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         FOOTER                              │
│  Links | Support | Legal                    │
└─────────────────────────────────────────────┘
```

---

## 2. Secciones Detalladas

### **2.1 Hero Section**

**Objetivo:** Captar atención y establecer valor inmediatamente

```tsx
<HeroSection>
  <Headline>
    EN: "Unlock the Full Power of TON618 Bot"
    ES: "Desbloquea Todo el Poder de TON618 Bot"
  </Headline>
  
  <Subheadline>
    EN: "Advanced moderation, custom commands, and priority support for serious server management"
    ES: "Moderación avanzada, comandos personalizados y soporte prioritario para gestión seria de servidores"
  </Subheadline>
  
  <TrustBadges>
    - "🔒 Secure Checkout"
    - "⚡ Instant Activation"
    - "💳 Powered by Lemon Squeezy"
    - "✅ 7-Day Money-Back Guarantee"
  </TrustBadges>
  
  <CTAButton>
    EN: "View Plans"
    ES: "Ver Planes"
    → Smooth scroll to pricing cards
  </CTAButton>
</HeroSection>
```

**Diseño Visual:**
- Background: Gradient from slate-950 via indigo-950 to slate-950
- Headline: 4xl-6xl font, gradient text (indigo-400 to purple-400)
- Trust badges: Horizontal row, icons + text
- CTA: Large button, indigo-600, hover effect

---

### **2.2 Pricing Cards**

**Objetivo:** Mostrar planes claramente con diferenciación visual

```tsx
<PricingCards>
  <PlanCard type="monthly">
    <Icon>⚡</Icon>
    <Name>Pro Monthly</Name>
    <Description>
      EN: "Perfect for trying out premium features"
      ES: "Perfecto para probar las funciones premium"
    </Description>
    <Price>$9.99<span>/month</span></Price>
    <Features>
      - Up to 50 custom commands
      - 20 auto-role configurations
      - 10 welcome message templates
      - Advanced moderation tools
      - Custom embed builder
      - Priority support
      - Server analytics dashboard
      - Cancel anytime
    </Features>
    <CTAButton>
      EN: "Get Started"
      ES: "Comenzar"
    </CTAButton>
  </PlanCard>
  
  <PlanCard type="yearly" highlighted>
    <Badge>BEST VALUE</Badge>
    <Icon>👑</Icon>
    <Name>Pro Yearly</Name>
    <Description>
      EN: "Save 17% with annual billing"
      ES: "Ahorra 17% con facturación anual"
    </Description>
    <Price>$99.99<span>/year</span></Price>
    <Savings>Save $20/year</Savings>
    <Features>
      - Everything in Monthly
      - Save $20 per year
      - Priority feature requests
      - Early access to new features
      - Dedicated support channel
      - Custom bot status (coming soon)
      - Advanced analytics
      - Yearly billing
    </Features>
    <CTAButton>
      EN: "Get Started"
      ES: "Comenzar"
    </CTAButton>
  </PlanCard>
  
  <PlanCard type="lifetime">
    <Badge>UNLIMITED</Badge>
    <Icon>✨</Icon>
    <Name>Lifetime</Name>
    <Description>
      EN: "One-time payment, forever access"
      ES: "Pago único, acceso para siempre"
    </Description>
    <Price>$299.99<span>one-time</span></Price>
    <Features>
      - Everything in Pro
      - 100 custom commands
      - 50 auto-role configurations
      - 20 welcome message templates
      - Lifetime updates
      - VIP support
      - Exclusive features
      - No recurring payments
      - Priority bug fixes
    </Features>
    <CTAButton>
      EN: "Get Lifetime Access"
      ES: "Obtener Acceso de por Vida"
    </CTAButton>
  </PlanCard>
</PricingCards>
```

**Diseño Visual:**
- Cards: rounded-2xl, backdrop-blur, border
- Highlighted card (Yearly): Gradient background, larger scale, ring
- Icons: Large, colorful, top of card
- Price: 4xl font, bold
- Features: Checkmarks, left-aligned list
- CTA: Full-width button, prominent

---

### **2.3 Comparison Table**

**Objetivo:** Mostrar diferencias claras entre planes

```tsx
<ComparisonTable>
  <Header>
    <Column>Feature</Column>
    <Column>Free</Column>
    <Column>Pro Monthly</Column>
    <Column>Pro Yearly</Column>
    <Column>Lifetime</Column>
  </Header>
  
  <Section title="Commands & Automation">
    <Row>
      <Feature>Custom Commands</Feature>
      <Value>5</Value>
      <Value>50</Value>
      <Value>50</Value>
      <Value>100</Value>
    </Row>
    <Row>
      <Feature>Auto-Role Configurations</Feature>
      <Value>3</Value>
      <Value>20</Value>
      <Value>20</Value>
      <Value>50</Value>
    </Row>
    <Row>
      <Feature>Welcome Message Templates</Feature>
      <Value>1</Value>
      <Value>10</Value>
      <Value>10</Value>
      <Value>20</Value>
    </Row>
  </Section>
  
  <Section title="Moderation">
    <Row>
      <Feature>Basic Moderation</Feature>
      <Value>✅</Value>
      <Value>✅</Value>
      <Value>✅</Value>
      <Value>✅</Value>
    </Row>
    <Row>
      <Feature>Advanced Moderation Tools</Feature>
      <Value>❌</Value>
      <Value>✅</Value>
      <Value>✅</Value>
      <Value>✅</Value>
    </Row>
    <Row>
      <Feature>Auto-Moderation Rules</Feature>
      <Value>❌</Value>
      <Value>✅</Value>
      <Value>✅</Value>
      <Value>✅</Value>
    </Row>
  </Section>
  
  <Section title="Customization">
    <Row>
      <Feature>Custom Embeds</Feature>
      <Value>❌</Value>
      <Value>✅</Value>
      <Value>✅</Value>
      <Value>✅</Value>
    </Row>
    <Row>
      <Feature>Custom Bot Status</Feature>
      <Value>❌</Value>
      <Value>❌</Value>
      <Value>Coming Soon</Value>
      <Value>✅</Value>
    </Row>
  </Section>
  
  <Section title="Support & Analytics">
    <Row>
      <Feature>Community Support</Feature>
      <Value>✅</Value>
      <Value>✅</Value>
      <Value>✅</Value>
      <Value>✅</Value>
    </Row>
    <Row>
      <Feature>Priority Support</Feature>
      <Value>❌</Value>
      <Value>✅</Value>
      <Value>✅</Value>
      <Value>✅ VIP</Value>
    </Row>
    <Row>
      <Feature>Server Analytics</Feature>
      <Value>❌</Value>
      <Value>✅</Value>
      <Value>✅ Advanced</Value>
      <Value>✅ Advanced</Value>
    </Row>
  </Section>
  
  <Section title="Billing">
    <Row>
      <Feature>Price</Feature>
      <Value>Free</Value>
      <Value>$9.99/mo</Value>
      <Value>$99.99/yr</Value>
      <Value>$299.99 once</Value>
    </Row>
    <Row>
      <Feature>Billing Cycle</Feature>
      <Value>-</Value>
      <Value>Monthly</Value>
      <Value>Yearly</Value>
      <Value>One-time</Value>
    </Row>
    <Row>
      <Feature>Cancel Anytime</Feature>
      <Value>-</Value>
      <Value>✅</Value>
      <Value>✅</Value>
      <Value>N/A</Value>
    </Row>
  </Section>
</ComparisonTable>
```

**Diseño Visual:**
- Table: Responsive, sticky header on scroll
- Highlighted column (Yearly): Subtle background color
- Checkmarks: Green for yes, red X for no
- Mobile: Horizontal scroll or accordion view

---

### **2.4 Donation Section**

**Objetivo:** Ofrecer opción de donar sin confundir con premium

```tsx
<DonationSection>
  <Container>
    <Icon>❤️</Icon>
    <Headline>
      EN: "Support TON618 Development"
      ES: "Apoya el Desarrollo de TON618"
    </Headline>
    <Description>
      EN: "Love TON618 Bot? Consider making a donation to support ongoing development and server costs. Every contribution helps us build better features for the community!"
      ES: "¿Te encanta TON618 Bot? Considera hacer una donación para apoyar el desarrollo continuo y los costos del servidor. ¡Cada contribución nos ayuda a construir mejores funciones para la comunidad!"
    </Description>
    <Disclaimer>
      EN: "Note: Donations do not activate premium features"
      ES: "Nota: Las donaciones no activan funciones premium"
    </Disclaimer>
    <CTAButton>
      EN: "Make a Donation ❤️"
      ES: "Hacer una Donación ❤️"
    </CTAButton>
  </Container>
</DonationSection>
```

**Diseño Visual:**
- Background: Gradient pink-500/10 to purple-500/10
- Border: Pink-500/20
- Icon: Large heart emoji
- Disclaimer: Smaller text, muted color
- CTA: Pink to purple gradient

---

### **2.5 Trust Signals**

**Objetivo:** Dar confianza y reducir fricción

```tsx
<TrustSignals>
  <Signal>
    <Icon>🔒</Icon>
    <Title>
      EN: "Secure Checkout"
      ES: "Pago Seguro"
    </Title>
    <Description>
      EN: "All payments are processed securely through Lemon Squeezy"
      ES: "Todos los pagos se procesan de forma segura a través de Lemon Squeezy"
    </Description>
  </Signal>
  
  <Signal>
    <Icon>🔄</Icon>
    <Title>
      EN: "Cancel Anytime"
      ES: "Cancela en Cualquier Momento"
    </Title>
    <Description>
      EN: "For subscriptions, cancel anytime with no questions asked"
      ES: "Para suscripciones, cancela en cualquier momento sin preguntas"
    </Description>
  </Signal>
  
  <Signal>
    <Icon>💰</Icon>
    <Title>
      EN: "Money-Back Guarantee"
      ES: "Garantía de Devolución"
    </Title>
    <Description>
      EN: "7-day money-back guarantee on all purchases"
      ES: "Garantía de devolución de 7 días en todas las compras"
    </Description>
  </Signal>
  
  <Signal>
    <Icon>⚡</Icon>
    <Title>
      EN: "Instant Activation"
      ES: "Activación Instantánea"
    </Title>
    <Description>
      EN: "Premium features activate within minutes of purchase"
      ES: "Las funciones premium se activan minutos después de la compra"
    </Description>
  </Signal>
</TrustSignals>

<PoweredBy>
  <Text>
    EN: "Billing powered by"
    ES: "Facturación por"
  </Text>
  <LemonSqueezyLogo />
</PoweredBy>
```

**Diseño Visual:**
- Grid: 2x2 on desktop, 1 column on mobile
- Icons: Large, colorful
- Background: Subtle card background
- Lemon Squeezy logo: Prominent, centered

---

## 3. Copy Bilingüe

### **3.1 Claves i18n (en.json)**

```json
{
  "pricing": {
    "hero": {
      "title": "Unlock the Full Power of TON618 Bot",
      "subtitle": "Advanced moderation, custom commands, and priority support for serious server management",
      "cta": "View Plans"
    },
    "plans": {
      "monthly": {
        "name": "Pro Monthly",
        "description": "Perfect for trying out premium features",
        "price": "$9.99",
        "interval": "month",
        "cta": "Get Started"
      },
      "yearly": {
        "name": "Pro Yearly",
        "description": "Save 17% with annual billing",
        "price": "$99.99",
        "interval": "year",
        "badge": "BEST VALUE",
        "savings": "Save $20/year",
        "cta": "Get Started"
      },
      "lifetime": {
        "name": "Lifetime",
        "description": "One-time payment, forever access",
        "price": "$299.99",
        "interval": "one-time",
        "badge": "UNLIMITED",
        "cta": "Get Lifetime Access"
      }
    },
    "features": {
      "custom_commands": "Custom Commands",
      "auto_roles": "Auto-Role Configurations",
      "welcome_messages": "Welcome Message Templates",
      "advanced_moderation": "Advanced Moderation Tools",
      "custom_embeds": "Custom Embed Builder",
      "priority_support": "Priority Support",
      "analytics": "Server Analytics Dashboard",
      "cancel_anytime": "Cancel anytime"
    },
    "donation": {
      "title": "Support TON618 Development",
      "description": "Love TON618 Bot? Consider making a donation to support ongoing development and server costs.",
      "disclaimer": "Note: Donations do not activate premium features",
      "cta": "Make a Donation ❤️"
    },
    "trust": {
      "secure": {
        "title": "Secure Checkout",
        "description": "All payments are processed securely through Lemon Squeezy"
      },
      "cancel": {
        "title": "Cancel Anytime",
        "description": "For subscriptions, cancel anytime with no questions asked"
      },
      "guarantee": {
        "title": "Money-Back Guarantee",
        "description": "7-day money-back guarantee on all purchases"
      },
      "instant": {
        "title": "Instant Activation",
        "description": "Premium features activate within minutes of purchase"
      }
    },
    "guild_selector": {
      "title": "Select a Server",
      "description": "Choose which server you want to upgrade to premium",
      "no_guilds": "No servers found where you have admin permissions",
      "already_premium": "This server already has premium",
      "proceed": "Proceed to Checkout"
    },
    "auth": {
      "required": "Sign in with Discord to continue",
      "sign_in": "Sign in with Discord",
      "loading": "Loading your servers..."
    },
    "errors": {
      "no_session": "Please sign in with Discord to purchase premium",
      "no_guild_selected": "Please select a server to upgrade",
      "guild_has_premium": "This server already has premium",
      "checkout_failed": "Failed to create checkout. Please try again.",
      "fetch_guilds_failed": "Failed to load your servers. Please try again."
    }
  }
}
```

### **3.2 Claves i18n (es.json)**

```json
{
  "pricing": {
    "hero": {
      "title": "Desbloquea Todo el Poder de TON618 Bot",
      "subtitle": "Moderación avanzada, comandos personalizados y soporte prioritario para gestión seria de servidores",
      "cta": "Ver Planes"
    },
    "plans": {
      "monthly": {
        "name": "Pro Mensual",
        "description": "Perfecto para probar las funciones premium",
        "price": "$9.99",
        "interval": "mes",
        "cta": "Comenzar"
      },
      "yearly": {
        "name": "Pro Anual",
        "description": "Ahorra 17% con facturación anual",
        "price": "$99.99",
        "interval": "año",
        "badge": "MEJOR VALOR",
        "savings": "Ahorra $20/año",
        "cta": "Comenzar"
      },
      "lifetime": {
        "name": "De por Vida",
        "description": "Pago único, acceso para siempre",
        "price": "$299.99",
        "interval": "único",
        "badge": "ILIMITADO",
        "cta": "Obtener Acceso de por Vida"
      }
    },
    "features": {
      "custom_commands": "Comandos Personalizados",
      "auto_roles": "Configuraciones de Auto-Roles",
      "welcome_messages": "Plantillas de Mensajes de Bienvenida",
      "advanced_moderation": "Herramientas de Moderación Avanzadas",
      "custom_embeds": "Constructor de Embeds Personalizados",
      "priority_support": "Soporte Prioritario",
      "analytics": "Panel de Análisis del Servidor",
      "cancel_anytime": "Cancela en cualquier momento"
    },
    "donation": {
      "title": "Apoya el Desarrollo de TON618",
      "description": "¿Te encanta TON618 Bot? Considera hacer una donación para apoyar el desarrollo continuo y los costos del servidor.",
      "disclaimer": "Nota: Las donaciones no activan funciones premium",
      "cta": "Hacer una Donación ❤️"
    },
    "trust": {
      "secure": {
        "title": "Pago Seguro",
        "description": "Todos los pagos se procesan de forma segura a través de Lemon Squeezy"
      },
      "cancel": {
        "title": "Cancela en Cualquier Momento",
        "description": "Para suscripciones, cancela en cualquier momento sin preguntas"
      },
      "guarantee": {
        "title": "Garantía de Devolución",
        "description": "Garantía de devolución de 7 días en todas las compras"
      },
      "instant": {
        "title": "Activación Instantánea",
        "description": "Las funciones premium se activan minutos después de la compra"
      }
    },
    "guild_selector": {
      "title": "Selecciona un Servidor",
      "description": "Elige qué servidor quieres actualizar a premium",
      "no_guilds": "No se encontraron servidores donde tengas permisos de administrador",
      "already_premium": "Este servidor ya tiene premium",
      "proceed": "Proceder al Pago"
    },
    "auth": {
      "required": "Inicia sesión con Discord para continuar",
      "sign_in": "Iniciar Sesión con Discord",
      "loading": "Cargando tus servidores..."
    },
    "errors": {
      "no_session": "Por favor inicia sesión con Discord para comprar premium",
      "no_guild_selected": "Por favor selecciona un servidor para actualizar",
      "guild_has_premium": "Este servidor ya tiene premium",
      "checkout_failed": "Error al crear el pago. Por favor intenta de nuevo.",
      "fetch_guilds_failed": "Error al cargar tus servidores. Por favor intenta de nuevo."
    }
  }
}
```

---

## 4. CTAs y Flujos

### **4.1 Flujo Principal (Premium Plans)**

```
User lands on /pricing
  ↓
Views pricing cards
  ↓
Clicks "Get Started" on a plan
  ↓
Check if authenticated
  ├─ NO → Show "Sign in with Discord" modal
  │         ↓
  │       User signs in
  │         ↓
  └─ YES → Show Guild Selector modal
            ↓
          User selects guild
            ↓
          Check if guild has premium
            ├─ YES → Show error "Already has premium"
            └─ NO → Create checkout
                      ↓
                    Redirect to Lemon Squeezy
                      ↓
                    User completes payment
                      ├─ Success → /billing/success
                      └─ Cancel → /billing/cancel
```

### **4.2 Flujo de Donación**

```
User clicks "Make a Donation"
  ↓
Check if authenticated
  ├─ NO → Allow anonymous donation
  │         ↓
  │       Create checkout (no guild_id, no user_id)
  │         ↓
  └─ YES → Create checkout (with user_id, no guild_id)
            ↓
          Redirect to Lemon Squeezy
            ↓
          User completes payment
            ├─ Success → /billing/success (donation variant)
            └─ Cancel → /billing/cancel
```

### **4.3 Estados de UI**

```tsx
// Estado 1: No autenticado
<PricingCard>
  <CTAButton onClick={handleSignIn}>
    Sign in with Discord
  </CTAButton>
</PricingCard>

// Estado 2: Autenticado, seleccionando plan
<PricingCard>
  <CTAButton onClick={() => setSelectedPlan('pro_monthly')}>
    Get Started
  </CTAButton>
</PricingCard>

// Estado 3: Plan seleccionado, mostrando guild selector
<GuildSelectorModal open={true}>
  <GuildList guilds={guilds} />
  <CTAButton onClick={handleProceedToCheckout}>
    Proceed to Checkout
  </CTAButton>
</GuildSelectorModal>

// Estado 4: Procesando checkout
<PricingCard>
  <CTAButton disabled loading>
    Creating Checkout...
  </CTAButton>
</PricingCard>

// Estado 5: Error
<Alert variant="error">
  {errorMessage}
</Alert>
```

---

## 5. FAQ Section

### **5.1 Preguntas Frecuentes**

```tsx
<FAQSection>
  <Headline>
    EN: "Frequently Asked Questions"
    ES: "Preguntas Frecuentes"
  </Headline>
  
  <FAQItem>
    <Question>
      EN: "How do I upgrade my server to premium?"
      ES: "¿Cómo actualizo mi servidor a premium?"
    </Question>
    <Answer>
      EN: "Simply select a plan above, sign in with Discord, choose your server, and complete the checkout. Premium features will be activated within minutes."
      ES: "Simplemente selecciona un plan arriba, inicia sesión con Discord, elige tu servidor y completa el pago. Las funciones premium se activarán en minutos."
    </Answer>
  </FAQItem>
  
  <FAQItem>
    <Question>
      EN: "Can I cancel my subscription anytime?"
      ES: "¿Puedo cancelar mi suscripción en cualquier momento?"
    </Question>
    <Answer>
      EN: "Yes! For monthly and yearly subscriptions, you can cancel anytime. Your premium features will remain active until the end of your billing period."
      ES: "¡Sí! Para suscripciones mensuales y anuales, puedes cancelar en cualquier momento. Tus funciones premium permanecerán activas hasta el final de tu período de facturación."
    </Answer>
  </FAQItem>
  
  <FAQItem>
    <Question>
      EN: "What's the difference between Lifetime and subscriptions?"
      ES: "¿Cuál es la diferencia entre De por Vida y las suscripciones?"
    </Question>
    <Answer>
      EN: "Lifetime is a one-time payment with no recurring charges. You get premium features forever. Subscriptions (monthly/yearly) require recurring payments but can be cancelled anytime."
      ES: "De por Vida es un pago único sin cargos recurrentes. Obtienes funciones premium para siempre. Las suscripciones (mensual/anual) requieren pagos recurrentes pero pueden cancelarse en cualquier momento."
    </Answer>
  </FAQItem>
  
  <FAQItem>
    <Question>
      EN: "Can I upgrade multiple servers?"
      ES: "¿Puedo actualizar múltiples servidores?"
    </Question>
    <Answer>
      EN: "Yes! Each server requires its own premium subscription. You can purchase premium for as many servers as you manage."
      ES: "¡Sí! Cada servidor requiere su propia suscripción premium. Puedes comprar premium para tantos servidores como administres."
    </Answer>
  </FAQItem>
  
  <FAQItem>
    <Question>
      EN: "Do donations activate premium features?"
      ES: "¿Las donaciones activan funciones premium?"
    </Question>
    <Answer>
      EN: "No, donations are separate from premium subscriptions. They support development but don't activate premium features. To get premium, purchase a Pro plan."
      ES: "No, las donaciones son separadas de las suscripciones premium. Apoyan el desarrollo pero no activan funciones premium. Para obtener premium, compra un plan Pro."
    </Answer>
  </FAQItem>
  
  <FAQItem>
    <Question>
      EN: "Is my payment information secure?"
      ES: "¿Mi información de pago es segura?"
    </Question>
    <Answer>
      EN: "Absolutely! All payments are processed through Lemon Squeezy, a trusted payment processor. We never store your payment information."
      ES: "¡Absolutamente! Todos los pagos se procesan a través de Lemon Squeezy, un procesador de pagos confiable. Nunca almacenamos tu información de pago."
    </Answer>
  </FAQItem>
  
  <FAQItem>
    <Question>
      EN: "What happens if I cancel my subscription?"
      ES: "¿Qué pasa si cancelo mi suscripción?"
    </Question>
    <Answer>
      EN: "Your premium features will remain active until the end of your current billing period. After that, your server will revert to the free plan."
      ES: "Tus funciones premium permanecerán activas hasta el final de tu período de facturación actual. Después de eso, tu servidor volverá al plan gratuito."
    </Answer>
  </FAQItem>
  
  <FAQItem>
    <Question>
      EN: "Can I get a refund?"
      ES: "¿Puedo obtener un reembolso?"
    </Question>
    <Answer>
      EN: "Yes! We offer a 7-day money-back guarantee on all purchases. Contact support if you're not satisfied."
      ES: "¡Sí! Ofrecemos una garantía de devolución de 7 días en todas las compras. Contacta a soporte si no estás satisfecho."
    </Answer>
  </FAQItem>
</FAQSection>
```

**Diseño Visual:**
- Accordion: Expandable items
- Icons: Chevron down/up
- Hover: Subtle background change
- Mobile: Full-width, easy to tap

---

## 6. Mobile UX

### **6.1 Adaptaciones Mobile**

```tsx
// Pricing Cards: Stack vertically
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {plans.map(plan => <PlanCard key={plan.key} {...plan} />)}
</div>

// Comparison Table: Horizontal scroll or accordion
<div className="overflow-x-auto md:overflow-visible">
  <ComparisonTable />
</div>

// Guild Selector: Full-screen modal on mobile
<Modal fullScreen={isMobile}>
  <GuildSelector />
</Modal>

// Trust Signals: 1 column on mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {trustSignals.map(signal => <TrustSignal key={signal.id} {...signal} />)}
</div>

// FAQ: Full-width accordion
<div className="w-full">
  <FAQAccordion items={faqItems} />
</div>
```

### **6.2 Touch Targets**

- Minimum button height: 44px
- Minimum tap target: 48x48px
- Spacing between interactive elements: 8px minimum
- CTA buttons: Full-width on mobile

### **6.3 Performance**

- Lazy load images below fold
- Use `loading="lazy"` for images
- Optimize hero section for LCP
- Minimize layout shift

---

## 7. Estados y Mensajes

### **7.1 Mensajes de Error**

```tsx
// Error: No autenticado
<Alert variant="error">
  <Icon>🔒</Icon>
  <Title>
    EN: "Authentication Required"
    ES: "Autenticación Requerida"
  </Title>
  <Message>
    EN: "Please sign in with Discord to purchase premium"
    ES: "Por favor inicia sesión con Discord para comprar premium"
  </Message>
  <CTAButton onClick={handleSignIn}>
    EN: "Sign in with Discord"
    ES: "Iniciar Sesión con Discord"
  </CTAButton>
</Alert>

// Error: No guild seleccionado
<Alert variant="warning">
  <Icon>⚠️</Icon>
  <Message>
    EN: "Please select a server to upgrade"
    ES: "Por favor selecciona un servidor para actualizar"
  </Message>
</Alert>

// Error: Guild ya tiene premium
<Alert variant="info">
  <Icon>✨</Icon>
  <Message>
    EN: "This server already has premium"
    ES: "Este servidor ya tiene premium"
  </Message>
</Alert>

// Error: Checkout falló
<Alert variant="error">
  <Icon>❌</Icon>
  <Message>
    EN: "Failed to create checkout. Please try again."
    ES: "Error al crear el pago. Por favor intenta de nuevo."
  </Message>
  <CTAButton onClick={handleRetry}>
    EN: "Try Again"
    ES: "Intentar de Nuevo"
  </CTAButton>
</Alert>

// Error: Fetch guilds falló
<Alert variant="error">
  <Icon>❌</Icon>
  <Message>
    EN: "Failed to load your servers. Please try again."
    ES: "Error al cargar tus servidores. Por favor intenta de nuevo."
  </Message>
  <CTAButton onClick={handleRefetch}>
    EN: "Reload"
    ES: "Recargar"
  </CTAButton>
</Alert>
```

### **7.2 Mensajes de Éxito**

```tsx
// Success Page (/billing/success)
<SuccessPage>
  <Icon>✅</Icon>
  <Headline>
    EN: "Payment Successful!"
    ES: "¡Pago Exitoso!"
  </Headline>
  <Message>
    EN: "Thank you for upgrading to TON618 Pro! Your premium features are being activated."
    ES: "¡Gracias por actualizar a TON618 Pro! Tus funciones premium se están activando."
  </Message>
  <NextSteps>
    <Step>
      EN: "Your premium features will be active within a few minutes"
      ES: "Tus funciones premium estarán activas en unos minutos"
    </Step>
    <Step>
      EN: "You'll receive a confirmation email from Lemon Squeezy"
      ES: "Recibirás un correo de confirmación de Lemon Squeezy"
    </Step>
    <Step>
      EN: "Access your server's dashboard to configure premium features"
      ES: "Accede al panel de tu servidor para configurar las funciones premium"
    </Step>
  </NextSteps>
  <CTAButton onClick={() => navigate('/dashboard')}>
    EN: "Go to Dashboard"
    ES: "Ir al Panel"
  </CTAButton>
</SuccessPage>
```

### **7.3 Mensajes de Cancelación**

```tsx
// Cancel Page (/billing/cancel)
<CancelPage>
  <Icon>⚠️</Icon>
  <Headline>
    EN: "Checkout Cancelled"
    ES: "Pago Cancelado"
  </Headline>
  <Message>
    EN: "No worries! Your checkout was cancelled and no charges were made."
    ES: "¡No te preocupes! Tu pago fue cancelado y no se realizaron cargos."
  </Message>
  <Benefits>
    <Benefit>
      EN: "Advanced moderation tools to keep your server safe"
      ES: "Herramientas de moderación avanzadas para mantener tu servidor seguro"
    </Benefit>
    <Benefit>
      EN: "Custom commands and auto-role configurations"
      ES: "Comandos personalizados y configuraciones de auto-roles"
    </Benefit>
    <Benefit>
      EN: "Priority support and early access to new features"
      ES: "Soporte prioritario y acceso anticipado a nuevas funciones"
    </Benefit>
  </Benefits>
  <CTAButton onClick={() => navigate('/pricing')}>
    EN: "Try Again"
    ES: "Intentar de Nuevo"
  </CTAButton>
</CancelPage>
```

---

## 8. Recomendaciones de Implementación

### **8.1 Componentes a Crear**

```
src/billing/components/
├── PricingHero.tsx
├── PlanCard.tsx
├── ComparisonTable.tsx
├── DonationSection.tsx
├── TrustSignals.tsx
├── FAQSection.tsx
├── GuildSelectorModal.tsx
└── AuthPrompt.tsx

src/billing/pages/
├── PricingPage.tsx
├── BillingSuccessPage.tsx
└── BillingCancelPage.tsx
```

### **8.2 Hooks a Crear**

```typescript
// usePricingFlow.ts
export function usePricingFlow() {
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);
  const [showGuildSelector, setShowGuildSelector] = useState(false);
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  
  const handlePlanSelect = async (planKey: PlanKey) => {
    // Logic here
  };
  
  const handleGuildSelect = (guildId: string) => {
    // Logic here
  };
  
  const handleProceedToCheckout = async () => {
    // Logic here
  };
  
  return {
    selectedPlan,
    showGuildSelector,
    selectedGuildId,
    processing,
    handlePlanSelect,
    handleGuildSelect,
    handleProceedToCheckout
  };
}
```

### **8.3 Animaciones**

```tsx
// Framer Motion animations
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate="visible"
>
  {plans.map(plan => (
    <motion.div key={plan.key} variants={cardVariants}>
      <PlanCard {...plan} />
    </motion.div>
  ))}
</motion.div>
```

---

## 9. Checklist de Implementación

### **UX/UI**
- [x] Estructura de página definida
- [x] Secciones detalladas
- [x] Copy bilingüe completo
- [x] Tabla comparativa
- [x] CTAs y flujos
- [x] FAQ section
- [x] Trust signals
- [x] Mobile UX
- [x] Estados y mensajes

### **Componentes**
- [ ] PricingHero
- [ ] PlanCard
- [ ] ComparisonTable
- [ ] DonationSection
- [ ] TrustSignals
- [ ] FAQSection
- [ ] GuildSelectorModal
- [ ] AuthPrompt

### **Páginas**
- [ ] PricingPage
- [ ] BillingSuccessPage
- [ ] BillingCancelPage

### **i18n**
- [ ] Claves en.json
- [ ] Claves es.json
- [ ] useTranslation en componentes

---

**Especificación completa lista para implementación.**

*Diseño UX/UI - 2026-04-06*
