<template>
  <div class="plane-component">
    <div class="component-nav-and-content">
      <app-menu v-show="displayMenu"></app-menu>
      <div class="modal-overlay" v-show="displayOverlay"></div>
      <div class="component-content">
        <div class="content-header">
          <div class="content-header-title-and-menu">
            <!-- <img src="../../assets/images/nav/if_menu-32.png" width="32px" class="content-header-menu"> -->
            <div @click="showMenu" class="content-header-menu">&#9776;</div>
            <p class="content-header-title">{{ $t("header.employeesList") }}</p>
          </div>
        </div>
        <div class="emp-tile">
          <div class="emp-filters">
            <div class="emp-section">
              <div class="cd-for-input">
                <input required class="cd-input" v-model="aFilters.user"/>
                <span class="cd-span"></span>
                <label class="cd-label">{{ $t("label.enterNameOrSurname") }}</label>
              </div>
              <div class="cd-for-select">
                <select required class="cd-select" v-model="aFilters.department">
                  <option v-for="department in departmentList" :key="department.Key" :value="department.Value">{{ department.Value }}</option>
                </select>
                <label class="ava-select-label-cool">{{ $t("label.orSelectDep") }}</label>
              </div>
            </div>
            <button class="func-btn emp-btn" @click="clearFilters">{{ $t("button.clear") }}</button>
          </div>
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
                <div class="emp-tbody-item-txt"> {{ user.BranchName }} </div>
              </div>
              <div class="emp-tbody-item">
                <div class="emp-tbody-item-title">{{ $t("label.department") }} </div>
                <div class="emp-tbody-item-txt"> {{ user.DepartmentName }} </div>
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
import i18n from "../../lang/lang";
import Menu from "../Menu.vue";
import { mapGetters, mapActions } from "vuex";
import Modal from '../dialogs/MessageLogDialog';
const utils = require("../../utils")

export default {
  data() {
    return {
      aFilters: {
        user: "",
        department: null
      }
    };
  },
  components: {
    "app-menu": Menu,
    "modal": Modal
  },
  created: function() {
    let oStore = this.$store;
      oStore.commit('SET_PROMISE_TO_READ', ["Domains", "Industries", "UserData", "UserList"]);
      oStore.dispatch('getData', null);
      utils.checkAuthLink(this.$router, oStore.getters.getUserAuth.ZMENU);
  },
  // computed: {
  //   ...mapGetters({
  //     usersList: "usersList",
  //     departmentList: "getDepartmentList",
  //     displayMenu: "getShowMenu",
  //     displayOverlay: "getShowMenuOverlay"
  //   }),
  //   filteredUsers: function() {
  //     let self = this,
  //       aFilteredUsers = this.usersList,
  //       aFilters = this.aFilters;

  //     if (aFilters.user == "" && aFilters.department === null) {
  //       aFilteredUsers = this.usersList;
  //     } else {
  //       let fnFilter;
  //       if (aFilters.user) {
  //         aFilteredUsers = self.usersList.filter(function(user) {
  //           return (
  //             user.Fullname.toLowerCase().indexOf(
  //               aFilters.user.toLowerCase()
  //             ) >= 0
  //           );
  //         });
  //       }
  //       if (aFilters.department) {
  //         fnFilter = function(oItem) {
  //           return oItem.DepartmentName === aFilters.department;
  //         };
  //         aFilteredUsers = aFilteredUsers.filter(fnFilter);
  //       }
  //     }
  //     return aFilteredUsers;
  //   }
  // },
  computed: Object.assign(
    mapGetters({
      usersList: "usersList",
      departmentList: "getDepartmentList",
      displayMenu: "getShowMenu",
      displayOverlay: "getShowMenuOverlay"
    }), {
      filteredUsers: function() {
      let self = this,
        aFilteredUsers = this.usersList,
        aFilters = this.aFilters;

      if (aFilters.user == "" && aFilters.department === null) {
        aFilteredUsers = this.usersList;
      } else {
        let fnFilter;
        if (aFilters.user) {
          aFilteredUsers = self.usersList.filter(function(user) {
            return (
              user.Fullname.toLowerCase().indexOf(
                aFilters.user.toLowerCase()
              ) >= 0
            );
          });
        }
        if (aFilters.department) {
          fnFilter = function(oItem) {
            return oItem.DepartmentName === aFilters.department;
          };
          aFilteredUsers = aFilteredUsers.filter(fnFilter);
        }
      }
      return aFilteredUsers;
    }
    }
  ),
  // methods: {
  //   ...mapActions({
  //     getUsersLists: "getUsersLists"
  //   }),
  //   clearFilters() {
  //     this.aFilters = {};
  //   },
  //   showMenu(event) {
  //     let name = { window, event };
  //     this.$store.dispatch("setSideMenu", name);
  //   }
  // }
  methods: Object.assign(
    mapActions({
      getUsersLists: "getUsersLists"
    }), {
       clearFilters() {
      this.aFilters = {};
    },
    showMenu(event) {
      let name = { window, event };
      this.$store.dispatch("setSideMenu", name);
    }
  }
  )
};
</script>

<style>
</style>
