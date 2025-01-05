<script setup>
import { ref, reactive, watch, computed } from 'vue';

const props = defineProps({
    script: {
        type: Object,
        required: true
    },
    config: {
        type: Object,
        default: false
    }
});

const actors = computed(() => {
  const actorsList = props.script.acts.flatMap(act => act.scenes.flatMap(scene => scene.lines.map(line => line.actor)));
  const frequencyMap = actorsList.reduce((acc, actor) => {
    acc[actor] = (acc[actor] || 0) + 1;
    return acc;
  }, {});
  const actors =  Object.keys(frequencyMap).sort((a, b) => frequencyMap[b] - frequencyMap[a]);
  const undefinedIndex = actors.indexOf("undefined");
  if(undefinedIndex > -1) actors.splice(undefinedIndex, 1, undefined);
  return actors;

});


</script>

<template>
  <div class="full-width">
    <div class="mb-4">
      <label class="block mb-2">Select Actors:</label>
      <select v-model="config.selectedActors" multiple class="block w-full p-2 border rounded">
        <option v-for="actor in actors" :key="actor" :value="actor">{{ actor ? actor : "**Settings**" }}</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block mb-2">Select Acts:</label>
      <select v-model="config.selectedActs" multiple class="block w-full p-2 border rounded">
        <option v-for="act in script.acts" :key="act.actNumber" :value="act.actNumber">Act {{ act.actNumber }}</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block mb-2">Select Scenes:</label>
      <select v-model="config.selectedScenes" multiple class="block w-full p-2 border rounded">
        <option v-for="scene in script.acts.flatMap(act => act.scenes)" :key="scene.sceneNumber" :value="scene.sceneNumber">Scene {{ scene.sceneNumber }}</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block mb-2">Show Lines Prior to Selected Actors:</label>
      <input type="checkbox" v-model="config.showLinesPrior" class="block" />
    </div>
    <div class="mb-4">
      <label class="block mb-2">Hide Text to Check Yourself:</label>
      <input type="checkbox" v-model="config.hideText" class="block" />
    </div>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
