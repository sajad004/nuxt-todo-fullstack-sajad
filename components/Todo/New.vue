<script setup>
	import type { FormSubmitEvent } from '@nuxt/ui'
	import { z } from 'zod'

	const toast = useToast()

	const schema = z.object({
		newTodo: z.string().min(3, 'New todo is required'),
	})

	type Schema = z.infer<typeof schema>

	const state = reactive({
		newTodo: '',
	})

	const addNewTodo = async (event: FormSubmitEvent<Schema>) => {
		await useFetch('/api/todos', {
			method: 'POST',
			body: {
				text: state.newTodo,
			},
		})
		toast.add({ title: 'Success', description: 'New todo added', color: 'success' })
		state.newTodo = ''
	}
</script>
<template>
	<UForm
		class="flex flex-col gap-5 mt-5 items-center"
		@submit="addNewTodo"
		:state="state"
		:schema="schema"
	>
		<UInput
			type="text"
			v-model="newTodo"
			placeholder="New Task ..."
			@keyup.ctrl.delete="newTodo = ''"
			class="w-80"
		/>
		<p class="text-xs text-gray-500">
			You can clear the input using <UKbd value="control" /> + <UKbd value="backspace" /> or
			<UKbd value="delete" />
		</p>
		<UButton type="submit" variant="soft"> Add Todo </UButton>
	</UForm>
</template>
