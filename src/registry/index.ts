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

const toolModules: Record<string, { default: Component; toolMeta: ToolMeta }> =
  import.meta.glob('../tools/*/index.vue', { eager: true })

const tools: ToolEntry[] = []

for (const path in toolModules) {
  const mod = toolModules[path]
  if (mod.toolMeta && mod.default) {
    tools.push({ meta: mod.toolMeta, component: mod.default })
  }
}

export const toolRegistry = tools

export function getToolBySlug(slug: string): ToolEntry | undefined {
  return tools.find((t) => t.meta.slug === slug)
}
