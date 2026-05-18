# Client Intake Survey — Feature Spec

## Overview

A public-facing, gamified intake form that collects a new client's tech stack and workflow details. The form lives on a shareable link, saves progress after Google sign-in, and emails Aaron (via Resend) a formatted summary upon submission.

This is a standalone feature — it does not require the visitor to have an existing CRM account.

---

## URL & Access

- Route: `/intake` (public, no auth required to view or start)
- Shareable as a plain link: `https://amp-crm.us/intake`
- Optional: support a personalized variant `/intake?name=ClientFirstName` that pre-fills a greeting (e.g., "Hey Marcus, let's get started")
- Google sign-in is prompted before the user can progress past the first section — not required to view the intro

---

## UX & Gamification

- Divided into **5 named chapters** (see below), each rendered one at a time
- Top progress bar showing chapter completion (e.g., "Chapter 2 of 5 — Money")
- Each chapter has a short title, an icon or emoji, and 1–2 sentences of framing copy
- "Next" advances to the next chapter; answers are auto-saved to Supabase on each chapter completion
- If the user returns to the link after signing in, they resume where they left off
- Final screen: a visual summary ("Your Stack at a Glance") reflecting their answers back before they hit Submit
- On Submit: confirmation screen + Resend email fires

---

## Chapters & Questions

### Chapter 1 — Your Home Base 🌐
*Where do you live online?*

| Field | Type | Options / Notes |
|---|---|---|
| `website_url` | text | "What's your website URL?" |
| `website_host` | single-select | Squarespace, Wix, Webflow, WordPress, Custom/Dev-built, Don't have one, Other |
| `domain_registrar` | single-select | GoDaddy, Namecheap, Squarespace, Google Domains, Cloudflare, Same as host, Not sure, Other |
| `email_provider` | single-select | Google Workspace, Microsoft 365, Built into my host, Personal Gmail/Outlook, Other |
| `website_host_other` | text | Shown if "Other" selected for host |
| `domain_registrar_other` | text | Shown if "Other" selected for registrar |

---

### Chapter 2 — Money 💳
*How you get paid and keep the books.*

| Field | Type | Options / Notes |
|---|---|---|
| `payment_processor` | multi-select | Stripe, Square, PayPal, Venmo/Zelle, Built into booking platform, Client pays by check, Other |
| `requires_deposit` | yes/no | "Do you require a deposit before booking?" |
| `invoice_tool` | single-select | QuickBooks, FreshBooks, Wave, Xero, HoneyBook, Dubsado, Excel/Google Sheets, I email a PDF template, Other |
| `invoice_tracking` | single-select | My accounting software tracks it, Spreadsheet, I remember / check my email, A platform like HoneyBook, Other |
| `has_bookkeeper` | yes/no/sometimes | "Do you have a bookkeeper or CPA involved?" |
| `invoice_tool_other` | text | Shown if "Other" selected |

---

### Chapter 3 — Booking Flow 📋
*From first inquiry to signed contract.*

| Field | Type | Options / Notes |
|---|---|---|
| `lead_sources` | multi-select | Contact form on website, Instagram DM, Referral from past client, Google search, Email directly, Phone call, Other |
| `proposal_tool` | single-select | HoneyBook, Dubsado, 17hats, Email a PDF, I don't send formal proposals, Other |
| `contract_tool` | single-select | HoneyBook, Dubsado, DocuSign, HelloSign, Email a PDF, Paper, Other |
| `booking_platform` | single-select | HoneyBook, Dubsado, 17hats, Acuity, Calendly, None — I manage manually, Other |
| `avg_time_to_book` | single-select | Same day, 1–3 days, 1 week, 2+ weeks, Varies a lot |

---

### Chapter 4 — Project & Delivery 📦
*How you manage active work and hand off the final product.*

| Field | Type | Options / Notes |
|---|---|---|
| `project_tracking` | single-select | HoneyBook/Dubsado/platform, Notion, Trello/Asana, Spreadsheet, Email threads, My head, Other |
| `client_communication` | multi-select | Email, Text/iMessage, A client portal, Instagram DM, Phone calls |
| `delivery_method` | single-select | Pixieset, Shootproof, Google Drive, Dropbox, WeTransfer, USB drive, Other |
| `file_storage` | single-select | External hard drives, Cloud (Google Drive, Dropbox, iCloud), NAS / home server, A mix, Other |
| `typical_active_projects` | single-select | 1–2, 3–5, 6–10, 10+ |

---

