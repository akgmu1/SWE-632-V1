export function dateToYYYYMMDD(date: Date) {
  // Helper method to format date to 'YYYY-MM-DD'
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0]
}
