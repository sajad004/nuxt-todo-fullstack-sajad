export default defineEventHandler(async (event) => {
  // Check the path
  const path = getRequestPath(event)
  if (path.includes('auth')) {
    return
  }

  // Check if user is authenticated
  const session = await getUserSession(event)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  // If user is authenticated, continue
  return

})
