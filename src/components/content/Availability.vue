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
                    <p class="content-header-title">{{ $t("header.availability") }}</p>
                    <p @click="closeAlert" class="ava-error-header" v-if="saveSuccess">{{ $t("message.successfullySaved") }}</p>
                    <p @click="closeAlert" v-if="editError">{{ $t("message.editProjectError") }}</p>
                    <p @click="closeAlert" v-if="removeError">{{ $t("message.removeProjectError") }}</p>
                    <p @click="closeAlert" v-if="addingError">{{ $t("message.addProjectError") }}</p>
                    <p @click="closeAlert" class="ava-error-header" v-if="removeSuccess">{{ $t("message.successfullyRemovedProject") }}</p>
                    <!-- <button v-show="saveSuccess || editError|| removeError || addingError || removeSuccess" class="ava-button" @click="closeAlert">X</button> -->
                </div>
            </div>
            <div class="availability-tiles">
                <div class="availability-tiles-row">
                    <div class="availability-tile ava-tile-1">
                        <div class="availability-tile-header">
                            <div class="ava-tile-header-title">
                                <h2 v-if="selectedUser === null">{{ $t("header.selectEmployee") }}</h2>
                                <h2 class="ava-selected-user-h2" v-else-if="selectedUser !== null">{{ selectedUser.Fullname }}</h2>
                                <div class="availability-tile-underscore"></div>
                            </div>
                        </div>
                        <div class="availability-tile-content">
                            <div class="ava-select-and-calendar">
                                <div class="availability-select-options">
                                    <div class="ava-div-select-cool">
                                        <select required class="ava-select-cool" v-model="selectedBranch">
                                            <option v-for="branch in branchList" :key="branch.Key" :value="branch.Key">{{ branch.Value }}</option>
                                        </select>
                                        <label class="ava-select-label-cool">{{ $t("label.department") }}</label>
                                    </div>
                                    <div class="ava-div-select-cool" v-if="selectedBranch != null">
                                        <select required class="ava-select-cool" v-model="selectedDepartment">
                                            <option v-for="department in departmentList" :key="department.Key" :value="department.Key">{{ department.Value }}</option>
                                        </select>
                                        <label class="ava-select-label-cool">{{ $t("label.branch") }}</label>
                                    </div>
                                    <div class="ava-div-select-cool" v-if="selectedDepartment != null">
                                        <select required class="ava-select-cool" v-model="selectedUser" @change="loadUserProjects(selectedUser.UserAlias)">
                                            <option v-for="user in filteredUsers" :value="user" :key="user.UserAlias">{{ user.Fullname }}</option>
                                        </select>
                                        <label class="ava-select-label-cool">{{ $t("label.employee") }}</label>
                                        <span>
                                            <label class="avail-error" v-if="filteredUsers.length === 0">{{ $t("label.emptyUsers") }}</label>
                                        </span>
                                    </div>
                                    <div class="ava-div-select-cool" v-if="selectedUser != null">
                                        <select required class="ava-select-cool" v-model="selectedType">
                                            <option v-for="type in availTypesList" :value="type.Key" :key="type.Key">{{type.Value}}</option>
                                        </select>
                                        <button class="ava-select-reset" :title="$t('title.reset')" v-if="selectedType" @click="selectedType = null">&#10006;</button>
                                        <label class="ava-select-label-cool">{{ $t("label.entryType") }}</label>
                                    </div>
                                    <div class="ava-div-select-cool" v-if="selectedUser != null">
                                        <select required class="ava-select-cool" v-model="selectedStatus">
                                            <option v-for="status in availStatusList" :key="status.Key" :value="status.Key">{{ status.Value }}</option>
                                        </select>
                                        <button class="ava-select-reset" :title="$t('title.reset')" v-if="selectedStatus" @click="selectedStatus = null">&#10006;</button>
                                        <label class="ava-select-label-cool">{{ $t("label.status") }}</label>
                                    </div>
                                    <button class="ava-button ava-button-edit" v-if="selectedUser != null" @click="showContent = true">{{ $t("label.display") }}</button>
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
                    <app-not-authorized-projects-tile :auth-type="authType" :selected-user="selectedUser.UserAlias" v-if="selectedType === 'PR' && showContent == true && authType === 'OWN'"></app-not-authorized-projects-tile>
                    <app-projects-tile :auth-type="authType" :selected-user="selectedUser.UserAlias" v-if="selectedType === 'PR' && showContent == true && authType !== 'OWN'"></app-projects-tile>
                    <app-leaves-tile   :auth-type="authType" :selected-user="selectedUser.UserAlias" :selected-type="selectedType"  v-if="selectedType !== 'PR' && showContent == true"></app-leaves-tile>
               </div>
                <div class="availability-tiles-row">
                    <app-projects-table :auth-type="authType" :selected-status="selectedStatus" v-if="selectedType === 'PR' && showContent == true"></app-projects-table>
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
            selectedDepartment: null,
            selectedBranch: null,
            showBranchSelect: true,
            selectedUser: null,
            showContent: false,
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
    computed: Object.assign(mapGetters({
            departmentList: 'getDepartmentList',
            branchList: 'getBranchList',
            usersList: 'usersList',
            userData: 'getUserInfo',
            sectionsList: 'sectionsList',
            projectsList: 'projectsList',
            addingError: "getAddingError",
            removeError: "getRemoveError",
            editError: "getEditError",
            saveSuccess: "getSaveDataSucccess",
            removeSuccess: "getRemoveSuccess",
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

        }), {
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
    }),
    created() {
      let oStore = this.$store;
      oStore.commit('SET_PROMISE_TO_READ', oStore.getters.getAvailabilityToRead);
      oStore.dispatch('getData', null);
      utils.checkAuthLink(this.$router, oStore.getters.getUserAuth.ZMENU);
    },
    watch: {
        selectedType(value) {
            this.newLeave.TypeId = value;
        },
        selectedUser(value){
            this.newLeave.UserId = value.UserAlias;
            this.newProject.UserAlias = value.UserAlias;

        // check if button is disabled to create project or other avail type
            if(this.authAcc === '*') {
            this.$store.commit('SET_DISABLED_BTN_TO_EDIT_PROJECT', false);
            this.$store.commit('SET_DISABLED_BTN_TO_EDIT_AVAIL', false);
            } else if(this.authAcc === 'TEAM' && this.filteredUsers.find(o => o.UserAlias === this.selectedUser.UserAlias)) {
            this.$store.commit('SET_DISABLED_BTN_TO_EDIT_PROJECT', false);
            this.$store.commit('SET_DISABLED_BTN_TO_EDIT_AVAIL', false);
            } else if(this.authType === 'OWN' && this.selectedUser.UserAlias === this.loginAlias) {
            this.$store.commit('SET_DISABLED_BTN_TO_EDIT_PROJECT', true);
            this.$store.commit('SET_DISABLED_BTN_TO_EDIT_AVAIL', false);
            } else {
            this.$store.commit('SET_DISABLED_BTN_TO_EDIT_PROJECT', true);
            this.$store.commit('SET_DISABLED_BTN_TO_EDIT_AVAIL', true);
            }
        },
        selectedBranch(value) {
    //   filter users to make possibility to edit or accept avails
            let aFilteredUsers = this.usersList,
            idTeam = this.userData.DepartmentId;
            aFilteredUsers = aFilteredUsers.filter(function(oData){
                return oData.DepartmentId === idTeam;
            });
            this.$store.commit('SET_FILTERED_TEAM_USERS', aFilteredUsers);
        }
    },
    methods: {
        ...mapActions({
            validateEditProject: 'validateEditProject',
            closeAlert: 'hideAllMessages',
            validateNewEngag: 'validateNewEngag',
            validateEditEngag: 'validateEditEngag'
        }),
        showMenu(event) {
            let obj = {window, event}
            this.$store.dispatch("setSideMenu", obj);
        },
        loadUserProjects(userId) {
            this.$store.commit('SET_DISPLAY_LOADER', true)
            this.$store.commit('SET_PROMISE_TO_READ', this.$store.getters.getAvailabilityToRead);
            let userData = {
                user: this.selectedUser.UserAlias
            }
            this.$store.dispatch('getData', userData);
        }
    }
}
</script>
<style>

</style>
