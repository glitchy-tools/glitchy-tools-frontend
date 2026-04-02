# Glitchy Tools

A public-facing dashboard of free, browser-based tools built on **Vue 3 + Tailwind CSS + shadcn-vue**. No sign-up, no backend, no nonsense.

**Domain:** [glitchy.tools](https://glitchy.tools)

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| UI | shadcn-vue components |
| Styling | Tailwind CSS |
| Routing | Vue Router |
| Build | Vite |
| SEO | @unhead/vue (meta tags, Open Graph, JSON-LD) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Adding a Tool

1. Create a folder in `src/tools/your-tool-name/`
2. Add an `index.vue` with this structure:

```vue
<script lang="ts">
export const toolMeta = {
  name: 'Tool Name',
  slug: 'tool-name',
  description: 'What it does in one sentence.',
  icon: '🔧',
  category: 'Developer',
  seo: {
    title: 'SEO Page Title',
    description: 'SEO meta description for search engines.',
    keywords: ['keyword1', 'keyword2'],
  },
}
</script>

<script setup lang="ts">
// Your tool logic here
</script>

<template>
  <!-- Your tool UI here -->
</template>
```

3. That's it. The tool auto-registers and appears on the home page.

## Validating a Tool

```bash
npm run validate -- src/tools/your-tool-name/index.vue
```

Checks for: correct file structure, required metadata fields, forbidden imports, security violations (no `fetch`, `eval`, `v-html`, `localStorage`, etc.).

## Tool Rules

- Only import from `vue`, `@/components/ui/*`, `@/lib/utils`, or the tool's own directory
- Tailwind utility classes only, no `<style>` blocks
- No network requests, no DOM manipulation, no external dependencies
- All state must be local (`ref`, `reactive`, `computed`)
- Must export `toolMeta` with name, slug, description, icon, category, and seo fields

## Available Categories

`Data` | `Design` | `Developer` | `Utility` | `Writing`

## Current Tools

| Tool | Category |
|------|----------|
| Base64 Encoder / Decoder | Developer |
| JSON Formatter | Developer |
| Timestamp Converter | Developer |
| Color Picker | Design |
| Case Converter | Writing |
| Lorem Ipsum Generator | Writing |
| Word Counter | Writing |
| Password Generator | Utility |
| Percentage Calculator | Data |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run validate -- <path>` | Validate a tool file |
