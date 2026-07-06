# ✈️ Susi Air – Crew Roster & Logbook Companion

A mobile-first Progressive Web Application (PWA) built with **Nuxt 3** for managing pilot schedules, flight hours, logbooks, and document validity.

---

## Tech Stack

- Nuxt 4
- Vue 3
- TypeScript
- Pinia
- Tailwind CSS

---

## Prerequisites

Before running the project, ensure you have:

- Node.js **18.x** or later
- npm or pnpm

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd susi-air
```

Install dependencies:

Using **npm**

```bash
npm install
```

Using **pnpm**

```bash
pnpm install
```

---

## Run Development Server

Using **npm**

```bash
npm run dev
```

Using **pnpm**

```bash
pnpm dev
```

The application will be available at:

```
http://localhost:3000
```

## Project Structure

```
app/
public/
server/
stores/
nuxt.config.ts
package.json
```

---

## Mock Data

Mock API endpoints are located in:

```
server/api/
```

Mock JSON files are located in:

```
public/mock/
```

## Auth em
For auth 

## 🛠️ Architecture & Tech Stack Decisions (Libraries Chosen & Why)

When building the **Susi Air Ops App**, the primary goal was to create a lightweight, mobile-first operational tool for pilots that feels robust, highly legible, and performant. Here is the rationale behind the primary libraries and tools selected:

* **Nuxt 3 (Vue 3 Framework):**
  * *Why:* Chosen for its exceptional Developer Experience (DX), built-in auto-imports, zero-config file-based routing, and the high-performance **Nitro** server engine. It enforces a clean modular structure (`pages/`, `components/`, `composables/`, `stores/`) out of the box.
* **Pinia (`@pinia/nuxt`):**
  * *Why:* As the official state management library for Vue/Nuxt, Pinia provides type-safe, modular stores. It was crucial for decoupling complex business logic—specifically the **15-day rolling sum flight hours calculation ($Y(D)$ formula)** and **document urgency categorization**—from the UI components, keeping templates clean and testable.
* **Tailwind CSS (`@nuxtjs/tailwindcss`):**
  * *Why:* A utility-first CSS framework that allowed rapid implementation of Susi Air’s strict operational design system (navy primary `#0E2138`, brand red `#E63757`, subtle shadows, and specific border radius). It ensures optimal mobile-first responsiveness (tested strictly at 390px width) without bloating custom CSS stylesheets.
* **Lucide Icons (`nuxt-lucide-icons`):**
  * *Why:* Airline operational tools require crisp, recognizable visual cues without distraction. Lucide provides consistent, modern line icons (1.5px – 2px stroke width) with minimal impact on the final bundle size.
* **Native / Lightweight Charting Approach:**
  * *Why:* Instead of importing heavy libraries like Chart.js or D3 for a simple line chart, a modular Vue component approach was favored to render the rolling-sum trend chart. This guarantees instant load times on mobile devices without unnecessary JavaScript overhead.

---

## 🚀 What I Would Do Differently With More Time (Future Roadmap)

Due to the time-constrained nature of this scope, several deliberate architectural trade-offs were made. Given more time, I would implement the following enhancements to elevate the application to production-grade standards:

1. **Unit & Integration Testing (Vitest):**
   * Write comprehensive unit tests for the complex mathematical logic in `usePilotStore` (verifying the exact rolling sum calculation across week, month, and year toggles).
   * Add component tests for the `DocumentCard` to ensure urgency badges (Green >30 days, Amber <30 days, Red expired) render correctly under edge-case dates.
2. **Progressive Web App (PWA) Offline Capabilities:**
   * Integrate `@vite-pwa/nuxt` with Service Workers and IndexedDB caching. Since Susi Air operates in remote regions of Indonesia (e.g., Papua, island airstrips) with limited or zero connectivity, enabling pilots to view their offline schedules and logbook documents is a critical operational feature.
3. **Real Authentication & Backend Integration:**
   * Replace the current mock login (`useCookie` bypass) with a robust JWT or OAuth2 authentication flow integrated with an actual flight operations backend (e.g., AMOS or custom ERP).
   * Implement role-based access control (RBAC) to differentiate between Captains, First Officers, and CRD Admins.
4. **Enhanced Calendar & Interactive UX:**
   * Expand the Schedule page calendar by implementing gesture-based swipe navigation between months.
   * Replace the *"Detail page coming soon"* placeholder modal with a full bottom-sheet drawer showing comprehensive flight breakdown (co-pilot, payload weight, weather Briefing, and aircraft tail number).

---

## Author

**Ferry Dwi Zulkhifli**
