<template>
  <!-- <div id="app"> -->
  <div class="display-row" style="position: relative">
    <!-- <app-menu v-show="showMenu"/> -->
    <loader v-if="showLoader"></loader>
    <router-view/>
    <modal v-show="showModal"/>
    <warning-dialog></warning-dialog>
  </div>
  <!-- </div> -->
</template>

<script>
import Menu from './components/Menu.vue'
import Loader from './components/dialogs/Loader.vue'
import Modal from './components/dialogs/MessageLogDialog'
import WarningDialog from './components/dialogs/WarningDialog'
import { mapGetters } from 'vuex';
export default {
  name: 'App',
  components: {
    'app-menu': Menu,
    'loader': Loader,
    'modal': Modal,
    'warning-dialog': WarningDialog
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
  computed: Object.assign(
    mapGetters({
      showLoader: 'getDisplayLoader',
      // messageLog: "getMessageLog",
      showModal: "getShowModal"
    })
  )

}
</script>

<style>
.display-row {
  display: flex;
  width: 100%;
  height: 100%;
}
.slide-top-enter-active {
  transition: all .3s ease;

}

.slide-top-leave-active {
  transition: all .2s ease;
}
.slide-top-enter {
  transform: translateY(-50px);
  opacity: 0;
}
.slide-top-leave-to {
 transform: translateY(-50px);
  opacity: 0;
}

.menu-popover-enter,
.menu-popover-leave-to {
  opacity: 0;
  transform: rotateY(50deg);
}
.menu-popover-enter-to,
.menu-popover-leave {
  opacity: 1;
  transform: rotateY(0deg);
}
.menu-popover-enter-active,
.menu-popover-leave-active {
  transition: opacity, transform 200ms ease-out;
}


</style>
