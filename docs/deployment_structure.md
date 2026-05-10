# Deployment & Infrastructure Structure

## Deployment Targets by Tier

### TIER 1: Free Deployment
- **Frontend**: Vercel Hobby Plan
- **Backend**: Next.js API Routes (Serverless) + Supabase Edge Functions (Free Tier)
- **Database**: Supabase Free Tier
- **Custom Domain**: No (uses .vercel.app subdomain)
- **SSL**: Automatic
- **Uptime SLA**: None (community best-effort, Supabase pauses on inactivity)

### TIER 2: Production Deployment
- **Frontend**: Vercel Pro Plan ($20/mo)
- **Backend**: Next.js API Routes + Supabase Edge Functions (Pro)
- **Database**: Supabase Pro Plan ($25/mo)
- **Custom Domain**: Yes (required)
- **SSL**: Automatic (included)
- **Uptime SLA**: 99.5%
- **Backups**: Daily

### TIER 3: Enterprise Deployment
- **Frontend**: Vercel Team/Enterprise Plan ($150+/mo)
- **Database**: Supabase Team Plan ($250+/mo) + Read Replicas
- **Custom Domain**: Yes (required, multiple)
- **SSL**: Enterprise-grade, EV certificates
- **Uptime SLA**: 99.99%
- **Backups**: Hourly + point-in-time recovery

## Environment Setup

### Local Development
**Tools Required:**
- Node.js: v20 LTS
- npm or pnpm: v9+
- Git: latest

**Environment Variables (.env.local):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_KEY]
GEO_DB_API_KEY=[YOUR_KEY]
FOURSQUARE_API_KEY=[YOUR_KEY]
UNSPLASH_ACCESS_KEY=[YOUR_KEY]
```

**Database Setup:**
- Start: `npx supabase start`
- Reset: `npx supabase db reset`
- Seed: `npx supabase db seed`

### Staging Environment
**Purpose:** Test before production

**Configuration:**
- Frontend: Vercel Preview Deployments (auto-generated on PRs)
- Database: Supabase Staging Project (mirror of production schema)

**Deployment Process:**
1. Developer creates PR to `main`.
2. Vercel automatically deploys a staging URL.
3. Review functionality against staging URL.

### Production Environment
**Configuration:**
- Frontend: Vercel Production Environment (main branch)
- Database: Supabase Production Project

**Deployment Process:**
1. Merge PR into `main`.
2. Vercel automatically builds and deploys to production.
3. Supabase migrations applied manually or via CI script if set up.

**Monitoring:**
- Error tracking: Vercel Analytics / Sentry
- Performance: Vercel Web Vitals
- Uptime: UptimeRobot (Free tier)

**Rollback Procedure:**
- If deployment fails, click "Promote to Production" on previous successful build in Vercel Dashboard.

## Continuous Deployment (CI/CD)

### Automated Workflows
- **On PR**: Vercel builds preview URL.
- **On merge to main**: Vercel builds and deploys to production domain.

### Scaling & Load Management
**Tier 1**
- Max concurrent users: ~100
- Max requests/second: 1 (GeoDB API limit is the bottleneck)
- Action if exceeded: Rate limit errors from APIs, client-side caching masks some failure.

**Tier 2**
- Auto-scaling: Yes (Vercel serverless functions scale automatically).
- Database handles ~2k concurrent connections.
