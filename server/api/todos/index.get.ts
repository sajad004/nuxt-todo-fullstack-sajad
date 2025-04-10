// TODO: Implement get todos for a user
import { useDrizzle, tables } from '~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
  const todos = await useDrizzle().select().from(tables.todos)

  return todos
})
