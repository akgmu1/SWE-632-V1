import z from 'zod'

export const colorHexSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
  message: 'Invalid color format. Must be a hex code like #112233.',
})
