#!/usr/bin/env node

/**
 * Tool Validation Script for glitchy.tools
 *
 * Usage: node scripts/validate-tool.js src/tools/my-tool/index.vue
 * Or:    npm run validate -- src/tools/my-tool/index.vue
 *
 * Checks that a tool meets all standards before it can be merged.
 */

import { readFileSync, existsSync } from 'fs'
import { basename, dirname } from 'path'

const filePath = process.argv[2]

if (!filePath) {
  console.error('Usage: node scripts/validate-tool.js <path-to-index.vue>')
  process.exit(1)
}

if (!existsSync(filePath)) {
  console.error(`File not found: ${filePath}`)
  process.exit(1)
}

const content = readFileSync(filePath, 'utf-8')
const errors = []
const warnings = []

// --- Structure checks ---

if (basename(filePath) !== 'index.vue') {
  errors.push('Entry point must be named index.vue')
}

if (!content.includes('<script lang="ts">')) {
  errors.push('Missing plain <script lang="ts"> block for toolMeta export')
}

if (!content.includes('<script setup lang="ts">')) {
  errors.push('Missing <script setup lang="ts"> block')
}

if (!content.includes('export const toolMeta')) {
  errors.push('Missing "export const toolMeta" — every tool must export metadata')
}

if (!content.includes('<template>')) {
  errors.push('Missing <template> block')
}

// Verify toolMeta has required fields
const metaFields = ['name', 'slug', 'description', 'icon', 'category']
for (const field of metaFields) {
  if (!new RegExp(`${field}\\s*:`).test(content)) {
    errors.push(`toolMeta is missing required field: "${field}"`)
  }
}

// --- Security checks ---

const securityPatterns = [
  { pattern: /\bfetch\s*\(/, label: 'fetch() — no network requests allowed' },
  { pattern: /XMLHttpRequest/, label: 'XMLHttpRequest — no network requests allowed' },
  { pattern: /\bWebSocket\b/, label: 'WebSocket — no network requests allowed' },
  { pattern: /navigator\.sendBeacon/, label: 'navigator.sendBeacon — no network requests allowed' },
  { pattern: /v-html/, label: 'v-html — no raw HTML injection allowed' },
  { pattern: /innerHTML/, label: 'innerHTML — no raw HTML injection allowed' },
  { pattern: /outerHTML/, label: 'outerHTML — no raw HTML injection allowed' },
  { pattern: /document\.write/, label: 'document.write — no raw HTML injection allowed' },
  { pattern: /\beval\s*\(/, label: 'eval() — no dynamic code execution allowed' },
  { pattern: /new\s+Function\s*\(/, label: 'new Function() — no dynamic code execution allowed' },
  { pattern: /\blocalStorage\b/, label: 'localStorage — no client storage allowed' },
  { pattern: /\bsessionStorage\b/, label: 'sessionStorage — no client storage allowed' },
  { pattern: /\bIndexedDB\b/i, label: 'IndexedDB — no client storage allowed' },
  { pattern: /document\.cookie/, label: 'document.cookie — no cookie access allowed' },
  { pattern: /document\.querySelector/, label: 'document.querySelector — no direct DOM access' },
  { pattern: /document\.getElementById/, label: 'document.getElementById — no direct DOM access' },
  { pattern: /document\.createElement/, label: 'document.createElement — no direct DOM access' },
  { pattern: /document\.body/, label: 'document.body — no direct DOM access' },
  { pattern: /window\.open/, label: 'window.open — no window manipulation' },
  { pattern: /window\.location/, label: 'window.location — no navigation manipulation' },
]

// Extract script content only (skip template strings and comments for fewer false positives)
const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/g)
const scriptContent = scriptMatch ? scriptMatch.join('\n') : ''

for (const { pattern, label } of securityPatterns) {
  if (pattern.test(scriptContent)) {
    errors.push(`SECURITY: ${label}`)
  }
}

// --- Style checks ---

if (/<style[\s>]/.test(content)) {
  errors.push('Contains <style> block — only Tailwind utility classes are allowed, no custom CSS')
}

// --- Import checks ---

const importLines = scriptContent.match(/^\s*import\s+.*$/gm) || []
const allowedImportPrefixes = [
  'vue',
  '@/components/ui/',
  '@/lib/utils',
  './',
  '../',
]

for (const line of importLines) {
  const fromMatch = line.match(/from\s+['"]([^'"]+)['"]/)
  if (!fromMatch) continue
  const source = fromMatch[1]
  const isAllowed = allowedImportPrefixes.some((prefix) => source === prefix || source.startsWith(prefix))
  if (!isAllowed) {
    errors.push(`Unauthorized import: "${source}" — only vue, @/components/ui/*, @/lib/utils, and local files are allowed`)
  }
}

// --- Output ---

console.log('')
console.log(`  Validating: ${filePath}`)
console.log('  ' + '─'.repeat(50))

if (errors.length === 0 && warnings.length === 0) {
  console.log('  ✓ All checks passed!')
  console.log('')
  process.exit(0)
}

for (const w of warnings) {
  console.log(`  ⚠ WARNING: ${w}`)
}

for (const e of errors) {
  console.log(`  ✗ FAIL: ${e}`)
}

console.log('')
console.log(`  ${errors.length} error(s), ${warnings.length} warning(s)`)
console.log('')

if (errors.length > 0) {
  process.exit(1)
}
