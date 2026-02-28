export function dateToYYYYMMDD(date: Date): string | undefined {
  // Helper method to format date to 'YYYY-MM-DD'
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0]
}

export function dateTrim(rawDate: Date): Date {
  const date = new Date(rawDate.getTime() + rawDate.getTimezoneOffset() * 60000)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function randomColor(): string {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`
}
