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
import * as pdfMake from "pdfmake/build/pdfmake";
import { Requirement } from '@/types/bazaar-api';
import { defineComponent, PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n';
import Dropdown from 'primevue/dropdown';

import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

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
      var chosenType = selectedReqType.value.code;
      var chosenFileType = selectedFileType.value.code;

      if (chosenFileType == "PDF") {
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
      } else {
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

      emit('save');
    }

    const exportRequirementsTex = (isCompleted: boolean, all: boolean) => {
      console.log('Export TeX started...');
      if (all) {
        var key = 'headerExportCatAll';
        var fileName = "requirements" + "_" + id + ".tex";
        var reqList = realized.concat(active);
      } else {
        if (isCompleted) {
          var key = 'headerExportCatComplete';
          var fileName = "completed_requirements" + "_" + id + ".tex";
          var reqList = realized;
        } else {
          var key = isCategory ? 'headerExportCatActive' : "headerExportRequirement";
          var fileName = isCategory ? "active_requirements" + "_" + id + ".tex" : "requirement" + "_" + id + ".tex";
          var reqList = active;
        }
      }
      // strings for the latex Itemize
      const setupItemize = t(key) + " " + categoryName + ':\n\\begin{itemize}\n';
      const endItemize = '\n\\end{itemize}';

      // body of the latex itemize
      var body = '';
      for (let i = 0; i < reqList.length; i++) {
        let name = makeTexCompatible(reqList[i].name, true)
        let description = makeTexCompatible(reqList[i].description, false);
        body += '\t\\item \\textbf\{' + name + ':\} ' + description + '\n';
      }
      let texString = setupItemize + body + endItemize;
      downloadTex(texString, fileName);
      console.log('Export TeX finished');
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
      atag.click()
    }

    const exportRequirementsPdf = (isCompleted: boolean, all: boolean) => {
      console.log('Export PDF started...');
      var bod = [[{ text: t('formTitle'), bold: true }, { text: t('formDesc'), bold: true }]];
      if (all) {
        var header = { text: t('headerExportCatAll') + " " + categoryName + ":\n\n", style: 'header' };
        var fileName = "requirements" + "_" + id + ".pdf";
        var reqList = realized.concat(active);
      } else {
        if (isCompleted) {
          var header = { text: t('headerExportCatComplete') + " " + categoryName + ":\n\n", style: 'header' };
          var fileName = "completed_requirements" + "_" + id + ".pdf";
          var reqList = realized;
        } else {
          var header = isCategory ? { text: t('headerExportCatActive') + " " + categoryName + ":\n\n", style: 'header' } :
            { text: t('headerExportRequirement') + " " + categoryName + ":\n\n", style: 'header' };
          var fileName = isCategory ? "active_requirements" + "_" + id + ".pdf" : "requirement" + "_" + id + ".pdf";
          var reqList = active;
        }
      }
      for (let i = 0; i < reqList.length; i++) {
        bod.push([{ text: reqList[i].name.split('\\\\').join('\\'), bold: false },
        { text: reqList[i].description.split('\\\\').join('\\'), bold: false }]);
      }
      var docDefinition = {
        content: [
          header,
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
              body: bod
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
