<template>
<div class="plane-component">
    <div class="component-nav-and-content">
        <app-menu v-show="displayMenu"></app-menu>
        <div class="m-overlay" v-show="displayOverlay"></div>
        <div class="component-content">
            <div class="content-header">
                <div class="content-header-title-and-menu">
                    <div @click="showMenu" class="content-header-menu">&#9776;</div>
                    <p class="content-header-title">{{ $t("header.availability") }}</p>
                </div>
            </div>
            <div class="availability-tiles">
                <div class="availability-tiles-row">
                    <div class="availability-tile ava-tile-1">
                        <div class="tile-head">
                            <div class="tile-head-row">
                                <h2 class="tile-head-title" v-if="selectedUser === null">{{ $t("header.selectEmployee") }}</h2>
                                <h2 class="tile-head-title" v-else-if="selectedUser !== null">{{ formattedUsername }}</h2>
                            </div>
                            <div class="tile-underscore"/>
                        </div>
                        <div class="availability-tile-content">
                            <div class="ava-select-and-calendar">
                                <div class="availability-select-options">
                                    <div class="cd-for-select cd-b">
                                        <select required class="cd-select" v-model="selectedBranch">
                                            <option v-for="branch in branchList" :key="branch.Key" :value="branch.Key">{{ branch.Value }}</option>
                                        </select>
                                        <label class="cd-slabel">{{ $t("label.department") }}</label>
                                    </div>
                                    <div class="cd-for-select cd-b" v-if="selectedBranch != null">
                                        <select required class="cd-select" v-model="selectedDepartment">
                                            <option v-for="department in departmentList" :key="department.Key" :value="department.Key">{{ department.Value }}</option>
                                        </select>
                                        <label class="cd-slabel">{{ $t("label.branch") }}</label>
                                    </div>
                                    <div class="cd-for-select cd-b" v-if="selectedDepartment != null">
                                        <select required class="cd-select" v-model="selectedUser" @change="loadUserProjects(selectedUser)">
                                            <option v-for="user in filteredUsers" :value="user.UserAlias" :key="user.UserAlias">{{ user.Fullname }}</option>
                                        </select>
                                        <label class="cd-slabel">{{ $t("label.employee") }}</label>
                                        <span class="avail-error-wrap">
                                            <label class="avail-error" v-if="filteredUsers.length === 0">{{ $t("label.emptyUsers") }}</label>
                                        </span>
                                    </div>
                                    <div class="cd-for-select cd-b" v-if="selectedUser != null">
                                        <select required class="cd-select" v-model="selectedType">
                                            <option v-for="type in availTypesList" :value="type.Key" :key="type.Key">{{type.Value}}</option>
                                        </select>
                                        <button class="select-reset" :title="$t('title.reset')" v-if="selectedType" @click="selectedType = null">&#10006;</button>
                                        <label class="cd-slabel">{{ $t("label.entryType") }}</label>
                                    </div>
                                    <div class="cd-for-select cd-b" v-if="selectedUser != null">
                                        <select required class="cd-select" v-model="selectedStatus">
                                            <option v-for="status in availStatusList" :key="status.Key" :value="status.Key">{{ status.Value }}</option>
                                        </select>
                                        <button class="select-reset" :title="$t('title.reset')" v-if="selectedStatus" @click="selectedStatus = null">&#10006;</button>
                                        <label class="cd-slabel">{{ $t("label.status") }}</label>
                                    </div>
                                    <!-- <button class="ava-button ava-button-edit" v-if="selectedUser != null" @click="showContent = true">{{ $t("label.display") }}</button> -->
                                </div>
                                <!-- <div class="calendar" v-if="selectedUser != null"> -->
                                <!-- calendar for projects -->
                                <div class="ava-calendar" v-if="selectedUser != null">
                                    <p class="ava-content-header" v-if="selectedType === 'PR'">{{ $t("label.projectsOverview") }}</p>
                                    <v-calendar class="availability-calendar" v-if="selectedType === 'PR'" :attributes="projectsAttr" mode='single' is-inline></v-calendar>
                                </div>
                                <!-- calendar for leaves -->
                                <div class="ava-calendar" v-if="selectedUser != null">
                                    <p class="ava-content-header" v-if="selectedType !== 'PR'">{{ $t("label.availabilityOverview") }}</p>
                                    <v-calendar class="availability-calendar"  v-if="selectedType !== 'PR'" :attributes="leavesAttr" mode='single' is-inline></v-calendar>
                                </div>
                            </div>
                        </div>
                    </div>
                    <app-not-authorized-projects-tile :auth-type="authType" :selected-user="selectedUser" v-if="selectedType === 'PR' && showContent == true && authAcc === 'OWN'"></app-not-authorized-projects-tile>
                    <app-projects-tile :auth-type="authType" :auth-acc="authAcc" :selected-user="selectedUser" v-if="selectedType === 'PR' && showContent == true && authAcc !== 'OWN'"></app-projects-tile>
                    <app-leaves-tile @change-selected-type="changeSelectedType" :auth-acc="authAcc" :selected-user="selectedUser" :selected-type="selectedType"  v-if="selectedType !== 'PR' && showContent == true"></app-leaves-tile>
               </div>
                <div class="availability-tiles-row">
                    <app-projects-table ref="projectsTable" :auth-type="authType" :auth-acc="authAcc" :selected-status="selectedStatus" v-show="selectedType === 'PR' && showContent == true"></app-projects-table>
                    <app-leaves-table :auth-type="authType" :selected-type="selectedType" :selected-status="selectedStatus" v-if="selectedType !== 'PR' && showContent == true"></app-leaves-table>
                </div>
            </div>
            <!-- for adding other entry -->
        </div>
    </div>
