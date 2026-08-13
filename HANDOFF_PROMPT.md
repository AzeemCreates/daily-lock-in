# Builder Handoff: Daily Lock-In

You are my super-agent builder. Build and verify a complete local-first personal habit tracker called **Daily Lock-In** inside this existing folder:

`/Users/yuzukijg1/Desktop/dailyapp`

Do not stop at a plan or static mockup. Create the real application, run it, test its core flows, fix errors, and leave a concise implementation report.

## Product goal

Create an extremely easy personal habit tracker modeled on the visual language of my existing **Mission Control** app. It should make completing a habit feel rewarding rather than clinical. I should be able to mark a habit complete with one prominent animated control or speak a short command such as “workout done.” A calendar heatmap/grid must show successful days in green and missed required days in red.

This is a **single-user, local-first MVP** for my own Mac. Do not add accounts, subscriptions, teams, social features, or cloud infrastructure.

## Product principles

1. **One-second logging:** the most common action takes one click or one voice command.
2. **Motivating, not generic:** avoid ordinary checkbox rows and generic green checkmark buttons.
3. **Honest history:** past required days show green when achieved and red when missed. Today remains in progress until the day ends. Future dates are neutral.
4. **Clear dependencies:** “Lock In” cannot be completed unless its preparation requirements are completed.
5. **Local privacy:** habit and voice-command data remain on the device in V1.
6. **Accessible reward:** animation, color, iconography, and text should communicate state; never rely on color alone.

## Default habits and rules

### 1. Workout

- Goal: **6 workouts per week**.
- Default week: Monday through Sunday.
- The user may choose one rest day in Settings; default rest day is Sunday.
- Scheduled workout days are required.
- Rest days show a distinct neutral/rest state and must not count as missed.
- Track a boolean completion plus optional completion time and short note.

### 2. Two showers

- Goal: **2 showers every day**.
- Show this as one habit card with two satisfying completion stages: `0/2`, `1/2`, and `2/2`.
- The first and second completion should each have their own timestamp.
- The day is green only when both showers are completed.
- If only one is completed by the end of the day, the day is red/incomplete, but the UI should still show `1/2` in history.

### 3. Lock In / Start Work

- Goal: begin focused work immediately after completing a preparation ritual.
- Required preparation items:
  - changed into work clothes;
  - completed a qualifying shower;
  - reset/cleaned the immediate work environment.
- Present these as three compact prerequisite chips or mini-controls inside the Lock In card.
- The large **LOCK IN** completion control remains visibly gated until all three are complete.
- A shower logged in the Shower habit for that day should automatically satisfy the shower prerequisite. Do not require duplicate entry.
- Once unlocked, clicking **LOCK IN** records the start time and triggers the strongest reward animation.
- Allow the user to undo any completion from a small overflow/history action with confirmation; do not make accidental undo easy.

## Main user flow

1. Open the app and land on **Today**.
2. See today’s progress, streak/status summary, and the three habit cards immediately.
3. Click a large tactile action on a card or press the microphone button and speak a command.
4. See the card physically react: press depth, spring release, glow burst, pulse/ripple, small particles, and concise motivational copy.
5. See today’s calendar cell update instantly.
6. Review previous dates in the interactive calendar and click any date to inspect or correct its entries.
7. Change the rest day, microphone preference, reduced motion, and theme color tokens in Settings.

## Required screens and layout

### Mission Control shell

Recreate the design language, not the agent-specific content, of the local Mission Control UI:

- near-black application background;
- fixed dark left sidebar around 220px wide;
- thin borders in muted charcoal;
- compact top bar with product title, command/search area, microphone control, and Settings button;
- off-white primary text and muted gray secondary text;
- rounded rectangular panels with subtle gradients rather than bright floating cards;
- restrained purple accent glow initially, implemented as replaceable CSS variables;
- compact spacing, small labels, and an operational dashboard feel;
- use a clean system sans-serif font;
- responsive behavior: sidebar collapses to bottom navigation or a drawer on narrow screens.

Sidebar routes:

- Today
- Calendar
- Insights
- Settings

The main content should not copy the Mission Control office scene. Translate its premium dark dashboard language into a focused habit cockpit.

### Today

Include:

- current date and a short status line;
- **Daily Charge** progress display based on today’s required completions;
- three distinctive habit cards;
- current weekly workout progress, such as `4 / 6`;
- a compact seven-day strip;
- a prominent microphone button with listening/processing/success/error states;
- no clutter or long motivational paragraphs.

Each habit card should have its own icon and accent treatment:

