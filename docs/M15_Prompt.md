[Agent Execution Prompt - Ready to Copy for TEAMMATE: Antigravity - Admin Dashboard]

> **Role:** Full-Stack Developer
>
> **Task:** Build the Admin Dashboard module as specified in the PRD.
>
> **Context:**
> - **Feature Requirements:** Admin interface to monitor usage.
> - **Architecture Specification:** Review architecture.md for system boundaries.
> - **Tech Stack:** Next.js 14, Supabase, TailwindCSS, Zustand
> - **Database Tables:** profiles, trips, activities
> - **API Endpoints:** 
> - **Dependencies:** M1
> - **File Attachments:** master_prd.md, architecture.md, module_prds/M15.md
>
> **Specific Instructions:**
> - Use exactly this tech stack: Next.js 14 App Router, Supabase JS client
> - Create these specific files: Required UI components and service files for Admin Dashboard.
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
