# Traveloop – Personalized Travel Planning Made Easy
## Product Requirements Document (PRD) v1.0

> **Context:** Hackathon Submission · 8-Hour Build Constraint · Production-Grade Architecture
> **Prepared by:** Product, Engineering, UX, and DevOps perspectives combined
> **Last Updated:** 2025

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [Market & Competitor Analysis](#3-market--competitor-analysis)
4. [User Personas](#4-user-personas)
5. [Product Goals & KPIs](#5-product-goals--kpis)
6. [Functional Requirements](#6-functional-requirements)
7. [Detailed User Flows](#7-detailed-user-flows)
8. [Frontend Architecture](#8-frontend-architecture)
9. [Backend Architecture](#9-backend-architecture)
10. [Database Design](#10-database-design)
11. [API Architecture](#11-api-architecture)
12. [UI/UX System](#12-uiux-system)
13. [Security Architecture](#13-security-architecture)
14. [Performance Optimization Strategy](#14-performance-optimization-strategy)
15. [AI Features](#15-ai-features)
16. [DevOps & Deployment](#16-devops--deployment)
17. [Analytics & Tracking](#17-analytics--tracking)
18. [Scalability Strategy](#18-scalability-strategy)
19. [Monetization Strategy](#19-monetization-strategy)
20. [MVP Roadmap — 8-Hour Hackathon Plan](#20-mvp-roadmap--8-hour-hackathon-plan)
21. [Engineering Folder Structure](#21-engineering-folder-structure)
22. [Reusable Component System](#22-reusable-component-system)
23. [Testing Strategy](#23-testing-strategy)
24. [Future Scope](#24-future-scope)

---

## 1. Executive Summary

### Product Overview

Traveloop is a modern, web-based travel planning platform that enables users to design personalized multi-city trips with structured itineraries, activity planning, budget tracking, packing checklists, and social sharing — all in one unified interface.

### Vision

To become the world's most intuitive travel operating system — where every traveler, from the spontaneous backpacker to the meticulous family planner, can organize the perfect trip end-to-end without ever leaving the platform.

### Mission

Build a user-centric, responsive application that simplifies the overwhelming complexity of planning multi-city travel. Traveloop gives travelers intuitive tools to add and manage travel stops, explore activities, estimate budgets automatically, visualize timelines, and share their plans with the world.

### Problem Statement

Travel planning today is fragmented across a dozen tools: spreadsheets for budgets, Google Docs for itineraries, WhatsApp for coordination, Google Maps for places, and booking sites for costs. There is no single product that brings all these workflows together in a clean, interactive, and personalized experience. Travelers lose hours to context-switching, duplicate work, and poor visibility of their full plan.

### Solution Overview

Traveloop consolidates the entire pre-trip planning lifecycle into a single SaaS platform with:

- Visual, drag-and-drop itinerary building
- Day-wise timeline and calendar views
- Integrated city and activity search
- Automatic budget estimation and invoice generation
- Per-trip packing checklists
- Trip notes and journals
- Public itinerary sharing and a community tab
- An admin analytics dashboard

### Business Opportunity

The global online travel market is projected to exceed $1.1 trillion by 2030. No dominant consumer-grade itinerary planning tool exists for independent travelers — TripIt is for business travelers, Wanderlog is growing but limited in depth, and Google Travel lacks the interactive building layer. Traveloop targets the underserved independent and social travel planning segment.

---

## 2. Product Overview

### What Traveloop Is

Traveloop is a SaaS travel planning web application where users create accounts, build personalized multi-stop trip itineraries, discover cities and activities, track their budget, manage packing, write trip journals, and optionally share their itinerary publicly within a community of travelers.

### Why It Exists

Because planning a trip should be as exciting as taking one. Traveloop replaces the chaos of scattered spreadsheets, notes apps, and browser tabs with one elegant, structured, and visual workspace for everything travel-related.

### Target Audience

- Independent travelers planning international or domestic trips
- Couples planning holidays together
- Friend groups coordinating shared trips
- Digital nomads managing frequent multi-city travel
- Travel content creators documenting and sharing itineraries
- Families building detailed multi-day plans

### Main Differentiators

- **End-to-end in one product:** From trip creation to budget invoice — no external tools needed
- **Community-native:** Public itinerary sharing and a community tab from day one
- **Budget intelligence:** Automatic cost breakdown, invoice generation with export to PDF
- **Packing intelligence:** Per-trip, categorized packing checklists with progress tracking
- **Journal-first design:** Built-in trip notes tied to specific days or stops
- **AI-ready architecture:** Built to layer in AI recommendations and itinerary generation post-MVP

### Core Value Proposition

> "Plan your entire trip — itinerary, budget, packing, and notes — in one place. Then share it with the world."

---

## 3. Market & Competitor Analysis

### TripIt

**Strengths:** Automatic import from email confirmations, clean timeline view, strong for business travelers.
**Weaknesses:** Not designed for planning — only for organizing already-booked trips. No discovery or community features. UI feels dated.
**Market Gap:** No pre-booking planning layer. No activity exploration. No collaboration.

### Wanderlog

**Strengths:** Good map integration, collaborative editing, growing user base.
**Weaknesses:** Overwhelming UI for new users. Budget tracking is shallow. No community sharing ecosystem.
**Market Gap:** UX complexity barrier. No per-stop notes. No invoice/expense view.

### Google Travel

**Strengths:** Deep integration with Search, Maps, Hotels, and Flights. Massive data advantage.
**Weaknesses:** No structured itinerary building. No community. Read-only trip overview. No budget or packing features.
**Market Gap:** Entirely passive — it shows you information but doesn't help you plan.

### Notion Travel Templates

**Strengths:** Fully flexible, power users love it.
**Weaknesses:** Zero travel-specific intelligence. No city data, activity APIs, map views, or budget charts. Requires significant self-setup.
**Market Gap:** Not a product — it's a blank canvas that travelers must build themselves.

### Airbnb Planning Experiences

**Strengths:** Discovery and booking in one place for accommodation.
**Weaknesses:** Only covers stays — not activities, transport, or overall trip structure.
**Market Gap:** No itinerary layer. No multi-stop planning. No community sharing.

### Traveloop's Competitive Advantage

| Feature | TripIt | Wanderlog | Google Travel | Traveloop |
|---|---|---|---|---|
| Itinerary Builder | ✓ | ✓ | ✗ | ✓ |
| Activity Discovery | ✗ | ✓ | ✓ | ✓ |
| Budget + Invoice | ✗ | Partial | ✗ | ✓ |
| Packing Checklist | ✗ | ✗ | ✗ | ✓ |
| Trip Journal | ✗ | ✗ | ✗ | ✓ |
| Public Sharing | ✗ | ✓ | ✗ | ✓ |
| Community Tab | ✗ | ✗ | ✗ | ✓ |
| Admin Analytics | ✗ | ✗ | ✗ | ✓ |
| AI-Ready | ✗ | Partial | Partial | ✓ |

### Differentiation Strategy

Traveloop wins not by doing one thing better, but by being the only product that covers the full planning lifecycle — discovery → structure → budget → packing → notes → sharing — in a single, beautiful, responsive interface.

---

## 4. User Personas

### Persona 1: The Solo Explorer — "Arjun"

- **Age:** 26, Software Engineer, Bangalore
- **Goals:** Plan affordable international trips efficiently. Discover local activities. Stay within budget.
- **Pain Points:** Spends hours on multiple tabs. Budget always goes over. Forgets to pack things.
- **Usage Behavior:** Plans 2–3 trips/year. Uses laptop primarily. Checks plans on mobile during travel.
- **Device Preference:** Desktop for planning, mobile for reference during the trip
- **User Journey Expectations:** Quick trip creation, clean day-wise view, easy budget estimates, offline-accessible packing list

### Persona 2: The Backpacker — "Mia"

- **Age:** 23, Student, Amsterdam
- **Goals:** Discover cheap cities, plan spontaneously, share itineraries with friends.
- **Pain Points:** Can't afford premium tools. Plans change frequently. Needs shareable formats.
- **Usage Behavior:** Mobile-first. Plans week-of, not months in advance. Shares public itineraries.
- **Device Preference:** Mobile exclusively
- **User Journey Expectations:** Fast trip creation on mobile, public sharing link, community inspiration

### Persona 3: The Couple Planner — "James & Cristina"

- **Age:** 31 & 29, Marketing Manager & Teacher, London
- **Goals:** Plan a detailed 2-week anniversary trip. Share the itinerary between them. Track costs together.
- **Pain Points:** Can't easily co-edit plans. One person ends up managing everything.
- **Usage Behavior:** Desktop planners, tablet for reviewing together.
- **Device Preference:** Desktop primary, tablet secondary
- **User Journey Expectations:** Clean itinerary view, budget breakdown per person, shareable link for review

### Persona 4: The Family Organizer — "Priya"

- **Age:** 38, Business Owner, Mumbai
- **Goals:** Plan a structured family vacation with kids. Ensure nothing is forgotten. Manage per-person costs.
- **Pain Points:** Itineraries get complicated with multiple family members. Packing is chaotic.
- **Usage Behavior:** Heavy planner, 1–2 trips/year, desktop-first.
- **Device Preference:** Desktop
- **User Journey Expectations:** Detailed day-wise planner, categorized packing, budget alerts, invoice export

### Persona 5: The Digital Nomad — "Kenji"

- **Age:** 34, Freelance Designer, Remote
- **Goals:** Track multiple city stays per month. Manage recurring expenses. Keep travel notes.
- **Pain Points:** Tools don't handle frequent city-hopping well. Expense tracking is manual.
- **Usage Behavior:** Daily platform user, manages 6–10 trips/year.
- **Device Preference:** Laptop + mobile equally
- **User Journey Expectations:** Fast add-stop flows, expense invoice, journal notes per stop, profile with trip history

### Persona 6: The Travel Content Creator — "Sofia"

- **Age:** 29, Travel Blogger, Barcelona
- **Goals:** Share polished itineraries publicly. Build a reputation as a trusted trip curator.
- **Pain Points:** Can't easily publish structured trip plans. No platform designed for itinerary sharing.
- **Usage Behavior:** Builds trips for content, shares publicly, engages community.
- **Device Preference:** Desktop for creation, mobile for community engagement
- **User Journey Expectations:** Beautiful public itinerary pages, community tab visibility, profile with preplanned trip showcase

---

## 5. Product Goals & KPIs

### Business Goals

- Launch a functional MVP within the 8-hour hackathon window
- Demonstrate all 14 core screens with real data flow
- Establish a foundation ready for investor or user demos

### User Goals

- Enable a user to create a complete multi-stop trip in under 3 minutes
- Allow a user to view a full budget breakdown without any manual calculations
- Enable public sharing of an itinerary in one click

### Technical Goals

- Maintain sub-200ms page transitions with Framer Motion
- Achieve 100% of CRUD operations backed by Supabase RLS-protected tables
- Implement responsive design that functions cleanly at 375px (mobile) and 1440px (desktop)

### Engagement Goals

- Each registered user creates at least 1 trip during demo session
- Community tab displays at least 3 seeded public itineraries
- Packing checklist used on at least 50% of created trips (post-launch metric)

### Monetization Goals (Post-Hackathon)

- Target freemium conversion rate of 8–12% within 6 months of public launch
- Invoice PDF export as a premium-tier trigger feature

### Measurable KPIs

| KPI | Target (Hackathon Demo) | Target (Month 3 Post-Launch) |
|---|---|---|
| Trip creation completion rate | 90%+ in demo | 70%+ |
| Average stops per trip | 2+ | 3+ |
| Public itineraries shared | 3 seeded | 500+ |
| Packing checklist adoption | N/A (demo) | 50%+ |
| Budget breakdown viewed | 100% of trips in demo | 80%+ |
| Page load time (LCP) | < 2s | < 1.5s |

---

## 6. Functional Requirements

### Module 1: Authentication (Login / Registration)

**Purpose:** Authenticate users to access and manage their personal travel plans securely.

**Screens Referenced:** Screen 1 (Login), Screen 2 (Registration)

**User Stories:**
- As a new user, I want to register with my name, email, password, city, country, and profile photo so that I can create a personalized account.
- As a returning user, I want to log in with my email and password so that I can access my trips.
- As a user, I want to reset my password via email if I forget it.

**User Flow:**
1. User lands on the Login screen
2. Enters email + password → clicks "Login Button"
3. If account doesn't exist → clicks "Register" link → goes to Registration Screen
4. Registration Screen collects: First Name, Last Name, Email, Password, Phone Number, City, Country, Profile Photo, Additional Information
5. On successful registration → redirected to Dashboard (Screen 3)
6. On login success → redirected to Dashboard

**Functional Requirements:**
- Email and password login via Supabase Auth
- Registration form with all fields from Screen 2 wireframe
- "Forgot Password" triggers Supabase password reset email
- Profile photo upload stored in Supabase Storage (`avatars` bucket)
- Input validation: email format, password minimum 8 characters, required fields
- Error messages displayed inline below each field
- Auth state persisted via Supabase session (localStorage-backed JWT)

**Components:**
- `<LoginForm />` — email, password, login button, forgot password link, signup link
- `<RegisterForm />` — all registration fields, photo upload, submit button
- `<AuthLayout />` — shared layout wrapper for auth pages with Traveloop branding

**Frontend Logic:**
- React Hook Form + Zod schema validation
- On submit: call `supabase.auth.signInWithPassword()` or `supabase.auth.signUp()`
- On success: Zustand auth store updated, redirect via React Router
- Photo upload: FileReader → Supabase Storage upload → store public URL in `profiles` table

**Backend Logic:**
- Supabase Auth handles token generation and session management
- On signup: Supabase trigger inserts a row into `profiles` table via a database function
- RLS policies ensure users can only read/write their own profile

**Database Requirements:** `users` (managed by Supabase Auth), `profiles` table

**Validation Rules:**
- Email: valid format, unique in system
- Password: minimum 8 characters
- First Name, Last Name: required, max 50 chars
- Phone: optional, numeric with country code
- City, Country: required

**Edge Cases:**
- Duplicate email on registration → show "Email already in use" error
- Invalid credentials on login → show "Incorrect email or password"
- Network failure during photo upload → show retry option, proceed without photo
- Session expiry → redirect to login with a toast notification

**Security Requirements:**
- HTTPS enforced (Vercel automatic)
- Supabase JWT tokens — never stored in non-secure storage
- Password hashing handled entirely by Supabase Auth (bcrypt)
- No raw passwords transmitted in client-accessible logs

**Responsive Behavior:** Single-column centered card layout at all breakpoints

---

### Module 2: Dashboard / Home Screen

**Purpose:** Central hub showing upcoming trips, popular destinations, and quick actions after login.

**Screen Referenced:** Screen 3 (Main Landing Page)

**User Stories:**
- As a logged-in user, I want to see my recent and upcoming trips on the dashboard.
- As a user, I want to quickly start planning a new trip from the dashboard.
- As a user, I want to see top regional destination suggestions for inspiration.

**User Flow:**
1. User logs in → lands on Dashboard
2. Sees welcome message with their name
3. Sees "Plan a Trip" CTA button prominently
4. Sees "Previous Trips" section with trip cards
5. Sees "Top Regional Selections" (popular destinations via GeoDB Cities API)
6. Can click any trip card to go to Itinerary View
7. Can use Group By / Filter / Sort controls to organize trip list
8. Can use the search bar to find a specific trip

**Functional Requirements:**
- Welcome message: "Welcome back, [First Name]"
- "Plan a Trip" button navigates to Create Trip screen
- Previous Trips: fetched from Supabase, displayed as cards showing trip name, date range, destination count
- Top Regional Selections: fetched from GeoDB Cities API, showing banner image (Unsplash API), city name, country
- Search bar filters trips by name in real time (client-side filter)
- Group By / Filter / Sort controls: group by status (Ongoing / Upcoming / Completed), filter by date range, sort by created date or trip start date
- Empty state: if no trips exist, show illustration + "Create your first trip" CTA

**Components:**
- `<DashboardLayout />` — sidebar + main content
- `<WelcomeBanner />` — personalized greeting
- `<TripCard />` — reusable card showing trip summary
- `<DestinationCard />` — inspiration card with city image and name
- `<SearchBar />` — real-time text filter
- `<FilterBar />` — group by / filter / sort controls
- `<EmptyState />` — illustrated empty state with CTA

**API Dependencies:** GeoDB Cities API (top cities), Unsplash API (destination cover images)

**Loading Behavior:** Skeleton loaders for trip cards and destination cards while fetching

**Error States:** If API call fails → show cached data or static fallback destinations

**Responsive Behavior:**
- Desktop: sidebar navigation + 2–3 column grid for trip cards
- Mobile: bottom tab navigation + single column list

---

### Module 3: Create Trip Screen

**Purpose:** Form to initiate a new trip with name, date range, description, and destination selection.

**Screen Referenced:** Screen 4 (Create a New Trip)

**User Stories:**
- As a user, I want to create a new trip by entering a name, start and end dates, description, and selecting places to visit.
- As a user, I want to see activity/place suggestions while creating a trip.
- As a user, I want to be able to add multiple destination sections in one creation flow.

**User Flow:**
1. User clicks "Plan a Trip" from Dashboard
2. Navigates to Create Trip screen
3. Enters trip name (text input)
4. Selects start date and end date via date pickers
5. Selects a place via city search (calls GeoDB Cities API)
6. Sees suggested places to visit / activities (Foursquare / Yelp APIs)
7. Can click "Add Another Section" to add additional stops inline
8. Clicks "Create" → trip saved to database → redirected to Itinerary Builder (Screen 5)

**Functional Requirements:**
- Trip name: text input, required, max 100 characters
- Start Date / End Date: date pickers, start must be before end
- Place selection: search-as-you-type, powered by GeoDB Cities API
- Suggestions section: pre-populated activity/place suggestions for selected city (Foursquare API)
- "Add Another Section" button appends a new city selection block to the form
- On submit: create `trips` record + create `trip_stops` records for each stop
- Cover photo: optional Unsplash image auto-assigned based on first destination city

**Components:**
- `<CreateTripForm />` — main form container
- `<CitySearchInput />` — debounced search with dropdown results
- `<DateRangePicker />` — start/end date selection
- `<SuggestionList />` — activity suggestions for selected city
- `<StopSection />` — repeatable city + date block for multi-stop creation

**Validation Rules:**
- Trip name: required
- At least one destination required
- End date must be after start date
- Stop dates must fall within trip overall date range

**Edge Cases:**
- User exits without saving → show "Discard changes?" confirmation modal
- City search returns no results → show "No cities found" with manual entry fallback
- Date conflict between stops → inline validation error per stop block

**Responsive Behavior:** Single-column stacked form on mobile, two-column on desktop

---

### Module 4: My Trips (Trip List) Screen

**Purpose:** List view of all trips created by the user with management actions.

**Screen Referenced:** Screen 6 (User Trip Listing)

**User Stories:**
- As a user, I want to see all my trips organized by status: Ongoing, Upcoming, Completed.
- As a user, I want to search, filter, sort, and group my trips.
- As a user, I want to view, edit, or delete any trip from this screen.

**User Flow:**
1. User navigates to "My Trips" from sidebar
2. Trips displayed in three sections: Ongoing / Upcoming / Completed
3. Each section shows trip cards with a short overview
4. User can search, filter, sort, and group using top controls
5. Clicking a card → navigates to Itinerary View (Screen 9)
6. Delete action → confirmation modal → soft-delete (is_deleted flag)
7. Edit action → navigates to Create Trip screen prefilled with existing data

**Functional Requirements:**
- Trips fetched from Supabase filtered by `user_id` (RLS enforced)
- Status determined by comparing trip dates to current date:
  - Ongoing: start_date ≤ today ≤ end_date
  - Upcoming: start_date > today
  - Completed: end_date < today
- Search: real-time client-side filter by trip name
- Sort: by created date (newest first), trip start date, or alphabetical
- Filter: by date range using date pickers
- Group By: by status (default), by destination country, or by year
- Delete: sets `is_deleted = true` — not a hard delete

**Components:**
- `<TripListPage />` — page container with sections
- `<TripStatusSection />` — "Ongoing", "Upcoming", "Completed" labeled groups
- `<TripCard />` — reusable card (shared with Dashboard)
- `<SearchFilterBar />` — search + filter + sort + group controls
- `<DeleteConfirmModal />` — confirmation dialog

**Empty State:** Illustrated "No trips yet" with "Create your first trip" CTA button

**Responsive Behavior:** Desktop: grid; Mobile: vertical list with swipe-to-delete gesture

---

### Module 5: Itinerary Builder Screen

**Purpose:** Interactive interface to build the full day-wise trip plan by adding/editing stops and activities.

**Screen Referenced:** Screen 5 (Build Itinerary Screen)

**User Stories:**
- As a user, I want to add multiple sections (stops) to my trip with names, descriptions, date ranges, and budgets.
- As a user, I want to reorder stops via drag-and-drop.
- As a user, I want to edit or delete any stop.

**User Flow:**
1. User arrives from Create Trip or clicks "Edit" from My Trips
2. Sees existing stops listed as Section 1, Section 2, Section 3... in order
3. Each section shows: title, description, date range (xxx to yyy), budget for section
4. User can expand each section to add activities
5. User can click "Add Stop" to append a new section
6. User can drag sections to reorder
7. User clicks "Save" → all changes persisted to Supabase

**Functional Requirements:**
- Sections (stops) are `trip_stops` records in the database
- Each stop has: name, description, city_id, start_date, end_date, budget_amount
- Drag-and-drop reordering updates `order_index` on each stop record
- Activities within a stop are managed in `activities` and `trip_activities` tables
- Auto-save on blur or debounced 2-second delay after last edit
- Manual "Save" button also available
- Budget field: numeric, optional, shows currency symbol based on user preference

**Components:**
- `<ItineraryBuilder />` — page container
- `<StopCard />` — draggable section card showing all stop details
- `<ActivityList />` — activities within a stop
- `<AddActivityModal />` — activity search and add dialog
- `<DragDropContainer />` — wraps stops with dnd-kit or react-beautiful-dnd

**API Dependencies:** GeoDB Cities API (city lookup), Foursquare/Yelp (activity suggestions per city)

**Edge Cases:**
- Stop date range outside trip date range → inline warning
- Duplicate city stops → allowed, with warning
- Budget sum exceeds trip total budget → show over-budget alert

**Responsive Behavior:** Single-column accordion-style on mobile; card layout on desktop

---

### Module 6: Itinerary View Screen (Timeline + Budget)

**Purpose:** Visual read-mode of the completed trip itinerary with budget section.

**Screen Referenced:** Screen 9 (Itinerary View Screen with Budget Section)

**User Stories:**
- As a user, I want to see my full trip laid out day by day.
- As a user, I want to see activities per day with their physical type and estimated expense.
- As a user, I want to toggle between a calendar view and a list view.
- As a user, I want to see a budget summary alongside the itinerary.

**User Flow:**
1. User selects a trip from My Trips or Dashboard
2. Lands on Itinerary View screen
3. Sees day-by-day layout grouped by city/stop (Day 1, Day 2, etc.)
4. Each day shows: date header, city name, activities with type label and expense
5. Group By / Filter / Sort / Search controls available at top
6. Toggle switch for Calendar / List view
7. Budget section shows total estimated vs actual spend breakdown
8. Can click "Edit" to switch to Itinerary Builder mode

**Functional Requirements:**
- Fetch trip with all stops and activities in a single Supabase join query
- Group activities by date, then by stop
- Calendar view: week-based grid with activities as blocks
- List view: accordion-style by day
- Budget section: aggregate cost from all `trip_activities.estimated_cost` fields
- Physical Activity label: tag showing activity type (e.g., "Sightseeing", "Food", "Adventure")
- Expense: shown per activity and totaled per day

**Components:**
- `<ItineraryViewPage />` — page container
- `<DayBlock />` — groups activities for a single day
- `<ActivityBlock />` — single activity with type badge and cost
- `<ViewToggle />` — list/calendar switch
- `<BudgetSummaryPanel />` — total/spent/remaining display with Recharts bar chart

**Responsive Behavior:** Mobile: list view default; Desktop: calendar view default with side-by-side budget panel

---

### Module 7: City Search Screen

**Purpose:** Discover and search cities to add to a trip.

**Screen Referenced:** Screen 8 (Activity Search / City Search Page)

**User Stories:**
- As a user, I want to search for cities by name.
- As a user, I want to filter cities by country or region.
- As a user, I want to add a city to my current trip.
- As a user, I want to see city details like cost index and popularity.

**User Flow:**
1. User navigates to City Search from sidebar or from within Itinerary Builder
2. Sees search bar, Group By / Filter / Sort controls
3. Types city name → debounced API call to GeoDB Cities API
4. Results show: city name, country, population, estimated cost index
5. Each result has a "View" button (detailed city info) and "Add to Trip" button
6. "Add to Trip" → adds city as a new stop in the current active trip

**Functional Requirements:**
- Search: GeoDB Cities API with debounce of 300ms
- Filter: by country, by population threshold, by region
- Results: paginated at 10 items, with "Load More" button
- "Add to Trip" only available when a trip is active in context
- City images: Unsplash API using city name as search query
- Caching: cache GeoDB results in localStorage for 24 hours to reduce API calls

**Components:**
- `<CitySearchPage />` — page container
- `<CitySearchBar />` — search input with debounce
- `<CityResultCard />` — city info card with image, name, country, controls
- `<CityFilterPanel />` — filter sidebar/dropdown

**API Dependencies:** GeoDB Cities API, Unsplash API

**Rate Limit Handling:** GeoDB free tier — 1 req/sec. Debounce + client-side caching enforced.

---

### Module 8: Activity Search Screen

**Purpose:** Browse and select activities for each stop in a trip.

**Screen Referenced:** Screen 8 (shared with City Search in wireframe)

**User Stories:**
- As a user, I want to search for activities by type (physical activity, food, sightseeing, etc.).
- As a user, I want to filter by cost, duration, and category.
- As a user, I want to add an activity to a specific stop in my trip.
- As a user, I want to see activity images, descriptions, and estimated costs.

**User Flow:**
1. User navigates to Activity Search from Itinerary Builder or sidebar
2. Selects a city context (pre-filled if coming from a stop)
3. Types activity name or browses by category (e.g., "Paragliding")
4. Results show: activity name, image, description, cost, duration, type tag
5. Each result has a "View" (full detail) and "Add to Trip" button
6. Added activity appears in the selected stop's activity list

**Functional Requirements:**
- Primary API: Foursquare Places API (venue search by city + category)
- Secondary API: Yelp Fusion API (restaurant and food activity search)
- Category filters: Physical Activity, Sightseeing, Food & Drink, Adventure, Culture, Shopping
- Cost filter: budget (<$20), mid-range ($20–$80), luxury (>$80)
- Duration filter: <1hr, 1–3hrs, half-day, full-day
- Activity cards show: name, category badge, estimated cost, description, Unsplash image
- "Add to Trip" stores activity in `trip_activities` with estimated cost

**Components:**
- `<ActivitySearchPage />` — page container
- `<ActivityFilterBar />` — category / cost / duration filters
- `<ActivityResultCard />` — activity card with all info and CTAs
- `<ActivityDetailModal />` — expanded view on "View" click

---

### Module 9: Trip Budget & Cost Breakdown + Invoice Screen

**Purpose:** Summarized financial view with cost breakdown and invoice generation.

**Screen Referenced:** Screen 14 (Expense Invoice / Billing Screen)

**User Stories:**
- As a user, I want to see a full breakdown of my trip costs by category (hotel, travel, activities, meals).
- As a user, I want to see total budget, total spent, and remaining balance.
- As a user, I want to see an itemized invoice with subtotal, tax, discount, and grand total.
- As a user, I want to download the invoice as a PDF or export it.
- As a user, I want to mark an invoice as paid.

**User Flow:**
1. User navigates to Budget / Invoice from a trip's detail page
2. Sees invoice header: Trip name, date range, city count, created by
3. Sees Traveler Details section with all travelers listed
4. Sees itemized table: Category | Description | Qty/Details | Unit Cost | Amount
5. Footer: Subtotal, Tax (5%), Discount, Grand Total
6. Budget Insights panel: Total Budget / Total Spent / Remaining
7. Buttons: Download Invoice, Export as PDF, Mark as Paid
8. "View Full Budget" links to chart view (pie/bar from Recharts)

**Functional Requirements:**
- Invoice data derived from `trip_activities.estimated_cost` + manually added line items
- Tax: configurable (default 5%), applied to subtotal
- Discount: optional, user-entered flat amount
- Grand Total = Subtotal + Tax − Discount
- Budget Insights: shows over-budget state in red if Remaining is negative (e.g., −$2000)
- PDF export: use browser print API or `jsPDF` library
- "Mark as Paid": updates `invoice_status` field in `trips` table
- Invoice ID: auto-generated format `INV-{tripId}-{random5digits}`

**Components:**
- `<InvoicePage />` — page container
- `<InvoiceHeader />` — trip metadata
- `<TravelerList />` — traveler names display
- `<InvoiceTable />` — itemized cost table
- `<InvoiceFooter />` — totals with tax/discount
- `<BudgetInsightsPanel />` — budget vs spent summary
- `<InvoiceActions />` — download, export, mark paid buttons
- `<BudgetChartModal />` — Recharts pie + bar chart view

**API Dependencies:** ExchangeRate API (for multi-currency support post-MVP)

---

### Module 10: Packing Checklist Screen

**Purpose:** Per-trip categorized packing checklist with progress tracking.

**Screen Referenced:** Screen 11 (Packing Checklist)

**User Stories:**
- As a user, I want to add items to a packing checklist for my trip.
- As a user, I want to categorize items (Documents, Clothing, Electronics, etc.).
- As a user, I want to check off items as I pack them and see progress.
- As a user, I want to reset the checklist for reuse on another trip.
- As a user, I want to share my checklist with travel companions.

**Wireframe Reference Data:**
- Trip: Paris & Rome Adventure
- Progress: 5/12 items packed
- Categories: Documents (3/4), Clothing (1/4), Electronics (1/3)
- Sample items: Passport, Flight Tickets, Travel Insurance, Hotel Booking Confirmation, Casual Shirts, Trousers, Comfortable Walking Shoes, Light Jacket, Phone Charger, Universal Power Adapter, Earphones

**Functional Requirements:**
- Items stored in `packing_items` table with `trip_id`, `category`, `name`, `is_packed`
- Add Item: inline input at bottom with category selector — "+ Add item to checklist"
- Check off: toggle `is_packed` boolean, updates progress counter
- Progress bar: (packed_count / total_count) × 100, shown per category and overall
- Categories: Documents, Clothing, Electronics, Toiletries, Miscellaneous (extensible)
- Reset All: sets all `is_packed` to false for the trip
- Share Checklist: generates a read-only shareable URL
- Delete item: swipe-to-delete on mobile, delete icon on desktop

**Components:**
- `<PackingChecklistPage />` — page container
- `<ChecklistProgressBar />` — overall + per-category progress
- `<ChecklistCategory />` — collapsible category group
- `<ChecklistItem />` — individual item with checkbox, name, delete
- `<AddItemInput />` — inline add item input
- `<ChecklistActions />` — Reset All / Share Checklist buttons

**Responsive Behavior:** Full-width single column on mobile; two-column category grid on desktop

---

### Module 11: Shared / Public Itinerary View Screen

**Purpose:** Public-facing page showing a read-only version of a shared itinerary.

**Screen Referenced:** Screen 10 (Community Tab Screen — partially), Screen 11 (Shared concept)

**User Stories:**
- As a user, I want to share my itinerary via a public URL.
- As a visitor, I want to view a shared itinerary without needing an account.
- As a visitor, I want to copy a shared trip into my own account.
- As a user, I want to share my itinerary to social media platforms.

**Functional Requirements:**
- Each trip has an optional `share_token` (UUID) stored in the `shared_trips` table
- Public URL format: `traveloop.com/share/{share_token}`
- View is fully read-only — no edit controls shown
- "Copy Trip" button: logged-in users can duplicate the trip into their account
- Social sharing: Open Graph meta tags for Twitter/Facebook/WhatsApp link previews
- Toggle sharing on/off from trip settings — toggling off invalidates the `share_token`
- No authentication required to view a public itinerary

**Components:**
- `<PublicItineraryPage />` — public-facing read-only layout
- `<ShareHeader />` — trip title, creator name, dates, city count
- `<PublicDayBlock />` — read-only day-by-day view
- `<CopyTripButton />` — prompts login if not authenticated, then copies trip
- `<SocialShareBar />` — Twitter / WhatsApp / Copy Link buttons

---

### Module 12: Community Tab Screen

**Purpose:** Social discovery feed of public itineraries shared by other users.

**Screen Referenced:** Screen 10 (Community Tab Screen)

**User Stories:**
- As a user, I want to explore public itineraries shared by other travelers.
- As a user, I want to filter and search community itineraries by destination or activity.
- As a user, I want to get inspired by what others have planned.

**Functional Requirements:**
- Displays all trips where `is_public = true` in the `shared_trips` table
- Each entry shows: trip title, creator name, destination cities, date range, activity count
- Search, Filter, Group By, Sort controls at top (same pattern as other list screens)
- Clicking a community trip navigates to its Public Itinerary View
- "Copy Trip" available on each community card

**Components:**
- `<CommunityPage />` — page container
- `<CommunityTripCard />` — public trip card with creator info
- `<CommunityFilterBar />` — search + filter + sort

---

### Module 13: User Profile / Settings Screen

**Purpose:** User settings to update profile information and manage preferences.

**Screen Referenced:** Screen 7 (User Profile Pages)

**User Stories:**
- As a user, I want to edit my name, email, profile photo, and bio.
- As a user, I want to see my preplanned and previous trips in one place.
- As a user, I want to delete my account.

**Functional Requirements:**
- Profile page sections: User photo (editable), User Details (name, email, city, country — editable), Preplanned Trips list, Previous Trips list
- Edit mode: in-place editing with save/cancel controls
- Photo update: new upload to Supabase Storage, update `profiles.avatar_url`
- Language preference: dropdown (English default — extensible)
- Delete Account: confirmation modal → soft-delete user record → Supabase Auth user disabled
- Preplanned Trips: filter `trips` where `start_date > today`
- Previous Trips: filter `trips` where `end_date < today`

**Components:**
- `<ProfilePage />` — page container
- `<ProfileHeader />` — avatar + name + edit button
- `<ProfileDetailsForm />` — editable fields
- `<TripHistorySection />` — preplanned and previous trip lists
- `<DeleteAccountModal />` — destructive action confirmation

---

### Module 14: Trip Notes / Journal Screen

**Purpose:** Simple note-taking tied to a specific trip, stop, or day.

**Screen Referenced:** Screen 13 (Trip Notes / Journal Screen)

**User Stories:**
- As a user, I want to add notes to my trip for hotel check-in details, local contacts, or day-specific reminders.
- As a user, I want to filter notes by All / by Day / by Stop.
- As a user, I want to see timestamps on all notes.
- As a user, I want to edit or delete any note.

**Wireframe Reference Data:**
- Trip: Paris & Rome Adventure
- Sample Note: "Hotel check-in details - Rome stop: check in after 2pm, room 302, breakfast included (7–10am)"
- Displayed on Day 3: June 14, 2025
- Filter tabs: All / by Day / by Stop

**Functional Requirements:**
- Notes stored in `notes` table with `trip_id`, `stop_id` (optional), `date` (optional), `content`, `created_at`
- "+ Add Note" button opens an inline text area with optional Day and Stop selectors
- Filter tabs: All (default), by Day (grouped by date), by Stop (grouped by `stop_id`)
- Notes listed in reverse chronological order within each group
- Edit: inline edit mode on click
- Delete: with confirmation
- Timestamps displayed as relative time ("3 days ago") and absolute date on hover

**Components:**
- `<JournalPage />` — page container
- `<JournalFilterTabs />` — All / by Day / by Stop tabs
- `<NoteCard />` — individual note with content, timestamp, edit/delete controls
- `<AddNoteForm />` — text area + day/stop selectors + save button

---

### Module 15: Admin / Analytics Dashboard

**Purpose:** Admin-only interface to monitor platform usage, user trends, and popular content.

**Screen Referenced:** Screen 12 (Admin Panel Screen)

**User Stories:**
- As an admin, I want to see user management controls and view all trips.
- As an admin, I want to see which cities and activities are most popular.
- As an admin, I want to see user engagement analytics and trends.

**Functional Requirements:**
- Accessible only to users with `role = 'admin'` in `profiles` table
- RLS policy blocks all non-admin access to admin queries
- Sections:
  - **Manage Users:** table of all users with name, email, trip count, join date, account status
  - **Popular Cities:** ranked list of most-added cities across all trips
  - **Popular Activities:** ranked list of most-added activities
  - **User Trends & Analytics:** charts of new users per week, trips created per week, activity additions
- All data aggregated via Supabase Edge Functions or direct PostgreSQL aggregate queries
- Search, Filter, Group By, Sort at top of each section

**Components:**
- `<AdminDashboardPage />` — tabbed page container
- `<UserManagementTable />` — data table with search and pagination
- `<PopularCitiesChart />` — Recharts horizontal bar chart
- `<PopularActivitiesChart />` — Recharts horizontal bar chart
- `<UserTrendsChart />` — Recharts line chart (weekly new users, weekly trips)

**Security:** Route-level guard checks `profiles.role === 'admin'`. RLS policies on `profiles` table enforce admin-only data access.

---

## 7. Detailed User Flows

### Flow 1: User Onboarding

```
Landing Page → Registration Screen →
  Fill: First Name, Last Name, Email, Password, Phone, City, Country, Photo →
  Submit → Profile created in Supabase →
  Redirect to Dashboard →
  Welcome state: "No trips yet" empty state shown →
  User clicks "Plan a Trip" → begins trip creation
```

### Flow 2: Trip Creation

```
Dashboard → Click "Plan a Trip" →
  Create Trip Form:
    Enter trip name →
    Select start + end dates →
    Search & select city (GeoDB API) →
    See activity suggestions (Foursquare API) →
    Click "Add Another Section" if multi-stop →
    Repeat city/date selection for each stop →
  Click "Create" →
    Trip record + stop records saved to Supabase →
  Redirect to Itinerary Builder
```

### Flow 3: Adding Stops and Activities

```
Itinerary Builder →
  See existing stops as accordion sections →
  Click "Add Stop" →
    Search city → select →
    Enter date range + description + budget →
    Save stop →
  Expand a stop section →
    Click "Add Activity" →
      Activity Search Modal opens →
      Filter by type / cost / duration →
      Select activity → "Add to Trip" →
      Activity added to stop with estimated cost →
  Drag stops to reorder →
  Auto-save triggers after 2 seconds of inactivity
```

### Flow 4: Budget Management

```
Trip Detail View →
  Click "Budget / Invoice" tab →
  See itemized invoice table (auto-populated from activities) →
  Add manual line items (e.g., "Flight: $12,000") →
  Tax (5%) auto-calculated →
  Enter discount if applicable →
  Grand Total displayed →
  Budget Insights: Total Budget / Total Spent / Remaining →
  If over budget → remaining shown in red →
  Click "Download Invoice" → browser print dialog →
  Click "Export as PDF" → jsPDF generates PDF →
  Click "Mark as Paid" → invoice_status updated
```

### Flow 5: Sharing an Itinerary

```
Trip Detail View →
  Click "Share" button →
  Toggle sharing on →
  System generates share_token + inserts into shared_trips table →
  Public URL displayed: traveloop.com/share/{token} →
  Social sharing buttons shown (Twitter / WhatsApp / Copy Link) →
  User copies link and shares →
  Recipient opens link without login →
  Sees read-only itinerary with "Copy Trip" option
```

### Flow 6: Packing Checklist Usage

```
Trip Detail View → Click "Packing" tab →
  Checklist shown with categories and items →
  Overall progress bar: 5/12 packed →
  User checks off items as they pack →
  Progress updates in real time →
  User clicks "+ Add item to checklist" →
    Types item name + selects category →
    Item added instantly →
  User clicks "Reset All" →
    Confirmation modal →
    All items unchecked →
  User clicks "Share Checklist" →
    Read-only checklist URL generated
```

### Flow 7: Writing a Trip Journal Entry

```
Trip Detail View → Click "Notes / Journal" tab →
  See existing notes filtered by "All" →
  Click "+ Add Note" →
    Text area appears →
    Type note content →
    Optionally select Day (date picker) or Stop (dropdown) →
    Click Save →
    Note appears in list with timestamp →
  Click filter tab "by Day" →
    Notes grouped by date, sorted chronologically →
  Click filter tab "by Stop" →
    Notes grouped by stop city name
```

---

## 8. Frontend Architecture

### Folder Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout with providers
│   ├── routes.tsx                  # React Router v6 route definitions
│   └── providers.tsx               # Supabase, Zustand, QueryClient providers
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── dashboard/
│   │   └── DashboardPage.tsx
│   ├── trips/
│   │   ├── CreateTripPage.tsx
│   │   ├── MyTripsPage.tsx
│   │   ├── TripDetailPage.tsx
│   │   └── [tripId]/
│   │       ├── ItineraryBuilder.tsx
│   │       ├── ItineraryView.tsx
│   │       ├── BudgetPage.tsx
│   │       ├── PackingPage.tsx
│   │       └── JournalPage.tsx
│   ├── search/
│   │   ├── CitySearchPage.tsx
│   │   └── ActivitySearchPage.tsx
│   ├── community/
│   │   └── CommunityPage.tsx
│   ├── share/
│   │   └── PublicItineraryPage.tsx
│   ├── profile/
│   │   └── ProfilePage.tsx
│   └── admin/
│       └── AdminDashboardPage.tsx
│
├── components/
│   ├── ui/                         # ShadCN UI primitives (Button, Input, Card, etc.)
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── MobileNav.tsx
│   │   ├── TopBar.tsx
│   │   └── DashboardLayout.tsx
│   ├── trips/
│   │   ├── TripCard.tsx
│   │   ├── StopCard.tsx
│   │   ├── ActivityBlock.tsx
│   │   └── DayBlock.tsx
│   ├── budget/
│   │   ├── InvoiceTable.tsx
│   │   ├── BudgetInsightsPanel.tsx
│   │   └── BudgetChartModal.tsx
│   ├── packing/
│   │   ├── ChecklistCategory.tsx
│   │   └── ChecklistItem.tsx
│   ├── journal/
│   │   └── NoteCard.tsx
│   ├── search/
│   │   ├── CityResultCard.tsx
│   │   └── ActivityResultCard.tsx
│   ├── community/
│   │   └── CommunityTripCard.tsx
│   ├── admin/
│   │   ├── UserManagementTable.tsx
│   │   └── UserTrendsChart.tsx
│   └── shared/
│       ├── SearchFilterBar.tsx
│       ├── EmptyState.tsx
│       ├── SkeletonCard.tsx
│       ├── ConfirmModal.tsx
│       └── ProgressBar.tsx
│
├── hooks/
│   ├── useTrips.ts                 # CRUD for trips
│   ├── useStops.ts                 # CRUD for trip stops
│   ├── useActivities.ts            # CRUD for activities
│   ├── usePacking.ts               # Packing checklist logic
│   ├── useNotes.ts                 # Journal notes logic
│   ├── useCitySearch.ts            # GeoDB API hook
│   ├── useActivitySearch.ts        # Foursquare/Yelp API hook
│   ├── useAuth.ts                  # Supabase Auth wrapper
│   └── useProfile.ts               # Profile fetch/update
│
├── store/
│   ├── authStore.ts                # Zustand: user session
│   ├── tripStore.ts                # Zustand: active trip context
│   └── uiStore.ts                  # Zustand: sidebar open/close, modals
│
├── services/
│   ├── supabase.ts                 # Supabase client initialization
│   ├── tripsService.ts             # Supabase queries for trips
│   ├── stopsService.ts             # Supabase queries for stops
│   ├── activitiesService.ts        # Supabase queries for activities
│   ├── geoDbService.ts             # GeoDB API calls
│   ├── foursquareService.ts        # Foursquare API calls
│   ├── unsplashService.ts          # Unsplash API calls
│   └── exchangeRateService.ts      # ExchangeRate API calls
│
├── lib/
│   ├── utils.ts                    # cn(), formatDate(), formatCurrency()
│   ├── validators.ts               # Zod schemas
│   └── constants.ts                # App-wide constants
│
└── types/
    ├── trip.types.ts
    ├── stop.types.ts
    ├── activity.types.ts
    ├── user.types.ts
    └── api.types.ts
```

### Routing Structure

```typescript
// routes.tsx
const routes = [
  { path: "/", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/app",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "trips", element: <MyTripsPage /> },
      { path: "trips/new", element: <CreateTripPage /> },
      { path: "trips/:tripId/builder", element: <ItineraryBuilder /> },
      { path: "trips/:tripId/view", element: <ItineraryView /> },
      { path: "trips/:tripId/budget", element: <BudgetPage /> },
      { path: "trips/:tripId/packing", element: <PackingPage /> },
      { path: "trips/:tripId/journal", element: <JournalPage /> },
      { path: "cities", element: <CitySearchPage /> },
      { path: "activities", element: <ActivitySearchPage /> },
      { path: "community", element: <CommunityPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "admin", element: <AdminGuard><AdminDashboardPage /></AdminGuard> },
    ]
  },
  { path: "/share/:token", element: <PublicItineraryPage /> },
];
```

### State Management (Zustand)

```typescript
// authStore.ts
interface AuthState {
  user: User | null;
  profile: Profile | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  logout: () => void;
}

// tripStore.ts
interface TripState {
  activeTripId: string | null;
  trips: Trip[];
  setActiveTrip: (id: string) => void;
  setTrips: (trips: Trip[]) => void;
}
```

### Form Handling

All forms use React Hook Form with Zod resolvers:

```typescript
const schema = z.object({
  tripName: z.string().min(1, "Trip name is required").max(100),
  startDate: z.date(),
  endDate: z.date(),
}).refine(data => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});
```

### Error Boundaries

- Global `<ErrorBoundary />` wraps the entire app — catches unexpected render errors
- Per-route `<Suspense fallback={<PageSkeleton />}>` for lazy-loaded pages
- API errors caught in service layer, propagated via React Query error states
- Toast notifications (Sonner) for non-blocking user-facing errors

### Lazy Loading

```typescript
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const CommunityPage = lazy(() => import('./pages/community/CommunityPage'));
const PublicItineraryPage = lazy(() => import('./pages/share/PublicItineraryPage'));
```

---

## 9. Backend Architecture

### Supabase Architecture

Traveloop uses Supabase as its complete backend-as-a-service:

- **Database:** PostgreSQL 15 with full relational schema
- **Auth:** Supabase Auth (JWT-based, email/password)
- **Storage:** Supabase Storage for profile photos and trip cover images
- **Edge Functions:** Deno-based serverless functions for complex operations
- **Realtime:** Supabase Realtime for future collaboration features
- **RLS:** Row-Level Security on all tables enforcing per-user data isolation

### Database Access Layer

All Supabase calls are abstracted into service modules (see folder structure). No raw Supabase calls exist in component files. Services return typed objects matching TypeScript interfaces.

```typescript
// tripsService.ts
export async function getTripsByUser(userId: string): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select(`*, trip_stops(*, activities(*))`)
    .eq('user_id', userId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}
```

### Edge Functions

| Function | Purpose |
|---|---|
| `generate-share-token` | Generates UUID share token for public itinerary sharing |
| `calculate-trip-budget` | Aggregates all activity costs to produce trip budget summary |
| `copy-shared-trip` | Duplicates a public trip into an authenticated user's account |
| `admin-analytics` | Aggregates platform-wide stats for admin dashboard |
| `export-invoice-pdf` | Future: server-side PDF generation |

### API Flow

```
Client Component
  → Hook (useTrips.ts)
    → Service (tripsService.ts)
      → Supabase Client
        → PostgreSQL (RLS enforced)
          → Returns typed data
        → Edge Function (for complex ops)
          → Returns processed result
    → React Query cache updated
  → Component re-renders with new data
```

### File Upload Architecture

```
User selects file → FileReader reads as ArrayBuffer
→ supabase.storage.from('avatars').upload(path, file)
→ getPublicUrl() returns CDN-backed public URL
→ URL stored in profiles.avatar_url
→ All subsequent renders use CDN URL directly
```

### Realtime Sync (Future)

Supabase Realtime channels will be used for:
- Live collaboration on shared itineraries
- Real-time packing checklist sync between travel companions

---

## 10. Database Design

### Complete Relational Schema

```sql
-- ============================================================
-- USERS (managed by Supabase Auth — auth.users)
-- ============================================================

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  city TEXT,
  country TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  language_preference TEXT DEFAULT 'en',
  additional_info TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRIPS
-- ============================================================
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_budget NUMERIC(12, 2),
  invoice_status TEXT DEFAULT 'pending' CHECK (invoice_status IN ('pending', 'paid')),
  is_public BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_start_date ON trips(start_date);

-- ============================================================
-- TRIP STOPS
-- ============================================================
CREATE TABLE trip_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  city_id TEXT,                           -- GeoDB city ID
  country TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  budget_amount NUMERIC(12, 2),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX idx_trip_stops_order ON trip_stops(trip_id, order_index);

-- ============================================================
-- ACTIVITIES (Global catalog — reusable across trips)
-- ============================================================
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,                           -- Sightseeing, Food, Adventure, etc.
  estimated_cost NUMERIC(10, 2),
  duration_hours NUMERIC(4, 1),
  image_url TEXT,
  source TEXT,                             -- 'foursquare', 'yelp', 'manual'
  source_id TEXT,                          -- External API ID
  city_name TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activities_category ON activities(category);
CREATE INDEX idx_activities_city ON activities(city_name);

-- ============================================================
-- TRIP ACTIVITIES (Join: stop ↔ activity, with trip-specific data)
-- ============================================================
CREATE TABLE trip_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  stop_id UUID REFERENCES trip_stops(id) ON DELETE SET NULL,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  custom_name TEXT,                        -- If manually added (not from catalog)
  date DATE,
  start_time TIME,
  estimated_cost NUMERIC(10, 2),
  actual_cost NUMERIC(10, 2),
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trip_activities_trip_id ON trip_activities(trip_id);
CREATE INDEX idx_trip_activities_stop_id ON trip_activities(stop_id);

-- ============================================================
-- PACKING ITEMS
-- ============================================================
CREATE TABLE packing_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'Miscellaneous',
  name TEXT NOT NULL,
  is_packed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_packing_items_trip_id ON packing_items(trip_id);

-- ============================================================
-- NOTES / JOURNAL
-- ============================================================
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  stop_id UUID REFERENCES trip_stops(id) ON DELETE SET NULL,
  date DATE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notes_trip_id ON notes(trip_id);
CREATE INDEX idx_notes_date ON notes(trip_id, date);

-- ============================================================
-- SHARED TRIPS
-- ============================================================
CREATE TABLE shared_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  share_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  is_active BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  copy_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_shared_trips_token ON shared_trips(share_token);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                       -- 'trip_shared', 'trip_copied', etc.
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id, is_read);

-- ============================================================
-- ANALYTICS EVENTS
-- ============================================================
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,                -- 'trip_created', 'activity_added', etc.
  properties JSONB,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at);
```

### Row-Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_trips ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read and update only their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trips: users can CRUD only their own trips
CREATE POLICY "Users can manage own trips" ON trips
  FOR ALL USING (auth.uid() = user_id);

-- Shared trips: anyone can read active shared trips (no auth required)
CREATE POLICY "Public can read active shared trips" ON shared_trips
  FOR SELECT USING (is_active = TRUE);

-- Admin: full access for admin role
CREATE POLICY "Admins have full access" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

## 11. API Architecture

### GeoDB Cities API

**Purpose:** City search and discovery — powering City Search screen and trip stop creation.

**Key Endpoints:**
- `GET /v1/geo/cities?namePrefix={query}&limit=10` — search cities by prefix
- `GET /v1/geo/cities/{cityId}` — get city details

**Usage Flow:** User types in city search input → 300ms debounce → GET request with namePrefix → results displayed in dropdown

**Rate Limits:** 1 request/second on free tier. Handled by: 300ms debounce + client-side result caching in localStorage for 24 hours.

**Caching Strategy:** Cache results by query string in localStorage. Cache TTL: 24 hours. On cache hit: skip API call entirely.

**Failure Handling:** On API failure → show "Search unavailable, enter city name manually" with a plain text input fallback.

**Data Normalization:**
```typescript
interface NormalizedCity {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  population: number;
  latitude: number;
  longitude: number;
}
```

---

### Foursquare Places API

**Purpose:** Activity and venue discovery for each trip stop.

**Key Endpoints:**
- `GET /v3/places/search?query={query}&near={city}&categories={categoryId}` — search venues

**Usage Flow:** User selects a city → Foursquare called with city name + category → results shown in Activity Search

**Rate Limits:** 100,000 calls/day on free tier — sufficient for hackathon.

**Caching Strategy:** Cache results by `city+category` key in React Query for session duration.

**Data Normalization:**
```typescript
interface NormalizedActivity {
  id: string;
  name: string;
  category: string;
  description?: string;
  imageUrl?: string;
  estimatedCost?: number;
  durationHours?: number;
  source: 'foursquare';
  sourceId: string;
}
```

---

### Yelp Fusion API

**Purpose:** Restaurant and food-specific activity search — supplementing Foursquare for food experiences.

**Key Endpoints:**
- `GET /v3/businesses/search?location={city}&categories=restaurants&price={1,2,3,4}`

**Usage Flow:** When category filter = "Food & Drink" → Yelp Fusion queried in parallel with Foursquare → results merged and deduplicated

**Rate Limits:** 500 calls/day on free tier. Used only for food category to conserve quota.

**Failure Handling:** If Yelp call fails → show Foursquare results only, no error shown to user.

---

### Unsplash API

**Purpose:** Cover images for cities and destinations throughout the UI.

**Key Endpoints:**
- `GET /photos/random?query={cityName}&orientation=landscape` — fetch a random city photo

**Usage Flow:** When a city is selected or a trip is created → Unsplash queried with city name → first result used as cover image

**Rate Limits:** 50 requests/hour on demo tier. Cache all fetched images by city name in localStorage indefinitely.

**Cost Optimization:** Fetch once per city name, cache forever client-side. Never re-fetch for the same city.

---

### OpenWeather API

**Purpose:** Show current or forecasted weather for trip destinations (future enhancement, architecture included for MVP).

**Key Endpoints:**
- `GET /data/2.5/forecast?q={cityName}&appid={key}&units=metric`

**Usage Flow (Post-MVP):** On Itinerary View, weather widget shows 5-day forecast for each stop city.

**Rate Limits:** 60 calls/minute on free tier.

---

### ExchangeRate API

**Purpose:** Multi-currency budget display.

**Key Endpoints:**
- `GET /v6/{apiKey}/latest/{baseCurrency}` — get exchange rates

**Usage Flow:** User selects preferred currency in Profile Settings → budget amounts converted and displayed in selected currency

**Caching Strategy:** Exchange rates cached for 1 hour in localStorage.

---

### Gemini API

**Purpose:** AI itinerary generation and travel recommendations (Phase 3 feature — architecture defined now).

**Usage Flow:**
1. User clicks "Generate with AI" on Create Trip screen
2. Prompt constructed: `"Create a {days}-day itinerary for {cities} with a budget of {budget}. Include activities for each day with estimated costs."`
3. Gemini API called via Edge Function (to protect API key server-side)
4. Response parsed into structured `trip_stops` + `trip_activities` format
5. Pre-fills the Itinerary Builder for user review and editing

**Prompt Engineering:**
```
System: You are a professional travel planner. Return ONLY a valid JSON object.
User: Plan a 7-day trip to Paris and Rome for 2 travelers with a budget of $5000.
      Return format: { stops: [{ city, days, activities: [{ name, category, estimatedCost, day }] }] }
```

**Security:** Gemini API key stored in Supabase Edge Function environment — never exposed to client.

---

## 12. UI/UX System

### Design Principles

1. **Clarity first:** Every screen has one primary action. Visual hierarchy guides the user's eye.
2. **Progressive disclosure:** Complex features (budget, packing, journal) are tabs within a trip — not overwhelming upfront.
3. **Consistency:** Same search/filter/sort/group controls appear on every list screen.
4. **Delight:** Framer Motion animations make transitions feel smooth, not jarring.
5. **Mobile-first:** Every component is designed for 375px first, then enhanced for larger screens.

### Typography System

```css
/* Font: Inter (Google Fonts) */
--font-sans: 'Inter', sans-serif;

/* Scale */
--text-xs: 0.75rem;    /* 12px — labels, timestamps */
--text-sm: 0.875rem;   /* 14px — body secondary */
--text-base: 1rem;     /* 16px — body primary */
--text-lg: 1.125rem;   /* 18px — card titles */
--text-xl: 1.25rem;    /* 20px — section headings */
--text-2xl: 1.5rem;    /* 24px — page headings */
--text-3xl: 1.875rem;  /* 30px — hero headings */
```

### Color Palette

```css
/* Brand */
--color-primary: #6C63FF;          /* Purple — primary actions */
--color-primary-light: #EEF2FF;    /* Light purple — hover states */
--color-secondary: #F59E0B;        /* Amber — highlights, badges */

/* Neutrals */
--color-background: #F8FAFC;       /* Off-white background */
--color-surface: #FFFFFF;          /* Card surfaces */
--color-border: #E2E8F0;           /* Borders */
--color-text-primary: #1E293B;     /* Dark slate — primary text */
--color-text-secondary: #64748B;   /* Medium slate — secondary text */
--color-text-muted: #94A3B8;       /* Light slate — placeholders */

/* Semantic */
--color-success: #10B981;          /* Green — paid, packed */
--color-warning: #F59E0B;          /* Amber — upcoming, caution */
--color-error: #EF4444;            /* Red — over budget, errors */
--color-info: #3B82F6;             /* Blue — informational */
```

### Component Behavior

- **Buttons:** Primary (filled purple), Secondary (outlined), Destructive (red). All have 150ms transition on hover.
- **Cards:** White background, `rounded-xl`, `shadow-sm` default, `shadow-md` on hover with 200ms transition.
- **Inputs:** Rounded-lg border, focus ring in primary purple, inline error text in red below the field.
- **Modals:** Center-screen overlay with backdrop blur, Framer Motion fade + scale animation (200ms).
- **Toasts:** Bottom-right corner via Sonner, auto-dismiss after 4 seconds.
- **Skeleton loaders:** Pulse animation matching the shape of the loading content.

### Animation Strategy (Framer Motion)

```typescript
// Page transition
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } }
};

// Card entrance (staggered)
const containerVariants = {
  animate: { transition: { staggerChildren: 0.05 } }
};
const cardVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 }
};
```

### Sidebar Navigation

- Desktop: fixed left sidebar, 240px wide, always visible
- Mobile: hidden by default, slide-in drawer triggered by hamburger icon
- Navigation items: Dashboard, My Trips, City Search, Activity Search, Community, Profile
- Active state: purple background pill on active route
- Admin item: visible only when `profile.role === 'admin'`

### Responsive Breakpoints

```css
sm: 640px   /* Large mobile / small tablet */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Accessibility

- All interactive elements have `aria-label` attributes
- Color contrast ratio minimum 4.5:1 (WCAG AA)
- Focus visible ring on all keyboard-navigable elements
- Form errors announced to screen readers via `aria-describedby`
- Skip-to-main-content link at top of page
- All images have descriptive `alt` text

### Keyboard Navigation

- Tab order follows visual layout
- Escape closes all modals
- Enter submits focused forms
- Arrow keys navigate dropdown menus

---

## 13. Security Architecture

### Authentication Flow

1. User submits credentials → Supabase Auth validates
2. On success: Supabase returns JWT access token + refresh token
3. Tokens stored in memory (access) + httpOnly-equivalent Supabase session (refresh)
4. Token auto-refreshed by Supabase client before expiry
5. On logout: both tokens invalidated via `supabase.auth.signOut()`

### Authorization

- **Route-level:** `<ProtectedRoute />` component checks `authStore.user` — redirects to `/` if null
- **Admin routes:** `<AdminGuard />` additionally checks `profile.role === 'admin'`
- **Database-level:** RLS policies enforce per-user data isolation — no user can query another user's trips regardless of client-side bypasses

### Input Validation

- **Client-side:** Zod schemas validate all form inputs before submission
- **Database-level:** PostgreSQL constraints (NOT NULL, CHECK, UNIQUE) enforce data integrity
- **Never trust client:** All critical operations validated server-side via Supabase functions or PostgreSQL constraints

### OWASP Protections

- **XSS:** React's JSX escapes all output by default. No `dangerouslySetInnerHTML` used.
- **CSRF:** Supabase JWT-based auth is not cookie-dependent — CSRF not applicable.
- **SQL Injection:** All database queries use Supabase parameterized query builder — no raw SQL with user input.
- **Insecure Direct Object References:** RLS policies ensure users can only access their own data — even if they guess another user's UUID.
- **Rate Limiting:** Supabase Auth has built-in rate limiting on auth endpoints.

### Secure File Uploads

- File type validation: only `image/jpeg`, `image/png`, `image/webp` accepted
- File size limit: maximum 5MB enforced client-side before upload
- Files stored in Supabase Storage with public read, authenticated write policies
- Uploaded file URLs are CDN-backed public URLs — no signed URL needed for images

### API Key Security

- All third-party API keys stored in environment variables (`.env.local`)
- Deployed to Vercel as encrypted environment variables
- Sensitive keys (Gemini) proxied via Supabase Edge Functions — never exposed to browser
- Public-safe keys (Unsplash, GeoDB) used directly in client with usage limits and domain restrictions configured in respective API consoles

---

## 14. Performance Optimization Strategy

### Lazy Loading

- All pages lazy-loaded with `React.lazy()` + `Suspense`
- Images use native `loading="lazy"` attribute
- Activity Search results virtualized with `react-window` for large lists

### Image Optimization

- Unsplash images requested at appropriate resolution: `?w=400&h=300&fit=crop` parameters
- `next/image`-equivalent optimization not applicable (Vite + React) — use Unsplash URL params directly
- Profile avatars stored at max 200×200px, served from Supabase CDN

### Query Optimization

- React Query used for all Supabase data fetching with:
  - `staleTime: 60 * 1000` (1 minute) for trip lists
  - `cacheTime: 5 * 60 * 1000` (5 minutes) for city search results
- Supabase queries use `select()` with explicit field lists — never `select('*')` in production
- Trip detail query uses a single join: `trips → trip_stops → trip_activities → activities`

### API Caching

- GeoDB city search results: localStorage cache, 24-hour TTL
- Unsplash city images: localStorage cache, no TTL (images are stable)
- Exchange rates: localStorage cache, 1-hour TTL
- Foursquare results: React Query cache, session-duration

### Optimistic UI

- Packing checklist item toggle: updates UI immediately, syncs to Supabase in background
- Note add/delete: optimistic update with rollback on failure
- Trip stop reorder: position updated visually on drag, persisted on drop completion

### Pagination

- My Trips list: initially loads 12 trips, "Load More" fetches next 12 via Supabase `.range()`
- City search results: 10 per page with "Load More"
- Activity search results: 12 per page

---

## 15. AI Features

### AI Itinerary Generator (Phase 3)

**Architecture:**
1. User clicks "✨ Generate with AI" on Create Trip screen
2. Client sends: destination cities, trip duration, budget, travel style (adventure / relaxed / cultural)
3. Request goes to Supabase Edge Function (`generate-itinerary`)
4. Edge Function constructs prompt and calls Gemini API
5. Response parsed into structured JSON → returned to client
6. Client pre-fills Itinerary Builder with generated stops and activities
7. User reviews, edits, and saves

**Prompt Engineering:**
```
System Prompt:
You are an expert travel planner. Return ONLY valid JSON matching this schema exactly.
No explanations, no markdown, no preamble.

Schema: {
  "stops": [{
    "city": string,
    "country": string,
    "days": number,
    "activities": [{
      "name": string,
      "category": "Sightseeing|Food|Adventure|Culture|Shopping",
      "day": number,
      "estimatedCost": number,
      "durationHours": number,
      "description": string
    }]
  }]
}

User Prompt Template:
"Plan a {totalDays}-day trip to {cities} for {travelerCount} traveler(s)
with a total budget of ${budget} USD.
Travel style: {style}.
Include {activitiesPerDay} activities per day.
Return valid JSON only."
```

**Context Handling:** Conversation history not maintained — each generation is stateless. User preferences (travel style, budget) from Profile Settings pre-populate the prompt.

### AI Travel Assistant (Phase 3)

A chat widget accessible from any trip screen. User can ask:
- "What should I pack for Tokyo in December?"
- "Is my Paris + Rome budget realistic?"
- "What's the best order for my stops?"

Implemented as a floating chat bubble. Messages sent to Gemini with trip context injected into system prompt.

### AI Packing Suggestions (Phase 3)

When creating or editing packing checklist, AI button generates suggested items based on:
- Destination countries (weather, culture)
- Trip duration
- Activity types in the itinerary

**Prompt:** `"Suggest a packing list for a {days}-day trip to {cities} including {activityTypes}. Format as JSON array of {category, items[]} objects."`

### AI Travel Summary (Phase 3)

After a trip's end_date passes, AI generates a shareable travel summary:
- "Your 10-day adventure across 3 cities, 24 activities, and $3,200 spent..."
- Generated from trip data, shared to Community tab optionally

---

## 16. DevOps & Deployment

### Tech Stack Summary

- **Hosting:** Vercel (frontend)
- **Backend:** Supabase (managed — no self-hosting needed for hackathon)
- **CI/CD:** GitHub Actions + Vercel auto-deploy

### Environment Setup

```bash
# .env.local (never committed to git)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_GEODB_API_KEY=xxx
VITE_FOURSQUARE_API_KEY=xxx
VITE_YELP_API_KEY=xxx
VITE_UNSPLASH_ACCESS_KEY=xxx
VITE_OPENWEATHER_API_KEY=xxx
VITE_EXCHANGERATE_API_KEY=xxx
VITE_POSTHOG_KEY=xxx

# Supabase Edge Function secrets (stored in Supabase dashboard)
GEMINI_API_KEY=xxx
```

### Branching Strategy

```
main          ← Production (auto-deploys to Vercel)
  └── dev     ← Integration branch
        └── feature/xxx  ← Feature branches (one per screen/module)
        └── fix/xxx      ← Bug fix branches
```

### Deployment Flow

1. Developer pushes to `feature/xxx` branch
2. Pull Request created against `dev`
3. Vercel creates a preview deployment automatically
4. PR reviewed (for hackathon: self-review)
5. Merged to `dev` → staging preview deployment updated
6. When ready for demo: merge `dev` → `main` → production deployment triggered

### Rollback Strategy

- Vercel: one-click rollback to any previous deployment from Vercel dashboard
- Supabase: database migrations are versioned. Rollback via migration revert script.
- No automated rollback — manual rollback acceptable for hackathon scope.

### Monitoring & Error Tracking

- **PostHog:** User analytics, funnel tracking, session recording
- **Vercel Analytics:** Core Web Vitals, page load performance
- **Supabase Dashboard:** Database query performance, auth error logs, storage usage
- **Browser console:** For hackathon — errors logged to console. Production: integrate Sentry.

---

## 17. Analytics & Tracking

### PostHog Integration

```typescript
// In app/providers.tsx
posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: 'https://app.posthog.com',
  capture_pageview: true,
});
```

### Key Events Tracked

| Event | Properties | Purpose |
|---|---|---|
| `trip_created` | `{ tripId, stopCount, totalDays }` | Funnel: creation rate |
| `activity_added` | `{ tripId, stopId, category, cost }` | Activity engagement |
| `budget_viewed` | `{ tripId, totalBudget }` | Budget feature adoption |
| `packing_item_checked` | `{ tripId, category }` | Packing engagement |
| `itinerary_shared` | `{ tripId }` | Sharing funnel |
| `community_trip_viewed` | `{ sourceTripId }` | Community engagement |
| `invoice_downloaded` | `{ tripId, grandTotal }` | Invoice feature usage |

### Funnels Tracked

1. **Signup → First Trip Created** — measures onboarding completion
2. **Trip Created → Itinerary Built** — measures builder engagement
3. **Itinerary Built → Budget Viewed** — measures budget feature adoption
4. **Itinerary Built → Shared** — measures sharing funnel

---

## 18. Scalability Strategy

### Database Scaling

- **Supabase Pro:** Upgrade from free tier adds connection pooling (PgBouncer), higher compute, read replicas
- **Indexing:** All foreign keys and frequently queried columns are indexed (defined in schema above)
- **Partitioning (Future):** `analytics_events` table partitioned by month when data volume grows
- **Archive strategy:** Trips with `is_deleted = true` and `end_date` > 2 years old moved to archive table

### API Scaling

- **Rate limit management:** Client-side caching reduces API calls by 70%+ for repeated searches
- **Edge Function scaling:** Supabase Edge Functions auto-scale — no manual configuration
- **CDN:** All static assets served from Vercel's global CDN; Unsplash and Supabase Storage images served from their CDNs

### Search Indexing Strategy (Future)

- When city/activity catalog grows beyond API-sourced results: implement PostgreSQL full-text search on `activities` table using `tsvector` + `GIN` index
- For production scale: Algolia integration for instant search

### Microservices Migration Plan (Phase 4)

Current monolithic Supabase backend can be decomposed into:
- **Trip Service:** Manages trip, stop, activity CRUD
- **Search Service:** City and activity search with caching layer
- **Media Service:** Image upload, processing, CDN management
- **Notification Service:** Email and in-app notifications
- **AI Service:** Gemini API proxy and prompt management

Each service deployed as Supabase Edge Functions or Node.js microservices on Railway/Fly.io.

---

## 19. Monetization Strategy

### Freemium Model

**Free Tier:**
- Up to 3 trips
- Up to 5 stops per trip
- Basic itinerary view
- Packing checklist (1 per trip)
- Community access (read-only)
- Public sharing (1 active shared trip)

**Pro Tier — $9/month:**
- Unlimited trips and stops
- Invoice PDF export
- Multi-currency budget display
- Trip journal / notes
- Custom packing categories
- Community posting and sharing
- Priority support

**AI Tier — $19/month (Phase 3):**
- Everything in Pro
- AI itinerary generator (10 generations/month)
- AI travel assistant chat
- AI packing suggestions
- AI travel summaries

### Affiliate Travel Integrations (Phase 4)

- **Booking.com / Agoda:** Hotel booking links embedded in itinerary stops → affiliate commission
- **GetYourGuide / Viator:** Activity booking links on activity cards → affiliate commission
- **Skyscanner / Kiwi.com:** Flight search embed in trip creation → affiliate commission

### Marketplace Opportunities (Phase 4)

- **Curated Itinerary Marketplace:** Travel creators sell premium itineraries ($5–$50 each)
- **Traveloop takes 20% commission**
- Creator profile pages with follower system

---

## 20. MVP Roadmap — 8-Hour Hackathon Plan

### Hour-by-Hour Execution Plan

This plan is derived directly from the 8-hour wireframe deliverable. The team should work in parallel streams where possible.

---

**Hours 1–2: Foundation**

- [ ] Initialize Vite + React + TypeScript + Tailwind + ShadCN project
- [ ] Configure Supabase project — create all database tables with schema above
- [ ] Enable RLS policies on all tables
- [ ] Set up Supabase Auth (email/password)
- [ ] Create folder structure as defined in Section 8
- [ ] Implement Supabase client + auth store (Zustand)
- [ ] Build `<AuthLayout />`, `<LoginForm />`, `<RegisterForm />` — Screens 1 & 2
- [ ] Configure React Router with all routes
- [ ] Build `<DashboardLayout />` with sidebar navigation

**Deliverable:** Working auth flow (login, register, logout) with sidebar navigation shell

---

**Hours 3–4: Core Trip Flows**

- [ ] Build `<DashboardPage />` with welcome banner, empty state, "Plan a Trip" CTA — Screen 3
- [ ] Build `<CreateTripPage />` with city search (GeoDB API), date range, "Add Section" — Screen 4
- [ ] Wire Create Trip form to Supabase — create `trips` + `trip_stops` records
- [ ] Build `<MyTripsPage />` with Ongoing/Upcoming/Completed sections, trip cards — Screen 6
- [ ] Build `<ItineraryBuilder />` with stop accordion cards, drag-to-reorder — Screen 5
- [ ] Fetch Unsplash image for trip cover photo on creation
- [ ] Build `<UserProfilePage />` with editable fields, preplanned/previous trips — Screen 7

**Deliverable:** Full trip creation → builder → my trips flow working end-to-end with real Supabase data

---

**Hours 5–6: Rich Features**

- [ ] Build `<CitySearchPage />` + `<ActivitySearchPage />` with filters — Screen 8
- [ ] Integrate Foursquare API for activity search
- [ ] Build `<ItineraryViewPage />` with day-by-day layout, budget panel — Screen 9
- [ ] Build `<PackingChecklistPage />` with categories, progress, add/check/reset — Screen 11
- [ ] Build `<JournalPage />` with note add/filter/edit — Screen 13
- [ ] Build `<InvoicePage />` with itemized table, budget insights, download — Screen 14
- [ ] Wire all pages to real Supabase data

**Deliverable:** Budget invoice, packing checklist, journal, city/activity search all functional

---

**Hours 7–8: Social + Admin + Polish**

- [ ] Build `<CommunityPage />` with public trips feed — Screen 10
- [ ] Implement share token generation + `<PublicItineraryPage />` — public sharing
- [ ] Build `<AdminDashboardPage />` with user table, popular cities/activities charts — Screen 12
- [ ] Add Framer Motion page transitions and card animations
- [ ] Add skeleton loaders to all async data screens
- [ ] Add empty states to all list screens
- [ ] Mobile responsive pass — test at 375px for all screens
- [ ] Seed the database with sample trips, activities, and public itineraries for demo
- [ ] Final QA pass across all 14 screens

**Deliverable:** Full 14-screen application demo-ready with real data, animations, and mobile layout

---

### Team Requirements (Hackathon)

| Role | Responsibilities |
|---|---|
| Frontend Lead | Pages, components, routing, animations, responsive |
| Full-Stack / Backend | Supabase schema, RLS, API integrations, service layer |
| UI/UX | Design decisions, ShadCN component config, Tailwind classes |
| (Optional 4th) | Admin dashboard, community, seeding, QA |

### Risks

| Risk | Mitigation |
|---|---|
| API rate limits (GeoDB 1 req/sec) | Implement debounce + localStorage cache from the start |
| Supabase RLS misconfiguration blocking data | Test RLS policies with two test users before building features |
| Foursquare API key approval delay | Prepare Yelp Fusion as fallback; have mock data ready |
| Drag-and-drop complexity consuming time | Use `dnd-kit` (simpler API than react-beautiful-dnd); skip if behind schedule |
| Mobile responsive pass taking too long | Use Tailwind responsive prefixes from the start, not as an afterthought |

---

## 21. Engineering Folder Structure

See Section 8 (Frontend Architecture) for the complete annotated folder structure.

**Key conventions:**
- One component per file
- All exported components are named exports (not default — easier refactoring)
- Service files export named async functions only
- Types defined in `/types/` — imported everywhere, never redefined inline
- Constants (category lists, status labels, etc.) in `/lib/constants.ts`

---

## 22. Reusable Component System

### UI Primitives (via ShadCN)

`Button`, `Input`, `Textarea`, `Select`, `DatePicker`, `Card`, `Badge`, `Dialog`, `Sheet`, `Tabs`, `Progress`, `Skeleton`, `Avatar`, `Tooltip`, `DropdownMenu`, `Separator`

### Shared Application Components

**`<TripCard />`**
Props: `trip: Trip`, `onEdit`, `onDelete`, `onView`
Used on: Dashboard, My Trips, Profile
Behavior: Hover shadow lift, action menu on kebab icon click

**`<EmptyState />`**
Props: `title: string`, `description: string`, `ctaLabel?: string`, `onCta?: () => void`, `illustration?: ReactNode`
Used on: All list screens when data is empty

**`<SearchFilterBar />`**
Props: `onSearch`, `onFilter`, `onSort`, `onGroupBy`, `filterOptions`, `sortOptions`, `groupOptions`
Used on: Dashboard, My Trips, City Search, Activity Search, Community, Admin
Behavior: Consistent control layout across all list screens

**`<SkeletonCard />`**
Props: `count?: number` (default: 3)
Used on: Any screen while async data loads

**`<ConfirmModal />`**
Props: `isOpen`, `title`, `description`, `confirmLabel`, `onConfirm`, `onCancel`, `variant: 'destructive' | 'warning'`
Used on: Delete trip, delete note, reset checklist, delete account

### Timeline Components

**`<DayBlock />`**
Props: `date: Date`, `dayNumber: number`, `stopName: string`, `activities: TripActivity[]`
Renders a day group in Itinerary View

**`<ActivityBlock />`**
Props: `activity: TripActivity`, `showCost?: boolean`, `showType?: boolean`
Renders a single activity row with category badge and estimated cost

### Chart Components (Recharts)

**`<BudgetPieChart />`**
Data: `{ category: string, amount: number }[]`
Renders cost breakdown by category

**`<BudgetBarChart />`**
Data: `{ date: string, spent: number, budget: number }[]`
Renders daily spend vs budget comparison

**`<UserTrendsLineChart />`**
Data: `{ week: string, newUsers: number, tripsCreated: number }[]`
Renders admin analytics trend lines

### Map Module (Mapbox — Phase 2)

**`<TripMapView />`**
Shows all trip stops as markers on a Mapbox map with connecting route lines

### Form System

All forms follow the pattern:
```typescript
const form = useForm<Schema>({ resolver: zodResolver(schema) });
// Fields use <Controller /> with ShadCN Input/Select components
// Errors displayed via form.formState.errors
// Submit calls service function, shows toast on success/failure
```

### Modal Architecture

All modals use ShadCN `<Dialog />` + Framer Motion for entrance/exit animation.
Global modal state managed in `uiStore` (Zustand) — avoids prop-drilling.

---

## 23. Testing Strategy

### Unit Testing (Vitest + React Testing Library)

**Target:** All service functions, Zod validators, utility functions, and isolated components

```typescript
// Example: test trip date validation
test('end date must be after start date', () => {
  const result = tripSchema.safeParse({
    tripName: 'Paris Trip',
    startDate: new Date('2025-06-20'),
    endDate: new Date('2025-06-10'), // Invalid
  });
  expect(result.success).toBe(false);
  expect(result.error.issues[0].path).toContain('endDate');
});
```

**Priority components to unit test:**
- `<TripCard />` — renders with correct data, calls onDelete when confirmed
- `<ChecklistItem />` — toggles is_packed, calls update handler
- `<InvoiceTable />` — calculates subtotal, tax, grand total correctly
- All Zod schemas in `/lib/validators.ts`

### Integration Testing (Vitest + MSW)

Mock Service Worker (MSW) intercepts API calls to GeoDB, Foursquare, Unsplash.

**Priority flows to test:**
- Create Trip form submission → mock Supabase insert → redirect to builder
- City search → mock GeoDB response → results displayed
- Packing item toggle → mock Supabase update → UI reflects change

### E2E Testing (Playwright — Post-Hackathon)

**Priority flows:**
1. Full user registration → trip creation → itinerary building → share
2. Budget invoice generation → PDF download
3. Admin dashboard access with non-admin account (should redirect)

### Performance Testing

- Lighthouse CI: target LCP < 2.5s, FID < 100ms, CLS < 0.1
- Run against Vercel preview deployments

### Security Testing

- Manual test: attempt to access another user's trip by UUID via URL — should return empty (RLS)
- Manual test: attempt admin route as regular user — should redirect
- Input: test XSS payload in trip name field — should be escaped in render

---

## 24. Future Scope

### Mobile Apps (Phase 4)

- React Native app sharing core business logic
- Offline-first architecture using SQLite (expo-sqlite) synced with Supabase
- Push notifications for trip start reminders

### Offline Support (Phase 3)

- Service Worker caching all static assets
- IndexedDB caching of active trip data
- Background sync: packing checklist and journal notes queued when offline, synced on reconnect

### Real-Time Collaboration (Phase 3)

- Supabase Realtime channels for multi-user itinerary editing
- Presence indicators: see who else is viewing the trip
- Conflict resolution: last-write-wins for simple fields; operational transforms for complex edits

### AI Agents (Phase 4)

- Autonomous trip planning agent: user describes trip in natural language → agent creates full itinerary, searches activities, estimates budget, and generates packing list
- Daily travel assistant: sends morning briefing for each day of active trip (weather, activity reminders, local tips)

### Booking Integrations (Phase 4)

- Embed booking flows from Booking.com, GetYourGuide, Skyscanner directly in the itinerary
- One-click booking with affiliate tracking
- Confirmed bookings auto-populate activities with real costs

### Social Travel Ecosystem (Phase 4)

- Follow other travelers
- Like and comment on public itineraries
- "Traveling soon" status on user profiles
- Location-based discovery: "Who else is going to Tokyo in July?"

### Travel Marketplace (Phase 4)

- Creators publish premium itineraries for sale
- Buyers get a pre-built, fully editable itinerary cloned into their account
- Creator earnings dashboard with Stripe Connect payouts

### Smart Budget Alerts (Phase 3)

- Real-time budget tracking against actual spend (manual entry or receipt upload)
- Push/email alerts when spend exceeds 80% of budget
- AI-powered "You're on track for $X over budget — here are 3 cheaper alternatives for Day 5"

---

*Document Version: 1.0*
*Product: Traveloop – Personalized Travel Planning Made Easy*
*Context: Hackathon Submission with 8-Hour Build Constraint*
*Architecture Level: Production-Grade*
