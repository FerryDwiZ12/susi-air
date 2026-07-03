/**
 * Pure date helpers. Semua dihitung di UTC midnight supaya tidak kena
 * pergeseran timezone (penting: dataset pakai ISO date "YYYY-MM-DD").
 * Tidak ada dependensi Nuxt/Vue -> gampang di-unit-test.
 */

/** "YYYY-MM-DD" -> Date (UTC midnight) */
export function parseISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** Date -> "YYYY-MM-DD" */
export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Geser tanggal ISO sebanyak n hari (boleh negatif). */
export function addDays(iso: string, n: number): string {
  const d = parseISODate(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return toISODate(d);
}

/** Selisih hari (a - b). Positif kalau a setelah b. */
export function diffDays(a: string, b: string): number {
  return Math.round((parseISODate(a).getTime() - parseISODate(b).getTime()) / 86_400_000);
}
