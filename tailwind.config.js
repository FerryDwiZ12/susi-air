/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        // Aligned with Susi Air Brand & Operations Role Colors
        navy: "#0E2138",
        brand: "#E63757",
        bg: "#F5F6F8",
        surface: "#FFFFFF",

        // Typography Colors
        "text-primary": "#0E2138",
        "text-secondary": "#6B7280",

        // Status Alerts Colors
        success: "#1FBF8F",
        warning: "#F59E0B",
        danger: "#E63757",

        // Analytics Chart Accent
        "chart-accent": "#22C5E8",
      },
      borderRadius: {
        // Specs: 12 - 16px on cards (We use mid-point 14px)
        card: "14px",
        // Specs: pill shape (24px) on primary buttons
        pill: "24px",
      },
      fontFamily: {
        // Operational professional look using Google Fonts
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        // Specs: Subtle card shadows, no heavy drop shadows
        subtle: "0 2px 8px -1px rgba(14, 33, 56, 0.04), 0 1px 4px -1px rgba(14, 33, 56, 0.02)",
      },
    },
  },
  plugins: [],
};
