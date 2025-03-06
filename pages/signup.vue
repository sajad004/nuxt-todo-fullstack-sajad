<script setup lang="ts">
import { z } from 'zod'

const { loggedIn, fetch } = useUserSession()

const router = useRouter()

const signupSchema = z.object({
	firstName: z.string().min(2),
	lastName: z.string().min(5),
	email: z.string().email(),
	password: z.string().min(8),
	confirmPassword: z.string().min(8),
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
		signupSchema.parse({
			firstName: signupData.value.firstName,
			lastName: signupData.value.lastName,
			email: signupData.value.email,
			password: signupData.value.password,
			confirmPassword: signupData.value.confirmPassword,
		})
		const response = await $fetch('/api/auth/signup', {
			method: 'POST',
			body: {
				firstName: signupData.value.firstName,
				lastName: signupData.value.lastName,
				email: signupData.value.email,
				password: signupData.value.password,
			},
		})
		if (response.statusCode === 400) {
			alert(response.statusMessage)
		} else {
			fetch()
			router.push('/')
		}
	} catch (error) {
		alert(error.message)
	}
}

onBeforeMount(() => {
	if (loggedIn.value) {
		router.push('/')
	}
})
</script>
<template>
	<div class="flex flex-col items-center justify-center h-[calc(100vh-72px)]">
		<h1 class="text-2xl font-bold mb-4">Signup</h1>
		<form class="flex flex-col gap-4" @submit.prevent="signup">
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
	</div>
</template>
