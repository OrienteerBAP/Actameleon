<template>
  <div class="p-4 border rounded-lg mb-4">
    <h2 class="text-2xl font-semibold mb-2">Scene {{ scene.sceneNumber }}<span v-if="scene.title">: {{ scene.title }}</span></h2>
    <div v-for="line in scene.lines" :key="line.id" class="mb-2">
      <LineDisplay :line="line" />
    </div>
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
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
