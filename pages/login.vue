<script setup lang="ts">
import { z } from 'zod'
const { fetch } = useUserSession()

const loading = ref(false)
const errorMessage = ref<string | undefined>(undefined)

useHead({
	title: 'Login',
})

const router = useRouter()

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
})

const loginData = ref({
	email: '',
	password: '',
})

const login = async () => {
	try {
		loading.value = true
		const parseResult = loginSchema.safeParse({
			email: loginData.value.email,
			password: loginData.value.password,
		})
		if (!parseResult.success) {
			loading.value = false
			errorMessage.value = parseResult.error.errors[0].message
			return
		}
		const response = await $fetch('/api/auth/login', {
			method: 'POST',
			body: {
				email: loginData.value.email,
				password: loginData.value.password,
			},
		})
		if (response?.statusCode === 400) {
			loading.value = false
			errorMessage.value = response.statusMessage
		} else {
			await fetch()
			await router.push('/')
			loading.value = false
		}
	} catch (error: unknown) {
		loading.value = false
		if (error instanceof Error) {
			errorMessage.value = 'Invalid email or password'
		} else {
			errorMessage.value = 'An unknown error occurred'
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
				:disabled="loading"
				class="border-2 border-gray-300 rounded-md p-2 disabled:cursor-not-allowed"
			/>
			<input
				type="password"
				v-model="loginData.password"
				placeholder="Password"
				:disabled="loading"
				class="border-2 border-gray-300 rounded-md p-2 disabled:cursor-not-allowed"
			/>
			<div class="flex items-center justify-center" v-if="errorMessage">
				<p class="text-red-500">{{ errorMessage }}</p>
			</div>
			<button
				type="submit"
				class="bg-green-500 text-white rounded-md p-2 disabled:cursor-not-allowed"
				:disabled="loading"
				:class="{ 'opacity-50': loading }"
			>
				{{ loading ? 'Logging in...' : 'Login' }}
			</button>
		</form>
		<p class="text-sm text-gray-500 mt-4">
			Don't have an account? <a href="/signup" class="text-blue-500">Signup</a>
		</p>
	</div>
</template>
