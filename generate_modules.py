import os
import json

modules_data = [
    {
        "num": 1,
        "name": "Authentication",
        "desc": "Authenticate users to access and manage their personal travel plans securely.",
        "tables": ["profiles", "users"],
        "endpoints": ["Supabase Auth"],
        "dependencies": [],
        "priority": "High"
    },
    {
        "num": 2,
        "name": "Dashboard",
        "desc": "Central hub showing upcoming trips, popular destinations, and quick actions.",
        "tables": ["trips"],
        "endpoints": ["GeoDB Cities", "Unsplash"],
        "dependencies": ["M1"],
        "priority": "High"
    },
    {
        "num": 3,
        "name": "Create Trip",
        "desc": "Form to initiate a new trip with name, dates, description, and destination.",
        "tables": ["trips", "trip_stops"],
        "endpoints": ["GeoDB Cities", "Foursquare"],
        "dependencies": ["M1"],
        "priority": "High"
    },
    {
        "num": 4,
        "name": "My Trips",
        "desc": "List view of all trips created by the user.",
        "tables": ["trips"],
        "endpoints": [],
        "dependencies": ["M1", "M3"],
        "priority": "High"
    },
    {
        "num": 5,
        "name": "Itinerary Builder",
        "desc": "Interactive interface to build day-wise trip plan.",
        "tables": ["trip_stops", "activities", "trip_activities"],
        "endpoints": ["GeoDB", "Foursquare"],
        "dependencies": ["M3"],
        "priority": "High"
    },
    {
        "num": 6,
        "name": "Itinerary View",
        "desc": "Visual read-mode of completed trip with budget.",
        "tables": ["trips", "trip_stops", "trip_activities"],
        "endpoints": [],
        "dependencies": ["M5"],
        "priority": "High"
    },
    {
        "num": 7,
        "name": "City Search",
        "desc": "Discover and search cities to add to a trip.",
        "tables": [],
        "endpoints": ["GeoDB", "Unsplash"],
        "dependencies": [],
        "priority": "Medium"
    },
    {
        "num": 8,
        "name": "Activity Search",
        "desc": "Browse and select activities for each stop.",
        "tables": ["activities", "trip_activities"],
        "endpoints": ["Foursquare", "Yelp"],
        "dependencies": ["M7"],
        "priority": "Medium"
    },
    {
        "num": 9,
        "name": "Budget Invoice",
        "desc": "Summarized financial view with cost breakdown.",
        "tables": ["trips", "trip_activities"],
        "endpoints": [],
        "dependencies": ["M5"],
        "priority": "Medium"
    },
    {
        "num": 10,
        "name": "Packing Checklist",
        "desc": "Per-trip categorized packing checklist.",
        "tables": ["packing_items"],
        "endpoints": [],
        "dependencies": ["M3"],
        "priority": "Low"
    },
    {
        "num": 11,
        "name": "Public Itinerary",
        "desc": "Public-facing read-only itinerary.",
        "tables": ["shared_trips", "trips", "trip_stops", "trip_activities"],
        "endpoints": [],
        "dependencies": ["M6"],
        "priority": "Low"
    },
    {
        "num": 12,
        "name": "Community Tab",
        "desc": "Social discovery feed of public itineraries.",
        "tables": ["shared_trips", "trips"],
        "endpoints": [],
        "dependencies": ["M11"],
        "priority": "Low"
    },
    {
        "num": 13,
        "name": "User Profile",
        "desc": "User settings to update profile info.",
        "tables": ["profiles", "trips"],
        "endpoints": [],
        "dependencies": ["M1"],
        "priority": "Medium"
    },
    {
        "num": 14,
        "name": "Trip Notes",
        "desc": "Simple note-taking tied to a specific trip.",
        "tables": ["notes"],
        "endpoints": [],
        "dependencies": ["M3"],
        "priority": "Low"
    },
    {
        "num": 15,
        "name": "Admin Dashboard",
        "desc": "Admin interface to monitor usage.",
        "tables": ["profiles", "trips", "activities"],
        "endpoints": [],
        "dependencies": ["M1"],
        "priority": "Low"
    }
]

base_dir = r"c:\Users\techn\Desktop\Traveloop\docs"

os.makedirs(os.path.join(base_dir, "module_prds"), exist_ok=True)
os.makedirs(os.path.join(base_dir, "migrations"), exist_ok=True)

for mod in modules_data:
    n = mod['num']
    mn = f"M{n}"
    folder_path = os.path.join(base_dir, mn)
    os.makedirs(folder_path, exist_ok=True)
    
    # 1. module_prds/MN.md
    prd_path = os.path.join(base_dir, "module_prds", f"{mn}.md")
    with open(prd_path, "w") as f:
        f.write(f"# Module {n}: {mod['name']}\n\n")
        f.write(f"**Description:** {mod['desc']}\n")
        f.write(f"**Database Touchpoints:** {', '.join(mod['tables'])}\n")
        f.write(f"**API Touchpoints:** {', '.join(mod['endpoints'])}\n")
        f.write(f"**Dependencies:** {', '.join(mod['dependencies'])}\n")
        f.write(f"**Priority:** {mod['priority']}\n")
    
    prompt_content = f"""[Agent Execution Prompt - Ready to Copy for TEAMMATE: Antigravity - {mod['name']}]

> **Role:** Full-Stack Developer
>
> **Task:** Build the {mod['name']} module as specified in the PRD.
>
> **Context:**
> - **Feature Requirements:** {mod['desc']}
> - **Architecture Specification:** Review architecture.md for system boundaries.
> - **Tech Stack:** Next.js 14, Supabase, TailwindCSS, Zustand
> - **Database Tables:** {', '.join(mod['tables'])}
> - **API Endpoints:** {', '.join(mod['endpoints'])}
> - **Dependencies:** {', '.join(mod['dependencies'])}
> - **File Attachments:** master_prd.md, architecture.md, module_prds/{mn}.md
>
> **Specific Instructions:**
> - Use exactly this tech stack: Next.js 14 App Router, Supabase JS client
> - Create these specific files: Required UI components and service files for {mod['name']}.
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
"""
    
    # 2. MN/MN_plan.md
    plan_path = os.path.join(folder_path, f"{mn}_plan.md")
    with open(plan_path, "w") as f:
        f.write(f"# {mn} Plan: {mod['name']}\n\n")
        f.write(f"## Module Specification\n{mod['desc']}\n\n")
        f.write("## Agent Assignment\nAssigned to Antigravity (suitable for full stack Next.js + Supabase implementation)\n\n")
        f.write("## Ready-to-Copy Prompt\n\n")
        f.write(prompt_content)
        f.write("\n## File Attachments Needed\n")
        f.write("- master_prd.md\n- architecture.md\n- module_prds/{mn}.md\n")

    # 3. MN_Prompt.md (Root Level)
    prompt_file_path = os.path.join(base_dir, f"{mn}_Prompt.md")
    with open(prompt_file_path, "w") as f:
        f.write(prompt_content)

print("Generated all modules.")
