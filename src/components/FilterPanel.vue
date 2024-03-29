<template>
  <div class="filterPanel">
    <span class="p-input-icon-left p-input-icon-right searchContainer">
      <i class="pi pi-search" />
      <InputText
        type="text"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        placeholder="Search title and description">
      </InputText>
      <i class="clearButton pi pi-times" v-show="searchQuery.length > 0" @click="onClearClick()" />
    </span>
    <span class="wrapContainer">
      <span>{{ t('sorting') }}:</span>
      <Dropdown
        id="sortOptionsDropdown"
        :options="sortOptions"
        optionLabel="name"
        optionValue="value"
        v-model="selectedSortInternal"
        @change="$emit('update:selectedSort', $event.value)">
      </Dropdown>
      <SelectButton
        :options="sortDirectionOptions"
        optionValue="value"
        class="selectButton"
        v-model="sortAscendingInternal">
        <template #option="slotProps">
          <i :class="slotProps.option.icon"></i>
        </template>
      </SelectButton>
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'Category',
  props: {
    searchQuery: {
      type: String,
      default: '',
    },
    selectedSort: String,
    sortOptions: Object,
    sortAscending: Boolean,
  },
  emits: ['update:searchQuery', 'update:selectedSort', 'update:sortAscending'],
  setup(props, context) {
    const { t } = useI18n({ useScope: 'global' });

    const onClearClick = () => {
      context.emit('update:searchQuery', '');
    }

    const sortAscendingInternal = ref(props.sortAscending);
    const sortDirectionOptions = [
      {icon: 'pi pi-sort-amount-down-alt', value: true},
      {icon: 'pi pi-sort-amount-up', value: false},
    ]
    watch(sortAscendingInternal, () => context.emit('update:sortAscending', sortAscendingInternal.value));
    // could also be done using toRefs, cf. https://v3.vuejs.org/guide/composition-api-introduction.html#reacting-to-changes-with-watch
    watch(() => props.sortAscending, (newValue) => {sortAscendingInternal.value = newValue});

    const selectedSortInternal = ref(props.selectedSort);
    return { t, selectedSortInternal, sortAscendingInternal, sortDirectionOptions, onClearClick }
  }
})
</script>

<style scoped>
  .filterPanel {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    justify-content: flex-end;
  }

  .clearButton {
    padding-right: 0.2rem;
  }

  .searchContainer {
    min-width: 150px;
  }

  .wrapContainer {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  .filterPanel ::v-deep(.p-button > .pi) {
    height: 17px;
  }

  .filterPanel > :first-child {
    flex: 1;
    margin-inline-start: 0;
  }

  .filterPanel input {
    width: 100%;
  }

  #sortOptionsDropdown {
    flex: 0.35;
  }

  .selectButton {
    direction: ltr;
  }
</style>
