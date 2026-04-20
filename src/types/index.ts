
export interface NavLink {
  label: string
  href: string
  badge?: string
  active?: boolean
}

export interface HeroCard {
  title: string
  subtitle: string
  videoSrc?: string
  imageSrc?: string
  href: string
}

export interface GalleryItem {
  id: string
  title?: string
  imageSrc: string
  videoSrc?: string
  href: string
  aspectRatio?: string
}

export interface GallerySection {
  title: string
  subtitle: string
  href: string
  badge?: string
  items: GalleryItem[]
}

export interface ToolCard {
  title: string
  subtitle: string
  videoSrc?: string
  imageSrc?: string
  href: string
  badge?: string
}

export interface FeatureTag {
  label: string
  href: string
}

// Tool registry types
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
  exclusive?: boolean
  seo: ToolSeo
}

export interface ToolEntry {
  meta: ToolMeta
  component: import('vue').Component
}
