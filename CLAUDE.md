# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Glitchy Tools is a standalone Vue 3 marketing toolkit hosted on `glitchy.tool`, embedded via iframe in the main Glitchy app. Each tool is a self-contained SFC that auto-registers through a glob-based registry.

## Commands

```bash
npm run dev          # Vite dev server
npm run build        # Type-check + Vite production build
npm run preview      # Preview production build
npm run typecheck    # vue-tsc type checking only
```

No test framework is configured.

## Architecture

- **Vue 3 + TypeScript + Vite** with Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Import alias**: `@/*` maps to `./src/*`
- **UI primitives**: shadcn-vue style components in `src/components/ui/` (Button, Card) using `class-variance-authority` + `clsx` + `tailwind-merge`

### Tool Auto-Registration

Tools live in `src/tools/<tool-name>/index.vue`. Each tool SFC exports a `toolMeta` object (in a non-`setup` `<script>` block) conforming to the `ToolMeta` interface. The registry at `src/registry/index.ts` uses `import.meta.glob` to eagerly discover all tools at build time. Routes resolve via `/tools/:slug` → `ToolView.vue` → registry lookup by slug.

To add a tool: create `src/tools/your-tool-name/index.vue` with a `toolMeta` export. No router or registry changes needed.

### Routing

Three routes in `src/router/index.ts`:
- `/` — landing page (`HomeView.vue`)
- `/tools/:slug` — dynamic tool view
- `/:pathMatch(.*)*` — 404 catch-all

### Shared Code

- `src/composables/` — Vue composables (e.g., `useCopyToClipboard`)
- `src/lib/utils.ts` — shadcn-style `cn()` utility
- `src/lib/download.ts` — file download helpers
- `src/types/index.ts` — all shared TypeScript interfaces (`ToolMeta`, `ToolEntry`, landing page types)
