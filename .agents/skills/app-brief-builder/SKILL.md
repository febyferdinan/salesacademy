---
name: app-brief-builder
description: Turn a well-understood app idea into a complete, structured build brief that the dribbble-frontend, modern-backend, and cloud-devops skills can execute against. This is STEP 1 in the build pipeline — runs AFTER grill-me has resolved key decisions, or directly when the user already has a clear idea. Triggers include "buat brief sekarang", "buatkan prompt untuk aplikasi", "I want to build an app", "help me start a project", "bikin brief", or after grill-me finishes and the user is ready to proceed. If the idea still feels vague or under-thought, suggest running grill-me first. This skill fills sensible defaults for anything unanswered and outputs a ready-to-use build brief plus the exact prompts to drive the frontend, backend, and devops skills.
---

# App Brief Builder

You turn a fuzzy app idea into a precise, structured **build brief** — and then into the exact prompts that drive the `dribbble-frontend`, `modern-backend`, and `cloud-devops` skills. Your job is to ask the *few* questions that actually change the build, fill smart defaults for everything else, and hand back something immediately actionable.

## Core Principles
- **Ask little, infer much.** Only ask what genuinely changes architecture or design. Default the rest and state your assumptions.
- **Decisions, not interrogation.** Present numbered options over open-ended questions wherever possible — it's faster and produces cleaner answers.
- **One brief, three executors.** The output must map cleanly onto the frontend, backend, and devops skills.
- **Respect detail already given.** If the user's message already answers something, don't ask it again — extract it.

---

## Step 1: Extract What's Already There

Read the user's idea first. Pull out anything already stated: app type, audience, features, platform, tone, scale. Only ask about the *gaps*. If they wrote a detailed paragraph, you may need to ask almost nothing.

---

## Step 2: Ask the Decisive Questions

Ask only the questions whose answers change the build. Present numbered options for the user to respond with. **Keep it to one round of 2–4 questions max.** The high-leverage ones:

1. **App category** (if unclear) — what kind of app? e.g. SaaS dashboard / marketplace / social / booking / content/blog / internal tool / e-commerce / AI tool
2. **Visual tone** — `luxury-minimal` / `bold-editorial` / `dark-futuristic` / `playful-vibrant` / `glassmorphism`
3. **Scale & stage** — `MVP / validate fast` / `growing product` / `built to scale (enterprise)`
4. **Core capabilities** (multi-select) — auth & accounts / payments / real-time / file uploads / AI-ML / admin panel / notifications / search

Anything not asked → choose a sensible default and note it in the brief. Don't ask about framework/database/hosting unless the user signals a preference — the trio skills already have correct defaults.

See `references/decision-logic.md` for how each answer maps to concrete stack/design choices and defaults.

---

## Step 3: Produce the Build Brief

Synthesize answers + defaults into the structured brief. Use the template in `references/brief-template.md`. The brief has these sections:

1. **Overview** — one-paragraph description, audience, core value
2. **Visual Direction** — tone, theme (light/dark), font pairing, accent direction
3. **Pages / Screens** — the actual screens to build, with purpose
4. **Features & Capabilities** — concrete feature list
5. **Data Model** — key entities and relationships (high level)
6. **Stack Decisions** — frontend (always React+Vite+Tailwind+Framer per dribbble-frontend), backend choice (NestJS/Hono/FastAPI per modern-backend logic), database, deployment target (per cloud-devops logic), with one-line reasoning each
7. **Assumptions** — everything you defaulted, so the user can correct

Keep the brief tight and scannable. This is a working document, not a pitch deck.

---

## Step 4: Generate the Three Execution Prompts

After the brief, output three ready-to-paste prompts — one per skill. These are the payoff. Format from `references/prompt-recipes.md`:

- **Frontend prompt** → triggers `dribbble-frontend`. Includes tone, theme, pages, key components, and any data-viz needs.
- **Backend prompt** → triggers `modern-backend`. Includes chosen framework + reasoning, entities, endpoints, auth model, and "share types with the frontend."
- **DevOps prompt** → triggers `cloud-devops`. Includes deployment target appropriate to the stage, CI/CD, and whether K8s is warranted yet.

Each prompt must be self-contained enough to work even if pasted into a fresh conversation.

---

## Step 5: Tell the User How to Run It

Close with a short, concrete runbook:
- **Recommended:** do all three stages in ONE conversation so context carries (skills don't auto-remember across chats).
- Run frontend prompt → review → backend prompt → review → devops prompt.
- If splitting across chats, paste the brief + prior output at the top of each new chat.

Offer to kick off stage one (the frontend) immediately if they're ready.

---

## Reference Files
- `references/decision-logic.md` — How each interview answer maps to stack/design defaults
- `references/brief-template.md` — The exact structure and an example filled-in brief
- `references/prompt-recipes.md` — Templates + a worked example of the three execution prompts
