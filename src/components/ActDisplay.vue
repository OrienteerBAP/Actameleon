<template>
  <div class="p-4 border-b mb-4">
    <h2 class="text-3xl font-semibold mb-4">Act {{ act.actNumber }}<span v-if="act.title">: {{ act.title }}</span></h2>
    <div v-for="scene in act.scenes" :key="scene.id" class="mb-4">
      <SceneDisplay :scene="scene" />
    </div>
  </div>
</template>

<script>
import SceneDisplay from './SceneDisplay.vue';

export default {
  name: 'ActDisplay',
  components: {
    SceneDisplay
  },
  props: {
    act: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
