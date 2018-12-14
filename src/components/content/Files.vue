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

          <div class="documents-tiles-row">
            <div @click.self="toggleDocTile" aria-expanded="false" class="documents-tiles-row-header">{{ $t("header.documents") }}</div>
            <div class="documents-tiles-row-content">
              <div class="documents-tile documents-tile-1-3" v-for="doc in docFiles" :key="doc.FileId">
                <div class="documents-tile-header">
                  <p class="documents-tile-header-title">{{ doc.Filename }}</p>
                  <div class="documents-tile-underscore"></div>
                </div>
                <div class="documents-tile-content">
                  <div class="documents-div">
                    <a class="doc-file-div" :href="generateLink(doc.FileId)" target="_blank" title="ściągnij">
                      <div class="doc-file-img doc-file-pdf" v-if="checkFileFormat(doc.Filename) == '.pdf'"></div>
                      <div class="doc-file-img doc-file-doc" v-if="checkFileFormat(doc.Filename) == '.docx' || checkFileFormat(doc.Filename) == '.doc'"></div>
                      <div class="doc-file-img doc-file-xls" v-if="checkFileFormat(doc.Filename) == '.xls'"></div>
                      <div class="doc-file-img doc-file-zip" v-if="checkFileFormat(doc.Filename) == '.zip'"></div>
                      <div class="doc-file-desc">{{ doc.Filename }}</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="documents-tiles-row">
            <div @click.self="toggleDocTile" class="documents-tiles-row-header" aria-expanded="false">{{ $t("header.systemData")}}</div>
            <div class="documents-tiles-row-content">
              <div class="documents-tile documents-tile-1-3" v-for="doc in systemFiles" :key="doc.FileId">
                <div class="documents-tile-header">
                  <p class="documents-tile-header-title">{{ doc.Filename }}</p>
                  <div class="documents-tile-underscore"></div>
                </div>
                <div class="documents-tile-content">
                  <div class="documents-div">
                    <a class="doc-file-div" :href="generateLink(doc.FileId)" target="_blank" title="ściągnij">
                      <div class="doc-file-img doc-file-pdf" v-if="checkFileFormat(doc.Filename) == '.pdf'"></div>
                      <div class="doc-file-img doc-file-doc" v-if="checkFileFormat(doc.Filename) == '.docx' || checkFileFormat(doc.Filename) == '.doc'"></div>
                      <div class="doc-file-img doc-file-xls" v-if="checkFileFormat(doc.Filename) == '.xls'"></div>
                      <div class="doc-file-img doc-file-zip" v-if="checkFileFormat(doc.Filename) == '.zip'"></div>
                      <div class="doc-file-desc">{{ doc.Filename }}</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="documents-tiles-row">
            <div @click.self="toggleDocTile" class="documents-tiles-row-header" aria-expanded="false">{{ $t("header.office") }}</div>
            <div class="documents-tiles-row-content">
              <div class="documents-tile documents-tile-1-3" v-for="doc in officeFiles" :key="doc.FileId">
                <div class="documents-tile-header">
                  <p class="documents-tile-header-title">{{ doc.Filename }}</p>
                  <div class="documents-tile-underscore"></div>
                </div>
                <div class="documents-tile-content">
                 <div class="documents-div">
                    <a class="doc-file-div" :href="generateLink(doc.FileId)" target="_blank" title="ściągnij">
                      <div class="doc-file-img doc-file-pdf" v-if="checkFileFormat(doc.Filename) == '.pdf'"></div>
                      <div class="doc-file-img doc-file-doc" v-if="checkFileFormat(doc.Filename) == '.docx' || checkFileFormat(doc.Filename) == '.doc'"></div>
                      <div class="doc-file-img doc-file-xls" v-if="checkFileFormat(doc.Filename) == '.xls'"></div>
                      <div class="doc-file-img doc-file-zip" v-if="checkFileFormat(doc.Filename) == '.zip'"></div>
                      <div class="doc-file-desc">{{ doc.Filename }}</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="documents-tiles-row">
            <div @click.self="toggleDocTile" class="documents-tiles-row-header" aria-expanded="false">{{ $t("header.information") }}</div>
            <div class="documents-tiles-row-content">
              <div class="documents-tile documents-tile-1-3" v-for="doc in infoFiles" :key="doc.FileId">
                <div class="documents-tile-header">
                  <p class="documents-tile-header-title">{{ doc.Filename }}</p>
                  <div class="documents-tile-underscore"></div>
                </div>
                <div class="documents-tile-content">
                 <div class="documents-div">
                    <a class="doc-file-div" :href="generateLink(doc.FileId)" target="_blank" title="ściągnij">
                      <div class="doc-file-img doc-file-pdf" v-if="checkFileFormat(doc.Filename) == '.pdf'"></div>
                      <div class="doc-file-img doc-file-doc" v-if="checkFileFormat(doc.Filename) == '.docx' || checkFileFormat(doc.Filename) == '.doc'"></div>
                      <div class="doc-file-img doc-file-xls" v-if="checkFileFormat(doc.Filename) == '.xls'"></div>
                      <div class="doc-file-img doc-file-zip" v-if="checkFileFormat(doc.Filename) == '.zip'"></div>
                      <div class="doc-file-desc">{{ doc.Filename }}</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="documents-tiles-row">
            <div @click.self="toggleDocTile" class="documents-tiles-row-header" aria-expanded="false">{{ $t("header.instructions") }}</div>
            <div class="documents-tiles-row-content">
              <div class="documents-tile documents-tile-1-3" v-for="doc in instrFiles" :key="doc.FileId">
                <div class="documents-tile-header">
                  <p class="documents-tile-header-title">{{ doc.Filename }}</p>
                  <div class="documents-tile-underscore"></div>
                </div>
                <div class="documents-tile-content">
                 <div class="documents-div">
                    <a class="doc-file-div" :href="generateLink(doc.FileId)" target="_blank" title="ściągnij">
                      <div class="doc-file-img doc-file-pdf" v-if="checkFileFormat(doc.Filename) == '.pdf'"></div>
                      <div class="doc-file-img doc-file-doc" v-if="checkFileFormat(doc.Filename) == '.docx' || checkFileFormat(doc.Filename) == '.doc'"></div>
                      <div class="doc-file-img doc-file-xls" v-if="checkFileFormat(doc.Filename) == '.xls'"></div>
                      <div class="doc-file-img doc-file-zip" v-if="checkFileFormat(doc.Filename) == '.zip'"></div>
                      <div class="doc-file-desc">{{ doc.Filename }}</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
