# Traveloop — AI-Powered Collaborative Travel Planner

Traveloop is a production-ready SaaS platform that centralizes travel planning into a single unified workspace. It leverages AI to generate itineraries, estimate budgets, and create contextual packing lists, all while supporting real-time collaboration and offline-first PWA capabilities.

## 🚀 Key Features

- **AI Trip Planner:** Generate multi-city itineraries from natural language prompts using Google Gemini.
- **Collaborative Workspaces:** Invite friends to co-edit trips with defined roles (Editor/Viewer).
- **Budget Management:** Track expenses across categories with AI-powered cost estimation.
- **PWA Support:** Install Traveloop on your device and access your trips even when offline.
- **Community Feed:** Share your itineraries with the world or duplicate templates from other travelers.
- **Dual-Database Failover:** Robust architecture with automatic failover between Supabase and Local PostgreSQL.

## 🛠️ Tech Stack

- **Frontend:** Next.js 14.2 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **State Management:** TanStack Query, Zustand
- **Database:** Prisma ORM, Supabase PostgreSQL (Primary), Local PostgreSQL (Failover)
- **AI Integration:** Vercel AI SDK, Google Gemini 2.0 Flash, Groq Llama 3.1
- **Monitoring:** Sentry, PostHog
- **Infrastructure:** Vercel, Resend (Email)

## 📦 Getting Started

### 1. Prerequisites

- Node.js 18+ 
- Docker (optional, for local PostgreSQL failover)
- Supabase account

### 2. Installation

```bash
git clone https://github.com/your-username/traveloop.git
cd traveloop
npm install
```

### 3. Environment Setup

Copy `.env.local.example` to `.env` and fill in your credentials:

```bash
cp .env.local.example .env
```

### 4. Database Setup

```bash
npx prisma db push
```

### 5. Running Locally

```bash
npm run dev
```

## 🧪 Testing

```bash
npm run test      # Unit tests with Vitest
npm run e2e       # E2E tests with Playwright
```

## 📄 Documentation

Comprehensive documentation can be found in the `/docs` directory:
- [Master PRD](/docs/master_prd.md)
- [System Architecture](/docs/architecture.md)
- [Stack Recommendation](/docs/stack_recommendation.md)

## 🛡️ License

MIT License. See [LICENSE](LICENSE) for details.
