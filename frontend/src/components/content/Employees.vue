<template>
  <div class="plane-component">
    <div class="component-nav-and-content">
      <app-menu></app-menu>
      <div class="component-content">
        <div class="content-header">
          <div class="content-header-title-and-menu">
            <img src="../../assets/images/nav/if_menu-32.png" width="32px" class="content-header-menu">
            <p class="content-header-title">Lista Pracowników</p>
          </div>
        </div>
        <div id="searchEmployee">
          <p>Wpisz imię lub nazwisko</p>
          <input v-model="aFilters.user"/>
          <p>Lub wybierz dział</p>
          <div class="ava-div-select-cool">
                    <select required class="ava-select-cool" v-model="aFilters.department">
                        <option v-for="department in departmentList" :key="department.Key" :value="department.Value">{{ department.Value }}</option>
                    </select>
                      <label class="ava-select-label-cool">{{ $t("label.branch") }}</label>
          </div>
          <button @click="clearFilters">Wyczyść</button>
        </div>
        <div class="employees-table">
          <div class="emp-thead">
                <div class="emp-thead-item">{{ $t("label.fullName") }}</div>
                <div class="emp-thead-item">{{ $t("label.branch") }}</div>
                <div class="emp-thead-item">{{ $t("label.department") }}</div>
                <div class="emp-thead-item">{{ $t("label.phone") }}</div>
                <div class="emp-thead-item">{{ $t("label.email") }}</div>
          </div>
          <div class="emp-tbody">
            <div class="emp-tbody-row" v-for="user in filteredUsers" :key="user.PersonNumber">
              <div class="emp-tbody-item">
                <div class="emp-tbody-item-title"> {{ $t("label.fullName") }} </div>
                <div class="emp-tbody-item-txt"> {{ user.Fullname }} </div>
              </div>
              <div class="emp-tbody-item">
                <div class="emp-tbody-item-title"> {{ $t("label.branch") }} </div>
                <div class="emp-tbody-item-txt"> {{ user.DepartmentName }} </div>
              </div>
              <div class="emp-tbody-item">
                <div class="emp-tbody-item-title">{{ $t("label.department") }} </div>
                <div class="emp-tbody-item-txt"> {{ user.SectionName }} </div>
              </div>
              <div class="emp-tbody-item">
                <div class="emp-tbody-item-title">{{ $t("label.phone") }} </div>
                <div class="emp-tbody-item-txt"> {{ user.Telephone }} </div>
              </div>
              <div class="emp-tbody-item">
                <div class="emp-tbody-item-title">{{ $t("label.email") }} </div>
                <div class="emp-tbody-item-txt"> {{ user.Email }} </div>
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
import { mapGetters } from 'vuex';

  export default {
    data() {
      return {
        userInfo: {},
       aFilters: {
          user: '',
          department: null
       }
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
      ...mapGetters({usersList:"usersList", departmentList: 'depList'}),
      filteredUsers:function(){
        let self = this,
            aFilteredUsers = this.usersList,
            aFilters = this.aFilters;
        
        if (aFilters.user == ''  && aFilters.department === null) {
          aFilteredUsers = this.usersList
        } else {
          let fnFilter;
          if (aFilters.user) {
            aFilteredUsers =  self.usersList.filter(function(user){ 
                return user.Fullname.toLowerCase().indexOf(aFilters.user.toLowerCase())>=0;
            });
          } 
          if (aFilters.department) {
             fnFilter = function(oItem){
                return oItem.DepartmentName === aFilters.department;
              }
              aFilteredUsers = aFilteredUsers.filter(fnFilter);
          }
        }
        return aFilteredUsers;
      }
    },
    methods: {
      clearFilters() {
        this.aFilters = {}
      }
    }
  }
</script>

<style>

</style>