### Chapter 5 — Pain Points & Priorities ⚡
*The honest part.*

| Field | Type | Options / Notes |
|---|---|---|
| `biggest_gap` | single-select | Following up on leads, Sending contracts/invoices, Tracking which projects are where, Getting paid on time, Delivering files, Client communication, Something else |
| `biggest_gap_other` | text | Shown if "Something else" |
| `tool_id_never_give_up` | text | "What's the one tool you'd never give up?" (free text) |
| `one_thing_to_fix` | text | "If you could fix one part of your workflow overnight, what would it be?" (free text) |
| `anything_else` | textarea | "Anything else you want me to know before we start building?" (optional) |

---

## Data Model

### New Supabase table: `intake_submissions`

```sql
create table intake_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Identity
  respondent_email text,                  -- from Google OAuth
  respondent_name text,                   -- from Google OAuth display name
  respondent_google_id text,              -- Google sub, for dedup / resume

  -- Progress
  completed_chapters int default 0,       -- 0–5; used to resume
  submitted_at timestamptz,               -- null until final submit

  -- Chapter 1 — Home Base
  website_url text,
  website_host text,
  website_host_other text,
  domain_registrar text,
  domain_registrar_other text,
  email_provider text,

  -- Chapter 2 — Money
  payment_processor text[],
  requires_deposit text,
  invoice_tool text,
  invoice_tool_other text,
  invoice_tracking text,
  has_bookkeeper text,

  -- Chapter 3 — Booking Flow
  lead_sources text[],
  proposal_tool text,
  contract_tool text,
  booking_platform text,
  avg_time_to_book text,

  -- Chapter 4 — Project & Delivery
  project_tracking text,
  client_communication text[],
  delivery_method text,
  file_storage text,
  typical_active_projects text,

  -- Chapter 5 — Pain Points
  biggest_gap text,
  biggest_gap_other text,
  tool_id_never_give_up text,
  one_thing_to_fix text,
  anything_else text
);
```

**RLS:** Table should be readable only by the service role and by the authenticated user whose `respondent_google_id` matches. No user_id FK needed — this is standalone from the main CRM auth.

---

## Auth Flow

1. Visitor arrives at `/intake` — sees intro screen, no sign-in required
2. They click "Get Started" and begin Chapter 1
3. At the end of Chapter 1 (before advancing to Chapter 2), a modal prompts: "Sign in with Google to save your progress"
4. After Google OAuth callback, the form resumes at Chapter 2
5. If a record with their `respondent_google_id` already exists and `submitted_at` is null, load and resume from `completed_chapters`
6. If `submitted_at` is set, show a "You already submitted — thanks!" screen

Use Supabase's existing Google OAuth provider (already configured for the main app).

---

## Save Behavior

- On completing each chapter and clicking "Next", upsert the current chapter's answers to `intake_submissions` and increment `completed_chapters`
- Use `respondent_google_id` as the upsert key
- Auto-save is not required within a chapter — only on chapter advance

---

## Submission & Email

### On Submit

1. Set `submitted_at = now()` on the record
2. Fire a Resend email to `NOTIFICATION_EMAIL` (from env)

### Email format (to Aaron)

**Subject:** `New intake submission — {respondent_name}`

**Body:** A clean, structured summary organized by chapter. Each answer rendered as a labeled row. Multi-select answers comma-joined. Free-text answers in block quotes. End with a direct link to the raw record (or a future admin view).

Use the existing Resend setup in the project (`RESEND_API_KEY`, `FROM_EMAIL`, `NOTIFICATION_EMAIL` from `.env.local`).

The API route for sending should live at `app/api/intake/submit/route.ts`.

---

## File Structure

```
app/
  intake/
    page.tsx               ← public intake shell + chapter router
    layout.tsx             ← minimal layout (no sidebar/nav)
    components/
      IntroScreen.tsx
      ChapterProgress.tsx
      Chapter1.tsx … Chapter5.tsx
      SummaryScreen.tsx
      SuccessScreen.tsx
  api/
    intake/
      save/route.ts        ← POST: upsert chapter answers
      submit/route.ts      ← POST: finalize + send Resend email
lib/
  intake/
    types.ts               ← IntakeSubmission type matching the table
    email.ts               ← formatIntakeEmail(submission) → Resend payload
```

---

## Out of Scope (for now)

- Admin UI for viewing past submissions inside the CRM
- Sending the respondent a copy of their answers
- Multiple respondents / team intake
- Editing a submitted form
