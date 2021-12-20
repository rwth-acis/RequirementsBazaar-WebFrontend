<template>
    <Avatar v-if="showDefaultIcon" icon="pi pi-user" shape="circle" :size="size"
            v-bind:class="[ { 'p-avatar-sm': size === 'small' } ]" />
    <Avatar v-else shape="circle" :size="size" v-bind:class="[ { 'p-avatar-sm': size === 'small' } ]">
        <img :alt="userName" :src="imageUrl" @error="handleImageError()" />
    </Avatar>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'UserAvatar',
  props: {
      imageUrl: { type: String, required: true },
      userName: { type: String, required: true },
      size: { type: String, default: 'large' },
  },
  setup: () => {
    const showDefaultIcon = ref(false);

    const handleImageError = () => {
        showDefaultIcon.value = true;
    };

    return { showDefaultIcon, handleImageError };
  },

})
</script>

<style scoped>
    .p-avatar-sm {
        width: 2rem;
        height: 2rem;
        font-size: 1.3rem;
    }
</style>
