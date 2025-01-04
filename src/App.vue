<script setup>
import ScriptDisplay from './components/ScriptDisplay.vue';
import scriptData from './assets/fools.json';

const script = scriptData;
</script>

<template>
  <div id="app" class="container mx-auto p-4">
    <ScriptDisplay :script="script" v-if="script" />
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
