// /api/auth/login.post.ts
import { z, ZodError } from 'zod'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // Read body
  const { email, password } = await readBody(event)

  // Create Zod schema
  const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  })

  try {
    // Validate user data
    userSchema.parse({ email, password })

    // Check if user exists
    const getUserFromDb = await useDrizzle().select().from(tables.users).where(eq(tables.users.email, email))
    const user = getUserFromDb[0]
    if (!user) {
      return createError({
        statusCode: 400,
        statusMessage: 'Invalid credentials',
      })
    }
    // Check if password is correct
    const isPasswordCorrect = await verifyPassword(user.password, password)
    if (!isPasswordCorrect) {
      return createError({
        statusCode: 400,
        statusMessage: 'Invalid credentials',
      })
    }

    // Set user session
    await setUserSession(event, {
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      loggedInAt: new Date()
    })

  } catch (error) {
    if (error instanceof ZodError) {
      return createError({
        statusCode: 400,
        statusMessage: error.errors[0].message,
      })
    }
    throw error
  }
})
