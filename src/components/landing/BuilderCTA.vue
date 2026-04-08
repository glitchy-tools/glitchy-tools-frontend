<script setup lang="ts">
</script>

<template>
  <section class="site-container mb-8 md:mb-16">
    <a
      href="/create"
      class="block rounded-3xl bg-bg-card shadow-card overflow-hidden hover:shadow-lg transition-shadow group"
    >
      <div class="flex flex-col md:flex-row items-center gap-6 p-8 md:p-10">
        <!-- Left: text -->
        <div class="flex-1 text-center md:text-left">
          <div class="inline-flex items-center gap-1.5 rounded-full bg-accent-lime/10 px-3 py-1 text-xs font-semibold text-accent-lime mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            AI-Powered
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-text-primary mb-3">
            Build Your Own Tool
          </h2>
          <p class="text-sm text-text-secondary max-w-md mb-5">
            Describe what you need and our AI will build it for you in seconds. No coding required.
          </p>
          <span class="inline-flex items-center gap-2 bg-accent-lime text-bg-primary rounded-lg font-semibold px-5 py-2.5 text-sm group-hover:brightness-110 transition-all">
            Start Building
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </div>

        <!-- Right: visual -->
        <div class="w-full md:w-[340px] shrink-0">
          <div class="rounded-2xl bg-bg-surface border border-border-card p-4">
            <!-- Fake chat preview -->
            <div class="space-y-3 mb-3">
              <div class="flex justify-end">
                <div class="rounded-2xl rounded-br-md bg-accent-lime/20 px-3 py-2 text-xs text-text-secondary max-w-[200px]">
                  Build me a color palette generator
                </div>
              </div>
              <div class="flex gap-2">
                <div class="h-5 w-5 rounded-md bg-accent-lime/20 shrink-0 flex items-center justify-center">
                  <span class="text-[8px] font-bold text-accent-lime">G</span>
                </div>
                <div class="rounded-2xl rounded-bl-md bg-bg-card border border-border-card px-3 py-2 text-xs text-text-muted max-w-[220px]">
                  Building your tool now...
                  <span class="inline-block w-1 h-3 bg-text-muted animate-pulse ml-0.5 align-middle" />
                </div>
              </div>
            </div>
            <!-- Fake code line -->
            <div class="rounded-lg bg-bg-primary border border-border-subtle px-3 py-2">
              <div class="flex items-center gap-2 mb-1.5">
                <div class="h-2 w-2 rounded-full bg-accent-lime/40" />
                <div class="h-1.5 w-24 rounded bg-text-muted/20" />
              </div>
              <div class="space-y-1">
                <div class="h-1.5 w-full rounded bg-text-muted/10" />
                <div class="h-1.5 w-3/4 rounded bg-text-muted/10" />
                <div class="h-1.5 w-5/6 rounded bg-text-muted/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  </section>
</template>
