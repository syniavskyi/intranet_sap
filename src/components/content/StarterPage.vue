<template>
  <div class="plane-component">
    <div class="component-nav-and-content">
      <app-menu v-show="displayMenu"></app-menu>
      <div class="modal-overlay" v-show="displayOverlay"></div>
      <div class="component-content">
        <div class="content-header">
          <div class="content-header-title-and-menu">
            <div @click="showMenu" class="content-header-menu">&#9776;</div>
            <p class="content-header-title">{{ $t("header.starterPage") }}</p>
          </div>
        </div>
        <h3 class="starter-page-user-header">{{ $t("header.welcome") }}</h3>
          <div class="starter-page-lists">
            <starter-page-template :file-type="docListNew" :file-header="'label.documentListNew'" :type="'new'"></starter-page-template>
            <starter-page-template :file-type="docListInfo" :file-header="'label.documentListInfo'" :type="'info'"></starter-page-template>
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
import StarterPageTemplate from '../templates/StarterPageTemplate';
const utils = require("../../utils")

export default {
  components: {
    "app-menu": Menu,
    "modal": Modal,
    "starter-page-template": StarterPageTemplate
  },
  created() {
      this.$store.commit("SET_PROMISE_TO_READ", ["UserData", "StarterDocsInfo", "StarterDocsNew", "NewToken"]);
      this.$store.dispatch('getData', null);
      utils.checkAuthLink(this.$router, this.$store.getters.getUserAuth.ZMENU);
  },
  computed: {
    ...mapGetters({
      docListNew: "getDocListNew",
      docListInfo: "getDocListInfo",
      displayMenu: "getShowMenu",
      displayOverlay: "getShowMenuOverlay"
    })
  },
  methods: {
    ...mapActions([]),
    showMenu(event) {
      let obj = { window, event };
      this.$store.dispatch("setSideMenu", obj);
    },
  }
};
</script>

<style scoped>
</style>