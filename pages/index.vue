<script lang="ts" setup>
import type { Todo } from '~/server/utils/drizzle'

useHead({
	title: 'Todos',
})

const { session } = useUserSession()

const { data: todos, status, refresh } = await useFetch<Todo[]>('/api/todos')

const refreshTodos = () => {
	refresh()
}
</script>

<template>
	<div>
		<!-- Greeting -->
		<h1 v-if="session" class="mb-5">
			Hello
			<span class="font-bold">{{ session?.user?.firstName + ' ' + session?.user?.lastName }}</span>
		</h1>
		<!-- Loading -->
		<div v-if="status === 'pending'" class="flex justify-center items-center h-screen">
			<UProgress animation="swing" />
		</div>
		<div v-else class="flex flex-col gap-5">
			<!-- New task form -->
			<TodoNew @refresh="refreshTodos" />	
			<!-- No tasks to show -->
			<p v-if="todos.length === 0" class="text-gray-500 text-bold text-2xl text-center">No tasks to show!</p>
			<!-- Tasks list -->
			<div v-else>
				<TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" @delete="deleteTodo(todo.id)" />
			</div>
		</div>
		<!-- Error -->
		<div v-if="status === 'error'" class="flex justify-center items-center h-screen">
			<p class="text-red-500 text-bold text-2xl">Error fetching todos</p>
			<UButton @click="refresh">Refresh</UButton>
		</div>
	</div>
</template>
