<template>
  <div class="p-4 border rounded-lg mb-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
    <h2 class="text-2xl font-semibold mb-2 sm:text-3xl">Scene {{ scene.sceneNumber }}<span v-if="scene.title">: {{ scene.title }}</span></h2>
    <div v-for="line in scene.lines" :key="line.id" class="mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6" v-show="line.active">
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
