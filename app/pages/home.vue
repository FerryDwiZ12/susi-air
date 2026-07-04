<script setup lang="ts">
// Import store yang dibutuhkan
const pilot = usePilotStore();
const docs = useDocumentsStore();
const scheduleStore = useScheduleStore();

// Mengambil semua mock data secara paralel saat inisialisasi halaman
await useAsyncData("home", async () => {
  await Promise.all([pilot.fetchAll(), docs.fetchAll(), scheduleStore.fetchAll()]);
  return true;
});

const bound = computed(() => pilot.activeBound);

// Menghitung akumulasi jam penerbangan aktif pada grafik tren
const current = computed(() => {
  const s = pilot.chartSeries;
  if (!s || !s.length) return 0;

  const i = s.findIndex((p) => p.date === pilot.today);
  const targetPoint = i >= 0 ? s[i] : s[s.length - 1];

  // Jika targetPoint ada ambil .value, jika tidak ada kembalikan 0
  return targetPoint?.value ?? 0;
});

const upcomingFlight = ref({
  date: "Friday, 15 May 2026",
  time: "07:30 UTC",
  route: "Jakarta (HLP) → Pangandaran (CJN)",
  aircraft: "Cessna Grand Caravan — PK-ASI",
  isValid: true,
});

const mockNews = ref([
  {
    title: "New Base Operations Launched in Papua",
    desc: "Operational readiness updates for Timika base expansion.",
  },
  {
    title: "Safety Bulletin: Wet Season Approaches",
    desc: "Key safety procedures regarding short-runway water dispersion.",
  },
  {
    title: "Avionics Upgrades Schedule",
    desc: "Phase 2 implementation for the Garmin G1000 flight decks.",
  },
]);

// Helper untuk menghitung batas persentase progress bar (maksimal 100%)
const getProgressWidth = (currentHours: number, limit: number) => {
  if (!limit) return "0%";
  const pct = Math.min((currentHours / limit) * 100, 100);
  return `${pct}%`;
};
</script>

