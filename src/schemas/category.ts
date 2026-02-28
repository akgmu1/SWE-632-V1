import { IdArrayDataManager } from '@/data'
import z from 'zod'
import { colorHexSchema } from './color'
import { taskManager } from './task'

const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  color: colorHexSchema,
})

export type Category = z.infer<typeof categorySchema>

export const categoryManager = new IdArrayDataManager(categorySchema, 'category')

export const PERM_CATEGORIES: number[] = []

function ensure(name: string, category: Omit<Omit<Category, 'id'>, 'name'>): number {
  const x = categoryManager.findBy('name', name)
  let id = x?.id ?? 0
  if (x === undefined) {
    id = categoryManager.add({
      ...category,
      name,
    })
  }

  PERM_CATEGORIES.push(id)

  return id
}

export const DEFAULT_CATEGORY = ensure('default', {
  color: '#112233',
})

export const META_ADD_NEW_CATEGORY = ensure('__add_new', {
  color: '#000000',
})

categoryManager.installHooks({
  onDelete: (categories) => {
    for (const category of categories) {
      taskManager.updateBy('category', category.id, {
        category: DEFAULT_CATEGORY,
      })
    }
  },
})
