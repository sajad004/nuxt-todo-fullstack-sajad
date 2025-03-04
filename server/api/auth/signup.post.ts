// /api/auth/signup.post.ts
import { useDrizzle, tables } from '~/server/utils/drizzle'
import { eq } from 'drizzle-orm'
import { z, ZodError } from 'zod'

export default defineEventHandler(async (event) => {
  // Read body
  const { email, password, firstName, lastName } = await readBody(event)

  // Create Zod schema
  const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    firstName: z.string().min(2, "First Name must be at least 2 characters long"),
    lastName: z.string().min(5, "Last Name must be at least 5 characters long"),
  })

  try {

    // Validate user data
    userSchema.parse({ email, password, firstName, lastName })

    // Check if user already exists
    const user = await useDrizzle().select().from(tables.users).where(eq(tables.users.email, email))
    if (user[0]) {
      return createError({
        statusCode: 400,
        statusMessage: 'User already exists',
      })
    }
    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const newUser = await useDrizzle().insert(tables.users).values({ email, password: hashedPassword, firstName, lastName }).returning()

    if (!newUser) {
      return createError({
        statusCode: 500,
        statusMessage: 'Failed to create user',
      })
    }

    // Set user session
    await setUserSession(event, {
      user: {
        email: email,
        firstName: firstName,
        lastName: lastName,
      },
      loggedInAt: new Date()
    })

  } catch (error) {
    if (error instanceof ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: error.errors[0].message,
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
