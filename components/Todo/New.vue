<script setup>
const newTodo = ref('')
const addNewTodo = () => {
	// TODO: add new todo
	newTodo.value = ''
}
</script>
<template>
	<UForm class="flex flex-col gap-5 mt-5 items-center">
		<UInput type="text" v-model="newTodo"
			placeholder="New Task ..." @keyup.ctrl.delete="newTodo = ''" class="w-80"/>
			<p class="text-xs text-gray-500">You can clear the input using <UKbd value="control" /> + <UKbd value="backspace" /> or <UKbd value="delete" /></p>
		<UButton type="submit" @click="addNewTodo" variant="soft">Add
			Todo</UButton>
	</UForm>
</template>
