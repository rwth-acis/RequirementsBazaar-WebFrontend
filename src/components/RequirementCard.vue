<template>
  <Card>
    <template #title>
      <div>{{ id }}</div>
    </template>
  </Card>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'RequirementCard',
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  setup: () => {
    const count = ref(0)
    return { count }
  }
})
</script>

<style scoped>

</style>
