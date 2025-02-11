<script setup lang="ts">
import HeaderComponent from 'src/components/HeaderComponent.vue';
</script>

<template>
  <q-layout view="lHr lpR fFf">
    <HeaderComponent />

    <q-page-container class="px-8 sm:px-16 md:px-32">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
