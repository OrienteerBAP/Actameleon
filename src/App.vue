<script setup>
import { ref, computed, watch } from 'vue';
import ScriptDisplay from './components/ScriptDisplay.vue';
import scriptData from './assets/fools.json';

const script = scriptData;

const selectedActors = ref(JSON.parse(localStorage.getItem('selectedActors')) || []);
const selectedActs = ref(localStorage.getItem('selectedActs') || []);
const selectedScenes = ref(JSON.parse(localStorage.getItem('selectedScenes')) || []);
const showLinesPrior = ref(JSON.parse(localStorage.getItem('showLinesPrior')) || true);

const filteredScript = computed(() => {
  let filteredActs = script.acts;

  if (selectedActs.value.length > 0) {
    filteredActs = filteredActs.filter(act => selectedActs.value.includes(act.actNumber));
  }

  if (selectedScenes.value.length > 0) {
    filteredActs = filteredActs.map(act => ({
      ...act,
      scenes: act.scenes.filter(scene => selectedScenes.value.includes(scene.sceneNumber))
    }));
  }

  if (selectedActors.value.length > 0) {
    filteredActs = filteredActs.map(act => ({
      ...act,
      scenes: act.scenes.map(scene => ({
        ...scene,
        lines: scene.lines.filter(line => selectedActors.value.includes(line.actor))
      }))
    }));
  }

  return {
    ...script,
    acts: filteredActs
  };
});

watch(selectedActors, (newVal) => {
  localStorage.setItem('selectedActors', JSON.stringify(newVal));
});

watch(selectedActs, (newVal) => {
  localStorage.setItem('selectedActs', newVal);
});

watch(selectedScenes, (newVal) => {
  localStorage.setItem('selectedScenes', JSON.stringify(newVal));
});

watch(showLinesPrior, (newVal) => {
  localStorage.setItem('showLinesPrior', JSON.stringify(newVal));
});
</script>

<template>
  <div id="app" class="container mx-auto p-4">
    <div class="mb-4">
      <label class="block mb-2">Select Actors:</label>
      <select v-model="selectedActors" multiple class="block w-full p-2 border rounded">
        <option v-for="actor in [...new Set(script.acts.flatMap(act => act.scenes.flatMap(scene => scene.lines.map(line => line.actor))))]" :key="actor" :value="actor">{{ actor ? actor : "**Settings**" }}</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block mb-2">Select Acts:</label>
      <select v-model="selectedActs" multiple class="block w-full p-2 border rounded">
        <option v-for="act in script.acts" :key="act.actNumber" :value="act.actNumber">Act {{ act.actNumber }}</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block mb-2">Select Scenes:</label>
      <select v-model="selectedScenes" multiple class="block w-full p-2 border rounded">
        <option v-for="scene in script.acts.flatMap(act => act.scenes)" :key="scene.sceneNumber" :value="scene.sceneNumber">Scene {{ scene.sceneNumber }}</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block mb-2">Show Lines Prior to Selected Actors:</label>
      <input type="checkbox" v-model="showLinesPrior" class="block" />
    </div>
    <ScriptDisplay :script="filteredScript" v-if="script" />
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
