<template>
  <Card id="card">
    <template #title>
      <div>{{ name }}</div>
    </template>
    <template #content>
        <div>{{ description }}</div>
    </template>
  </Card>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'CategoryCard',
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  setup: () => {
    return {};
  },

})
</script>

<style scoped>
  #card {
    overflow: hidden;
  }
</style>
