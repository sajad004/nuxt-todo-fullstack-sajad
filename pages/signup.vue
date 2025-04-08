<script setup lang="ts">
import { z } from 'zod'
const { fetch } = useUserSession()

const loading = ref(false)
const errorMessage = ref<string | undefined>(undefined)

useHead({
	title: 'Signup',
})

const router = useRouter()

const signupSchema = z.object({
	firstName: z.string().min(2, 'First name must be at least 2 characters long'),
	lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
	confirmPassword: z.string().min(8, 'Passwords should match'),
})

const signupData = ref({
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	confirmPassword: '',
})

const signup = async () => {
	try {
		loading.value = true
		const parseResult = signupSchema.safeParse({
			firstName: signupData.value.firstName,
			lastName: signupData.value.lastName,
			email: signupData.value.email,
			password: signupData.value.password,
			confirmPassword: signupData.value.confirmPassword,
		})
		if (!parseResult.success) {
			loading.value = false
			errorMessage.value = parseResult.error.errors[0].message
			return
		}
		const response = await $fetch('/api/auth/signup', {
			method: 'POST',
			body: {
				firstName: signupData.value.firstName,
				lastName: signupData.value.lastName,
				email: signupData.value.email,
				password: signupData.value.password,
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
		if (error instanceof Error) {
			errorMessage.value = error.message
		} else {
			errorMessage.value = 'An unknown error occurred'
		}
	}
}
</script>
<template>
	<div class="flex flex-col items-center justify-center h-[calc(100vh-88px)] w-full">
		<UCard class="w-full max-w-md p-6">
			<template #header>
				<h1 class="text-2xl font-bold">Signup</h1>
			</template>
			<form class="flex flex-col gap-4 w-full max-w-md" @submit.prevent="signup">
				<input
				type="text"
				v-model="signupData.firstName"
				placeholder="First Name"
				class="border-2 border-gray-300 rounded-md p-2"
			/>
			<input
				type="text"
				v-model="signupData.lastName"
				placeholder="Last Name"
				class="border-2 border-gray-300 rounded-md p-2"
			/>
			<input
				type="email"
				v-model="signupData.email"
				placeholder="Email"
				class="border-2 border-gray-300 rounded-md p-2"
			/>
			<input
				type="password"
				v-model="signupData.password"
				placeholder="Password"
				class="border-2 border-gray-300 rounded-md p-2"
			/>
			<input
				type="password"
				v-model="signupData.confirmPassword"
				placeholder="Confirm Password"
				class="border-2 border-gray-300 rounded-md p-2"
			/>
				<button type="submit" class="bg-green-500 text-white rounded-md p-2">Signup</button>
			</form>
		</UCard>
	</div>
</template>