const utils = require("../../utils");

export default {
  data() {
    return {
      closed: "true"
    }
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
    this.$nextTick(this.calcDocsHeight().then(height => {}));
  },
  methods: {
    showMenu(event) {
      let obj = { window, event };
      this.$store.dispatch("setSideMenu", obj);
    },
    checkFileFormat(name) {
      return name.slice(name.lastIndexOf(".")).toLowerCase();
    },
    generateLink(file) {
      let url =
        window.location.origin + "/api/sap/opu/odata/sap/ZGW_INTRANET_SRV/AttachmentMedias(FileId='" +
        file +
        "',Language='" +
        "PL" +
        "',UserAlias='" +
        "" +
        "')/$value?c=" + this.$store.getters.getCookie;
      return url;
    },
    toggleDocTile(evt, target) {
      if (evt.target.getAttribute("aria-expanded") === "false") {
        evt.target.setAttribute("aria-expanded", true);
        this.closed = true;
      } else evt.target.setAttribute("aria-expanded", false);
      let el = evt.target.nextElementSibling,
        elChild = evt.target.nextElementSibling;
      const name = { el, elChild };
      this.$store.dispatch("toggleDocTile", name);
    },
    calcDocsHeight(tiles) {
      var tiles = document.getElementsByClassName("documents-tiles-row");
      this.$store.dispatch("calcDocsHeight", tiles);
    }
  },
  components: {
    "app-menu": Menu,
    "modal": Modal
  }
};
</script>
<style>
</style>
