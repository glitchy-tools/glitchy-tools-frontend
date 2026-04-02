import type { Component } from 'vue'

export interface ToolSeo {
  title: string
  description: string
  keywords: string[]
}

export interface ToolMeta {
  name: string
  slug: string
  description: string
  icon: string
  category: string
  seo: ToolSeo
}

export interface ToolEntry {
  meta: ToolMeta
  component: Component
}

// Auto-discovers all tools from their index.vue entry points via Vite's import.meta.glob.
const toolModules: Record<string, { default: Component; toolMeta: ToolMeta }> =
  import.meta.glob('../tools/*/index.vue', { eager: true })

const tools: ToolEntry[] = []

for (const path in toolModules) {
  const mod = toolModules[path]
  if (mod.toolMeta && mod.default) {
    tools.push({
      meta: mod.toolMeta,
      component: mod.default,
    })
  } else {
    console.warn(`[registry] Tool at ${path} is missing toolMeta or default export — skipping.`)
  }
}

export const toolRegistry = tools

export function getToolBySlug(slug: string): ToolEntry | undefined {
  return tools.find((t) => t.meta.slug === slug)
}

export function getToolsByCategory(): Record<string, ToolEntry[]> {
  const grouped: Record<string, ToolEntry[]> = {}
  for (const tool of tools) {
    const cat = tool.meta.category
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(tool)
  }
  return grouped
}

