<template>
  <div class="plane-component">
    <div class="component-nav-and-content">
      <app-menu v-show="displayMenu"></app-menu>
      <div class="modal-overlay" v-show="displayOverlay"></div>
      <div class="component-content">
        <div class="content-header">
          <div class="content-header-title-and-menu">
            <img src="../../assets/images/nav/if_menu-32.png" width="32px" class="content-header-menu">
            <p class="content-header-title">{{ $t("header.starterPage") }}</p>
          </div>
        </div>
        <h3 class="starter-page-user-header">{{ $t("header.welcome") }}</h3>
          <div class="starter-page-lists">
            <div class="starter-page-list" v-if="docListNew && docListNew.length !== 0">
              <div class="starter-page-list-header">
                <p class="starter-page-list-title">{{ $t("label.documentListNew") }}</p>
              </div>
              <div class="starter-page-list-content">
                <ul class="starter-page-ul">
                  <li class="starter-page-item" v-for="list in docListNew" :key="list.FileId">
                    <div class="starter-page-list-item-btns">
                      <a class="starter-page-file-btn" v-if="list.Filename.includes('http')" :title="$t('title.download')" target="_blank" :href="list.Filename">&#x21e3;</a>
                      <a class="starter-page-file-btn" v-else :title="$t('title.download')" target="_blank" :href="generateLinks(list.FileId)">&#x21e3;</a>
                      <div v-if="checkFileFormat(list.Filename) == '.pdf'">
                        <p class="starter-page-pdf">{{checkFileFormat(list.Filename)}}</p>
                      </div>
                      <div v-if="checkFileFormat(list.Filename) == '.doc' || checkFileFormat(list.Filename) == '.docx'">
                        <p class="starter-page-docx">{{checkFileFormat(list.Filename)}}</p>
                      </div>
                      <div v-if="list.Filename.includes('http')">
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
                      <input class="starter-page-checkbox" :checked="list.Status" @change="changeCheckboxForNew(list)" type="checkbox">
                      <div class="checkbox-in"></div>
                    </label>
                  </li>
                </ul>
                <div class="starter-page-list-bottom">
                  <button class="starter-page-docs-btn button" :disabled="setButtonNew" @click="removeNewFile">{{ $t("button.documentComplete") }}</button>
                </div>
              </div>
            </div>
            <div class="starter-page-list" v-if="docListInfo && docListInfo.length !== 0">
              <div class="starter-page-list-header">
                <p class="starter-page-list-title">{{ $t("label.documentListInfo") }}</p>
              </div>
              <div class="starter-page-list-content">
                <ul class="starter-page-ul">
                  <li class="starter-page-item" v-for="list in docListInfo" :key="list.FileId">
                    <div class="starter-page-list-item-btns">
                      <a class="starter-page-file-btn" v-if="list.Filename.includes('http')" :title="$t('title.download')" target="_blank" :href="list.Filename">&#x21e3;</a>
                      <a class="starter-page-file-btn" v-else :title="$t('title.download')" target="_blank" :href="generateLinks(list.FileId)">&#x21e3;</a>
                      <div v-if="checkFileFormat(list.Filename) == '.pdf'">
                        <p class="starter-page-pdf"> {{checkFileFormat(list.Filename)}}</p>
                      </div>
                      <div v-if="checkFileFormat(list.Filename) == '.doc' || checkFileFormat(list.Filename) == '.docx'">
                        <p class="starter-page-docx">{{checkFileFormat(list.Filename)}} </p>
                      </div>
                       <div v-if="list.Filename.includes('http')">
                        <p class="starter-page-link"> .link </p>
                      </div>
                    </div>
                    <div class="starter-page-list-item-wrapper">
                      <div class="starter-page-item-text" :class="list.Status ? 'line-through' : 'none'">
                        {{ list.FileId }}
                        <p class="starter-list-item-popover">{{ list.Filename }}</p>
                      </div>
                    </div>
                    <label class="checkbox-wrap starter-page-checkbox">
                      <input :checked="list.Status" @change="changeCheckboxInfo(list)" type="checkbox">
                      <div class="checkbox-in"></div>
                    </label>
                  </li>
                </ul>
                <div class="starter-page-list-bottom">
                  <button class="starter-page-docs-btn button" :disabled="setButtonInfo" @click="removeInfoFile">{{ $t("button.documentComplete") }}</button>
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
import { mapGetters, mapActions } from "vuex";
import Modal from '../dialogs/MessageLogDialog';
const utils = require("../../utils")

export default {
  data() {
    return {
      listOfDoc: []
    };
  },
  components: {
    "app-menu": Menu,
    "modal": Modal
  },
  created() {
      this.$store.commit("SET_PROMISE_TO_READ", ["UserData", "StarterDocsInfo", "StarterDocsNew"]);
      this.$store.dispatch('getData', null);
      utils.checkAuthLink(this.$router, this.$store.getters.getUserAuth.ZMENU);
  },
  computed: {
    ...mapGetters({
      setButtonNew: "getButtonStateNew",
      setButtonInfo: "getButtonStateInfo",
      docListNew: "getDocListNew",
      docListInfo: "getDocListInfo",
      displayMenu: "getShowMenu",
      displayOverlay: "getShowMenuOverlay"
    })
  },
  methods: {
    ...mapActions([
      "checkListForNew",
      "checkListForInfo",
      "checkFileFormat",
      "editSingleNewDoc",
      "deleteNewFile",
      "deleteInfoFile"
    ]),
    // add css to checkbox
    changeCheckboxForNew(data) {
      if (data.Status === undefined) {
        data["status"] = true;
      } else {
        data.Status = !data.Status;
      }
      this.editSingleNewDoc(data);
      this.checkListForNew(this.docListNew);
    },
    changeCheckboxInfo(data) {
      if (data.Status === undefined) {
        data["status"] = true;
      } else {
        data.Status = !data.Status;
      }
      this.editSingleNewDoc(data);
      this.checkListForInfo(this.docListInfo);
    },
    // format file name to display file format
    checkFileFormat(name) {
      return name.slice(name.lastIndexOf("."));
    },
    generateLinks(file) {
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
    removeNewFile() {
      this.deleteNewFile();
      this.$store.commit('SET_BUTTON_STATE_NEW', true);

    },
    removeInfoFile() {
      this.deleteInfoFile();
      this.$store.commit('SET_BUTTON_STATE_INFO', true);
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