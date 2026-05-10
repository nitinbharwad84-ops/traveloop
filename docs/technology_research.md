# Technology Research Report

## Frontend Framework Research

### Candidates Evaluated
1. **Next.js (React)**
2. **Vite + React (SPA)**
3. **SvelteKit**

### Comparison Table
| Technology | Cost | Community | Maintenance | Performance | Learning Curve | Best For |
|---|---|---|---|---|---|---|
| **Next.js 14+** | Free | 120k+ Stars | Very Active | High (SSR/SSG) | 3/5 | SEO, large web apps, Vercel integration |
| **Vite + React** | Free | 65k+ Stars | Very Active | High (CSR) | 2/5 | Fast MVP, pure SPAs |
| **SvelteKit** | Free | 18k+ Stars | Active | Very High | 2/5 | Lightweight edge apps |

### Research Details
- **Next.js**: Industry standard for React frameworks. Seamless Vercel deployment. Server components make data fetching efficient.
- **Vite + React**: Very fast build tool, great for 8-hour hackathon constraints (as suggested in PRD), but Next.js provides better routing and API endpoints out of the box.

### Decision Rationale
**Top Choice: Next.js**
Despite the PRD mentioning Vite initially, Next.js aligns perfectly with the user's choice of "Website Only (Next.js, Vercel)". It provides built-in API routes (reducing need for external backend servers) and optimal performance.

---

## Backend & Database Selection

### Candidates Evaluated
1. **Supabase (PostgreSQL)**
2. **Firebase (NoSQL)**
3. **Appwrite**

### Comparison Table
| Technology | Cost (Free Tier) | Community | Maintenance | Performance | Learning Curve | Best For |
|---|---|---|---|---|---|---|
| **Supabase** | Free (500MB DB) | 65k+ Stars | Very Active | High | 3/5 | Relational data, rapid dev |
| **Firebase** | Free (1GB NoSQL) | Massive | Active | High | 2/5 | Real-time NoSQL |
| **Appwrite** | Free (Self-hosted) | 40k+ Stars | Active | High | 3/5 | Open-source alternative |

### Decision Rationale
**Top Choice: Supabase**
The PRD mandates a relational schema with complex joins (trips → stops → activities). Supabase provides a robust PostgreSQL database with Row Level Security (RLS) and built-in Auth, fitting the Free Tier constraint perfectly.

---

## Authentication Service

### Candidates Evaluated
1. **Supabase Auth**
2. **NextAuth.js (Auth.js)**
3. **Clerk**

### Comparison Table
| Technology | Cost | Community | Maintenance | Performance | Learning Curve | Best For |
|---|---|---|---|---|---|---|
| **Supabase Auth** | Free (50k MAU) | N/A (built-in) | Active | High | 2/5 | Integrated DB/Auth |
| **NextAuth.js** | Free | 22k+ Stars | Active | High | 3/5 | Bring-your-own-DB |
| **Clerk** | Free (10k MAU) | Growing | Active | High | 1/5 | Drop-in UI |

### Decision Rationale
**Top Choice: Supabase Auth**
Since we are using Supabase for the database, using Supabase Auth is a no-brainer. It provides seamless RLS integration, meaning security is enforced at the database level without writing complex backend middleware.

---

## External APIs (Cities, Activities, Images)

- **Cities**: GeoDB Cities API (Free tier: 1 req/sec)
- **Activities**: Foursquare Places API (Free tier: 100k calls/day)
- **Images**: Unsplash API (Free tier: 50 req/hour)
All these fit the "FREE ONLY" requirement perfectly.
