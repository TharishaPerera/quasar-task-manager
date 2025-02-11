<script setup lang="ts">
import type { Task } from 'src/types/Task';
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: boolean; task?: Task }>();
const emit = defineEmits(['update:modelValue', 'update-task']);

const editedTask = ref();

watch(() => props.task, (newTask) => {
  editedTask.value = newTask ? { ...newTask } : null;
});

const titleRef = ref();
const descriptionRef = ref();
const required = (val: string) => (val && val.trim() !== '' ? true : 'This field is required');

const closeDialog = () => {
  emit('update:modelValue', false);
};
const submitTask = () => {
  const isTitleValid = titleRef.value.validate();
  const isDescriptionValid = descriptionRef.value.validate();

  if (isTitleValid && isDescriptionValid) {
    emit('update-task', editedTask.value);
    closeDialog();
  }
};
</script>

<template>
  <q-dialog :model-value="props.modelValue" @update:model-value="emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Create New Task</div>
      </q-card-section>

      <q-card-section class="space-y-4">
        <q-input filled v-model="editedTask.title" label="Task Title" :autofocus="true" ref="titleRef" lazy-rules
          :rules="[required]" />
        <q-input filled v-model="editedTask.description" label="Task Description" autogrow ref="descriptionRef" lazy-rules
          :rules="[required]" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" @click="closeDialog" />
        <q-btn flat label="Update Task" color="primary" @click="submitTask" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
