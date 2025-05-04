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
  <!-- Page background -->
  <div class="min-h-screen flex items-center justify-center bg-white-100 py-10 px-4">
    <!-- Gradient border card wrapper -->
    <div class="w-full max-w-2xl rounded-xl p-px bg-gradient-to-br from-rose-300 via-amber-200 to-sky-300">
      <!-- Inner white card -->
      <div class="bg-white rounded-xl shadow-md">
        <!-- App title -->
   
		<h1 class="text-center text-2xl font-semibold py-6 border-b">Task Tracker</h1>

        <div class="p-6 space-y-10">

          <!-- Loading state -->
          <div v-if="status === 'pending'" class="flex justify-center items-center">
            <UProgress animation="swing" />
          </div>

          <!-- Success state -->
          <div v-if="status === 'success' && todos" class="space-y-8">
            <!-- "Add New Task" card -->
            <section class="bg-white rounded-lg shadow-sm border border-gray-100">
              <header class="px-6 pt-6">
                <h2 class="text-lg font-semibold">Add New Task</h2>
              </header>
              <div class="p-6 pt-0">
                <TodoNew @refresh="refreshTodos" />
              </div>
            </section>

            <!-- Empty‑state message -->
            <p v-if="todos.length === 0" class="text-gray-400 text-center text-lg">No tasks to show!</p>

            <!-- Tasks list card -->
            
              <header class= "mb-0">
                <h2 class="text-lg font-semibold py-5 ">Tasks</h2>
              </header>
              <div>
                <TodoItem
                  v-for="todo in todos"
                  :key="todo.id"
                  :todo="todo"
                  @delete="deleteTodo(todo.id)"
                />
              </div>
           
          </div>

          <!-- Error state -->
          <div v-if="status === 'error'" class="flex flex-col gap-5 justify-center items-center">
            <p class="text-red-500 text-2xl font-semibold">Error fetching todos</p>
            <UButton @click="refresh">Refresh</UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>