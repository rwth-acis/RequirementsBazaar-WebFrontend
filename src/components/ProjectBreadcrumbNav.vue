<template>
    <Breadcrumb :home="home" :model="items" />
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
    requirementId: { type: Number, required: false },
    requirementName: { type: String, required: false },
  },
  setup: (props) => {
    const { t } = useI18n({ useScope: 'global' });
    const { projectId, projectName, categoryId, categoryName, requirementId, requirementName } = toRefs(props);

    const home =  computed(() => {
      return {
        label: t('publicProjects'),
        to: `/projects`
      }
    });

    const items = computed(() => {
      const menuItems: { label: string, to?: string }[] = [
        { label: projectName.value, to: `/projects/${projectId.value}` }
      ];

      if (categoryId.value && categoryName.value) {
        menuItems.push({ label: categoryName.value, to: `/projects/${projectId.value}/categories/${categoryId.value}` });

        if (requirementId.value && requirementName.value) {
          menuItems.push({ label: requirementName.value, to: `/projects/${projectId.value}/requirements/${requirementId.value}` });
        }
      }
      return menuItems;
    });

    return {
      home,
      items,
    };
  },
})
</script>
