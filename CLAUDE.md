# bankap

Booking app for independent beauty providers (eyebrows, lashes, nails). A provider shares a link and her clients book a free slot on their own, without WhatsApp back-and-forth.

- Product requirements: `project/uploads/PRD - App de turnos para prestadoras de belleza.pdf` (business rules RN-xx, functional requirements RF-xx).
- Visual design: Daniela shares a screenshot of each screen when we build it. The original HTML prototype was removed on purpose; never build screens as HTML files.
- **Colors:** `project/global-styles/colors.css` is the official palette (source of truth). React Native can't read CSS, so `project/global-styles/colors.ts` mirrors it with the same names in camelCase (`--texto-principal` → `colors.textoPrincipal`). Always use these variables, never hardcoded colors; if a color is missing, ask before adding it. Keep both files in sync.
- Other tokens (fonts, spacing, radii) live in `project/front-office/pages/theme.ts`.
- Design conversation: `chats/chat1.md`.

## Stack

- **React Native** with Expo (SDK 57) and TypeScript. The whole app is built in React Native.
- `App.tsx` at the repo root is the entry point: it loads fonts and mounts the current screen.
- Install native packages with `npx expo install <pkg>` so versions match the SDK.
- UI copy is in **Spanish, Rioplatense voice** ("vos": "Elegí", "Reservá", "Confirmá").

## Project structure

The code is split first by audience, then by responsibility:

```
project/
├── front-office/        # Client-facing side (the clienta who books a turno)
│   ├── logic/           # Component logic: state, hooks, handlers, business rules
│   ├── pages/           # UI only: screens and visual components
│   ├── services/        # Data access: API calls, storage, external integrations
│   └── test/            # Unit tests for this side
└── back-office/         # Provider side (the prestadora who manages her agenda)
    ├── logic/
    ├── pages/
    ├── services/
    └── test/
```

### Rules

1. **Choose the side first.** Decide whether a screen or feature belongs to the clienta (`front-office`) or the prestadora (`back-office`), and put its files there.
2. **Logic and UI stay separate.**
   - `pages/` only renders. It receives data and callbacks; it holds no business rules and makes no data calls.
   - `logic/` holds what a page needs to work: state, hooks, validation, availability rules.
   - `services/` is the only layer that talks to the outside world (API, storage, WhatsApp/calendar links, notifications). `logic/` calls `services/`, and `pages/` never calls `services/` directly.
3. **Reusable components.** When a piece of UI or logic is needed in more than one place, extract it into a reusable component instead of duplicating it. Each screen gets its own folder in `pages/` (e.g. `pages/ServiceSelection/`), and UI reused across screens of the same side goes in `pages/components/`. Before creating any new shared or top-level folder (e.g. something shared by front-office and back-office), propose the location and wait for approval.
4. **Don't invent structure.** Don't add folders, layers, libraries or config beyond what is described here without asking first.

## Testing (TDD)

- The project follows test-driven development, but **unit tests are written only when Daniela asks for them**.
- When asked, write the tests first, then the implementation that makes them pass.
- Tests go in the `test/` folder of the same side (`front-office/test` or `back-office/test`).
- Candidates: functions, methods and some components (business rules from the PRD are the main targets).

## Working style

- Daniela is a front-end developer and owns the architecture. Build in **small, reviewable steps** that she asks for; don't scaffold or implement the whole app in one go.
- She is learning React Native with this project: when something is React Native–specific (layout, styling, navigation, native APIs), briefly explain the why.
- When a request is ambiguous about placement (which side, which layer), ask before writing code.
