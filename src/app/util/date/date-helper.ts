export function afterMinutes(minutes: number) {
  return new Date(new Date().setMinutes(new Date().getMinutes() + minutes));
}

export function getYmdFormatDate(date: Date = new Date()) {
  return new Date(date).toISOString().slice(0, 10).replace(/-/g, '');
}
