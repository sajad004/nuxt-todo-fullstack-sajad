// TODO: Implement create todo for a user
import { db, tables, type NewTodo, type Todo } from '~/server/utils/drizzle'
import { z, ZodError } from 'zod'

export default defineEventHandler(async (event) => {
  // Read body
  const { text } = await readBody(event)
  const session = await getUserSession(event)

  // Check if user is authenticated
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Get user id
  const userId = session.user.id

  // Create Zod schema
  const todoSchema = z.object({
    text: z.string().min(3, "Text must be at least 3 character long"),
    userId: z.number().int().positive(),
  })

  // Validate body
  try {
    todoSchema.parse({ text, userId })
    // Create todo
    const newTodo: NewTodo = { text, userId }
    // Insert todo
    const todo: Todo[] = await db.insert(tables.todos).values(newTodo).returning()

    return todo[0]
    
  } catch (error) {
    if (error instanceof ZodError) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }
})
