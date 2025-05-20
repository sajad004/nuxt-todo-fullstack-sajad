// TODO: Implement get todos for a user
import { db, tables, type Todo } from '~/server/utils/drizzle'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  // Get user id
  const userId = session.user.id

  if (userId) {
    // Get todos
    try {
      const todos: Todo[] = await db.query.todos.findMany({
        where: eq(tables.todos.userId, userId),
      })
      return todos
    } catch (error) {
      throw createError({ statusCode: 500, message: 'Internal server error' })
    }
  }

  throw createError({
    statusCode: 401,
    message: 'User not found'
  })

})
