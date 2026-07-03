<script setup lang="ts">
import { parseISODate } from "~/composables/useDates";
import type { DecoratedSchedule, LegendEntry } from "~/stores/schedule";

const props = defineProps<{
  byDate: Record<string, DecoratedSchedule>;
  legend: LegendEntry[];
  today: string;
}>();

const init = props.today ? parseISODate(props.today) : new Date();
const viewYear = ref(init.getUTCFullYear());
const viewMonth = ref(init.getUTCMonth()); // 0-based

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
  schedule: DecoratedSchedule | null;
}

// Menghasilkan daftar agenda linear untuk bulan yang dipilih
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
      isToday: iso === props.today,
      schedule: props.byDate[iso] ?? null,
    });
  }
  return out;
});

function legendFor(code: string): LegendEntry | undefined {
  return props.legend.find((l) => l.code === code);
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
  <div class="space-y-6 animate-fadeIn pb-4">
    <div class="px-1 flex items-center justify-between">
      <div>
        <h1 class="text-lg font-bold text-navy tracking-tight">Roster Schedule</h1>
        <p class="text-xs text-text-secondary mt-0.5">
          Your monthly flight duties and assignments overview.
        </p>
      </div>
      <div class="inline-flex bg-white rounded-full border border-slate-100 p-0.5 shadow-sm">
        <button
          @click="prev"
          class="p-1.5 text-navy hover:bg-slate-50 rounded-full transition cursor-pointer active:scale-95"
        >
          &lsaquo;
        </button>
        <span class="text-xs font-bold text-navy py-3.5 px-1.5 min-w-[80px] text-center">{{
          monthLabel
        }}</span>
        <button
          @click="next"
          class="p-1.5 text-navy hover:bg-slate-50 rounded-full transition cursor-pointer active:scale-95"
        >
          &rsaquo;
        </button>
      </div>
    </div>

    <div class="space-y-2.5">
      <div
        v-for="day in agendaDays"
        :key="day.iso"
        class="bg-surface rounded-card p-4 shadow-subtle border flex items-start gap-4 transition duration-150 active:scale-[0.99] cursor-pointer"
        :class="[
          day.isToday
            ? 'border-l-4 border-l-brand ring-1 ring-brand/10 bg-brand/5'
            : 'border-slate-100',
          // Menambahkan border kiri tipis untuk hari penugasan
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
          <span class="text-xl font-bold font-data leading-none mt-1">{{ day.dayNumber }}</span>
          <span class="text-[9px] font-bold uppercase tracking-wider">{{ day.weekday }}</span>
        </div>

        <div class="flex-grow space-y-2">
          <template v-if="day.schedule">
            <div class="flex items-center gap-2.5">
              <span
                class="inline-block rounded px-2 py-0.5 font-data text-[10px] font-extrabold text-white uppercase tracking-wider"
                :style="{ backgroundColor: day.schedule.base_color }"
              >
                {{ day.schedule.base_name }}
              </span>
              <h3 class="text-xs font-bold text-navy">
                SA-21{{ day.dayNumber }} • {{ legendFor(day.schedule.duty_type)?.label }}
              </h3>
            </div>

            <div class="text-[11px] text-text-secondary flex items-center gap-3">
              <span
                :class="day.schedule.status === 2 ? 'text-success' : 'text-warning'"
                class="font-semibold flex items-center gap-1"
              >
                <span
                  :class="day.schedule.status === 2 ? 'bg-success' : 'bg-warning'"
                  class="w-1.5 h-1.5 rounded-full"
                ></span>
                Flight:{{ day.schedule.status === 2 ? "Verified" : "Pending" }}
              </span>
              <span>• Jakarta (HLP) ➔ Pangandaran (CJN)</span>
            </div>
          </template>

          <template v-else>
            <div class="text-xs font-medium text-slate-400 italic pt-1">
              No duty assigned (Rest Day)
            </div>
          </template>
        </div>

        <div v-if="day.schedule" class="flex-shrink-0 text-right self-center pl-2">
  
  <template v-if="day.schedule.count_logbooks === day.schedule.count_schedules">
    <span 
      class="flex h-5 w-5 items-center justify-center rounded-full text-white bg-success shadow-sm font-bold text-xs"
      :title="`${day.schedule.count_logbooks}/${day.schedule.count_schedules} logged`"
    >
      ✓
    </span>
  </template>

  <template v-else>
     <span 
       class="inline-block min-w-[20px] h-5 leading-5 text-center font-data text-[10px] font-extrabold text-white px-1.5 rounded-full" 
       :class="day.schedule.status === 2 ? 'bg-navy' : 'bg-brand'"
       :title="`${day.schedule.count_logbooks}/${day.schedule.count_schedules} logged`"
     >
       {{ day.schedule.count_schedules }}
     </span>
  </template>

</div>
      </div>
    </div>

    <div class="bg-surface rounded-card p-4 border border-slate-100 shadow-subtle">
      <h4 class="text-xs font-bold text-navy uppercase tracking-wider mb-3 px-1">
        Duty Type Legend
      </h4>
      <div class="flex flex-wrap gap-x-3 gap-y-1.5">
        <div
          v-for="l in legend"
          :key="l.code"
          class="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md"
        >
          <span class="h-2 w-2 rounded-full flex-shrink-0" :style="{ backgroundColor: l.color }" />
          <span class="font-data text-[10px] font-bold text-navy">{{ l.code }}</span>
          <span class="text-[10px] text-text-secondary font-medium">— {{ l.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
