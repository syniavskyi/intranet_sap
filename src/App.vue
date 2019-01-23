<template>
  <div class="display-row">
    <loader v-if="showLoader"/>
    <router-view/>
    <message-log-dialog v-show="showModal"/>
    <warning-dialog/>
    <session-end-dialog/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Menu from './components/Menu.vue'
import Loader from './components/dialogs/Loader.vue'
import MessageLogDialog from './components/dialogs/MessageLogDialog'
import WarningDialog from './components/dialogs/WarningDialog'
import SessionEndDialog from './components/dialogs/SessionEndDialog'

export default {
  name: 'App',
  components: {
    'app-menu': Menu,
    'loader': Loader,
    'message-log-dialog': MessageLogDialog,
    'warning-dialog': WarningDialog,
    'session-end-dialog': SessionEndDialog
  },
  created() {
    window.addEventListener("resize", this.showMenu)
  },
  destroyed() {
    window.removeEventListener("resize", this.showMenu)
  },
  mounted() {
    this.$nextTick(() => {
      this.showMenu();
    })
  },
  methods: {
    showMenu(event) {
      let obj = {window, event}
      this.$store.dispatch("setSideMenu", obj);
    }
  },
  computed: {
    ...mapGetters({
      showLoader: 'getDisplayLoader',
      showModal: "getShowModal"
    })
  }
}
</script>

<style>
.display-row {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
