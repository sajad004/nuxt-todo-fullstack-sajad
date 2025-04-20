// TODO: Implement get todos for a user
import { db, tables, type Todo } from '~/server/utils/drizzle'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // Check if user is authenticated
  const session = await getUserSession(event)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Get user id
  const userId = session.user.id

  console.log(userId)

  // Get todos
  const todos: Todo[] = await db.query.todos.findMany({
    where: eq(tables.todos.userId, userId),
  })

  return todos
})
