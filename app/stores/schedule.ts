import { defineStore } from "pinia";

export interface LegendEntry {
  code: string;
  label: string;
  color: string;
}

export interface Schedule {
  id: string;
  duty_date: string;
  status: number;
  base_name: string;
  base_color: string;
  duty_type: string;
  count_schedules: number;
  count_logbooks: number;
}

/** Schedule + flag turunan untuk memudahkan render cell kalender. */
export interface DecoratedSchedule extends Schedule {
  isCompleted: boolean; // count_logbooks === count_schedules -> tampilkan tick
  isPending: boolean; // status === 1
}

interface SchedulesResponse {
  today: string;
  legend: LegendEntry[];
  schedules: Schedule[];
}

export const useScheduleStore = defineStore("schedule", {
  state: () => ({
    pilotName: "Capt. John Doe",
    today: "",
    legend: [] as LegendEntry[],
    schedules: [] as Schedule[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    /** Map duty_date -> schedule (untuk lookup cepat per cell kalender). */
    byDate(state): Record<string, DecoratedSchedule> {
      const map: Record<string, DecoratedSchedule> = {};
      for (const s of state.schedules) {
        map[s.duty_date] = {
          ...s,
          isCompleted: s.count_logbooks === s.count_schedules,
          isPending: s.status === 1,
        };
      }
      return map;
    },

    /** Map code -> legend entry (untuk warna/label duty type). */
    legendByCode(state): Record<string, LegendEntry> {
      const map: Record<string, LegendEntry> = {};
      for (const l of state.legend) map[l.code] = l;
      return map;
    },
  },

  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        const data = await $fetch<SchedulesResponse>("/api/schedules");
        this.today = data.today;
        this.legend = data.legend;
        this.schedules = data.schedules;
      } catch (e) {
        this.error = e instanceof Error ? e.message : "Failed to load schedules";
      } finally {
        this.loading = false;
      }
    },
  },
});
