<script setup lang="ts">
import EditTaskDialog from 'src/components/EditTaskDialog.vue';
import NewTaskDialog from 'src/components/NewTaskDialog.vue';
import TaskCard from 'src/components/TaskCard.vue';
import type { NewTask, Task } from 'src/types/Task';
import { computed, onMounted, ref } from 'vue';

const tasks = ref<Task[]>([]);
const prompt = ref<boolean>(false);
const editPrompt = ref<boolean>(false);
const selectedTask = ref<Task>();

const current = ref<number>(1);
const itemsPerPage = 12;
const totalPages = computed(() => Math.ceil(tasks.value.length / itemsPerPage));
const paginatedTasks = computed(() => {
  const start = (current.value - 1) * itemsPerPage;
  return tasks.value.slice(start, start + itemsPerPage);
})

const sortTasks = (tasks: Task[]) => {
  return tasks.sort((a, b) => Number(a.completed) - Number(b.completed));
};
const fetchTasks = async () => {
  try {
    const res = await fetch('http://localhost:5000/tasks');
    tasks.value = await res.json();
    tasks.value = sortTasks(tasks.value);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
  }
};
const toggleCompletion = async (taskId: string) => {
  const task = tasks.value.find((task) => task.id === taskId);
  if (task) {
    task.completed = !task.completed;
    try {
      await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      tasks.value = sortTasks(tasks.value);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }
};
const addTask = async (newTask: NewTask) => {
  try {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });
    const createdTask = await res.json();
    tasks.value.unshift(createdTask);
    tasks.value = sortTasks(tasks.value);
  } catch (error) {
    console.error('Error adding task:', error);
  }
};
const deleteTask = async (taskId: string) => {
  try {
    await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: 'DELETE',
    });
    tasks.value = tasks.value.filter((task) => task.id !== taskId);
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};
const updateTask = async (updatedTask: Task) => {
  try {
    await fetch(`http://localhost:5000/tasks/${updatedTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    });
    tasks.value = tasks.value.map((task) => (task.id === updatedTask.id ? updatedTask : task));
  } catch (error) {
    console.error('Error updating task:', error);
  }
};
const editTask = (task: Task) => {
  selectedTask.value = task;
  editPrompt.value = true;
};

onMounted(fetchTasks);
</script>

<template>
  <q-page class="">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl my-10">Task List</h1>
      <q-btn label="New Task" color="primary" @click="prompt = true" />
      <NewTaskDialog v-model="prompt" @add-task="addTask" />
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      <TaskCard v-for="(task, index) in paginatedTasks" :key="index" :task="task" :toggle-completion="toggleCompletion"
        :delete-task="deleteTask" @edit-task="editTask" />
    </div>
    <EditTaskDialog v-model="editPrompt" :task="selectedTask!" @update-task="updateTask" />
    <q-pagination v-model="current" :max="totalPages" boundary-numbers direction-links flat class="mt-5 w-full flex justify-end" color="grey" active-color="primary" />
  </q-page>
</template>
