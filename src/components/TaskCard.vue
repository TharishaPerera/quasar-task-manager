<script setup lang="ts">
import type { Task } from 'src/types/Task';

defineProps<{
  task: Task,
  toggleCompletion: (taskId: string) => void,
  deleteTask: (taskId: string) => void,
}>();
defineEmits(['edit-task']);
</script>

<template>
  <q-card class="my-card">
    <q-btn @click="deleteTask(task.id)" round icon="close" size="sm"
      class="bg-red-300 text-red-600 absolute z-10 right-1 top-1" />
    <q-card-section class="bg-gray-400 text-white min-h-28">
      <div :class="{ 'line-through': task.completed }" class="text-h6">{{ task.title }}</div>
      <div :class="{ 'line-through': task.completed }" class="text-subtitle2">{{ task.description }}</div>
    </q-card-section>

    <q-card-actions class="flex items-center justify-end">
      <q-btn @click="$emit('edit-task', task)" square icon="edit" class="bg-yellow-200 text-yellow-600" />
      <q-btn @click="toggleCompletion(task.id)" :color="task.completed ? 'red' : 'green'">
        {{ task.completed ? 'Mark as Incomplete' : 'Mark as Completed' }}
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<style scoped>
</style>
