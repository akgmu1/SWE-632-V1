import { IdArrayDataManager } from '@/data'
import z from 'zod'

const timeEntrySchema = z.object({
  id: z.number(),
  taskId: z.number(),
  minutes: z.number(),
  date: z.coerce.date(),
  note: z.string(),
})

export type TimeEntry = z.infer<typeof timeEntrySchema>
export type CreateTimeEntry = Omit<TimeEntry, 'id'>

export const timeEntryManager = new IdArrayDataManager(timeEntrySchema, 'time-entry')
