export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "nuxt-lucide-icons"],
  pinia: {
    storesDirs: ["../app/stores/**"],
  },

  app: {
    head: {
      title: "Susi Air — Pilot Operations", // Judul tab yang juga terlihat di bar
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { hid: "description", name: "description", content: "Susi Air pilot operations portal." },
      ],
      link: [
        // 🚀 Tautkan ke ikon kamu di sini
        // Jika menggunakan format .ico:
        // { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },

        // Jika menggunakan format .png, aktifkan baris di bawah ini dan nonaktifkan yang .ico di atas:
        { rel: "icon", type: "image/png", href: "/favicon.png" },
      ],
    },
  },
});
