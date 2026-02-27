import { ArrayDataManager, IdArrayDataManager } from '@/data'
import z from 'zod'

const taskSchema = z.object({
  id: z.number(),
  description: z.string(),
  completed: z.boolean(),
  category: z.number(),
  dueDate: z.coerce.date(),
})

export type Task = z.infer<typeof taskSchema>
export type CreateTask = Omit<Task, 'id'>

export const taskManager = new IdArrayDataManager(taskSchema, 'task')
export const deletedTaskManager = new ArrayDataManager(taskSchema, 'task-deleted')
