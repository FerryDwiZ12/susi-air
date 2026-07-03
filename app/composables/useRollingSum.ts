import { addDays } from './useDates'

export interface FlightHourEntry {
  date: string // "YYYY-MM-DD"
  hours: number
}

export interface RollingPoint {
  date: string
  value: number // total jam pada window yang berakhir di `date`
  isFuture: boolean // true kalau date > today (data aktual = 0)
}

const round1 = (n: number): number => Math.round(n * 10) / 10

/**
 * Ubah array flightHours jadi Map date->hours untuk lookup O(1).
 * (Kalau ada duplikat tanggal, dijumlahkan — defensif.)
 */
export function buildHoursMap(entries: FlightHourEntry[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const e of entries) {
    map.set(e.date, (map.get(e.date) ?? 0) + e.hours)
  }
  return map
}

/**
 * Total jam pada window [endDate - windowDays + 1 ... endDate].
 * Tanggal yang tidak ada di data di-treat 0 (bukan undefined/error) —
 * ini yang bikin garis tetap mulus & turun ke arah hari-hari future.
 */
export function rollingSumAt(
  map: Map<string, number>,
  endDate: string,
  windowDays: number,
): number {
  let sum = 0
  for (let i = 0; i < windowDays; i++) {
    sum += map.get(addDays(endDate, -i)) ?? 0
  }
  return round1(sum)
}

/**
 * Bangun deret titik chart, di-center pada `today`:
 *   (displayRangeDays sebelum) + today + (displayRangeDays sesudah).
 * Sesuai brief: today ±7 hari = 15 titik. windowDays hanya mengatur
 * panjang rolling-sum tiap titik, bukan jumlah titik yang ditampilkan.
 */
export function buildRollingSeries(
  entries: FlightHourEntry[],
  today: string,
  windowDays: number,
  displayRangeDays: number,
): RollingPoint[] {
  const map = buildHoursMap(entries)
  // displayRangeDays = radius, today selalu di tengah:
  //   (displayRangeDays sebelum) + today + (displayRangeDays sesudah)
  // Untuk displayRangeDays = 7 -> 15 titik (today-7 .. today+7).
  const total = displayRangeDays * 2 + 1
  const start = addDays(today, -displayRangeDays)

  const points: RollingPoint[] = []
  for (let i = 0; i < total; i++) {
    const date = addDays(start, i)
    points.push({
      date,
      value: rollingSumAt(map, date, windowDays),
      isFuture: date > today,
    })
  }
  return points
}