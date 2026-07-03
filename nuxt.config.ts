export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", 'nuxt-lucide-icons'],
  pinia: {
    storesDirs: ["../app/stores/**"],
  },
});