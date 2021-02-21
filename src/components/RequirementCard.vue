<template>
  <Card>
    <template #title>
      <div>{{ name }}</div>
    </template>
    <template #content>
      <div>{{ description }}</div>
    </template>
    <template #footer>
      <div id="actionButtons">
        <Button label="Vote"></Button>
        <Button :label="`${numberOfComments} Comments`"></Button>
        <Button label="Share"></Button>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'RequirementCard',
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    numberOfComments: { type: Number, required: true },
  },
  setup: () => {
    const count = ref(0)
    return { count }
  }
})
</script>

<style scoped>
  #actionButtons {
    width: 100%;
    display: flex;
    flex-direction: row;
  }

  button {
    display: flex;
    flex: 1;
    margin-left: .5rem;
  }

  #actionButtons :first-child {
    margin-left: 0;
  }
</style>
