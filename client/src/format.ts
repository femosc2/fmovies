// Display a rating with one decimal place (e.g. "7" -> "7.0", "8.5" -> "8.5").
// Falls back to the raw value for non-numeric ratings (e.g. "N/A").
export function formatRating(rating: string | number): string {
  const n = Number(rating);
  return Number.isFinite(n) ? n.toFixed(1) : String(rating);
}
