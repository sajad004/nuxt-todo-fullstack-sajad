<script setup lang="ts">
const props = defineProps(['todo'])
const emit = defineEmits(['delete'])
</script>

<template>
    <UCard class="mb-5">
        <div class="flex items-center justify-between gap-2 w-full">
            <UCheckbox v-model="props.todo.completed" />
            <input :class="{ 'line-through': props.todo.completed }" v-model="props.todo.text" :disabled="props.todo.completed" class="bg-transparent disabled:text-gray-500 focus-visible:outline-0 focus-visible:border-b focus-visible:border-gray-300 w-full"/>
            <UButton icon="i-heroicons-trash" variant="ghost" color="error" @click="emit('delete', props.todo.id)"/>
        </div>
    </UCard>
</template>

