import { routePathToRequirement } from "@/router";
import { ActionTypes } from "@/store/actions";
import { Project } from "@/types/bazaar-api";

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

export const createShareableRequirementLink = (projectId, requirementId) => {
  const path = routePathToRequirement(projectId, requirementId);
  return window.location.origin + path;
};

export const createGitHubIssueForRequirement = (confirm, t, project: Project, requirement: { id: number, name: string, description: string, additionalProperties }) => {
  const githubBaseUrl = project.additionalProperties!.github_url;
  const requirementTitle = requirement.name.replace(/\s/g, '+'); // TODO Don't URL ecode by hand...
  const description = requirement.description.replace(/\s/g, '+');
  const bazaarRequirementUrl = createShareableRequirementLink(project.id, requirement.id)
  if(requirement.additionalProperties === undefined){
    confirm.require({
      header: t('createIssueDialogHeader'),
      message: t('createIssueDialogMessage'),
      icon: 'pi pi-external-link',
      group: 'dialog',
        accept: () => {
    window.open(githubBaseUrl+"/issues/new?"+"title="+requirementTitle+"&body=" + description +" -> _**See+requirement+in+Bazaar:**_ "+bazaarRequirementUrl);
    },
        reject: () => {
    console.log('not redirected');
    }
  });
  }else{
    alertShareGitHub(confirm, t('requirementAlreadyOnGitHub'))
  }
};

const alertShareGitHub = (confirm, message: string) => {
  confirm.require({
      group: 'dialog',
      message: message,
      header: 'Ops',
      icon: 'pi pi-info-circle',
      rejectClass: 'p-sr-only',
      acceptLabel: 'OK',
  });
}
