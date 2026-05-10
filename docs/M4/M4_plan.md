# M4 Plan: My Trips

## Module Specification
List view of all trips created by the user.

## Agent Assignment
Assigned to Antigravity (suitable for full stack Next.js + Supabase implementation)

## Ready-to-Copy Prompt

[Agent Execution Prompt - Ready to Copy for TEAMMATE: Antigravity - My Trips]

> **Role:** Full-Stack Developer
>
> **Task:** Build the My Trips module as specified in the PRD.
>
> **Context:**
> - **Feature Requirements:** List view of all trips created by the user.
> - **Architecture Specification:** Review architecture.md for system boundaries.
> - **Tech Stack:** Next.js 14, Supabase, TailwindCSS, Zustand
> - **Database Tables:** trips
> - **API Endpoints:** 
> - **Dependencies:** M1, M3
> - **File Attachments:** master_prd.md, architecture.md, module_prds/M4.md
>
> **Specific Instructions:**
> - Use exactly this tech stack: Next.js 14 App Router, Supabase JS client
> - Create these specific files: Required UI components and service files for My Trips.
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
