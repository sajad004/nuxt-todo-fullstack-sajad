<script setup>
const { loggedIn, clear, session } = useUserSession()

const router = useRouter()

const logout = async () => {
	await clear()
	await router.push('/login')
}

const items = [
	{
		label: 'Login',
		to: '/login',
	},
	{
		label: 'Signup',
		to: '/signup',
	},
]
</script>
<template>
	<header class="fixed top-0 left-0 right-0 z-50 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm shadow-sm">
		<div class="max-w-4xl mx-auto w-full flex justify-between items-center py-5">
			<ULink to="/">
				<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
					Nuxt <span class="text-(--ui-primary)">Todo</span>
				</h1>
			</ULink>
			<div v-if="loggedIn" class="text-center">
				<p class="text-lg">
					Hello
					<span class="font-bold">{{ session?.user?.firstName + ' ' + session?.user?.lastName }}</span>
				</p>
			</div>
			<nav class="flex items-center gap-4" v-if="!loggedIn">
				<UNavigationMenu :items="items" />
				<GeneralColorModeButton />
			</nav>
			<nav class="flex items-center gap-2" v-else>
				<UButton
					@click="logout"
					variant="soft"
					color="error"
					icon="i-heroicons-arrow-right-on-rectangle"
				></UButton>
				<GeneralColorModeButton />
			</nav>
		</div>
	</header>
</template>

<style scoped>
.router-link-active {
	@apply text-(--ui-primary);
}
</style>
