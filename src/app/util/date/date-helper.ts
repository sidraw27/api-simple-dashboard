export function afterMinutes(minutes: number) {
  return new Date(new Date().setMinutes(new Date().getMinutes() + minutes));
}
