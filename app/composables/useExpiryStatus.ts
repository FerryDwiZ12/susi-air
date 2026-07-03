import { diffDays } from './useDates'

export type ExpiryStatus = 'expired' | 'soon' | 'safe'

export interface ExpiryResult {
  daysRemaining: number
  status: ExpiryStatus
  color: string
}

/** Warna default per status (samakan dengan Tailwind theme kalau perlu). */
export const EXPIRY_COLORS: Record<ExpiryStatus, string> = {
  expired: '#EF4444', // red
  soon: '#F59E0B', // amber
  safe: '#10B981', // green
}

export function getExpiryStatus(
  expiryDate: string,
  today: string,
  warningDays = 30,
): ExpiryResult {
  const daysRemaining = diffDays(expiryDate, today)

  let status: ExpiryStatus
  if (daysRemaining <= 0) status = 'expired'
  else if (daysRemaining <= warningDays) status = 'soon'
  else status = 'safe'

  return { daysRemaining, status, color: EXPIRY_COLORS[status] }
}