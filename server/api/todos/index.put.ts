// TODO: Implement update todo for a user
import { db, tables, type Todo } from '~/server/utils/drizzle'
import { z, ZodError } from 'zod'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // Read body
  const { id, text, description, completed } = await readBody(event)
  const session = await getUserSession(event)

  // Get user id
  const userId = session.user.id

  // Create Zod schema
  const todoSchema = z.object({
    id: z.number().int().positive(),
    text: z.string().min(3, "Text must be at least 3 character long"),
    description: z.string().min(3, "Description must be at least 3 character long").optional(),
    completed: z.boolean(),
    userId: z.number().int().positive(),
  })

  // Validate body
  try {
    todoSchema.parse({ id, text, description, completed, userId })
    
    // Find todo by id
    const todo: Todo | undefined = await db.query.todos.findFirst({
      where: eq(tables.todos.id, id),
    })

    if (!todo) {
      throw createError({ statusCode: 404, message: 'Todo not found' })
    }

    // Check if user is owner of todo
    if (todo.userId !== userId) {
      throw createError({ statusCode: 403, message: 'Forbidden' })
    }

    // Update todo
    const updatedTodo: Todo[] = await db.update(tables.todos).set({ text, description, completed }).where(eq(tables.todos.id, id)).returning()

    return updatedTodo[0]

  } catch (error) {
    if (error instanceof ZodError) {
      throw createError({ statusCode: 400, message: error.message })
    }
    throw createError({ statusCode: 400, message: 'Invalid body' })
  }
})
