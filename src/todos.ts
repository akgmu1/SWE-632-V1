import { z } from 'zod'

const TimeEntrySchema = z.object({
  minutes: z.number(),
  date: z.string(), // YYYY-MM-DD
  note: z.string().optional(),
})
const SubtaskSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
})
const TodoSchema = z.object({
  id: z.number(),
  description: z.string(),
  completed: z.boolean(),
  dueDate: z.string().optional(),
  category: z.string().optional(),
  categoryColor: z.string().optional(), // e.g. '#38bdf8'
  timeEntries: z.array(TimeEntrySchema).optional(),
  subtasks: z.array(SubtaskSchema).optional(),
})
export type Subtask = z.infer<typeof SubtaskSchema>
export type Todo = z.infer<typeof TodoSchema>
const TodoArraySchema = z.array(TodoSchema)

export type CreateTodo = z.infer<typeof CreateTodoSchema>

const CreateTodoSchema = TodoSchema.omit({ id: true })
const TodoSettingsSchema = z.object({
  currentId: z.number().default(0),
})

type TodoSettings = z.infer<typeof TodoSettingsSchema>

const TODO_SETTINGS_KEY = 'todo-settings'
const TODOS_KEY = 'todos'
const TODOS_RECENTLY_DELETED_KEY = 'todos-recently-deleted'

// PERF: Some sort of cache to not have to constantly read from storage

export class TodoManager {
  public static reset() {
    localStorage.removeItem(TODO_SETTINGS_KEY)
    localStorage.removeItem(TODOS_KEY)
    localStorage.removeItem(TODOS_RECENTLY_DELETED_KEY)
  }

  public static clearRecentlyDeletedTodos() {
    localStorage.removeItem(TODOS_RECENTLY_DELETED_KEY)
  }

  private static settings(): TodoSettings {
    return TodoSettingsSchema.parse(JSON.parse(localStorage.getItem(TODO_SETTINGS_KEY) ?? '{}'))
  }

  private static updateSettings(settings: TodoSettings) {
    localStorage.setItem(TODO_SETTINGS_KEY, JSON.stringify(settings))
  }

  public static createTodo(todo: CreateTodo): number {
    let settings = this.settings()
    const id = settings.currentId
    settings.currentId += 1
    this.updateSettings(settings)

    let todos = this.getTodos()
    todos.push({
      id,
      ...todo,
    })
    this.writeTodos(todos)

    return id
  }

  private static writeTodos(todos: Todo[]) {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos))
  }

  public static todoExists(id: number): boolean {
    return (
      this.getTodos().find((element) => {
        return element.id === id
      }) !== undefined
    )
  }

  public static getTodo(id: number): Todo | undefined {
    return this.getTodos().find((element) => {
      return element.id === id
    })
  }

  public static getRecentlyDeletedTodo(id: number): Todo | undefined {
    return this.getRecentlyDeletedTodos().find((element) => {
      return element.id === id
    })
  }

  public static getTodos(): Todo[] {
    let storage = localStorage.getItem(TODOS_KEY)
    if (storage == null) {
      // Empty, so can populate with default
      localStorage.setItem(TODOS_KEY, '[]')
      return []
    }

    try {
      return TodoArraySchema.parse(JSON.parse(storage))
    } catch (e) {
      // TODO: An error occurred, so some sort of recovery is needed
      return []
    }
  }

  public static updateTodo(todo: Todo) {
    this.writeTodos(
      this.getTodos().map((e) => {
        if (e.id == todo.id) {
          return todo
        } else {
          return e
        }
      }),
    )
  }

  public static removeTodo(id: number) {
    const todo = this.getTodo(id)
    if (todo !== undefined) {
      this.writeTodos(this.getTodos().filter((e) => e.id !== id))
      this.writeRecentlyDeletedTodos([todo, ...this.getRecentlyDeletedTodos()])
    }
  }

  public static revertRecentlyDeletedTodo(id: number) {
    const todo = this.getRecentlyDeletedTodos().find((element) => {
      return element.id === id
    })

    if (todo !== undefined) {
      this.writeRecentlyDeletedTodos(this.getRecentlyDeletedTodos().filter((e) => e.id !== id))
      this.writeTodos([todo, ...this.getTodos()])
    }
  }

  public static getRecentlyDeletedTodos(): Todo[] {
    let storage = localStorage.getItem(TODOS_RECENTLY_DELETED_KEY)
    if (storage == null) {
      // Empty, so can populate with default
      localStorage.setItem(TODOS_RECENTLY_DELETED_KEY, '[]')
      return []
    }

    try {
      return TodoArraySchema.parse(JSON.parse(storage))
    } catch (e) {
      // TODO: An error occurred, so some sort of recovery is needed
      return []
    }
  }

  private static writeRecentlyDeletedTodos(todos: Todo[]) {
    localStorage.setItem(TODOS_RECENTLY_DELETED_KEY, JSON.stringify(todos))
  }
}
