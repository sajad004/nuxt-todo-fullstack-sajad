import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from '../database/schema'

export const tables = schema

function useDrizzle() {
  return drizzle(process.env.DATABASE_URL as string, { schema })
}

export const db = useDrizzle()

export type User = typeof tables.users.$inferSelect
export type NewUser = typeof tables.users.$inferInsert

export type Todo = typeof tables.todos.$inferSelect
export type NewTodo = typeof tables.todos.$inferInsert
