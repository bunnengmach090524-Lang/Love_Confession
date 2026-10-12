/** Whole calendar days from `dateStr` (YYYY-MM-DD) to today, in local time. Negative if the date is in the future. */
export function daysSince(dateStr, now = new Date()) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const start = new Date(year, month - 1, day)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((today - start) / 86400000) // round absorbs daylight-saving shifts
}
