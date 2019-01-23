<template>
  <div class="plane-component">
    <div class="component-nav-and-content">
      <app-menu v-show="displayMenu"></app-menu>
      <div class="modal-overlay" v-show="displayOverlay"></div>
      <div class="component-content">
        <div class="content-header">
          <div class="content-header-title-and-menu">
            <div @click="showMenu" class="content-header-menu">&#9776;</div>
            <p class="content-header-title">{{ $t("header.documents") }}</p>
          </div>
        </div>
        <div class="documents-page-tiles">
          <file-row :file-type="docFiles" :header-name="'header.documentsCount'"></file-row>
          <file-row :file-type="systemFiles" :header-name="'header.systemData'"></file-row>
          <file-row :file-type="officeFiles" :header-name="'header.office'"></file-row>
          <file-row :file-type="infoFiles" :header-name="'header.information'"></file-row>
          <file-row :file-type="instrFiles" :header-name="'header.instructions'"></file-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Menu from "../Menu.vue";
import i18n from "../../lang/lang";
import { mapGetters } from "vuex";
import Modal from '../dialogs/MessageLogDialog';
import FileRow from '../dialogs/FileRow';
const utils = require("../../utils");

export default {
  data() {
    return {}
  },
  computed: Object.assign(
    mapGetters({
      infoFiles: "getInfoFiles",
      docFiles: "getDocumentFiles",
      instrFiles: "getInstructionFiles",
      officeFiles: "getOfficeFiles",
      systemFiles: "getSystemFiles",
      displayMenu: "getShowMenu",
      displayOverlay: "getShowMenuOverlay"
    })
  ),
  created() {
    let oStore = this.$store;
        oStore.commit('SET_PROMISE_TO_READ', oStore.getters.getFilesToRead);
        oStore.dispatch('getData', null);
        utils.checkAuthLink(this.$router, oStore.getters.getUserAuth.ZMENU);
  },
  mounted() {
    this.$nextTick(() => {
       // calculating doucument title height to change class that will suffice lack of support for property : -webkit-line-clamp and -webkit-box in Firefox
      this.calcDocsHeight()
    });
  },
  methods: {
    showMenu(event) {
      let obj = { window, event };
      this.$store.dispatch("setSideMenu", obj);
    },
    calcDocsHeight(tiles) {
      var tiles = document.getElementsByClassName("documents-tiles-row");
      this.$store.dispatch("calcDocsHeight", tiles);
    }
  },
  components: {
    "app-menu": Menu,
    "modal": Modal,
    "file-row": FileRow
  }
};
</script>
<style>
</style>
