<template>
    <Breadcrumb :model="items" />
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'ProjectBreadcrumbNav',
  props: {
    projectId: { type: Number, required: true },
    projectName: { type: String, required: false, default: 'Project Home' },
    categoryId: { type: Number, required: false },
    categoryName: { type: String, required: false, default: 'Parent Category' },
  },
  setup: (props) => {
    const { t } = useI18n({ useScope: 'global' });
    const { projectId, projectName, categoryId, categoryName } = toRefs(props);

    const items = computed(() => {
      const menuItems: { label: string, to?: string }[] = [{
        label: projectName.value,
        to: `/projects/${projectId.value}`
      }];

      if (categoryId.value && categoryName.value) {
        menuItems.push({ label: categoryName.value, to: `/projects/${projectId.value}/categories/${categoryId.value}` });
      }
      return menuItems;
    });

    return {
      items,
    };
  },
})
</script>
