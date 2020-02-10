<template>
  <div class="documents-tiles-row">
    <div @click.self="toggleDocTile" class="documents-tiles-row-header" aria-expanded="false">
      <i18n :path="headerName">
        <span place="number">{{ fileType.length }}</span>
        <!-- <span  place="number"> 1 </span> -->
      </i18n>
    </div>
    <div class="documents-tiles-row-content">
      <div class="documents-tile documents-tile-1-3" v-for="doc in fileType" :key="doc.FileId">
        <div class="documents-tile-header">
          <p class="documents-tile-header-title">{{ doc.Filename }}</p>
          <div class="documents-tile-underscore"></div>
        </div>
        <div class="documents-tile-content">
          <div class="documents-div">
            <a v-if="doc.Link" class="doc-file-div" :href="doc.Link" target="_blank" :title="$t('title.download')">
              <div class="doc-file-img doc-file-link" v-if="doc.Link"></div>
              <div class="doc-file-desc">{{ doc.Filename }}</div>
            </a>
            <a v-else class="doc-file-div" :href="generateLink(doc.FileId)" target="_blank" :title="$t('title.download')" >
              <div class="doc-file-img doc-file-pdf" v-if="checkFileFormat(doc.Filename) == '.pdf'"></div>
              <div
                class="doc-file-img doc-file-doc"
                v-if="checkFileFormat(doc.Filename) == '.docx' || checkFileFormat(doc.Filename) == '.doc'">
              </div>
              <div class="doc-file-img doc-file-xls" v-if="checkFileFormat(doc.Filename) == '.xls'"></div>
              <div class="doc-file-img doc-file-zip" v-if="checkFileFormat(doc.Filename) == '.zip'"></div>
              <div class="doc-file-desc">{{ doc.Filename }}</div>
            </a>
            <p :title="$t('button.delete')" @click="openConfDialog(doc)" v-if="authType !== 'OWN'" class="doc-file-delete">x</p>
          </div>
        </div>
         <confirm-file-deletion v-if="showDialog"></confirm-file-deletion>
      </div>
    </div>
  </div>
</template>
<script>
import i18n from "../../lang/lang";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import ConfirmFileDeletion from '../dialogs/ConfirmFileDeletion';
export default {
  name: "fileRow",
  props: ["file-type", "header-name"],
  data() {
    return {
      closed: "true",
      authType: this.$store.getters.getUserAuth.ZPROF_ATCV
    }
  },
  components: {
      'confirm-file-deletion': ConfirmFileDeletion,

  },
  computed: {
    ...mapGetters({
      displayMenu: "getShowMenu",
      displayOverlay: "getShowMenuOverlay",
      showDialog: "getShowFileConfDialog"
    })
  },
  methods: {
    ...mapActions(["deleteFile"]),
    checkFileFormat(name) {
      return name.slice(name.lastIndexOf(".")).toLowerCase()
    },
    generateLink(file) {
      let url = `${window.location.origin}/api/sap/opu/odata/sap/ZGW_INTRANET_SRV/AttachmentMedias(FileId='${file}',Language='PL',UserAlias='')/$value?c=${this.$store.getters.getCookie}`
      return url
    },
    toggleDocTile(evt) {
      if (evt.target.getAttribute("aria-expanded") === "false") {
        evt.target.setAttribute("aria-expanded", true);
        this.closed = true;
      } else evt.target.setAttribute("aria-expanded", false);
      let el = evt.target.nextElementSibling,
        elChild = evt.target.nextElementSibling;
      const name = { el, elChild };
      this.$store.dispatch("toggleDocTile", name);
    },
    openConfDialog(doc) {
      this.$store.commit('SET_DOC_TO_DELETE', doc)
      this.$store.commit('SET_SHOW_FILE_CONF_DIALOG', true)
    }
  }
}
</script>
