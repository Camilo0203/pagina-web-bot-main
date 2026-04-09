# Web Utils - Architecture Guide

Utility functions and helpers for the TON618 web dashboard.

## 📁 Directory Structure

```
src/
├── lib/                    # Core utilities
│   ├── performance.ts      # Performance monitoring
│   └── utils.ts            # Generic utilities
├── utils/                  # React/Domain utilities
│   ├── dateFormat.ts       # Date formatting
│   └── ...
├── billing/
│   └── hooks/              # Billing-specific hooks
├── dashboard/
│   ├── api/                # API clients
│   ├── hooks/              # Dashboard hooks
│   └── utils/              # Dashboard utilities
└── config/                 # Configuration
    └── pricing.ts          # Pricing config
```

## 🎯 Utilities Overview

### Performance Monitoring (`lib/performance.ts`)

Tracks Core Web Vitals and custom metrics:

```typescript
import { measurePageLoad, trackCustomMetric } from '@/lib/performance';

// Measure page load
measurePageLoad();

// Track custom timing
trackCustomMetric('dashboard_load', duration);
```

### API Clients (`dashboard/api/`)

Structured API clients for different domains:

```typescript
import { guildApi } from '@/dashboard/api/guild';
import { ticketsApi } from '@/dashboard/api/tickets';

// Fetch guild data
const data = await guildApi.fetchDashboardData(guildId);
```

### React Hooks

Custom hooks for data fetching and state management:

```typescript
import { useBillingGuilds } from '@/billing/hooks/useBillingGuilds';
import { useDashboardData } from '@/dashboard/hooks/useDashboardData';

// Use in components
const { data, isLoading } = useBillingGuilds();
```

## 🛡️ Type Safety

All utilities should be fully typed:

```typescript
// No 'any' types
function formatDate(date: Date | string, locale: 'en' | 'es'): string {
  // Implementation
}

// Use unknown for flexible params
function processData(data: unknown): ProcessedData {
  // Type guards
  if (isValidData(data)) {
    return transform(data);
  }
  throw new Error('Invalid data');
}
```

## 🧪 Testing

Utilities should have unit tests:

```typescript
// __tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from '@/utils/dateFormat';

describe('formatDate', () => {
  it('formats dates correctly', () => {
    const result = formatDate(new Date('2024-01-01'), 'en');
    expect(result).toBe('January 1, 2024');
  });
});
```

Run tests:
```bash
npm run test:unit
```

## 📦 Bundle Size

Keep utilities small and tree-shakable:

```typescript
// Good: Named exports, tree-shakable
export function util1() {}
export function util2() {}

// Avoid: Default export with many utilities
export default { util1, util2 }; // Harder to tree-shake
```

### Analyzing Bundle Size

```bash
# Build and analyze
npm run analyze

# View report
npx vite-bundle-visualizer
```

## 🔧 Best Practices

1. **Pure Functions**: Utilities should be pure when possible
2. **No Side Effects**: Avoid mutating global state
3. **Error Handling**: Always handle errors gracefully
4. **Memoization**: Use `useMemo`/`useCallback` for expensive operations
5. **Lazy Loading**: Use dynamic imports for heavy utilities

```typescript
// Lazy load heavy utility
const heavyUtil = await import('./heavyUtil');
heavyUtil.process(data);
```

## 🌐 Internationalization

Use i18n for user-facing strings:

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <span>{t('key.nested.value')}</span>;
}
```

## 📝 Documentation

Add JSDoc to all exported functions:

```typescript
/**
 * Formats a number as currency
 * 
 * @param amount - Amount to format
 * @param currency - Currency code (USD, EUR, etc)
 * @returns Formatted currency string
 * @example
 * formatCurrency(9.99, 'USD') // '$9.99'
 */
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
```

## 🔒 Security

- Never expose sensitive data in client code
- Sanitize all user inputs
- Use CSP headers (configured in vite.config.ts)
- Validate data from APIs with Zod

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
});

// Validate API response
const user = UserSchema.parse(apiResponse);
```

## 📊 Performance Budgets

Current targets:
- First Load JS: < 200KB gzipped
- Total bundle: < 500KB gzipped
- TTFB: < 200ms
- FCP: < 1.8s
- LCP: < 2.5s

Monitor in production with:
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
```

---

Last updated: April 2026
