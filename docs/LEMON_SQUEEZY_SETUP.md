# Lemon Squeezy Integration Setup Guide

Complete guide for setting up the TON618 Bot monetization system with Lemon Squeezy.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Lemon Squeezy Configuration](#lemon-squeezy-configuration)
3. [Supabase Configuration](#supabase-configuration)
4. [Bot Configuration](#bot-configuration)
5. [Frontend Configuration](#frontend-configuration)
6. [Testing](#testing)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Lemon Squeezy account (https://lemonsqueezy.com)
- Supabase project
- Discord Bot with OAuth2 configured
- Node.js 18+ for the bot
- React app deployed (ton618-web)

---

## Lemon Squeezy Configuration

### Step 1: Create Products

1. Go to **Products** in Lemon Squeezy dashboard
2. Create a new product: **TON618 Bot Pro**
3. Add product description and images

### Step 2: Create Variants

Create 4 variants under the TON618 Bot Pro product:

#### Variant 1: Pro Monthly
- **Type:** Subscription
- **Price:** $9.99 USD
- **Billing Interval:** Monthly
- **Trial:** Optional (7 days recommended)

#### Variant 2: Pro Yearly
- **Type:** Subscription
- **Price:** $99.99 USD
- **Billing Interval:** Yearly
- **Trial:** Optional (7 days recommended)

#### Variant 3: Lifetime
- **Type:** One-time payment
- **Price:** $299.99 USD

#### Variant 4: Donation
- **Type:** One-time payment
- **Price:** Pay what you want (minimum $1)

### Step 3: Get API Credentials

1. Go to **Settings → API**
2. Create a new API key
3. Copy the API key (starts with `lemon_`)
4. Note your Store ID (found in Settings → Stores)

### Step 4: Configure Webhooks

1. Go to **Settings → Webhooks**
2. Click **Create Webhook**
3. Set URL: `https://[your-supabase-project].supabase.co/functions/v1/lemon-squeezy-webhook`
4. Select events:
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_resumed`
   - `subscription_expired`
   - `subscription_paused`
   - `subscription_unpaused`
   - `subscription_payment_success`
   - `subscription_payment_failed`
   - `order_created`
   - `order_refunded`
5. Copy the **Signing Secret** (starts with `whsec_`)

---

## Supabase Configuration

### Step 1: Run Migrations

```bash
cd ton618-web
supabase db push
```

This will create the following tables:
- `subscriptions`
- `purchases`
- `guild_premium`
- `donations`

### Step 2: Set Environment Variables

Go to **Project Settings → Edge Functions** and add:

```env
LEMON_SQUEEZY_API_KEY=lemon_your_api_key_here
LEMON_SQUEEZY_STORE_ID=12345
LEMON_SQUEEZY_WEBHOOK_SECRET=whsec_your_webhook_secret_here
LEMON_SQUEEZY_PRODUCT_ID=123456
LEMON_SQUEEZY_VARIANT_MONTHLY=123456
LEMON_SQUEEZY_VARIANT_YEARLY=123457
LEMON_SQUEEZY_VARIANT_LIFETIME=123458
LEMON_SQUEEZY_VARIANT_DONATION=123459
LEMON_SQUEEZY_TEST_MODE=false
BOT_API_KEY=your_secure_random_key_here
```

**Generate BOT_API_KEY:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Deploy Edge Functions

```bash
supabase functions deploy lemon-squeezy-webhook
supabase functions deploy lemon-create-checkout
supabase functions deploy lemon-get-guild-premium
supabase functions deploy lemon-get-user-guilds
```

### Step 4: Test Webhook Endpoint

```bash
curl -X POST https://[your-project].supabase.co/functions/v1/lemon-squeezy-webhook \
  -H "Content-Type: application/json" \
  -H "X-Signature: test" \
  -d '{"test": true}'
```

Expected: 401 Unauthorized (signature validation working)

---

## Bot Configuration

### Step 1: Update Environment Variables

Add to `ton618-bot/.env`:

```env
SUPABASE_URL=https://[your-project].supabase.co
BOT_API_KEY=your_secure_random_key_here
```

**Important:** Use the SAME `BOT_API_KEY` from Supabase config.

### Step 2: Initialize Premium Service

Add to `ton618-bot/index.js` (or main entry point):

```javascript
const { premiumService } = require('./src/services/premiumService');

// After database connection
await premiumService.initialize();
console.log('✅ Premium service initialized');
```

### Step 3: Deploy Premium Command

The `/premium` command is already created at:
- `src/commands/public/premium.js`

Deploy commands:
```bash
node scripts/deploy-commands.js
```

### Step 4: Example Usage in Commands

```javascript
const { requirePremium } = require('../../utils/premiumMiddleware');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('advanced-feature')
    .setDescription('Premium only feature'),

  async execute(interaction) {
    // Check premium status
    const hasPremium = await requirePremium(interaction);
    if (!hasPremium) return; // Auto-replies with upgrade message

    // Your premium feature code here
    await interaction.reply('✨ Premium feature activated!');
  },
};
```

---

## Frontend Configuration

### Step 1: Update Environment Variables

Add to `ton618-web/.env`:

```env
VITE_SUPABASE_URL=https://[your-project].supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 2: Add Routes

Update `src/App.tsx`:

```tsx
import { PricingPage } from './components/PricingPage';
import { BillingDashboard } from './components/BillingDashboard';

// Add routes
<Route path="/pricing" element={<PricingPage />} />
<Route path="/dashboard/billing" element={<BillingDashboard />} />
```

### Step 3: Update Navigation

Add pricing link to your navbar:

```tsx
<a href="/pricing">Pricing</a>
```

---

## Testing

### Test Mode Setup

1. Enable test mode in Lemon Squeezy
2. Set `LEMON_SQUEEZY_TEST_MODE=true` in Supabase
3. Use test card: `4242 4242 4242 4242`

### Test Flow

1. **User Registration**
   - Visit `/pricing`
   - Click "Get Started" on any plan
   - Login with Discord
   - Select a server
   - Complete checkout

2. **Webhook Processing**
   - Check Supabase logs: `supabase functions logs lemon-squeezy-webhook`
   - Verify `guild_premium` table updated
   - Check `subscriptions` or `purchases` table

3. **Bot Verification**
   - Run `/premium` in Discord server
   - Should show premium status
   - Test premium-only commands

4. **Cancellation Flow**
   - Cancel subscription in Lemon Squeezy
   - Verify webhook received
   - Check `expires_at` set correctly
   - Premium should remain active until expiry

### Testing Checklist

- [ ] Monthly subscription checkout works
- [ ] Yearly subscription checkout works
- [ ] Lifetime purchase checkout works
- [ ] Donation checkout works
- [ ] Webhook signature validation works
- [ ] Premium status shows in bot
- [ ] Premium commands work
- [ ] Free tier commands still work
- [ ] Subscription cancellation works
- [ ] Subscription renewal works
- [ ] Refund deactivates premium

---

## Production Deployment

### Pre-Launch Checklist

- [ ] All environment variables set to production values
- [ ] `LEMON_SQUEEZY_TEST_MODE=false`
- [ ] Webhook URL points to production Supabase
- [ ] Bot deployed with production credentials
- [ ] Frontend deployed with production Supabase URL
- [ ] Database migrations applied
- [ ] Edge Functions deployed
- [ ] Test complete purchase flow end-to-end
- [ ] Monitor webhook logs for 24 hours
- [ ] Set up error alerting (Sentry, etc.)

### Monitoring

**Supabase Dashboard:**
- Monitor Edge Function invocations
- Check for errors in logs
- Monitor database growth

**Lemon Squeezy Dashboard:**
- Track successful payments
- Monitor failed webhooks
- Check refund requests

**Bot Logs:**
- Monitor premium service errors
- Track cache hit/miss rates
- Log premium feature usage

---

## Troubleshooting

### Webhook Not Receiving Events

**Check:**
1. Webhook URL is correct
2. Webhook is enabled in Lemon Squeezy
3. Signature secret matches
4. Edge Function is deployed
5. Check Supabase function logs

**Fix:**
```bash
supabase functions logs lemon-squeezy-webhook --tail
```

### Premium Not Activating

**Check:**
1. Webhook processed successfully
2. `guild_premium` table has entry
3. `is_active = true`
4. `expires_at` is in future (or NULL for lifetime)
5. Bot has correct `BOT_API_KEY`

**Manual Fix:**
```sql
UPDATE guild_premium 
SET is_active = true 
WHERE guild_id = 'YOUR_GUILD_ID';
```

### Bot Can't Fetch Premium Status

**Check:**
1. `SUPABASE_URL` set correctly
2. `BOT_API_KEY` matches Supabase config
3. Edge Function deployed
4. Network connectivity

**Test:**
```bash
curl -H "X-Bot-Api-Key: YOUR_KEY" \
  https://[project].supabase.co/functions/v1/lemon-get-guild-premium/GUILD_ID
```

### Checkout Session Not Creating

**Check:**
1. User is authenticated
2. User has `MANAGE_GUILD` permission
3. Guild doesn't already have premium
4. Lemon Squeezy API key is valid
5. Variant IDs are correct

**Debug:**
```javascript
// Add to Edge Function
console.log('Creating checkout:', { guild_id, plan_type, variant_id });
```

### Cache Not Invalidating

**Manual Invalidation:**
```javascript
// In bot
await premiumService.invalidateCache('GUILD_ID');
```

**Check TTL:**
```javascript
// MongoDB
db.premium_cache.find({ guild_id: 'GUILD_ID' })
```

---

## Security Best Practices

1. **Never expose API keys in frontend**
2. **Always validate webhook signatures**
3. **Use HTTPS for all endpoints**
4. **Rotate `BOT_API_KEY` periodically**
5. **Enable RLS on Supabase tables**
6. **Log all billing events**
7. **Monitor for suspicious activity**
8. **Implement rate limiting**

---

## Support

For issues:
1. Check Supabase function logs
2. Check Lemon Squeezy webhook logs
3. Check bot console logs
4. Review this documentation
5. Contact support with error logs

---

## Changelog

### v1.0.0 (2026-04-06)
- Initial Lemon Squeezy integration
- Monthly, Yearly, Lifetime plans
- Donation support
- Premium service with caching
- Webhook processing
- Frontend billing dashboard
