# Daily Lock-In

A local-first personal habit cockpit for workout consistency, two daily showers, and a gated work-start ritual. The interface uses the dark operational language of Mission Control while replacing generic checkboxes with tactile activation controls and reward effects.

## Run

```bash
cd /Users/yuzukijg1/Desktop/dailyapp
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## Verification

```bash
npm test
npm run lint
npm run build
npm run test:e2e
```

The Playwright suite verifies desktop and 390×844 touch layouts, completion flow, Lock In gating, refresh persistence, and calendar navigation.

## Voice commands

Press the microphone button and say phrases such as:

- `workout done`
- `first shower done`
- `second shower done`
- `I changed clothes`
- `desk is clean`
- `lock me in`
- `undo workout` (confirmation required)

Voice input uses the browser Web Speech API. The implementation carries over DailyScheduler's proven iOS behavior: a fresh recognition instance is created for every tap, and a stuck stop is force-aborted after 500 ms. Microphone access requires browser permission and a secure context outside localhost. No raw audio is stored. If speech recognition is unsupported, type the same command in the command bar and press Enter.

## Data and backups

Data is stored only in browser `localStorage` under `daily-lock-in-v1`. Use Settings → Export JSON for a backup and Import JSON to restore it. Imports are schema-validated before replacement. Clearing browser storage without a backup erases the records.

## Habit rules

- Workout is required six days per week. Sunday is the default rest day and can be changed in Settings.
- Two shower timestamps are allowed each day. One shower is partial; two completes the habit.
- Lock In requires at least one shower, work clothes, and a reset environment. This rule is enforced in domain logic as well as the UI.
- Past incomplete days are red, partial days amber, completed days green, today outlined/in progress, and future days neutral.

## PWA

The app includes a web manifest and installable icon. Local Mac use is the supported V1 mode. Cross-device sync is not included.
