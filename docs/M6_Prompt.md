[Agent Execution Prompt - Ready to Copy for TEAMMATE: Antigravity - Itinerary View]

> **Role:** Full-Stack Developer
>
> **Task:** Build the Itinerary View module as specified in the PRD.
>
> **Context:**
> - **Feature Requirements:** Visual read-mode of completed trip with budget.
> - **Architecture Specification:** Review architecture.md for system boundaries.
> - **Tech Stack:** Next.js 14, Supabase, TailwindCSS, Zustand
> - **Database Tables:** trips, trip_stops, trip_activities
> - **API Endpoints:** 
> - **Dependencies:** M5
> - **File Attachments:** master_prd.md, architecture.md, module_prds/M6.md
>
> **Specific Instructions:**
> - Use exactly this tech stack: Next.js 14 App Router, Supabase JS client
> - Create these specific files: Required UI components and service files for Itinerary View.
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
