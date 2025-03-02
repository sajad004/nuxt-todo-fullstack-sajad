<template>
	<header class="fixed top-0 left-0 right-0">
		<div class="max-w-4xl mx-auto w-full flex justify-between items-center py-5">
			<h1 class="text-2xl font-bold">Nuxt <span class="text-green-500">Todo</span></h1>
			<nav class="flex items-center gap-2">
				<NuxtLink to="/login">Login</NuxtLink>
				<NuxtLink to="/signup">Signup</NuxtLink>
			</nav>
		</div>
	</header>
</template>
