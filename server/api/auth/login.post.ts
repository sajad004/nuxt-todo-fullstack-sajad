// /api/auth/login.post.ts
import { z, ZodError } from 'zod'

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

    // Check if password is correct

    // Set user session

  } catch (error) {
    if (error instanceof ZodError) {
      return createError({
        statusCode: 400,
        statusMessage: error.message,
      })
    }
    throw error
  }
})
