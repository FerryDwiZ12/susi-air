<script setup lang="ts">
useHead({
  htmlAttrs: { lang: "en" },
  title: "Susi Air — Pilot Operations",
  link: [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap",
    },
  ],
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
body {
  @apply bg-bg text-navy antialiased;
  margin: 0;
}

/* Mengikuti aturan penulisan angka tebal pada panduan desain system */
.font-data {
  font-family: "Plus Jakarta Sans", "Inter", sans-serif;
  font-weight: 700;
}
</style>