- Workout: energy/strength visual;
- Showers: water/refresh visual with two-stage charge;
- Lock In: focus/ignition visual with prerequisite chips.

### Calendar

Build an interactive month grid and a compact yearly heatmap option.

Cell states:

- **green:** all requirements for that habit/day were achieved;
- **red:** a past required day was not fully achieved;
- **amber/partial:** optional visual detail for partial progress, while still treated as incomplete in totals;
- **neutral dark:** future date or non-required workout rest day;
- **outlined/accented:** today, still in progress.

Requirements:

- switch between overall day status and a specific habit;
- previous/next month navigation and “Today” shortcut;
- click a date to open a details panel/modal showing completions and timestamps;
- permit intentional backfilling/editing with a clear “edited” indicator;
- never mark future dates red;
- compute missed status from local calendar dates, not elapsed 24-hour durations.

### Insights

Keep V1 simple and useful:

- current streak and best streak;
- workout count this week versus 6;
- shower completion rate;
- Lock In completion rate and typical start time;
- last 30 days summary;
- no invented health claims or guilt-heavy language.

### Settings

Include:

- workout rest day;
- week start day;
- editable habit labels and short motivational success phrases;
- primary/accent/reward color variables with reset-to-default;
- microphone enabled/disabled;
- reduced-motion toggle that respects the OS `prefers-reduced-motion` setting;
- export data to JSON;
- import previously exported JSON with validation and confirmation;
- reset all local data behind a strong confirmation.

## Motivating completion controls

Do not use a plain square checkbox or a generic green button labeled “Complete.” Create a tactile **charge/activation control** for each habit.

Suggested interaction:

- idle label examples: `POWER THE DAY`, `REFRESH 1 OF 2`, `IGNITE FOCUS`;
- pointer down: button compresses and shadow recedes;
- release: spring overshoot, colored energy sweep, icon transformation, brief particles/glow;
- success copy rotates among short editable phrases such as `MOMENTUM BUILT`, `RESET COMPLETE`, and `FOCUS ONLINE`;
- completed state remains visually strong but calm after the effect;
- animation should last about 600 to 1000ms and must not block another action;
- include a reduced-motion alternative using a quick color/scale transition without particles.

Use CSS transforms and lightweight DOM/CSS effects or a small animation library only if justified. Avoid heavy game engines.

## Voice control

Implement voice input using the browser Web Speech API where supported, with a typed-command fallback. Keep it replaceable behind a small adapter.

Supported intent examples:

- “workout done” / “I finished my workout”;
- “first shower done”;
- “second shower done” / “showers complete”;
- “I changed clothes”;
- “desk is clean” / “environment reset”;
- “lock me in” / “start work”;
- “undo workout” (must ask for confirmation).

Behavior:

1. The user explicitly presses the microphone button; no always-on listening.
2. Show a live listening state and the recognized transcript.
3. Parse commands locally with a deterministic keyword/intent matcher; an AI API is not required.
4. If confidence/intent is ambiguous, show the interpreted action and ask for one-tap confirmation rather than guessing.
5. Never claim a habit was logged unless the local write succeeds.
6. Handle unsupported browsers and microphone denial gracefully with a typed command input.
7. Do not store raw audio. Keeping the transcript is off by default.

## Recommended implementation

Use the existing folder as the project root. Prefer:

- Next.js with App Router and TypeScript;
- React;
- Tailwind CSS or well-organized CSS modules with theme variables;
- Lucide icons;
- local persistence using IndexedDB (Dexie is acceptable) or another reliable browser-local database;
- Zod for imported-data validation;
- Vitest + React Testing Library for logic/components;
- Playwright for the primary browser flows.

If the folder is empty, initialize the application there without creating an unnecessary nested project folder. Initialize Git and make an initial verified commit. Do not overwrite unrelated existing work if files appear before implementation.

Do not add a backend or hosted database in V1. Keep persistence behind a repository interface so a future iPhone/PWA sync backend can replace it cleanly.

## Data model

Use a versioned local schema. A reasonable model is:

### HabitDefinition

- `id`
- `key`: `workout | showers | lock_in`
- `label`
- `description`
- `icon`
- `targetPerDay`
- `targetPerWeek`
- `scheduledWeekdays`
- `successPhrases[]`
- `enabled`
- `createdAt`
- `updatedAt`

### DailyRecord

- `id`
- `localDate` in `YYYY-MM-DD`
- `workoutCompletedAt | null`
- `showerCompletedAt[]` with a maximum of two entries in V1
- `changedClothesAt | null`
- `environmentResetAt | null`
- `lockInCompletedAt | null`
- `notes`
- `editedAt | null`
- `createdAt`
- `updatedAt`

