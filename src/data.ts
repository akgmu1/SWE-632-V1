import { z, ZodObject } from 'zod'

// const TimeEntrySchema = z.object({
//   minutes: z.number(),
//   date: z.string(), // YYYY-MM-DD
//   note: z.string().optional(),
// })

// const SubtaskSchema = z.object({
//   id: z.string(),
//   text: z.string(),
//   completed: z.boolean(),
// })

// const TodoSchema = z.object({
//   id: z.number(),
//   description: z.string(),
//   completed: z.boolean(),
//   dueDate: z.string().optional(),
//   category: z.string().optional(),
//   categoryColor: z.string().optional(), // e.g. '#38bdf8'
//   timeEntries: z.array(TimeEntrySchema).optional(),
//   subtasks: z.array(SubtaskSchema).optional(),
// })
// export type Subtask = z.infer<typeof SubtaskSchema>
// export type Todo = z.infer<typeof TodoSchema>
// const TodoArraySchema = z.array(TodoSchema)

// export type CreateTodo = z.infer<typeof CreateTodoSchema>

// const CreateTodoSchema = TodoSchema.omit({ id: true })
// const TodoSettingsSchema = z.object({
//   currentId: z.number().default(0),
// })

// type TodoSettings = z.infer<typeof TodoSettingsSchema>

// const TODO_SETTINGS_KEY = 'todo-settings'
// const TODOS_KEY = 'todos'
// const TODOS_RECENTLY_DELETED_KEY = 'todos-recently-deleted'

// TODO: Caching reads

export class DataManager<TSchema extends z.ZodTypeAny> {
  protected schema: TSchema
  protected key: string

  constructor(schema: TSchema, key: string) {
    this.schema = schema
    this.key = key
  }

  public reset() {
    localStorage.removeItem(this.key)
  }

  public load(): z.infer<TSchema> | undefined {
    try {
      const data = JSON.parse(localStorage.getItem(this.key) ?? '{}')
      return this.schema.parse(data)
    } catch {
      return undefined
    }
  }

  public save(input: z.infer<TSchema>) {
    localStorage.setItem(this.key, JSON.stringify(input))
  }
}

export class ArrayDataManager<TObjectSchema extends ZodObject<any>> extends DataManager<
  z.ZodArray<TObjectSchema>
> {
  constructor(elementSchema: TObjectSchema, key: string) {
    super(z.array(elementSchema), key)
  }

  public override load(): z.infer<TObjectSchema>[] {
    const raw = localStorage.getItem(this.key)
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      const data = this.schema.parse(parsed)
      return Array.isArray(data) ? data : []
    } catch {
      this.save([])
      return []
    }
  }

  public all(): z.infer<TObjectSchema>[] {
    return this.load()
  }

  public add(item: z.infer<TObjectSchema>) {
    const data = this.all()
    data.push(item)
    this.save(data)
  }

  public findBy<K extends keyof z.infer<TObjectSchema>>(
    field: K,
    value: z.infer<TObjectSchema>[K],
  ): z.infer<TObjectSchema> | undefined {
    return this.all().find((item) => item[field] === value)
  }

  public filterBy<K extends keyof z.infer<TObjectSchema>>(
    field: K,
    value: z.infer<TObjectSchema>[K],
  ): z.infer<TObjectSchema>[] {
    return this.all().filter((item) => item[field] === value)
  }

  public updateBy<K extends keyof z.infer<TObjectSchema>>(
    field: K,
    value: z.infer<TObjectSchema>[K],
    updater:
      | Partial<z.infer<TObjectSchema>>
      | ((old: z.infer<TObjectSchema>) => z.infer<TObjectSchema>),
  ) {
    const updated = this.all().map((item) => {
      if (item[field] === value) {
        if (typeof updater === 'function') {
          return (updater as (old: z.infer<TObjectSchema>) => z.infer<TObjectSchema>)(item)
        } else {
          return { ...item, ...updater }
        }
      }
      return item
    })
    this.save(updated)
  }

  public removeBy<K extends keyof z.infer<TObjectSchema>>(
    field: K,
    value: z.infer<TObjectSchema>[K],
  ) {
    const filtered = this.all().filter((item) => item[field] !== value)
    this.save(filtered)
  }
}

export class IdArrayDataManager<
  TObjectSchema extends ZodObject<any>,
> extends ArrayDataManager<TObjectSchema> {
  private counterKey: string

  constructor(elementSchema: TObjectSchema, key: string) {
    super(elementSchema, key)
    this.counterKey = `${key}-id-counter`
  }

  private nextId(): number {
    const current = this.currentId()
    localStorage.setItem(this.counterKey, String(current + 1))
    return current
  }

  private currentId() {
    return Number(localStorage.getItem(this.counterKey) ?? '0')
  }

  public add(item: Omit<z.infer<TObjectSchema>, 'id'>): number {
    const id = this.nextId()
    const newItem = { ...(item as any), id } as z.infer<TObjectSchema>
    super.add(newItem)
    return id
  }

  public insert(item: z.infer<TObjectSchema>) {
    const list = this.all()
    if (
      typeof item.id === 'number' &&
      item.id < this.currentId() &&
      !list.some((x) => item.id === x.id)
    ) {
      list.push(item)
      this.save(list)
    }
  }

  public override reset(includeCounter = false) {
    super.reset()
    if (includeCounter) localStorage.removeItem(this.counterKey)
  }
}
