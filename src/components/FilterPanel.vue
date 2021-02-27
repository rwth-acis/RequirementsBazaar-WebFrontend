<template>
  <div class="filterPanel">
    <span class="p-input-icon-left p-input-icon-right">
      <i class="pi pi-search" />
      <InputText
        type="text"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        placeholder="Search title and description">
      </InputText>
      <i class="clearButton pi pi-times" v-show="searchQuery.length > 0" @click="onClearClick()" />
    </span>
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
      v-model="sortAscendingInternal">
      <template #option="slotProps">
        <i :class="slotProps.option.icon"></i>
      </template>
    </SelectButton>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
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
    const onClearClick = () => {
      context.emit('update:searchQuery', '');
    }

    const sortAscendingInternal = ref(props.sortAscending);
    const sortDirectionOptions = [
      {icon: 'pi pi-sort-amount-down-alt', value: true},
      {icon: 'pi pi-sort-amount-up', value: false},
    ]
    watch(sortAscendingInternal, () => context.emit('update:sortAscending', sortAscendingInternal.value));

    const selectedSortInternal = ref(props.selectedSort);
    return { selectedSortInternal, sortAscendingInternal, sortDirectionOptions, onClearClick }
  }
})
</script>

<style scoped>
  .filterPanel {
    display: flex;
    flex-direction: row;
    margin-bottom: 1.5rem;
  }

  .clearButton {
    padding-right: 0.2rem;
  }

  .filterPanel > * {
    margin-left: .5rem;
  }

  .filterPanel ::v-deep(.p-button > .pi) {
    height: 17px;
  }

  .filterPanel :first-child {
    flex: 1;
    margin-left: 0;
  }

  .filterPanel input {
    width: 100%;
  }

  #sortOptionsDropdown {
    flex: 0.35;
  }
</style>
