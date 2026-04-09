/** Category icons — one SVG path per category, scales to any number of tools */
export const categoryIcons: Record<string, string> = {
  Marketing: 'M22 12h-4l-3 9L9 3l-3 9H2',
  Design: 'M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586',
  Content: 'M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z',
  Analytics: 'M18 20V10M12 20V4M6 20v-6',
  Productivity: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
}

/** Generate a consistent gradient from a tool slug */
export function gradientFromSlug(slug: string): string {
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = slug.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 60 + 250
  return `linear-gradient(135deg, hsl(${hue}, 40%, 20%) 0%, hsl(${hue + 30}, 30%, 12%) 100%)`
}
