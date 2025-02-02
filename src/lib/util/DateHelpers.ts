import { format } from "date-fns"

export const formatDateCustom = (input: string | Date | null, formatString: string, fallback: string = "---"): string => {
  if (!input) return fallback
  const date = typeof input === "string" ? new Date(input) : input
  if (date.toString() === "Invalid Date") return fallback
  try {
    return format(date, formatString)
  } catch (e) {
    console.log("formatDateCustom error", input, date, { formatString, fallback })
    return fallback
  }
}
