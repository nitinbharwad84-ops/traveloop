[Agent Execution Prompt - Ready to Copy for TEAMMATE: Antigravity - Public Itinerary]

> **Role:** Full-Stack Developer
>
> **Task:** Build the Public Itinerary module as specified in the PRD.
>
> **Context:**
> - **Feature Requirements:** Public-facing read-only itinerary.
> - **Architecture Specification:** Review architecture.md for system boundaries.
> - **Tech Stack:** Next.js 14, Supabase, TailwindCSS, Zustand
> - **Database Tables:** shared_trips, trips, trip_stops, trip_activities
> - **API Endpoints:** 
> - **Dependencies:** M6
> - **File Attachments:** master_prd.md, architecture.md, module_prds/M11.md
>
> **Specific Instructions:**
> - Use exactly this tech stack: Next.js 14 App Router, Supabase JS client
> - Create these specific files: Required UI components and service files for Public Itinerary.
> - Error handling: Use Sonner toasts and graceful fallbacks.
> - Logging: Console logs for development.
> - Security: Enforce RLS on Supabase.
> - Performance: Lazy load components where appropriate.
> - Do NOT: Do not use Redux or other state managers, strictly Zustand.
>
> **Output Requirements:**
> - Production-ready code only
> - Complete and copy-paste ready
> - Include TypeScript types
> - Include error handling
> - Include security measures
> - No explanatory text beyond code comments
> - Assume this code will be used immediately in production
