<template>
  <div class="p-fluid">
    <div v-if="isCategory">
      <label for="reqType">{{ t('reqType') }}</label>
      <Dropdown id="reqType" v-model="selectedReqType" :options="reqTypes" optionLabel="name" :required="true" />
    </div>
    <label for="fileType">{{ t('fileType') }}</label>
    <Dropdown id="fileType" v-model="selectedFileType" :options="fileTypes" optionLabel="name" :required="true" />
    <label for="tagHead">{{ t('tagHeader') }}</label>
    <InputSwitch inputId="tagHead" v-model="checked" />
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
import InputSwitch from 'primevue/inputswitch';

export default defineComponent({
    name: "ExportPopup",
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
            default: "",
        },
        isCategory: {
            type: Boolean,
            required: false,
            default: true,
        },
        onCancel: Function as PropType<(x: string) => void>,
        onSave: Function as PropType<(x: string) => void>, /* workaround for typing custom events */
    },
    emits: ["cancel", "save"],
    setup: ({ id, categoryName, realizedRequirements, activeRequirements, isCategory }, { emit }) => {
        const { t } = useI18n({ useScope: "global" });
        const selectedReqType = ref({ name: t("exportRequirementsAll"), code: "ALL" });
        const submitted = ref(false);
        const checked = ref(false);
        const realized = realizedRequirements as Array<Requirement>;
        const active = activeRequirements as Array<Requirement>;
        const reqTypes = ref([
            { name: t("exportRequirementsAll"), code: "ALL" },
            { name: t("exportRequirementsActive"), code: "ACTIVE" },
            { name: t("exportRequirementsCompleted"), code: "COMPLETE" }
        ]);
        const selectedFileType = ref({ name: t("exportRequirementsPdf"), code: "PDF" });
        const fileTypes = ref([
            { name: t("exportRequirementsPdf"), code: "PDF" },
            { name: t("exportRequirementsTex"), code: "TEX" }
        ]);
        const cancel = () => {
            emit("cancel");
        };
        const handleSubmit = () => {
            submitted.value = true;
            let chosenType = selectedReqType.value.code;
            let chosenFileType = selectedFileType.value.code;
            if (chosenFileType == "PDF") {
                handlePdf(chosenType, checked.value);
            }
            else {
                handleTex(chosenType, checked.value);
            }
            emit("save");
        };
        function handlePdf(chosenType: string, isTagged: boolean) {
            if (isCategory) {
                switch (chosenType) {
                    case "ALL":
                        exportRequirementsPdf(true, true, isTagged);
                        break;
                    case "ACTIVE":
                        exportRequirementsPdf(false, false, isTagged);
                        break;
                    case "COMPLETE":
                        exportRequirementsPdf(true, false, isTagged);
                        break;
                }
            }
            else {
                exportRequirementsPdf(false, false, isTagged);
            }
        }
        function handleTex(chosenType: string, isTagged:boolean) {
            if (isCategory) {
                switch (chosenType) {
                    case "ALL":
                        exportRequirementsTex(true, true,isTagged);
                        break;
                    case "ACTIVE":
                        exportRequirementsTex(false, false,isTagged);
                        break;
                    case "COMPLETE":
                        exportRequirementsTex(true, false,isTagged);
                        break;
                }
            }
            else {
                exportRequirementsTex(false, false,isTagged);
            }
        }
        const exportRequirementsTex = (isCompleted: boolean, all: boolean, isTagged: boolean) => {
            console.log("Export TeX started...");
            let key = isCategory ? "headerExportCatActive" : "headerExportRequirement";
            let fileName = isCategory ? "active_requirements" + "_" + id + ".tex" : "requirement" + "_" + id + ".tex";
            let reqList = active;
            if (all) {
                key = "headerExportCatAll";
                fileName = "requirements" + "_" + id + ".tex";
                reqList = realized.concat(active);
            }
            else {
                if (isCompleted) {
                    key = "headerExportCatComplete";
                    fileName = "completed_requirements" + "_" + id + ".tex";
                    reqList = realized;
                }
            }
            const texString = getTexString(reqList, key, isTagged);
            downloadTex(texString, fileName);
            console.log("Export TeX finished");
        };
        function getTexString(reqList: Requirement[], key: string, isTagged: boolean) {
            // create map filtered by tags
            var tagged: Map<string, Requirement[]>;
            var uncat: Requirement[];
            if(isTagged){
              tagged = getFilteredTagRequirements(reqList);
              uncat = getUncatRequirements(reqList);
            } else {
              tagged = new Map([]);;
              uncat = reqList;
            }

            // strings for the latex Itemize
            const header = "\\subsection*{" + t(key) + " " + categoryName + "}";
            const beginItemize = "\n\\begin{itemize}\n";
            const endItemize = "\n\\end{itemize}";
            // bodys of the latex itemize
            let texString = header;
            if (uncat.length != 0) {
                var bodyUncat = "";
                for (let i = 0; i < uncat.length; i++) {
                    let name = makeTexCompatible(uncat[i].name, true);
                    let description = makeTexCompatible(uncat[i].description, false);
                    bodyUncat += "\t\\item \\textbf{" + name + ":} " + description + "\n";
                }
                texString += beginItemize + bodyUncat + endItemize;
            }
            tagged.forEach((reqs: Requirement[], key: string) => {
                var bod = "";
                for (let i = 0; i < reqs.length; i++) {
                    let name = makeTexCompatible(reqs[i].name, true);
                    let description = makeTexCompatible(reqs[i].description, false);
                    bod += "\t\\item \\textbf{" + name + ":} " + description + "\n";
                }
                texString += "\\paragraph{" + key + ":}" + beginItemize + bod + endItemize;
            });
            return texString;
        }
        function makeTexCompatible(text: string, name: boolean) {
            text = text.split("\\\\").join("\\textbackslash ");
            if (name) {
                text = text.split("\\").join("\\textbackslash ");
            }
            text = text.split("{").join("\\{");
            text = text.split("}").join("\\}");
            text = text.split("<").join("\\textless");
            text = text.split(">").join("\\textgreater");
            text = text.split("%").join("\\%");
            text = text.split("$").join("\\$");
            text = text.split("&").join("\\&");
            text = text.split("#").join("\\#");
            text = text.split("|").join("\\textbar");
            text = text.split("–").join("\\textendash");
            text = text.split("¿").join("\\textquestiondown");
            return text;
        }
        function downloadTex(texString: string, fileName: string) {
            let content = new Blob([texString], { type: "text/plain" });
            let saveFile = new File([content], fileName);
            const objUrl = URL.createObjectURL(saveFile);
            const atag = document.createElement("a");
            atag.setAttribute("href", objUrl);
            atag.setAttribute("download", fileName);
            atag.click();
        }
        function getFilteredTagRequirements(reqs: Array<Requirement>) {
            var filtered = new Map<string, Requirement[]>();
            reqs.forEach((req: Requirement) => {
                if (req.tags && req.tags.length != 0) {
                    if (filtered.has(req.tags[0].name)) {
                        let reqList = filtered.get(req.tags[0].name);
                        reqList?.push(req);
                        filtered.set(req.tags[0].name, reqList!);
                    }
                    else {
                        filtered.set(req.tags[0].name, [req]);
                    }
                }
            });
            return filtered;
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
        const exportRequirementsPdf = (isCompleted: boolean, all: boolean, isTagged: boolean) => {
            console.log("Export PDF started...");
            let bodUncat = [[{ text: t("formTitle"), bold: true }, { text: t("formDesc"), bold: true }]];
            let header = isCategory ? { text: t("headerExportCatActive") + " " + categoryName + ":\n\n", style: "header" } :
                { text: t("headerExportRequirement") + " " + categoryName + ":\n\n", style: "header" };
            let fileName = isCategory ? "active_requirements" + "_" + id + ".pdf" : "requirement" + "_" + id + ".pdf";
            let reqList = active;
            if (all) {
                header = { text: t("headerExportCatAll") + " " + categoryName + ":\n\n", style: "header" };
                fileName = "requirements" + "_" + id + ".pdf";
                reqList = realized.concat(active);
            }
            else {
                if (isCompleted) {
                    header = { text: t("headerExportCatComplete") + " " + categoryName + ":\n\n", style: "header" };
                    fileName = "completed_requirements" + "_" + id + ".pdf";
                    reqList = realized;
                }
            }
            // create seperated lists for tags
            var tagged: Map<string, Requirement[]>;
            var uncat: Requirement[];
            if(isTagged){
              tagged = getFilteredTagRequirements(reqList);
              uncat = getUncatRequirements(reqList);
            } else {
              tagged = new Map([]);;
              uncat = reqList;
            }
            interface IpdfEl {
                head: {
                    text: string;
                    fontSize: number;
                    bold: boolean;
                    margin: number[];
                };
                bod: {
                    text: string;
                    bold: boolean;
                }[][];
            }
            ;
            var pdfElements: IpdfEl[] = [];
            tagged.forEach((reqs: Requirement[], key: string) => {
                let head = { text: key + ":", fontSize: 14, bold: true, margin: [0, 10, 0, 5] };
                let bod = [[{ text: t("formTitle"), bold: true }, { text: t("formDesc"), bold: true }]];
                for (let i = 0; i < reqs.length; i++) {
                    bod.push([{ text: reqs[i].name.split("\\\\").join("\\"), bold: false }, { text: reqs[i].description.split("\\\\").join("\\"), bold: false }]);
                }
                pdfElements.push({ head, bod });
            });
            uncat.forEach((req: Requirement) => {
                bodUncat.push([{ text: req.name.split("\\\\").join("\\"), bold: false }, { text: req.description.split("\\\\").join("\\"), bold: false }]);
            });
            var docDefinition = {
                content: [
                    header,
                    uncat.length != 0 ?
                        {
                            layout: {
                                hLineColor: function (i, node) {
                                    return (i === 0 || i === node.table.body.length || i == 1) ? "black" : "gray";
                                },
                                vLineColor: function (i, node) {
                                    return (i === 0 || i === node.table.widths.length) ? "black" : "gray";
                                }
                            },
                            table: {
                                headerRows: 1,
                                widths: [100, "*"],
                                body: bodUncat
                            }
                        } : undefined,
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true
                    }
                }
            };
            pdfElements.forEach((el: {
                head: {
                    text: string;
                    fontSize: number;
                    bold: boolean;
                    margin: number[];
                };
                bod: {
                    text: string;
                    bold: boolean;
                }[][];
            }) => {
                docDefinition.content.push(el.head, {
                    layout: {
                        hLineColor: function (i, node) {
                            return (i === 0 || i === node.table.body.length || i == 1) ? "black" : "gray";
                        },
                        vLineColor: function (i, node) {
                            return (i === 0 || i === node.table.widths.length) ? "black" : "gray";
                        }
                    },
                    table: {
                        headerRows: 1,
                        widths: [100, "*"],
                        body: el.bod
                    }
                });
            });
            pdfmake.createPdf(docDefinition, {}, {
                // Default font should still be available
                Roboto: {
                    normal: "Roboto-Regular.ttf",
                    bold: "Roboto-Medium.ttf",
                    italics: "Roboto-Italic.ttf",
                    bolditalics: "Roboto-Italic.ttf"
                },
                // Make sure you define all 4 components - normal, bold, italics, bolditalics - (even if they all point to the same font file)
                TimesNewRoman: {
                    normal: "Times-New-Roman-Regular.ttf",
                    bold: "Times-New-Roman-Bold.ttf",
                    italics: "Times-New-Roman-Italics.ttf",
                    bolditalics: "Times-New-Roman-Italics.ttf"
                }
            }, pdfFonts.pdfMake.vfs).download(fileName);
            console.log("Export PDF finished");
        };
        return { t, cancel, handleSubmit, reqTypes, selectedReqType, fileTypes, selectedFileType, submitted, checked };
    },
    components: { InputSwitch }
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
.p-inputswitch{
  margin-left: 5%;
  margin-top: 1%;
}
</style>
