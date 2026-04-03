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
  components/       # Landing page sections + shared UI
  composables/      # Shared Vue composables
  lib/              # Utility functions
  registry/         # Auto-discovery tool registry
  router/           # Vue Router config
  tools/            # Self-contained tool implementations
  types/            # TypeScript interfaces
  views/            # Route-level views (Home, Tool)
```

## Adding a Tool

Create `src/tools/your-tool-name/index.vue` with a `toolMeta` export. It auto-registers and is accessible at `/tools/your-tool-name`.

## Current Tools

- Trending Angles (`/tools/trending-angles`)
- Notification Mockup (`/tools/notification-mockup`)
