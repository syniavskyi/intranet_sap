<template>
  <div class="plane-component" id="news">
    <div class="component-nav-and-content">
      <app-menu></app-menu>
      <div class="component-content">
        <div class="content-header">
          <div class="content-header-title-and-menu">
            <img src="../../assets/images/nav/if_menu-32.png" width="32px" class="content-header-menu">
            <p class="content-header-title">Informacje</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
</style>
<script>

import Menu from '../Menu.vue'
  export default {
    components: {
        'app-menu': Menu
    }
  }
</script>