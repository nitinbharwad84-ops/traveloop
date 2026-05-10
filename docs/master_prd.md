# Traveloop - Master PRD

## Executive Summary
Traveloop is a modern, web-based travel planning platform that enables users to design personalized multi-city trips with structured itineraries, activity planning, budget tracking, packing checklists, and social sharing — all in one unified interface. It consolidates the fragmented pre-trip planning lifecycle into a single SaaS application.

## Vision & North Star Metrics
To become the world's most intuitive travel operating system.
**North Star Metrics:**
- Trip creation completion rate (90%+ in demo)
- Average stops per trip (2+)
- Budget breakdown viewed (100% of trips in demo)

## Target User Persona
- **Arjun (Solo Explorer)**: Needs quick trip creation, budget tracking, offline packing.
- **Mia (Backpacker)**: Mobile-first, shares itineraries publicly.
- **James & Cristina (Couples)**: Desktop planners needing shareable links for review.
- **Priya (Family Organizer)**: Heavy desktop planner, needs detailed packing and invoice exports.

## Key Features
- **Authentication**: Secure signup/login with profile management.
- **Dashboard**: Hub for upcoming trips and destination inspiration.
- **Trip Creation**: Multi-stop trip initiation with GeoDB city search.
- **Itinerary Builder**: Drag-and-drop day-wise activity planning.
- **Activity Discovery**: Foursquare-powered venue search.
- **Budget & Invoice**: Automatic cost aggregation and PDF export.
- **Packing Checklist**: Progress-tracked, categorized packing lists.
- **Trip Journal**: Notes tied to specific days or stops.
- **Community & Sharing**: Public read-only itinerary links and social feed.

## Success Metrics
- Each registered user creates at least 1 trip during demo session.
- Sub-200ms page transitions with Framer Motion.
- 100% CRUD operations backed by Supabase RLS.

## Non-Negotiables
- Production-Grade Architecture.
- 8-Hour Build Constraint (Hackathon submission).
- Free Tier only for all infrastructure and APIs.
- Fully responsive (Mobile & Desktop).

## Technical Decisions
- **Platform**: Website Only (Next.js, Vercel)
- **Tier**: Tier 1 (Free - $0/month)
- **Tech Stack**: Next.js 14, TailwindCSS, Zustand, Supabase (PostgreSQL & Auth).
- **Development Timeline**: 8 Hours (Hackathon MVP).

## Assumptions
- Free tier API limits (e.g., GeoDB's 1 req/sec) will not be exceeded during the demo due to caching.
- Users will primarily manage their trips via web browsers, not native mobile apps.
