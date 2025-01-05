<template>
  <div :class="`line-${line.state}`">
    <strong class="mr-2" v-if="line.actor && line.state != 'hide'">{{ line.actor }}:</strong>
    <span v-if="line.setting && line.state != 'hide'" class="italic mr-2">{{ line.setting }}</span>
    <span v-if="line.state!='hide'">{{ line.text }}</span>
    <span v-else>*</span>
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
