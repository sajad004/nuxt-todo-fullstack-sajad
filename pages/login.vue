<script setup lang="ts">
import * as z from 'zod'
const { fetch } = useUserSession()
const router = useRouter()
const toast = useToast()
const loading = ref(false)

useHead({
	title: 'Login',
})

const schema = z.object({
	email: z.string().email('Invalid email'),
	password: z.string().min(8, 'Must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
	email: undefined,
	password: undefined,
})

const onSubmit = async () => {
	try {
		loading.value = true
		const response = await $fetch('/api/auth/login', {
			method: 'POST',
			body: {
				email: state.email,
				password: state.password,
			},
		})
		if (response?.statusCode === 400) {
			loading.value = false
			toast.add({ title: 'Error', description: 'Invalid email or password', color: 'error' })
		} else {
			await fetch()
			await router.push('/')
			toast.add({ title: 'Success', description: 'You have been logged in.', color: 'success' })
			loading.value = false
		}
	} catch (error: unknown) {
		loading.value = false
		if (error instanceof Error) {
			toast.add({ title: 'Error', description: 'Invalid email or password', color: 'error' })
		} else {
			toast.add({ title: 'Error', description: 'An unknown error occurred', color: 'error' })
		}
	}
}
</script>
<template>
	<div class="flex flex-col items-center justify-center h-[calc(100vh-88px)] w-full">
		<UCard class="w-full max-w-md p-6">
			<template #header>
				<h1 class="text-2xl font-bold">Login</h1>
			</template>
			<UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
				<UFormField name="email">
					<UInput v-model="state.email" placeholder="Email" :disabled="loading" class="w-full" size="xl" />
				</UFormField>

				<UFormField name="password">
					<UInput
						v-model="state.password"
						type="password"
						placeholder="Password"
						:disabled="loading"
						class="w-full"
						size="xl"
					/>
				</UFormField>

				<div class="flex flex-col items-center mt-5">
					<UButton type="submit" :loading="loading" size="xl" class="w-full py-3 justify-center"> Submit </UButton>
					<NuxtLink to="/signup" class="mt-4 text-sm text-center">
						<span class="text-gray-500 font-normal">Don't have any account?</span>
						<span class="text-blue-600 font-semibold hover:underline cursor-pointer"> SignUp</span>
					</NuxtLink>
				</div>
			</UForm>
		</UCard>
	</div>
</template>