</div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex'
import moment from "moment";
import i18n from '../../lang/lang'
import {
    required,
    number,
    between
} from 'vuelidate/lib/validators'
import Menu from '../Menu.vue'
import ProjectsTable from './availabilityComponents/AvailProjectsTable'
import LeavesTable from './availabilityComponents/AvailLeavesTable'
import ProjectsTile from './availabilityComponents/AvailProjectsTile'
import LeavesTile from './availabilityComponents/AvailLeavesTile'
import NotAuthProjectsTile from './availabilityComponents/AvailNotAuthorizedProjectsTile'
import Modal from '../dialogs/MessageLogDialog';
const utils = require("../../utils.js");

export default {
    data() {
        return {
            showUsersCalendar: false,
            showBranchSelect: true,
            showContent: true,
            selectedType: null,
            selectedStatus: null,
            loginAlias: localStorage.getItem("id")
        }
    },
    components: {
        'app-menu': Menu,
        'app-projects-table': ProjectsTable,
        'app-leaves-table': LeavesTable,
        'app-projects-tile': ProjectsTile,
        'app-leaves-tile': LeavesTile,
        'app-not-authorized-projects-tile': NotAuthProjectsTile,
        'modal': Modal
    },
    computed: {
        ...mapGetters({
            departmentList: 'getDepartmentList',
            branchList: 'getBranchList',
            usersList: 'usersList',
            userData: 'getUserInfo',
            sectionsList: 'sectionsList',
            projectsList: 'projectsList',
            availStatusList: 'getAvailStatus',
            availTypesList: 'getAvailType',
            newLeave: 'getNewLeaveForUser',
            displayMenu: 'getShowMenu',
            displayOverlay: 'getShowMenuOverlay',
            newProject: 'getNewProjectForUser',
            userProjects: 'userProjectsList',
            userAvail: 'getUserAvail',
            authType: 'getAvailabilityAuth',
            authAcc: 'getAvailAcceptAuth',
            disabledBtnToEditAvail: "getDisabledBtnToEditAvail"
        }),
        selectedBranch: {
            get () {
                return this.$store.getters.getSelectedBranch
            },
            set (branchId) {
                this.$store.commit('SET_SELECTED_DEF_AVAIL', { selectedBranch: branchId, selectedDep: null, selectedUser: null })
            }
        },
        selectedDepartment: {
            get () {
                return this.$store.getters.getSelectedDepartment
            },
            set (departmentId) {
                this.$store.commit('SET_SELECTED_DEF_AVAIL', { selectedDep: departmentId, selectedUser: null, selectedBranch: null })
            }
        },
        selectedUser: {
            get () {
                let sUserId = this.$store.getters.getSelectedUser
               if(window.location.href.includes('?')) {
                   let iIndex = window.location.href.indexOf('?') + 1
                   sUserId = window.location.href.slice(iIndex)
               }
                return sUserId
            },
            set (userId) {
                this.$store.commit('SET_SELECTED_DEF_AVAIL', { selectedUser: userId, selectedDep: null, selectedBranch: null })
                this.$store.commit('SET_NEW_PROJ', { UserAlias: userId })
                
            }
        },
        formattedUsername() {
            const userId = this.selectedUser
             for (let i = 0; i < this.usersList.length; i++){
                 if (this.usersList[i].UserAlias === userId) {
                      return this.usersList[i].Fullname
                 }
             }
        },
        filteredUsers() {
            let aFilteredUsers = this.usersList,
                selectedDep = this.selectedDepartment,
                selectedBranch = this.selectedBranch;
                aFilteredUsers = aFilteredUsers.filter(function(oData){
                  return oData.DepartmentId === selectedDep && oData.BranchId === selectedBranch;
                });
              return aFilteredUsers;
        },
        leavesAttr() {
            return this.userAvail.map(t => ({
                key: t.EntryId,
                highlight: {
                    backgroundColor: t.Color,
                    borderRadius: '0px',
                    height: '100%'
                },
                order: t.Order,
                dates: {
                    start: t.DateStart,
                    end: t.DateEnd
                },
                popover: {
                    label: t.TypeName
                },
                customData: t
            }))
        },
        projectsAttr() {
            return this.userProjects.map(t => ({
                key: t.EntryId,
                highlight: {
                    backgroundColor: t.Color,
                    borderRadius: '0px',
                    height: '100%'
                },
                order: t.Order,
                dates: {
                    start: t.StartDate,
                    end: t.EndDate
                },
                popover: {
                    label: t.ProjectName + ' (' + t.Engag + '%)'
                },
                customData: t
            }))
        }
    },
    created() {
      let oStore = this.$store;
      oStore.commit('SET_PROMISE_TO_READ', oStore.getters.getAvailabilityToRead);
      oStore.dispatch('getData', null);
      utils.checkAuthLink(this.$router, oStore.getters.getUserAuth.ZMENU);
      this.$nextTick(() => {
          this.checkAuthorization()
      })
    },
    watch: {
        selectedType(value) {
            let isTypeIdNull = !value ? true : false;
            this.$store.commit('SET_NEW_LEAVE', {TypeId: value, TypeIdNull: isTypeIdNull});
        },
        selectedUser(value){
            this.$store.commit('SET_NEW_LEAVE', {UserId: value});
            this.$refs.projectsTable.cancel() 
            this.newProject.UserAlias = value;
            this.checkAuthorization();
        },
        selectedBranch(value) {
    //   filter users to make possibility to edit or accept avails
            let aFilteredUsers = this.usersList,
            idTeam = this.userData.DepartmentId;
            aFilteredUsers = aFilteredUsers.filter(function(oData){
                return oData.DepartmentId === idTeam;
            });
            this.$store.commit('SET_FILTERED_TEAM_USERS', aFilteredUsers);
            
        },
        selectedDepartment(value){
        }
    },
    methods: {
        ...mapActions({
            validateEditProject: 'validateEditProject',
            validateNewEngag: 'validateNewEngag',
            validateEditEngag: 'validateEditEngag'
        }),
        showMenu(event) {
            this.$store.commit('SET_MENU_CLICKED', true)
            let obj = {window, event}
            this.$store.dispatch("setSideMenu", obj);
        },
        loadUserProjects(userId) {
            this.$store.commit('SET_DISPLAY_LOADER', true)
            this.$store.commit('SET_PROMISE_TO_READ', this.$store.getters.getAvailabilityToRead);
            let userData = {
                user: this.selectedUser
            }
            this.$store.dispatch('getData', userData);
        },
        changeSelectedType(value){
            this.selectedType = value;
        },
        checkAuthorization(){
         // check if button is disabled to create project or other avail type
            if(this.authAcc === '*') {
            this.$store.commit('SET_DISABLED_BTN_TO_EDIT_AVAIL', false);
            } else if(this.authAcc === 'TEAM' && this.filteredUsers.find(o => o.UserAlias === this.selectedUser)) {
            this.$store.commit('SET_DISABLED_BTN_TO_EDIT_AVAIL', false);
            } else if(this.authType === 'OWN' && this.selectedUser === this.loginAlias) {
            this.$store.commit('SET_DISABLED_BTN_TO_EDIT_AVAIL', false);
            } else {
            this.$store.commit('SET_DISABLED_BTN_TO_EDIT_AVAIL', true);
            }
        }
    }
}
</script>
<style>

</style>
