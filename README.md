# bankap

Turnos para prestadoras de belleza (cejas, pestañas, uñas). Implementación del diseño exportado de Claude Design (`project/Bankap.dc.html`) siguiendo el PRD (`project/uploads/`).

| Carpeta | Qué es | Stack |
| --- | --- | --- |
| `apps/web` | Página pública de la clienta: servicio → horario → datos → confirmación | React 19 + Vite + TypeScript |
| `apps/mobile` | App de la prestadora: agenda por día y semana, detalle, reprogramar, cancelar | Expo SDK 57 + Expo Router |
| `packages/core` | Reglas de disponibilidad (RN-01 a RN-07), catálogo, agenda de ejemplo, tokens de diseño | TypeScript sin dependencias |

```bash
npm install
npm test            # reglas de negocio (node:test)
npm run typecheck   # core + web + mobile
npm run web         # http://localhost:5173
npm run mobile      # Expo: abrir con Expo Go o un simulador
```

## Demo de la web

La web acepta parámetros en la URL en lugar del panel de Tweaks del prototipo:

- `?ahora=2026-10-01T10:15`: fija fecha y hora (la agenda de ejemplo se arma alrededor de esa semana).
- `?conflicto`: al confirmar, otra clienta toma el horario primero (RF-15).
- `?sobreturnos`: el turno solo tiene que empezar dentro del horario (RN-06).

## Estado actual

- **Sin backend todavía.** Cada app usa un `BookingStore` en memoria (`packages/core/src/store.ts`) con la forma que tendría la API: la verificación de "¿sigue libre?" se hace al guardar. El PRD propone ASP.NET Core + PostgreSQL; ahí el constraint de no superposición (RNF-01) pasa a la base.
- Por eso web y app **no comparten datos**: una reserva en la web no aparece en la app, y la notificación push del prototipo (banner "Nueva reserva") queda pendiente hasta tener backend + `expo-notifications`.
- "Agregar a mi calendario" descarga un `.ics` real con el link de gestión; "Avisale por WhatsApp" abre `wa.me` con el mensaje prearmado. El teléfono de la prestadora y el token del link son datos de ejemplo.
- Las pestañas Servicios, Horarios y Perfil de la app muestran un aviso, igual que en el diseño.
- Las fotos son placeholders rayados.
- Las horas se calculan en hora de Argentina (UTC-3, RNF-03).

## Bundle de diseño

`chats/` y `project/` son el export original de Claude Design y quedan como referencia.

---

# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read the chat transcripts first.** There are 1 chat transcript(s) in `chats/`. The transcripts show the full back-and-forth between the user and the design assistant — they tell you **what the user actually wants** and **where they landed** after iterating. Don't skip them. The final HTML files are the output, but the chat is where the intent lives.

**Read `project/Bankap.dc.html` in full.** The user had this file open when they triggered the handoff, so it's almost certainly the primary design they want built. Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `README.md` — this file
- `chats/` — conversation transcripts (read these!)
- `project/` — the `App Design Requirements Spanish` project files (HTML prototypes, assets, components)
