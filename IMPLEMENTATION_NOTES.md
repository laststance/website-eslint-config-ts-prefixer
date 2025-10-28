# Rule Limiting Implementation

## Overview

Implemented environment-based rule limiting to reduce page size during development using `@t3-oss/env-nextjs`.

## Problem

The page was displaying all 37 ESLint rules, resulting in a large page size (~115.6k tokens) that exhausted the Playwright context during testing.

## Solution

- **Installed**: `@t3-oss/env-nextjs` and `zod` for type-safe environment variable management
- **Created**: `lib/env.ts` with environment variable schema
- **Implemented**: Rule filtering logic in `app/page.tsx` that limits to 1/3 of rules when `NEXT_PUBLIC_LIMIT_RULES=third`
- **Configuration**:
  - `.env.local` - Local development with rule limiting enabled
  - `.env.example` - Template for environment variables

## Usage

### Development Mode (Limited Rules)

```bash
# .env.local
NEXT_PUBLIC_LIMIT_RULES=third
```

This displays 13 rules (1/3 of 37 total rules)

### Production Mode (All Rules)

```bash
# .env.local or .env.production
NEXT_PUBLIC_LIMIT_RULES=full
```

This displays all 37 rules

## Files Modified

1. `lib/env.ts` - New file with t3-env schema
2. `app/page.tsx` - Added rule filtering logic
3. `.env.local` - Local development configuration
4. `.env.example` - Example configuration template
5. `package.json` - Added `@t3-oss/env-nextjs` and `zod` dependencies

## Results

- **Before**: 37 rules displayed, ~115.6k token page size
- **After (dev mode)**: 13 rules displayed, significantly reduced page size
- **Server logs**: Shows clear indication when rule limiting is active

## Testing

Verified with Playwright that the page loads successfully with reduced context usage.

```bash
# Console output confirms:
[DEV MODE] Limiting rules from 37 to 13 (1/3) to reduce page size
```
