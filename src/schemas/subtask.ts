import { IdArrayDataManager } from '@/data'
import z from 'zod'

const subtaskSchema = z.object({
  id: z.number(),
  taskId: z.number(),
  text: z.string(),
  completed: z.boolean(),
})

export type Subtask = z.infer<typeof subtaskSchema>

export const subtaskManager = new IdArrayDataManager(subtaskSchema, 'subtask')
