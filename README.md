# Glitchy Tools

Marketing toolkit platform. Vue 3 + TypeScript + Tailwind v4. Hosted on `glitchy.tool`, embedded via iframe in the main Glitchy app.

## Setup

```bash
npm install
npm run dev
```

## Structure

```
src/
  components/
    icons/           # SVG icon components
    landing/         # Landing page sections
    ui/              # Shared UI primitives (Button, Card)
  composables/       # Shared Vue composables
  lib/               # Pure utility functions
  registry/          # Auto-discovery tool registry
  router/            # Vue Router config
  tools/             # Self-contained tool implementations
  types/             # TypeScript interfaces
  views/             # Route-level views
```

## Adding a Tool

Create `src/tools/your-tool-name/index.vue` with a `toolMeta` export. It auto-registers at `/tools/your-tool-name`.

## Current Tools (Open)

- Notification Mockup (`/tools/notification-mockup`)
- Trending Angles (`/tools/trending-angles`)
- Email HTML Generator (`/tools/email-html-generator`)
- Cloaker (`/tools/cloaker`)
- Watermark Remover (`/tools/watermark-remover`)
- SMS Verification (`/tools/sms-verification`)
