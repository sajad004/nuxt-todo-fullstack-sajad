<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

	const toast = useToast()

	const schema = z.object({
		newTodo: z.string().min(3, 'New todo is required'),
	})

	type Schema = z.output<typeof schema>

	const state = reactive<Partial<Schema>>({
		newTodo: undefined,
	})

	const emit = defineEmits(['refresh'])

	const addNewTodo = async (event: FormSubmitEvent<Schema>) => {
		await $fetch('/api/todos', {
			method: 'POST',
			body: {
				text: event.data.newTodo,
			},
		})
		toast.add({ title: 'Success', description: 'New todo added', color: 'success' })
		clearInput()
		emit('refresh')
	}

	const clearInput = () => {
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
			v-model="state.newTodo"
			placeholder="New Task ..."
			@keyup.ctrl.delete="clearInput"
			class="w-80"
		/>
		<p class="text-xs text-gray-500">
			You can clear the input using <UKbd value="control" /> + <UKbd value="backspace" /> or
			<UKbd value="delete" />
		</p>
		<UButton type="submit" variant="soft"> Add Todo </UButton>
	</UForm>
</template>
