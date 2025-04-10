<script lang="ts" setup>
const { loggedIn, session } = useUserSession()
const todos = ref([])
useHead({
	title: 'Home',
})
</script>

<template>
	<div v-if="loggedIn">
		<h1>
			Hello
			<span class="font-bold">{{ session?.user?.firstName + ' ' + session?.user?.lastName }}</span>
		</h1>
		<br />
		<p v-show="todos.length === 0" class="text-gray-500 text-bold text-2xl">No tasks to show!</p>

		<ul class="flex flex-col gap-5">
			<TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" @delete="(id) => todos.splice(id, 1)" />
		</ul>
		<TodoNew />
	</div>
	<div v-else>
		<h1 class="text-2xl font-bold">Please login to continue</h1>
		<NuxtLink to="/login" class="text-blue-500">Login</NuxtLink>
	</div>
</template>
