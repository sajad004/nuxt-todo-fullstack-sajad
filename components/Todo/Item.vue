<script setup lang="ts">
	const props = defineProps(['todo'])

	const editTodo = ref(false)
	const inputRef = ref(null)

	watch(editTodo, (val) => {
		if (val) {
			nextTick(() => {
				inputRef.value?.focus()
			})
		}
	})

	const toast = useToast()

	watch(props.todo, (updatedTodo) => {
        // TODO: only update if completed has changed
		// updateTodo(updatedTodo.id, updatedTodo.completed, updatedTodo.text)
	})

    // TODO: update todo text after editTodo is done

	const updateTodo = async (id: string, completed: boolean, text: string) => {
		await $fetch('/api/todos', {
			method: 'PUT',
			body: {
				id,
				completed,
				text,
			},
		})
		toast.add({ title: 'Success', description: 'Todo updated', color: 'success' })
	}

	const deleteTodo = (id: string) => {
		console.log(id, 'delete')
        // TODO: delete todo - first add the code for endpoint in server/api/todos/index.delete.ts
		// await $fetch('/api/todos', {
		// 	method: 'DELETE',
		// 	body: {
		// 		id,
		// 	},
		// })
	}
</script>

<template>
	<UCard class="mb-5 ">
		<div class="flex items-center justify-between gap-2 w-full shadow-none">
			<UCheckbox v-model="props.todo.completed" />
			<input
				ref="inputRef"
				:class="{ 'line-through': props.todo.completed }"
				v-model="props.todo.text"
				:disabled="props.todo.completed || !editTodo"
				class="bg-transparent disabled:text-gray-500 focus-visible:outline-0 focus-visible:border-b focus-visible:border-gray-300 w-full"
			/>
			<UButton
				icon="i-heroicons-pencil"
				:variant="editTodo ? 'solid' : 'ghost'"
				color="primary"
				@click="editTodo = !editTodo"
			/>
			<UButton
				icon="i-heroicons-trash"
				variant="ghost"
				color="error"
				@click="deleteTodo(props.todo.id)"
			/>
		</div>
	</UCard>
</template>
