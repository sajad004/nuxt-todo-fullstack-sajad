<script setup lang="ts">
import { z } from 'zod'
const { fetch } = useUserSession()

const router = useRouter()

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

const loginData = ref({
	email: '',
	password: '',
})

const login = async () => {
	try {
		loginSchema.parse({
			email: loginData.value.email,
			password: loginData.value.password,
		})
		const response = await $fetch('/api/auth/login', {
			method: 'POST',
			body: {
				email: loginData.value.email,
				password: loginData.value.password,
			},
		})
		if (response?.statusCode === 400) {
			alert(response.statusMessage)
		} else {
			fetch()
			router.push('/')
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			alert(error.message)
		} else {
			alert('An unknown error occurred')
		}
	}
}
</script>
<template>
	<div class="flex flex-col items-center justify-center h-[calc(100vh-72px)] w-full">
		<h1 class="text-2xl font-bold mb-4">Login</h1>
		<form class="flex flex-col gap-4 w-full max-w-md" @submit.prevent="login">
			<input
				type="email"
				v-model="loginData.email"
				placeholder="Email"
				class="border-2 border-gray-300 rounded-md p-2"
			/>
			<input
				type="password"
				v-model="loginData.password"
				placeholder="Password"
				class="border-2 border-gray-300 rounded-md p-2"
			/>
			<button type="submit" class="bg-green-500 text-white rounded-md p-2">Login</button>
		</form>
		<p class="text-sm text-gray-500 mt-4">
			Don't have an account? <a href="/signup" class="text-blue-500">Signup</a>
		</p>
	</div>
</template>
