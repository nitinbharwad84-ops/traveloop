# Cost Breakdown by Tier

## TIER 1: FREE (Proof of Concept)
**Total Monthly Cost**: $0

**Infrastructure Breakdown:**
- Frontend hosting: $0 (Vercel Hobby Plan)
- Database/Auth: $0 (Supabase Free Tier)
- External APIs: $0 (GeoDB, Foursquare, Unsplash Free Tiers)

**Limitations:**
- GeoDB API: 1 request/second limitation. Impact: Requires aggressive client-side debouncing and caching.
- Unsplash API: 50 requests/hour limitation. Impact: Images must be cached persistently.
- Supabase: 500MB Database space, pause after 1 week of inactivity. Impact: Only suitable for demo and low traffic MVP.

**Use Case**: Hackathon submission and initial user testing.
**Time to MVP**: 1-2 days (8 hours).

---

## TIER 2: LITTLE BUDGET (Production MVP)
**Total Monthly Cost**: $64/month

**Infrastructure Breakdown:**
- Frontend hosting: $20 (Vercel Pro - prevents deployment queues, larger functions)
- Database: $25 (Supabase Pro - no project pausing, daily backups)
- Maps/Cities API: $19 (GeoDB Basic - higher rate limits)

**What Changes from Tier 1:**
- Scaling Limits: Supabase supports up to 100,000 MAU. External API rate limits are removed.
- Allows Custom Domain and consistent uptime.

**Use Case**: Public beta launch and first 10,000 users.

---

## TIER 3: PAID (Enterprise)
**Total Monthly Cost**: $600+/month

**Infrastructure Breakdown:**
- Frontend hosting: $150 (Vercel Enterprise/Team scale)
- Database: $250+ (Supabase Team/Dedicated compute, depending on traffic)
- Monitoring & Analytics: $100 (PostHog Premium, Sentry)
- Premium APIs: $100+ (Full Google Places API integration replacing Foursquare/GeoDB)

**What Changes from Tier 2:**
- Additional Features: Point in time database recovery, dedicated support SLA. Full AI Integration (Gemini Paid tier).
- Scaling Capability: Unlimited/SLA backed.

**Use Case**: Established product with high DAU and revenue.

---

## Upgrade Path

**From Tier 1 → Tier 2:**
- **When**: When nearing 500MB DB limit, or experiencing 429 Too Many Requests errors from free APIs.
- **Cost increase**: $64/month
- **Migration effort**: Minimal (just updating billing on platforms).
- **Breaking changes**: None.

**From Tier 2 → Tier 3:**
- **When**: When traffic requires dedicated compute, or when migrating to enterprise-grade APIs (Google Places).
- **Cost increase**: ~$550/month
- **Migration effort**: 40-80 hours (swapping out Foursquare/GeoDB for Google Places, setting up dedicated monitoring).
- **Breaking changes**: Yes (API response schemas will change if switching providers).
