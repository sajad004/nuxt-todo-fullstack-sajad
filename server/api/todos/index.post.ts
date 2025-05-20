// TODO: Implement create todo for a user
import { db, tables, type NewTodo, type Todo } from '~/server/utils/drizzle'
import { z, ZodError } from 'zod'

export default defineEventHandler(async (event) => {
  // Read body
  const { text, description } = await readBody(event)
  const session = await getUserSession(event)

  // Get user id
  const userId = session.user.id

  // Create Zod schema
  const todoSchema = z.object({
    text: z.string().min(3, "Text must be at least 3 character long"),
    description: z.string().min(3, "Description must be at least 3 character long").optional(),
    userId: z.number().int().positive(),
  })

  // Validate body
  try {
    todoSchema.parse({ text, description, userId })
    // Create todo
    const newTodo: NewTodo = { text, description, userId }
    // Insert todo
    const todo: Todo[] = await db.insert(tables.todos).values(newTodo).returning()

    return todo[0]
    
  } catch (error) {
    if (error instanceof ZodError) {
      throw createError({ statusCode: 400, message: error.message })
    }
    throw createError({ statusCode: 400, message: 'Invalid body' })
  }
})
