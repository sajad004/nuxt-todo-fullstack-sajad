import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from '../database/schema'

export const tables = schema

export function useDrizzle() {
  return drizzle(process.env.DATABASE_URL as string, { schema })
}

export type User = typeof tables.users.$inferSelect
export type NewUser = typeof tables.users.$inferInsert
