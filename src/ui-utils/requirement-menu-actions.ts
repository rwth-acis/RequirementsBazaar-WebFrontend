import { ActionTypes } from "@/store/actions";


export const confirmDeleteRequirement = (confirm, t, store, id: number, afterDelete: () => void = () => {}) => {
  confirm.require({
    header: t('deleteRequirement'),
    message: t('deleteRequirementDesc'),
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    group: 'dialog',
    accept: () => {
      store.dispatch(ActionTypes.DeleteRequirement, id).then(() => {
        afterDelete();
      });
    },
    reject: () => {
      console.log('not deleted');
    }
  });
};
