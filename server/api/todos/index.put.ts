// TODO: Implement update todo for a user
import { db, tables, type Todo } from '~/server/utils/drizzle'
import { z, ZodError } from 'zod'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // Read body
  const { id, text, completed } = await readBody(event)
  const session = await getUserSession(event)

  // Get user id
  const userId = session.user.id

  // Create Zod schema
  const todoSchema = z.object({
    id: z.number().int().positive(),
    text: z.string().min(3, "Text must be at least 3 character long"),
    completed: z.boolean(),
    userId: z.number().int().positive(),
  })

  // Validate body
  try {
    todoSchema.parse({ id, text, completed, userId })
    
    // Find todo by id
    const todo: Todo | undefined = await db.query.todos.findFirst({
      where: eq(tables.todos.id, id),
    })

    if (!todo) {
      throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
    }

    // Check if user is owner of todo
    if (todo.userId !== userId) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    // Update todo
    const updatedTodo: Todo[] = await db.update(tables.todos).set({ text, completed }).where(eq(tables.todos.id, id)).returning()

    return updatedTodo[0]

  } catch (error) {
    if (error instanceof ZodError) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }
})
