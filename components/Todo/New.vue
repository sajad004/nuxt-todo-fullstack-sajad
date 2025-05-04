<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

	const toast = useToast()

	const schema = z.object({
		newTodo: z.string().min(3, 'New todo is required'),
		description: z.string().optional(),
	})

	type Schema = z.output<typeof schema>

	const state = reactive<Partial<Schema>>({
		newTodo: undefined,
		description: undefined,
	})

	const emit = defineEmits(['refresh'])

	const addNewTodo = async (event: FormSubmitEvent<Schema>) => {
		await $fetch('/api/todos', {
			method: 'POST',
			body: {
				text: event.data.newTodo,
				description: event.data.description,
			},
		})
		toast.add({ title: 'Success', description: 'New todo added', color: 'success' })
		clearInput()
		emit('refresh')
	}

	const clearInput = () => {
		state.newTodo = ''
		state.description = ''
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
			class="w-80 w-full"
		/>
		<UTextarea
			v-model="state.description"
			placeholder="Task Description (optional)"
			class="w-80 w-full"
		/>
		<UButton type="submit" icon="i-lucide-plus" size="lg" variant="solid" class="w-full sm:w-auto self-start"> Add Todo </UButton>
		<p class="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
			<UIcon name="i-lucide-info" class="w-3 h-3" />You can clear the input using <UKbd value="control" /> + <UKbd value="backspace" /> or
			<UKbd value="delete" />
		</p>
		
	</UForm>
</template>
