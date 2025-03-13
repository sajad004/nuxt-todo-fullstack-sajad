export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = useUserSession()
  // if (to.path === '/login' || to.path === '/signup') {
  //   if (loggedIn.value) {
  //     return navigateTo('/')
  //   }
  // } 
  // if (!loggedIn.value) {
  //   return navigateTo('/login')
  // }

  switch (to.path) {
    case '/login':
      if (loggedIn.value) {
        return navigateTo('/')
      }
      break
    case '/signup':
      if (loggedIn.value) {
        return navigateTo('/')
      }
      break
    default:
      if (!loggedIn.value) {
        return navigateTo('/login')
      }
  }
})
