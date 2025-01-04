<template>
  <div class="md:p-4">
    <h1 class="text-4xl font-bold mb-4">{{ script.title }}</h1>
    <div v-for="act in script.acts" :key="act.id" class="mb-6">
      <ActDisplay :act="act" />
    </div>
  </div>
</template>

<script>
import ActDisplay from './ActDisplay.vue';

export default {
  name: 'ScriptDisplay',
  components: {
    ActDisplay
  },
  props: {
    script: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
