<template>
  <div class="scene p-4 border rounded-lg mb-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
    <h2 class="text-2xl font-semibold mb-2 sm:text-3xl">{{ scene.sceneTitle ?? `Scene ${scene.sceneNumber}` }}<span v-if="scene.title">: {{ scene.title }}</span></h2>
    <div v-if="scene.setting" class="italic mb-2">{{ scene.setting }}</div>
    <LineDisplay v-for="line in scene.lines" :line="line" :hide-to-check="hideToCheck"/>
  </div>
</template>

<script>
import LineDisplay from './LineDisplay.vue';

export default {
  name: 'SceneDisplay',
  components: {
    LineDisplay
  },
  props: {
    scene: {
      type: Object,
      required: true
    },
    hideToCheck: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
