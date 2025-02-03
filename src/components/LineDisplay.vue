<template>
  <div :class="[`line-${line.state}`, { 'line-selected' : line.selected}]">
    <strong class="mr-2" v-if="line.actor && line.state != 'hide'">{{ line.actor }}:</strong>
    <span v-if="line.setting && line.state != 'hide' && !hideText" class="italic mr-2">{{ line.setting }}</span>
    <span v-if="line.state!='hide' && !hideText">{{ line.text }}</span>
    <button v-if="line.state!='hide' && hideText" @click="toggleHideText" class="show-text-button">Show</button>
    <span v-if="line.state=='hide'">*</span>
  </div>
</template>

<script>
export default {
  name: 'LineDisplay',
  props: {
    line: {
      type: Object,
      required: true
    },
    hideToCheck: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hideText: this.hideToCheck && this.line.state == 'show'
    }
  },
  watch: {
    hideToCheck(newVal) {
      this.hideText = newVal && this.line.state == 'show';
    }
  },
  methods: {
    toggleHideText() {
      this.hideText = !this.hideText;
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
