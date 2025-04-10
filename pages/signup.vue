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
			<UForm :schema="schema" :state="state" class="space-y-4" @submit.prevent="signup">
				<UFormField name="firstName">
					<UInput
						v-model="signupData.firstName"
						placeholder="First Name"
						class="w-full"
						size="xl"
					/>
				</UFormField>

				<UFormField name="lastName">
					<UInput
						v-model="signupData.lastName"
						placeholder="Last Name"
						class="w-full"
						size="xl"
					/>
				</UFormField>

				<UFormField name="email">
					<UInput
						v-model="signupData.email"
						type="email"
						placeholder="Email"
						class="w-full"
						size="xl"
					/>
				</UFormField>

				<UFormField name="password">
					<UInput
						v-model="signupData.password"
						type="password"
						placeholder="Password"
						class="w-full"
						size="xl"
					/>
				</UFormField>

				<UFormField name="confirmPassword">
					<UInput
						v-model="signupData.confirmPassword"
						type="password"
						placeholder="Confirm Password"
						class="w-full"
						size="xl"
					/>
				</UFormField>
				<UButton type="submit" :loading="loading" size="xl" class="w-full py-3 justify-center">Signup</UButton>
			</UForm>
			<template #footer>
				<p>
					<span class="text-gray-500 font-normal">Already have an account?</span>
					<UButton to="/login" variant="link">Login</UButton>
				</p>
			</template>
		</UCard>
	</div>
</template>
