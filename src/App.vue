<script setup>
import { ref, reactive, watch, computed } from 'vue';
import ConfigPanel from './components/ConfigPanel.vue';
import ScriptDisplay from './components/ScriptDisplay.vue';
import scripts from './assets/scripts.json';
import t2v from './services/text2voice.js';

const safeJSONparse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};

const selectedScript = ref(safeJSONparse(localStorage.getItem('script')) || 'fools');

const config = reactive(safeJSONparse(localStorage.getItem(`config.${selectedScript.value}`)) 
                  || {
                    selectedActors: [],
                    selectedActs: [],
                    selectedScenes: [],
                    showLinesPrior: false,
                    hideText: false
                  });

const markActive = (script) => {
  script.acts.forEach(act => {
    act.active = config.selectedActs.length == 0 ? true : config.selectedActs.includes(act.actNumber);
    act.scenes.forEach(scene => {
      scene.active = config.selectedScenes.length == 0 ? true : config.selectedScenes.includes(scene.sceneNumber);

      for (let i = 0; i < scene.lines.length; i++) {
        const line = scene.lines[i];
        if (config.selectedActors.length == 0) {
          line.state = "show";
        } else {
          line.state = config.selectedActors.includes(line.actor) ? "show" : "hide";
          if (config.showLinesPrior && line.state == "show") {
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

const script = reactive({});

const loadScript = async (scriptRef) => {
  if (!scriptRef) return;
  if(!scriptRef.script) {
    try {
    
      const response = await fetch(scriptRef.url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      scriptRef.script = await response.json();
      
    } catch (error) {
      console.error('Failed to load script data:', error);
    }
  }
  Object.assign(script, scriptRef.script);
  markActive(script);
};

const loadSelectedScript = async () => {
  let scriptRef = scripts.find(s => s.name === selectedScript.value);
  if(!scriptRef) {
    scriptRef = scripts[0];
    selectedScript.value = scriptRef.name;
  }
  await loadScript(scriptRef);
  const newConfig = safeJSONparse(localStorage.getItem(`config.${selectedScript.value}`)) 
                          || {
                            selectedActors: [],
                            selectedActs: [],
                            selectedScenes: [],
                            showLinesPrior: false,
                            hideText: false
                          };
  Object.assign(config, newConfig);
}


watch(selectedScript, (newVal) => {
  if(typeof(newVal) == 'undefined') newVal = scripts[0];
  localStorage.setItem('script', JSON.stringify(newVal));
  loadSelectedScript();
}, { immediate: true });

watch(config, (newVal) => {
  markActive(script);
  t2v.cancel();
  localStorage.setItem(`config.${selectedScript.value}`, JSON.stringify(newVal));
});

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <div id="app" class="container mx-auto p-4">
    <div class="mb-4">
      <label class="block mb-2">Select Script:</label>
      <select v-model="selectedScript" class="block w-full p-2 border rounded">
        <option v-for="s in scripts" :key="s.name" :value="s.name">{{ s.title }}</option>
      </select>
    </div>
    <ConfigPanel :script="script" :config="config" />

    <ScriptDisplay :script="script" :hide-to-check="config.hideText" v-if="script" v-cloak/>

    <!-- Floating button to scroll to top -->
    <button @click="t2v.readIt(script)" class="readit" v-if="t2v.available">
      {{ t2v.speaking.value ? "Stop" : "Read This" }}
    </button>
    <!-- Floating button to scroll to top -->
    <button @click="scrollToTop" class="scroll2top">
      ↑ Top
    </button>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
