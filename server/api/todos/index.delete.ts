import { z, ZodError } from 'zod'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  // Get user id
  const userId = session.user.id

  // Read body
  const { id } = await readBody(event)

  // Create Zod schema
  const todoSchema = z.object({
    id: z.number().int().positive()
  })

  // Validate body
  try {
    todoSchema.parse({ id, userId })

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
    await db.delete(tables.todos).where(eq(tables.todos.id, id))

    return { statusCode: 200, statusMessage: 'Todo deleted' }

  } catch (error) {
    if (error instanceof ZodError) {
      throw createError({ statusCode: 400, statusMessage: error.message })
    }
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }
  
})
