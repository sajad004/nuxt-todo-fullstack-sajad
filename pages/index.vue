<script lang="ts" setup>
const { loggedIn, session } = useUserSession()

useHead({
	title: 'Home',
})
</script>

<template>
	<div v-if="loggedIn">
		<h1>
			Hello
			<span class="font-bold">{{ session?.user?.firstName + ' ' + session?.user?.lastName }}</span>
		</h1>
		<br />
		<pre class="text-sm font-mono whitespace-pre-wrap bg-gray-100 p-4 rounded-md">
			{{ JSON.stringify(session, null, 2) }}
		</pre
		>
	</div>
	<div v-else>
		<h1 class="text-2xl font-bold">Please login to continue</h1>
		<NuxtLink to="/login" class="text-blue-500">Login</NuxtLink>
	</div>
</template>
