import { defineStore } from 'pinia'
import {
  buildRollingSeries,
  buildHoursMap,
  rollingSumAt,
  type FlightHourEntry,
  type RollingPoint,
} from '~/composables/useRollingSum'

export type ChartToggle = '1w' | '1m' | '3m' | '6m' | '1y'

export interface ChartBound {
  limit: number 
  max: number 
  windowDays: number 
  displayRangeDays: number 
}

export interface Pilot {
  name: string
  totalFlightHours: number
}

export interface Limits {
  daily: number
  weekly: number
  monthly: number
  annual: number
}

interface FlightHoursResponse {
  pilot: Pilot
  limits: Limits
  chartBounds: Record<ChartToggle, ChartBound>
  flightHours: FlightHourEntry[]
}

export const TODAY = '2026-05-31'

export const usePilotStore = defineStore('pilot', {
  state: () => ({
    pilot: null as Pilot | null,
    limits: null as Limits | null,
    chartBounds: null as Record<ChartToggle, ChartBound> | null,
    flightHours: [] as FlightHourEntry[],
    activeToggle: '1w' as ChartToggle,
    today: TODAY,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    activeBound(state): ChartBound | null {
      return state.chartBounds ? state.chartBounds[state.activeToggle] : null
    },

    toggles(state): ChartToggle[] {
      return state.chartBounds
        ? (Object.keys(state.chartBounds) as ChartToggle[])
        : []
    },

    chartSeries(state): RollingPoint[] {
      const bound = state.chartBounds?.[state.activeToggle]
      if (!bound) return []
      return buildRollingSeries(
        state.flightHours,
        state.today,
        bound.windowDays,
        bound.displayRangeDays,
      )
    },

    /** * PERBAIKAN SEKSI A: Menghitung akumulasi jam terbang pilot saat ini 
     * berdasarkan masing-masing jendela aturan regulasi reguler.
     */
    currentHoursSummary(state): Record<string, number> {
      if (!state.flightHours.length) return { daily: 0, weekly: 0, monthly: 0, annual: 0 }
      
      const map = buildHoursMap(state.flightHours)
      return {
        daily: rollingSumAt(map, state.today, 1),     // Today only
        weekly: rollingSumAt(map, state.today, 7),    // Rolling 7 days
        monthly: rollingSumAt(map, state.today, 30),  // Rolling 30 days
        annual: rollingSumAt(map, state.today, 365)   // Rolling 365 days
      }
    }
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const data = await $fetch<FlightHoursResponse>('/api/flight-hours')
        this.pilot = data.pilot
        this.limits = data.limits
        this.chartBounds = data.chartBounds
        this.flightHours = data.flightHours
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to load flight hours'
      } finally {
        this.loading = false
      }
    },

    setToggle(toggle: ChartToggle) {
      this.activeToggle = toggle
    },
  },
})