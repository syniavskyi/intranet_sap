<template>
  <div class="plane-employees">
    <div class="employees-nav-and-content">
      <app-menu></app-menu>
      <div class="employees-content">
        <div class="employees-header">
          <div class="employees-header-title-and-menu">
            <img src="../../assets/images/nav/if_menu-32.png" width="32px" class="employees-header-menu">
            <p class="employees-header-title">Lista Pracowników</p>
          </div>
        </div>
        <div class="employees-table">
          <div class="emp-thead">
                <div class="emp-thead-item">{{ $t("label.fullName") }}</div>
                <div class="emp-thead-item">{{ $t("label.position") }}</div>
                <div class="emp-thead-item">{{ $t("label.department") }}</div>
                <div class="emp-thead-item">{{ $t("label.phone") }}</div>
                <div class="emp-thead-item">{{ $t("label.email") }}</div>
          </div>
          <div class="emp-tbody">
            <div class="emp-tbody-row" v-for="userInfo in getUserList">
              <div class="emp-tbody-item">
                <div class="emp-tbody-item-title"> {{ $t("label.fullName") }} </div>
                <div class="emp-tbody-item-txt"> {{ userInfo.firstName }} {{ userInfo.lastName }} </div>
              </div>
              <div class="emp-tbody-item">
                <div class="emp-tbody-item-title"> {{ $t("label.position") }} </div>
                <div class="emp-tbody-item-txt"> {{ userInfo.roleName }} </div>
              </div>
              <div class="emp-tbody-item">
                <div class="emp-tbody-item-title">{{ $t("label.department") }} </div>
                <div class="emp-tbody-item-txt"> {{ userInfo.depName }} </div>
              </div>
              <div class="emp-tbody-item">
                <div class="emp-tbody-item-title">{{ $t("label.phone") }} </div>
                <div class="emp-tbody-item-txt"> {{ userInfo.phone }} </div>
              </div>
              <div class="emp-tbody-item">
                <div class="emp-tbody-item-title">{{ $t("label.email") }} </div>
                <div class="emp-tbody-item-txt"> {{ userInfo.email }} </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
import axios from "axios";
import i18n from '../../lang/lang'
import Menu from '../Menu.vue'

  export default {
    data() {
      return {
        userInfo: {}
      }
    },
    components: {
        'app-menu': Menu
    },
    beforeCreate() {
      if (this.$store.getters.isDataLoaded === false) {
            this.$store.dispatch('loadData', localStorage.getItem('token'))
      }
    },
    computed: {
      getUserList() {
        return this.$store.getters.usersList;
      }
    }
  }
</script>

<style>

</style>
