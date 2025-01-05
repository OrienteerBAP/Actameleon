<script setup>
import { ref, reactive, watch } from 'vue';
import ScriptDisplay from './components/ScriptDisplay.vue';
import scriptData from './assets/fools.json';

const safeJSONparse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};

const selectedActors = ref(safeJSONparse(localStorage.getItem('selectedActors')) || []);
const selectedActs = ref(safeJSONparse(localStorage.getItem('selectedActs')) || []);
const selectedScenes = ref(safeJSONparse(localStorage.getItem('selectedScenes')) || []);
const showLinesPrior = ref(safeJSONparse(localStorage.getItem('showLinesPrior')) || false);

const markActive = (script) => {
  script.acts.forEach(act => {
    act.active = selectedActs.value.length == 0 ? true : selectedActs.value.includes(act.actNumber);
    act.scenes.forEach(scene => {
      scene.active = selectedScenes.value.length == 0 ? true : selectedScenes.value.includes(scene.sceneNumber);

      for (let i = 0; i < scene.lines.length; i++) {
        const line = scene.lines[i];
        if (selectedActors.value.length == 0) {
          line.state = "show";
        } else {
          line.state = selectedActors.value.includes(line.actor) ? "show" : "hide";
          if (showLinesPrior.value && line.state == "show") {
            for (let j = i - 1; j >= 0; j--) {
              if (scene.lines[j].state == 'hide') scene.lines[j].state = "clue";
              if (scene.lines[j].actor) break;
            }
          }
        }
      }
    });
  });
  return script;
};

const script = reactive(markActive(scriptData));

watch([selectedActors, selectedActs, selectedScenes, showLinesPrior], () => { markActive(script) });

watch(selectedActors, (newVal) => {
  localStorage.setItem('selectedActors', JSON.stringify(newVal));
});

watch(selectedActs, (newVal) => {
  localStorage.setItem('selectedActs', JSON.stringify(newVal));
});

watch(selectedScenes, (newVal) => {
  localStorage.setItem('selectedScenes', JSON.stringify(newVal));
});

watch(showLinesPrior, (newVal) => {
  localStorage.setItem('showLinesPrior', JSON.stringify(newVal));
});

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
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
    <ScriptDisplay :script="script" v-if="script" v-cloak/>

    <!-- Floating button to scroll to top -->
    <button @click="scrollToTop" class="scroll2top">
      ↑ Top
    </button>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
