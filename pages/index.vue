<script lang="ts" setup>
const { loggedIn, user, session, clear } = useUserSession()
const router = useRouter()

onBeforeMount(() => {
	if (!loggedIn) {
		router.push('/login')
	}
})
</script>

<template>
	<div v-if="loggedIn">
		<h1>Hello {{ user?.firstName }} {{ user?.lastName }}</h1>
		<pre>
			{{ session }}
		</pre
		>
	</div>
	<div v-else>
		<h1>Please login to continue</h1>
		<NuxtLink to="/login">Login</NuxtLink>
	</div>
</template>
