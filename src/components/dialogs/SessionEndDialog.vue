<template>
  <div>
    <div v-if="sessionStatus" class="modal-overlay"/>
    <div v-if="sessionStatus" class="modal-s modal-leave-page">
      <h1 class="leave-page-header">{{ $t("header.sessionEnd") }}</h1>
      <p class="leave-page-info">{{ $t("message.sessionEndInfo") }}</p>
      <div class="leave-buttons">
        <button class="leave-page-btn func-btnm" @click="afterClickLogout">OK</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import i18n from "../../lang/lang";
export default {
  computed: {
    ...mapGetters({
      sessionStatus: "getSessionStatus"
    })
  },
  methods: {
    afterClickLogout() {
      this.$store.commit("SET_SESSION_LOGOUT", false);
      this.$store.dispatch("logout");
      location.reload();
    }
  }
};
</script>