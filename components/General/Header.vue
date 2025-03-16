<script setup>
const { loggedIn, clear } = useUserSession()

const router = useRouter()

const logout = async () => {
	await clear()
	await router.push('/login')
}
</script>
<template>
	<header class="fixed top-0 left-0 right-0">
		<div class="max-w-4xl mx-auto w-full flex justify-between items-center py-5">
			<NuxtLink to="/">
				<h1 class="text-2xl font-bold">Nuxt <span class="text-green-500">Todo</span></h1>
			</NuxtLink>
			<nav class="flex items-center gap-4" v-if="!loggedIn">
				<NuxtLink to="/login" class="text-gray-500 hover:text-green-500">Login</NuxtLink>
				<NuxtLink to="/signup" class="text-gray-500 hover:text-green-500">Signup</NuxtLink>
			</nav>
			<nav class="flex items-center gap-2" v-else>
				<NuxtLink to="/">Home</NuxtLink>
				<button @click="logout">Logout</button>
			</nav>
		</div>
	</header>
</template>

<style scoped>
.router-link-active {
	@apply text-green-500;
}
</style>
