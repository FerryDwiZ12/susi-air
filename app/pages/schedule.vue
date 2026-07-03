<script setup lang="ts">
import { parseISODate } from "~/composables/useDates";

// 1. Panggil Store Pinia Jadwal Susi Air
const scheduleStore = useScheduleStore();

// 2. Lakukan pre-fetch data saat SSR/Navigasi agar data instan tersedia
await useAsyncData("schedule-data", async () => {
  await scheduleStore.fetchAll();
  return true;
});

// 3. Inisialisasi navigasi penanggalan internal berdasarkan 'today' dari store
const init = scheduleStore.today ? parseISODate(scheduleStore.today) : new Date();
const viewYear = ref(init.getUTCFullYear());
const viewMonth = ref(init.getUTCMonth()); // 0-based

// 4. Logika Modal Pop-up Placeholder "Detail page coming soon"
const showModal = ref(false);
const selectedDateLabel = ref("");

function handleDateTap(dayNumber: number, isoString: string) {
  const d = new Date(isoString);
  selectedDateLabel.value = d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  showModal.value = true;
}

// Label Bulan & Tahun Aktif (misal: "May 2026")
const monthLabel = computed(() =>
  new Date(Date.UTC(viewYear.value, viewMonth.value, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }),
);

interface ListDay {
  iso: string;
  dayNumber: number;
  weekday: string;
  isToday: boolean;
  schedule: any;
}

// 5. Pembentukan array hari linier bulanan (Aman dari kondisi Null/Undefined)
const agendaDays = computed<ListDay[]>(() => {
  const daysInMonth = new Date(Date.UTC(viewYear.value, viewMonth.value + 1, 0)).getUTCDate();
  const out: ListDay[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(Date.UTC(viewYear.value, viewMonth.value, i));
    const iso = d.toISOString().slice(0, 10);

    out.push({
      iso,
      dayNumber: i,
      weekday: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
      isToday: iso === scheduleStore.today,
      // 💡 LAPISAN PENGAMAN: Menggunakan opsional chaining (?.) agar tidak crash jika bulan kosong
      schedule: scheduleStore.byDate?.[iso] ?? null,
    });
  }
  return out;
});

function legendFor(code: string) {
  return scheduleStore.legend?.find((l) => l.code === code);
}

function prev() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11;
    viewYear.value--;
  } else {
    viewMonth.value--;
  }
}

function next() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0;
    viewYear.value++;
  } else {
    viewMonth.value++;
  }
}
</script>

