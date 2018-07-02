<template>
  <!-- <div id="app"> -->
  <div class="display-row">
    <!-- <app-menu v-show="showMenu"/> -->
    
      <!-- <transition name="slide-top" mode="out-in"> -->
         <router-view/>
      <!-- </transition> -->
  </div>
  <!-- </div> -->
</template>

<script>
import Menu from './components/Menu.vue'
export default {
  name: 'App',
  components: {
    'app-menu': Menu
  },
  computed: {
    showMenu() {
      return this.$store.getters.showMenu
    }
  }

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
