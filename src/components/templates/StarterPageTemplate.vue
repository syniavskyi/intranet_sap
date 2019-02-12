<template>
 <div class="starter-page-list" v-if="fileType && fileType.length !== 0">
  <div class="starter-page-list-header">
    <p class="starter-page-list-title">{{ $t(fileHeader) }}</p>
  </div>
  <div class="starter-page-list-content">
    <ul class="starter-page-ul">
      <li class="starter-page-item" v-for="list in fileType" :key="list.FileId">
         <div class="starter-page-list-item-btns">
            <a class="starter-page-file-btn" v-if="list.Link" :title="$t('title.download')" target="_blank" :href="list.Link">&#x21e3;</a>
            <a class="starter-page-file-btn" v-else :title="$t('title.download')" target="_blank" :href="generateLinks(list.FileId)">&#x21e3;</a>
            <div v-if="checkFileFormat(list.Filename.toLowerCase()) == '.pdf'">
                <p class="starter-page-pdf">{{checkFileFormat(list.Filename).toLowerCase()}}</p>
            </div>
            <div v-if="checkFileFormat(list.Filename) == '.doc' || checkFileFormat(list.Filename) == '.docx'">
                 <p class="starter-page-docx">{{checkFileFormat(list.Filename)}}</p>
            </div>
            <div v-if="list.Link !== ''">
                <p class="starter-page-link"> .link </p>
            </div>
         </div>
         <div class="starter-page-list-item-wrapper">
            <div class="starter-page-item-text" :class="list.Status ? 'line-through' : 'none'">
                {{ list.Filename }}
                <p class="starter-list-item-popover">{{ list.FileId }}</p>
            </div>
         </div>
            <label class="checkbox-wrap starter-page-checkbox">
                <input v-if="type==='new'" class="starter-page-checkbox" :checked="list.Status" @change="changeCheckboxForNew(list)" type="checkbox">
                <input v-if="type==='info'" class="starter-page-checkbox" :checked="list.Status" @change="changeCheckboxForInfo(list)" type="checkbox">
                <div class="checkbox-in"></div>
            </label>
        </li>
     </ul>
  <div class="starter-page-list-bottom">
    <button v-if="type==='new'" class="starter-page-docs-btn button" :disabled="this.$store.getters.getDocListNew.find(o => o.Status === false)" @click="removeNewFile">{{ $t("button.documentComplete") }}</button>
    <button v-if="type==='info'" class="starter-page-docs-btn button" :disabled="this.$store.getters.getDocListInfo.find(o => o.Status === false)" @click="removeInfoFile">{{ $t("button.documentComplete") }}</button>
  </div>
  </div>
 </div>
</template>

<script>
import i18n from "../../lang/lang";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "starterPageTemplate",
  props: ['file-type', 'file-header', 'type'],
  methods: {
    ...mapActions([
      "checkFileFormat",
      "editSingleNewDoc",
      "deleteNewFile",
      "deleteInfoFile"
    ]),
    showMenu(event) {
      this.$store.commit('SET_MENU_CLICKED', true)
      let obj = { window, event };
      this.$store.dispatch("setSideMenu", obj);
    },
    // add css to checkbox
    changeCheckboxForNew(data) {
      if (data.Status === undefined) {
        data["status"] = true;
      } else {
        data.Status = !data.Status;
      }
      this.editSingleNewDoc(data);
    },
    changeCheckboxForInfo(data) {
      if (data.Status === undefined) {
        data["status"] = true;
      } else {
        data.Status = !data.Status;
      }
      this.editSingleNewDoc(data);
    },
    // format file name to display file format
    checkFileFormat(name) {
      return name.slice(name.lastIndexOf("."));
    },
    generateLinks(file) {
      let url = `${window.location.origin}/api/sap/opu/odata/sap/ZGW_INTRANET_SRV/AttachmentMedias(FileId='${file}',Language='PL',UserAlias='')/$value?c=${this.$store.getters.getCookie}`
      return url;
    },
    removeNewFile() {
      this.deleteNewFile();
      // this.$store.commit('SET_BUTTON_STATE_NEW', true);
    },
    removeInfoFile() {
      this.deleteInfoFile();
      
      // this.$store.commit('SET_BUTTON_STATE_INFO', true);
    }
  }
};
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
  color: grey;
}
.none {
  text-decoration: none;
}
</style>