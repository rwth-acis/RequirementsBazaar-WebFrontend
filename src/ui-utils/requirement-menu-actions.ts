import { routePathToRequirement } from "@/router";
import { ActionTypes } from "@/store/actions";
import { Category, Project } from "@/types/bazaar-api";

import { useProgress } from '@/service/ProgressService';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


export const confirmDeleteRequirement = (confirm, t, store, id: number, afterDelete: () => void = () => {}) => {
  const { setLoading } = useProgress();

  confirm.require({
    header: t('deleteRequirement'),
    message: t('deleteRequirementDesc'),
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    group: 'dialog',
    accept: () => {
      setLoading(true);
      store.dispatch(ActionTypes.DeleteRequirement, id).then(() => {
        afterDelete();
        setLoading(false);
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

export const exportToPDF=(category: Category, requirement: { id: number, name: string, description: string},t) => {
  console.log('Export started...')
  var fileName = "requirement"+"_"+requirement.id+".pdf"

  var docDefinition = {
    content: [
    {text: t('headerExportRequirement')+" "+category.name+":\n\n", style: 'header'},
      {
        layout: {
          hLineColor: function (i, node) {
            return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
          },
          vLineColor: function (i, node) {
            return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
          }
        },
        table: {
          headerRows: 1,
          widths: [ 'auto', '*'],
          body: [
            [ { text: t('formTitle'), bold: true , noWrap: true}, { text: t('formDesc'), bold: true }],
            [ requirement.name.split('\\\\').join('\\'), requirement.description.split('\\\\').join('\\')],
          ]
        }
      }
    ],
    styles: {
      header: {
        fontSize: 15,
        bold: true
      }
  }
};

  pdfMake.createPdf(docDefinition).download(fileName);
  console.log('Export finished')
};

export const exportToTex=(category: Category, requirement: { id: number, name: string, description: string},t) => {
  // create the TeX string
  let texString = buildTexString(category, requirement, t);

  // download it
  let fileName = "requirement"+"_"+requirement.id+".tex"
  let content = new Blob([texString],{type: 'text/plain'});
  let saveFile = new File([content], fileName);

  const objUrl = URL.createObjectURL(saveFile);
  const atag = document.createElement('a');

  atag.setAttribute('href', objUrl);
  atag.setAttribute('download', fileName);
  atag.click()
}

function buildTexString(category: Category, requirement: { id: number, name: string, description: string},t){
  const setupItemize =t('headerExportRequirement')+" "+category.name+':\n\\begin{itemize}\n';
  const endItemize ='\n\\end{itemize}';

  var content = '\t\\item \\textbf\{'+ makeTexCompatible(requirement.name, true) + ':\} '+ makeTexCompatible(requirement.description, false);
  var texString = setupItemize.concat(content, endItemize);
  return texString;
}

function makeTexCompatible(text: string, name: boolean){
  text = text.split('\\\\').join('\\textbackslash ');
  if(name){
    text = text.split('\\').join('\\textbackslash ');
  }
  text = text.split('{').join('\\{');
  text = text.split('}').join('\\}');
  text = text.split('<').join('\\textless');
  text = text.split('>').join('\\textgreater');
  text = text.split('%').join('\\%');
  text = text.split('$').join('\\$');
  text = text.split('&').join('\\&');
  text = text.split('_').join('\\_');
  text = text.split('#').join('\\#');
  text = text.split('|').join('\\textbar');
  text = text.split('–').join('\\textendash');
  text = text.split('¿').join('\\textquestiondown');
  return text
}

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
