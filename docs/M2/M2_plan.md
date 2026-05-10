# M2 Plan: Dashboard

## Module Specification
Central hub showing upcoming trips, popular destinations, and quick actions.

## Agent Assignment
Assigned to Antigravity (suitable for full stack Next.js + Supabase implementation)

## Ready-to-Copy Prompt

[Agent Execution Prompt - Ready to Copy for TEAMMATE: Antigravity - Dashboard]

> **Role:** Full-Stack Developer
>
> **Task:** Build the Dashboard module as specified in the PRD.
>
> **Context:**
> - **Feature Requirements:** Central hub showing upcoming trips, popular destinations, and quick actions.
> - **Architecture Specification:** Review architecture.md for system boundaries.
> - **Tech Stack:** Next.js 14, Supabase, TailwindCSS, Zustand
> - **Database Tables:** trips
> - **API Endpoints:** GeoDB Cities, Unsplash
> - **Dependencies:** M1
> - **File Attachments:** master_prd.md, architecture.md, module_prds/M2.md
>
> **Specific Instructions:**
> - Use exactly this tech stack: Next.js 14 App Router, Supabase JS client
> - Create these specific files: Required UI components and service files for Dashboard.
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

## File Attachments Needed
- master_prd.md
- architecture.md
- module_prds/{mn}.md
