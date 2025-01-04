<template>
  <div class="flex items-start mb-2">
    <strong class="mr-2">{{ line.character }}<span v-if="line.actor"> ({{ line.actor }})</span>:</strong>
    <span v-if="line.setting" class="italic mr-2">{{ line.setting }}</span>
    <span>{{ line.text }}</span>
  </div>
</template>

<script>
export default {
  name: 'LineDisplay',
  props: {
    line: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
