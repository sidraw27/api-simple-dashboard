export function afterMinutes(minutes: number) {
  return new Date(new Date().setMinutes(new Date().getMinutes() + minutes));
}

export function afterDays(days: number) {
  return new Date(new Date().setDate(new Date().getDate() + days));
}

export function getYmdFormatDate(date: Date = new Date()) {
  return new Date(date).toISOString().slice(0, 10).replace(/-/g, '');
}