<template>
  <div class="space-y-6 animate-fadeIn pb-4 relative">
    <div class="border-b border-slate-100 pb-5 flex items-center justify-between">
      <div>
        <div class="font-data text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Roster Portal
        </div>
        <h1 class="mt-0.5 text-xl font-bold text-navy">Duty Schedule</h1>
      </div>

      <div
        class="inline-flex bg-white rounded-full border border-slate-200 p-0.5 shadow-sm items-center"
      >
        <button
          @click="prev"
          class="w-7 h-7 flex items-center justify-center text-navy font-bold hover:bg-slate-50 rounded-full transition cursor-pointer active:scale-90"
        >
          &lsaquo;
        </button>
        <span class="text-xs font-bold text-navy px-2 min-w-[110px] text-center select-none">{{
          monthLabel
        }}</span>
        <button
          @click="next"
          class="w-7 h-7 flex items-center justify-center text-navy font-bold hover:bg-slate-50 rounded-full transition cursor-pointer active:scale-90"
        >
          &rsaquo;
        </button>
      </div>
    </div>

    <div v-if="scheduleStore.today" class="space-y-2.5">
      <div
        v-for="day in agendaDays"
        :key="day.iso"
        @click="handleDateTap(day.dayNumber, day.iso)"
        class="bg-surface rounded-card p-4 shadow-subtle border flex items-start gap-4 transition duration-150 active:scale-[0.98] cursor-pointer"
        :class="[
          day.isToday
            ? 'border-l-4 border-l-brand ring-1 ring-brand/10 bg-brand/5'
            : 'border-slate-100',
          day.schedule?.status === 2 ? 'border-l-success border-l-2' : '',
          day.schedule?.status === 1 ? 'border-l-warning border-l-2' : '',
        ]"
      >
        <div
          class="flex flex-col items-center justify-center min-w-[36px] h-10 rounded-lg"
          :class="
            day.isToday ? 'bg-brand text-white' : 'bg-slate-50 text-navy border border-slate-100'
          "
        >
          <span class="text-lg font-bold font-data leading-none mt-0.5">{{ day.dayNumber }}</span>
          <span class="text-[8px] font-bold uppercase tracking-wider">{{ day.weekday }}</span>
        </div>

        <div class="flex-grow space-y-1">
          <template v-if="day.schedule">
            <div class="flex items-center gap-2">
              <span
                class="inline-block rounded px-1.5 py-0.5 font-data text-[9px] font-extrabold text-white uppercase tracking-wider"
                :style="{ backgroundColor: day.schedule.base_color }"
              >
                {{ day.schedule.base_name }}
              </span>
              <h3 class="text-xs font-bold text-navy">
                SA-21{{ day.dayNumber }} •
                {{ legendFor(day.schedule.duty_type)?.label ?? "Duty Assignment" }}
              </h3>
            </div>
            <div class="text-[11px] text-text-secondary flex items-center gap-2">
              <span
                :class="day.schedule.status === 2 ? 'text-success' : 'text-warning'"
                class="font-bold"
              >
                ● {{ day.schedule.status === 2 ? "Verified" : "Pending" }}
              </span>
              <span class="text-slate-300">|</span>
              <span>Ops Sector Flight</span>
            </div>
          </template>
          <template v-else>
            <div class="text-xs font-medium text-slate-400 italic pt-2">
              No duty assigned (Rest Day)
            </div>
          </template>
        </div>

        <div v-if="day.schedule" class="flex-shrink-0 text-right self-center pl-2">
          <span
            v-if="day.schedule.count_logbooks === day.schedule.count_schedules"
            class="flex h-5 w-5 items-center justify-center rounded-full text-white bg-success font-bold text-xs shadow-sm"
          >
            ✓
          </span>
          <span
            v-else
            class="inline-block min-w-[20px] h-5 leading-5 text-center font-data text-[9px] font-extrabold text-white px-1.5 rounded-full"
            :class="day.schedule.status === 2 ? 'bg-navy' : 'bg-brand'"
          >
            {{ day.schedule.count_schedules }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="py-12 text-center text-sm text-slate-400">
      {{ scheduleStore.error ?? "Loading fleet roster details..." }}
    </div>

    <div class="bg-surface rounded-card p-4 border border-slate-100 shadow-subtle">
      <h4 class="text-xs font-bold text-navy uppercase tracking-wider mb-3 px-0.5">
        Duty Type Legend
      </h4>
      <div class="flex flex-wrap gap-x-2.5 gap-y-1.5">
        <div
          v-for="l in scheduleStore.legend"
          :key="l.code"
          class="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md"
        >
          <span
            class="h-1.5 w-1.5 rounded-full flex-shrink-0"
            :style="{ backgroundColor: l.color }"
          />
          <span class="font-data text-[10px] font-bold text-navy">{{ l.code }}</span>
          <span class="text-[10px] text-text-secondary font-medium">— {{ l.label }}</span>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm"
        @click.self="showModal = false"
      >
        <div
          class="bg-white rounded-card max-w-xs w-full p-5 shadow-xl text-center border border-slate-100"
        >
          <div
            class="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand mb-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
          </div>

          <h3 class="text-sm font-bold text-navy">Detail page coming soon</h3>
          <p class="text-xs text-text-secondary mt-1.5 leading-relaxed">
            The comprehensive sector metrics and crew roster logs for
            <span class="font-bold text-slate-700">{{ selectedDateLabel }}</span> are currently
            being prepared by Flight Operations.
          </p>

          <button
            @click="showModal = false"
            class="mt-4 w-full bg-navy text-white text-xs font-bold py-2.5 rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition cursor-pointer"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