<template>
  <div class="space-y-6">
    <div
      class="flex items-center justify-between bg-surface rounded-card p-4 shadow-subtle border border-slate-100"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 rounded-full border border-slate-100 overflow-hidden flex items-center justify-center bg-slate-100 shadow-sm"
        >
          <img
            src="/images/pilot-avatar.webp"
            alt="Pilot Avatar"
            class="w-full h-full object-cover"
          />
        </div>
        <div>
          <span class="text-[11px] text-text-secondary uppercase tracking-wider font-bold block"
            >Welcome Back</span
          >
          <h1 class="text-base font-bold text-navy leading-tight mt-0.5">
            {{ pilot.pilot?.name ?? "Pilot" }}
          </h1>
        </div>
      </div>

      <button
        class="relative p-2 bg-slate-50 hover:bg-slate-100 active:scale-95 rounded-full transition duration-200 cursor-pointer text-navy border border-slate-100"
      >
        <LucideBell :size="20" :stroke-width="1.75" />

        <span
          class="absolute -top-1 -right-1 min-w-[16px] h-4 bg-brand text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 border border-white"
        >
          2
        </span>
      </button>
    </div>

    <section class="bg-navy text-white rounded-card p-5 shadow-md relative overflow-hidden">
      <div
        class="absolute -right-6 -bottom-6 text-white/5 text-7xl font-bold font-data select-none"
      >
        FLIGHT
      </div>
      <span
        class="text-[10px] uppercase bg-white/20 px-2 py-0.5 rounded-full font-semibold tracking-wider"
      >
        Next Assignment
      </span>
      <div class="mt-3">
        <div class="text-lg font-bold">{{ upcomingFlight.route }}</div>
        <div class="text-xs text-slate-300 mt-1 font-data">
          {{ upcomingFlight.date }}
          <span v-if="upcomingFlight.isValid">• {{ upcomingFlight.time }}</span>
        </div>
      </div>
      <div
        class="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-slate-400"
      >
        <span>{{ upcomingFlight.aircraft }}</span>
        <span
          class="text-chart-accent font-semibold cursor-pointer"
          @click="navigateTo('/schedule')"
        >
          View Calendar →
        </span>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-md font-bold text-navy px-1">Hours to Legal Limits</h2>
      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="(limitVal, key) in pilot.limits"
          :key="key"
          class="bg-surface p-4 rounded-card border border-slate-100 shadow-sm flex flex-col justify-between"
        >
          <div>
            <span class="text-xs text-text-secondary capitalize font-semibold tracking-wide block">
              {{ key }} Limit
            </span>
            <div class="flex items-baseline gap-1 mt-1.5">
              <span class="font-data text-xl font-bold text-navy">
                {{ pilot.currentHoursSummary[key]?.toFixed(1) ?? "0.0" }}h
              </span>
              <span class="text-xs text-text-secondary">/ {{ limitVal }}h</span>
            </div>
          </div>

          <div class="mt-4">
            <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="
                  (pilot.currentHoursSummary[key] ?? 0 > limitVal)
                    ? 'bg-danger animate-pulse'
                    : 'bg-chart-accent'
                "
                :style="{ width: getProgressWidth(pilot.currentHoursSummary[key] ?? 0, limitVal) }"
              ></div>
            </div>

            <p class="text-[11px] text-text-secondary mt-2 font-medium">
              <template v-if="limitVal - (pilot.currentHoursSummary[key] ?? 0) >= 0">
                Remaining:
                <span class="font-data font-bold text-slate-700">
                  {{ (limitVal - (pilot.currentHoursSummary[key] ?? 0)).toFixed(1) }}h
                </span>
              </template>
              <template v-else>
                <span class="text-danger font-bold flex items-center gap-1">
                  ⚠️ Limit Breached
                </span>
              </template>
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-card border border-slate-100 bg-surface p-5 shadow-sm">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-bold text-navy">Rolling Flight Analysis</h2>
        <div class="inline-flex bg-slate-50 p-0.5 rounded-lg border border-slate-100">
          <button
            v-for="t in pilot.toggles"
            :key="t"
            class="rounded-md px-2.5 py-1 font-data text-xs font-semibold uppercase transition"
            :class="
              pilot.activeToggle === t
                ? 'bg-surface text-navy shadow-sm font-bold'
                : 'text-slate-400'
            "
            @click="pilot.setToggle(t)"
          >
            {{ t }}
          </button>
        </div>
      </div>

      <div v-if="bound" class="mt-4 flex items-baseline gap-2">
        <span
          class="font-data text-2xl font-bold"
          :class="current > bound.limit ? 'text-danger' : 'text-navy'"
        >
          {{ current.toFixed(1) }}h
        </span>
        <span class="text-xs text-text-secondary">/ {{ bound.limit }}h cap</span>
        <span
          v-if="current > bound.limit"
          class="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-brand animate-pulse"
        >
          Limit Breach
        </span>
      </div>

      <div v-if="bound" class="mt-3">
        <FlightHoursChart
          :series="pilot.chartSeries"
          :limit="bound.limit"
          :max="bound.max"
          :today="pilot.today"
        />
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-md font-bold text-navy px-1">Latest Company News</h2>
      <div class="flex gap-4 overflow-x-auto pb-3 snap-x no-scrollbar">
        <div
          v-for="news in mockNews"
          :key="news.title"
          class="bg-surface p-4 rounded-card border border-slate-100 shadow-sm min-w-[260px] max-w-[260px] snap-start flex-shrink-0"
        >
          <h3 class="text-xs font-bold text-navy line-clamp-1">{{ news.title }}</h3>
          <p class="text-[11px] text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
            {{ news.desc }}
          </p>
          <span class="inline-block mt-3 text-[10px] font-bold text-brand cursor-pointer">
            Read Full Article →
          </span>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-md font-bold text-navy px-1">Documents &amp; Currency</h2>
      <div class="grid gap-2.5">
        <DocumentCard
          v-for="d in docs.decorated"
          :key="d.id"
          :label="d.label"
          :expiry-date="d.expiryDate"
          :days-remaining="d.daysRemaining"
          :status="d.status"
          :color="d.color"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