### AppSettings

- `schemaVersion`
- `weekStartsOn`
- `workoutRestDay`
- `accentColor`
- `rewardColor`
- `dangerColor`
- `microphoneEnabled`
- `reducedMotion`
- `storeVoiceTranscripts` default `false`

Enforce the Lock In rule in domain logic, not only by disabling a UI button. A Lock In write must fail unless changed clothes, a shower, and environment reset are present for that local date.

## Status logic

Put calendar/status calculations in tested pure functions.

- Overall day success means every required habit target for that date is complete.
- Workout is not required on the configured rest day.
- Showers require two completions every day.
- Lock In requires its three prerequisites plus the final Lock In timestamp.
- Past means a local date before today.
- A past incomplete required habit is missed/red.
- Today is in progress unless complete.
- Future dates are neutral.
- Partial progress may be amber visually but remains incomplete in statistics.
- Changes to the configured rest day should affect schedule calculations predictably; document whether historical schedules are recalculated. For V1, prefer applying the current schedule globally and state this limitation in Settings/export metadata.

## Seed/demo behavior

On first launch, start with today empty and include a clearly labeled **Load Demo Data** action in development/demo mode only. Demo data should populate approximately 30 days with a mix of complete, partial, missed, and rest days so the calendar can be visually tested. Do not silently mix demo data with real user data.

## PWA and device behavior

Make the app installable as a basic PWA so it can later be used from an iPhone home screen when served securely. V1 may remain Mac-local. The layout must still be touch-friendly and responsive. Do not promise cross-device sync in V1.

## Acceptance criteria

The build is complete only when all of the following are proven:

- The app runs locally from `/Users/yuzukijg1/Desktop/dailyapp`.
- It visually follows the Mission Control dark dashboard language.
- I can complete Workout with one motivating animated control.
- I can log exactly two shower stages and see `0/2`, `1/2`, and `2/2` correctly.
- Shower completion automatically satisfies the Lock In shower prerequisite.
- Lock In cannot be recorded before shower, changed clothes, and environment reset are complete.
- I can complete each prerequisite and then activate Lock In.
- A successful action persists after page refresh.
- Voice or typed commands can trigger every supported safe action.
- Ambiguous and undo voice commands require confirmation.
- The month grid distinguishes success, miss, partial, rest, today, and future states.
- Future days never appear missed.
- Clicking a calendar date shows its details.
- Workout progress correctly handles a six-day week and one rest day.
- Settings can change theme tokens and rest day.
- JSON export/import works and rejects malformed input.
- Reduced-motion mode works.
- The layout is usable at desktop and mobile viewport sizes.
- Automated tests cover schedule/status logic, two-shower counting, Lock In gating, persistence, and voice-intent parsing.
- A Playwright smoke test covers today completion, refresh persistence, and calendar inspection.
- The production build succeeds with no TypeScript errors.

## Required verification process

1. Inspect the folder before changing anything.
2. Implement the smallest complete local-first architecture.
3. Run lint, type checking, unit/component tests, Playwright smoke tests, and the production build.
4. Start the app and inspect the real rendered UI at desktop and mobile widths.
5. Fix failures and obvious visual defects; do not merely report them.
6. Verify persistence with an actual refresh/reload.
7. Verify the microphone path if the environment/browser permits it; otherwise test the deterministic parser and typed fallback, and report the exact browser limitation.
8. Initialize Git if needed and create a commit only after verification.

## Required documentation/files

Create:

- `README.md` with setup, run, test, storage, browser voice support, and backup instructions;
- `IMPLEMENTATION_STATUS.md` listing completed, partial, and deferred capabilities;
- `.env.example` only if the final implementation genuinely needs environment variables (it should not in V1);
- automated tests and sample/demo fixtures;
- this handoff file must be preserved.

## Explicit deferrals

Do not build these in V1:

- authentication or multi-user support;
- subscriptions;
- cloud database or cross-device sync;
- AI/LLM command parsing;
- health-device integrations;
- social leaderboards;
- punitive notifications;
- a native iOS application.

Preserve clean interfaces for future cloud sync, notifications, Apple Health integration, and a native/mobile wrapper.

## Final report format

When finished, report:

1. exact files and major features created;
2. exact local run command and URL;
3. exact verification commands and their real pass/fail results;
4. voice-control behavior actually verified;
5. storage/export behavior;
6. limitations and deferred features;
7. Git branch and commit hash.

Do not claim a feature or test passed unless you actually exercised it.
