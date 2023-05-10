<template>
  <div class="p-fluid">
    <div v-if="isCategory">
      <label for="reqType">{{ t('reqType') }}</label>
      <Dropdown id="reqType" v-model="selectedReqType" :options="reqTypes" optionLabel="name" :required="true" />
    </div>
    <label for="fileType">{{ t('fileType') }}</label>
    <Dropdown id="fileType" v-model="selectedFileType" :options="fileTypes" optionLabel="name" :required="true" />
    <div class="footer">
      <Button :label="t('cancel')" @click="cancel" class="p-button-outlined p-ml-2 p-mr-2" />
      <Button :label="t('exportBtn')" @click="handleSubmit" />
    </div>
  </div>
</template>

<script lang="ts">
import { Requirement } from '@/types/bazaar-api';
import { defineComponent, PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n';
import Dropdown from 'primevue/dropdown';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

export default defineComponent({
  name: 'ExportPopup',
  props: {
    realizedRequirements: {
      type: Array,
      required: false,
    },
    activeRequirements: {
      type: Array,
      required: false,
    },
    id: {
      type: Number,
      required: true,
    },
    categoryName: {
      type: String,
      required: false,
      default: '',
    },
    isCategory: {
      type: Boolean,
      required: false,
      default: true,
    },
    onCancel: Function as PropType<(x: string) => void>, /* workaround for typing custom events */
    onSave: Function as PropType<(x: string) => void>, /* workaround for typing custom events */
  },
  emits: ['cancel', 'save'],
  setup: ({ id, categoryName, realizedRequirements, activeRequirements, isCategory }, { emit }) => {
    const { t } = useI18n({ useScope: 'global' });
    const selectedReqType = ref({ name: t('exportRequirementsAll'), code: 'ALL' });
    const submitted = ref(false);
    const realized = realizedRequirements as Array<Requirement>
    const active = activeRequirements as Array<Requirement>

    const reqTypes = ref([
      { name: t('exportRequirementsAll'), code: 'ALL' },
      { name: t('exportRequirementsActive'), code: 'ACTIVE' },
      { name: t('exportRequirementsCompleted'), code: 'COMPLETE' }
    ]);

    const selectedFileType = ref({ name: t('exportRequirementsPdf'), code: 'PDF' });
    const fileTypes = ref([
      { name: t('exportRequirementsPdf'), code: 'PDF' },
      { name: t('exportRequirementsTex'), code: 'TEX' }
    ]);

    const cancel = () => {
      emit('cancel');
    }

    const handleSubmit = () => {
      submitted.value = true;
      let chosenType = selectedReqType.value.code;
      let chosenFileType = selectedFileType.value.code;

      if (chosenFileType == "PDF") {
        handlePdf(chosenType);
      } else {
        handleTex(chosenType);
      }
      emit('save');
    }

    function handlePdf(chosenType: string) {
      if (isCategory) {
        switch (chosenType) {
          case "ALL":
            exportRequirementsPdf(true, true);
            break;
          case "ACTIVE":
            exportRequirementsPdf(false, false);
            break;
          case "COMPLETE":
            exportRequirementsPdf(true, false);
            break;
        }
      } else {
        exportRequirementsPdf(false, false);
      }
    }

    function handleTex(chosenType: string) {
      if (isCategory) {
        switch (chosenType) {
          case "ALL":
            exportRequirementsTex(true, true);
            break;
          case "ACTIVE":
            exportRequirementsTex(false, false);
            break;
          case "COMPLETE":
            exportRequirementsTex(true, false);
            break;
        }
      } else {
        exportRequirementsTex(false, false);
      }
    }

    const exportRequirementsTex = (isCompleted: boolean, all: boolean) => {
      console.log('Export TeX started...');
      let key = isCategory ? 'headerExportCatActive' : "headerExportRequirement";
      let fileName = isCategory ? "active_requirements" + "_" + id + ".tex" : "requirement" + "_" + id + ".tex";
      let reqList = active;
      if (all) {
        key = 'headerExportCatAll';
        fileName = "requirements" + "_" + id + ".tex";
        reqList = realized.concat(active);
      } else {
        if (isCompleted) {
          key = 'headerExportCatComplete';
          fileName = "completed_requirements" + "_" + id + ".tex";
          reqList = realized;
        }
      }
      const texString = getTexString(reqList, key);
      downloadTex(texString, fileName);
      console.log('Export TeX finished');
    }

    function getTexString(reqList: Requirement[], key: string){
            // create seperated lists for tags
            const must = getMustRequirements(reqList);
      const should = getShouldRequirements(reqList);
      const could = getCouldRequirements(reqList);
      const uncat = getUncatRequirements(reqList);
      // strings for the latex Itemize
      const header = '\\subsection*\{'+t(key) + " " + categoryName+'\}';
      const beginItemize = '\n\\begin{itemize}\n';
      const endItemize = '\n\\end{itemize}';

      // bodys of the latex itemize
      let texString = header

      if(uncat.length != 0){
        var bodyUncat = '';
        for (let i = 0; i < uncat.length; i++) {
          let name = makeTexCompatible(uncat[i].name, true)
          let description = makeTexCompatible(uncat[i].description, false);
          bodyUncat += '\t\\item \\textbf\{' + name + ':\} ' + description + '\n';
        }
        texString += beginItemize + bodyUncat + endItemize;
      }
      if(must.length!= 0){
        var bodyMust = '';
        for (let i = 0; i < must.length; i++) {
          let name = makeTexCompatible(must[i].name, true)
          let description = makeTexCompatible(must[i].description, false);
          bodyMust += '\t\\item \\textbf\{' + name + ':\} ' + description + '\n';
        }
        texString += '\\paragraph\{Must:\}'+ beginItemize + bodyMust + endItemize;
      }
      if(should.length !=0){
        var bodyShould = '';
        for (let i = 0; i < should.length; i++) {
          let name = makeTexCompatible(should[i].name, true)
          let description = makeTexCompatible(should[i].description, false);
          bodyShould += '\t\\item \\textbf\{' + name + ':\} ' + description + '\n';
        }
        texString += '\\paragraph\{Should:\}'+ beginItemize + bodyShould + endItemize;
      }
      if(could.length!=0){
        var bodyCould = '';
        for (let i = 0; i < could.length; i++) {
          let name = makeTexCompatible(could[i].name, true)
          let description = makeTexCompatible(could[i].description, false);
          bodyCould += '\t\\item \\textbf\{' + name + ':\} ' + description + '\n';
        }
        texString += '\\paragraph\{Could:\}'+ beginItemize + bodyCould + endItemize;
      }
      return texString;
    }

    function makeTexCompatible(text: string, name: boolean) {
      text = text.split('\\\\').join('\\textbackslash ');
      if (name) {
        text = text.split('\\').join('\\textbackslash ');
      }
      text = text.split('{').join('\\{');
      text = text.split('}').join('\\}');
      text = text.split('<').join('\\textless');
      text = text.split('>').join('\\textgreater');
      text = text.split('%').join('\\%');
      text = text.split('$').join('\\$');
      text = text.split('&').join('\\&');
      text = text.split('#').join('\\#');
      text = text.split('|').join('\\textbar');
      text = text.split('–').join('\\textendash');
      text = text.split('¿').join('\\textquestiondown');
      return text
    }

    function downloadTex(texString: string, fileName: string) {
      let content = new Blob([texString], { type: 'text/plain' });
      let saveFile = new File([content], fileName);

      const objUrl = URL.createObjectURL(saveFile);
      const atag = document.createElement('a');

      atag.setAttribute('href', objUrl);
      atag.setAttribute('download', fileName);
      atag.click();
    }

    function getMustRequirements(reqs: Array<Requirement>) {
      var must: Requirement[] = [];
      reqs.forEach((req: Requirement) => {
        if (req.tags && req.tags.length != 0) {
          if (req.tags[0].name == 'Must') {
            must.push(req);
          }
        }
      });
      return must;
    }

    function getShouldRequirements(reqs: Array<Requirement>) {
      var should: Requirement[] = [];
      reqs.forEach((req: Requirement) => {
        if (req.tags && req.tags.length != 0) {
          if (req.tags[0].name == 'Should') {
            should.push(req);
          }
        }
      });
      return should;
    }

    function getCouldRequirements(reqs: Array<Requirement>) {
      var could: Requirement[] = [];
      reqs.forEach((req: Requirement) => {
        if (req.tags && req.tags.length != 0) {
          if (req.tags[0].name == 'Could') {
            could.push(req);
          }
        }
      });
      return could;
    }

    function getUncatRequirements(reqs: Array<Requirement>) {
      var uncat: Requirement[] = [];
      reqs.forEach((req: Requirement) => {
        if (!req.tags || req.tags.length == 0) {
          uncat.push(req);
        }
      });
      return uncat;
    }

    const exportRequirementsPdf = (isCompleted: boolean, all: boolean) => {
      console.log('Export PDF started...');
      let bodMust = [[{ text: t('formTitle'), bold: true }, { text: t('formDesc'), bold: true }]];
      let bodShould = [[{ text: t('formTitle'), bold: true }, { text: t('formDesc'), bold: true }]];
      let bodCould = [[{ text: t('formTitle'), bold: true }, { text: t('formDesc'), bold: true }]];
      let bodUncat = [[{ text: t('formTitle'), bold: true }, { text: t('formDesc'), bold: true }]];

      let header = isCategory ? { text: t('headerExportCatActive') + " " + categoryName + ":\n\n", style: 'header' } :
        { text: t('headerExportRequirement') + " " + categoryName + ":\n\n", style: 'header' };
      let fileName = isCategory ? "active_requirements" + "_" + id + ".pdf" : "requirement" + "_" + id + ".pdf";
      let reqList = active;
      if (all) {
        header = { text: t('headerExportCatAll') + " " + categoryName + ":\n\n", style: 'header' };
        fileName = "requirements" + "_" + id + ".pdf";
        reqList = realized.concat(active);
      } else {
        if (isCompleted) {
          header = { text: t('headerExportCatComplete') + " " + categoryName + ":\n\n", style: 'header' };
          fileName = "completed_requirements" + "_" + id + ".pdf";
          reqList = realized;
        }
      }

      // create seperated lists for tags
      const must = getMustRequirements(reqList);
      const should = getShouldRequirements(reqList);
      const could = getCouldRequirements(reqList);
      const uncat = getUncatRequirements(reqList);
      const mustHeader = must.length!= 0? { text: 'Must:', fontSize: 14, bold: true, margin: [0, 10, 0, 5]}: undefined;
      const shouldHeader = should.length!=0? { text: 'Should:', fontSize: 14, bold: true, margin: [0, 10, 0, 5] }: undefined;
      const couldHeader = could.length!=0? { text: 'Could:', fontSize: 14, bold: true, margin: [0, 10, 0, 5] }: undefined;

      must.forEach((req: Requirement) => {
        bodMust.push([{ text: req.name.split('\\\\').join('\\'), bold: false },
        { text: req.description.split('\\\\').join('\\'), bold: false }]);
      })
      should.forEach((req: Requirement) => {
        bodShould.push([{ text: req.name.split('\\\\').join('\\'), bold: false },
        { text: req.description.split('\\\\').join('\\'), bold: false }]);
      })
      could.forEach((req: Requirement) => {
        bodCould.push([{ text: req.name.split('\\\\').join('\\'), bold: false },
        { text: req.description.split('\\\\').join('\\'), bold: false }]);
      })
      uncat.forEach((req: Requirement) => {
        bodUncat.push([{ text: req.name.split('\\\\').join('\\'), bold: false },
        { text: req.description.split('\\\\').join('\\'), bold: false }]);
      })

      const docDefinition = {
        content: [
          header, uncat.length !=0?
          {
            layout: {
              hLineColor: function (i, node) {
                return (i === 0 || i === node.table.body.length || i == 1) ? 'black' : 'gray';
              },
              vLineColor: function (i, node) {
                return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
              }
            },
            table: {
              headerRows: 1,
              widths: [100, '*'],
              body: bodUncat
            }
          }:undefined,
          mustHeader,  must.length !=0?
          {
            layout: {
              hLineColor: function (i, node) {
                return (i === 0 || i === node.table.body.length || i == 1) ? 'black' : 'gray';
              },
              vLineColor: function (i, node) {
                return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
              }
            },
            table: {
              headerRows: 1,
              widths: [100, '*'],
              body: bodMust
            }
          }: undefined,
          shouldHeader, should.length !=0?
          {
            layout: {
              hLineColor: function (i, node) {
                return (i === 0 || i === node.table.body.length || i == 1) ? 'black' : 'gray';
              },
              vLineColor: function (i, node) {
                return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
              }
            },
            table: {
              headerRows: 1,
              widths: [100, '*'],
              body: bodShould
            }
          }: undefined,
          couldHeader, could.length != 0?
          {
            layout: {
              hLineColor: function (i, node) {
                return (i === 0 || i === node.table.body.length || i == 1) ? 'black' : 'gray';
              },
              vLineColor: function (i, node) {
                return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
              }
            },
            table: {
              headerRows: 1,
              widths: [100, '*'],
              body: bodCould
            }
          }:undefined,
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true
          }
        }
      };
      pdfmake.createPdf(docDefinition, {},
        {
          // Default font should still be available
          Roboto: {
            normal: 'Roboto-Regular.ttf',
            bold: 'Roboto-Medium.ttf',
            italics: 'Roboto-Italic.ttf',
            bolditalics: 'Roboto-Italic.ttf'
          },
          // Make sure you define all 4 components - normal, bold, italics, bolditalics - (even if they all point to the same font file)
          TimesNewRoman: {
            normal: 'Times-New-Roman-Regular.ttf',
            bold: 'Times-New-Roman-Bold.ttf',
            italics: 'Times-New-Roman-Italics.ttf',
            bolditalics: 'Times-New-Roman-Italics.ttf'
          }
        },
        pdfFonts.pdfMake.vfs).download(fileName);
      console.log('Export PDF finished');
    };

    return { t, cancel, handleSubmit, reqTypes, selectedReqType, fileTypes, selectedFileType, submitted };
  }
})
</script>

<style scoped>
.footer {
  text-align: end;
  margin-top: 3%;
}

.footer ::v-deep(.p-button) {
  width: auto;
}

.p-dropdown {
  margin-bottom: 2%;
  margin-top: 1%;
}
</style>
