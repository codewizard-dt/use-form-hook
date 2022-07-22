export function unsnakeCase(str: string): string {
  return str.replace(/_/g, ' ')
}