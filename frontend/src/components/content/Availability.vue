<template>
<div class="plane-component">
    <div class="component-nav-and-content">
        <app-menu v-show="displayMenu"></app-menu>
        <div class="component-content">
            <div class="content-header">
                <div class="content-header-title-and-menu">
                    <!-- <img src="../../assets/images/nav/if_menu-32.png" width="32px" class="content-header-menu"> -->
                    <div @click="showMenu" class="content-header-menu">&#9776;</div>
                    <p class="content-header-title">{{ $t("header.availability") }}</p>
                    <p @click="closeAlert" class="ava-error-header" v-if="saveSuccess">Pomyślnie zapisano dane</p>
                    <p @click="closeAlert" v-if="editError">{{ $t("message.editProjectError") }}</p>
                    <p @click="closeAlert" v-if="removeError">{{ $t("message.removeProjectError") }}</p>
                    <p @click="closeAlert" v-if="addingError">{{ $t("message.addProjectError") }}</p>
                    <p @click="closeAlert" class="ava-error-header" v-if="removeSuccess">Pomyślnie usunięto projekt</p>
                    <!-- <button v-show="saveSuccess || editError|| removeError || addingError || removeSuccess" class="ava-button" @click="closeAlert">X</button> -->
                </div>
            </div>
            <div class="availability-tiles">
                <div class="availability-tiles-row">
                    <div class="availability-tile ava-tile-1">
                        <div class="availability-tile-header">
                            <div class="ava-tile-header-title">
                                <h2 v-if="selectedUser === null">{{ $t("header.selectEmployee") }}</h2>
                                <h2 class="ava-selected-user-h2" v-else-if="selectedUser !== null">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</h2>
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
                                              <option v-for="department in departmentList" :key="department.Key" :value="department.Value">{{ department.Value }}</option>
                                        </select>
                                        <label class="ava-select-label-cool">{{ $t("label.branch") }}</label>
                                    </div>
                                    <div class="ava-div-select-cool" v-if="selectedDepartment != null">
                                        <select required class="ava-select-cool" v-model="selectedUser" @change="loadUserProjects(selectedUser.UserAlias)">
                                            <option v-for="user in filteredUsers" :value="user" :key="user.UserAlias">{{ user.Fullname }}</option>
                                        </select>
                                        <label class="ava-select-label-cool">{{ $t("label.employee") }}</label>
                                    </div>
                                    <div class="ava-div-select-cool" v-if="selectedUser != null">
                                        <select required class="ava-select-cool" v-model="selectedType">
                                            <option v-for="type in availTypesList" :value="type.Key" :key="type.Key">{{type.Value}}</option>
                                            
                                            <!-- <option v-for="branch in branchList" :key="branch.branchId" :value="selectedBranch = branch.branchId">{{ branch.branchName }}</option> -->
                                        </select>
                                        <label class="ava-select-label-cool">Rodzaj wpisu</label>
                                        <button v-if="selectedType" @click="selectedType = null">X</button>
                                    </div>
                                    <div class="ava-div-select-cool" v-if="selectedUser != null">
                                        <select required class="ava-select-cool" v-model="selectedStatus">
                                            <option v-for="status in availStatusList" :key="status.Key" :value="status.Key">{{ status.Value }}</option>
                                             <!-- <option v-for="branch in branchList" :key="branch.branchId" :value="selectedBranch = branch.branchId">{{ branch.branchName }}</option> -->
                                        </select>
                                        <label class="ava-select-label-cool">Status</label>
                                        <button v-if="selectedStatus" @click="selectedStatus = null">X</button>
                                    </div>
                                    <button class="ava-button ava-button-edit" v-if="selectedUser != null" @click="showContent = true">Wyświetl</button>
                                </div>

                                <!-- <div class="calendar" v-if="selectedUser != null"> -->
                                <!-- calendar for projects -->
                                <div class="ava-calendar" v-if="selectedUser != null">
                                    <v-calendar class="availability-calendar" v-if="selectedType === 'PR'" :theme-styles="themeStyles" :attributes="projectsAttr" mode='single' is-inline></v-calendar>
                                </div>
                                <!-- calendar for leaves -->
                                <div class="ava-calendar" v-if="selectedUser != null">
                                    <v-calendar class="availability-calendar"  v-if="selectedType !== 'PR'" :theme-styles="themeStyles" :attributes="leavesAttr" mode='single' is-inline></v-calendar>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                        <app-projects-tile v-if="selectedType === 'PR' && showContent == true"></app-projects-tile>
                        <app-leaves-tile   :selected-type="selectedType"  v-if="selectedType !== 'PR' && showContent == true"></app-leaves-tile>
               </div>
                <div class="availability-tiles-row">
                    <app-projects-table :selected-status="selectedStatus" v-if="selectedType === 'PR' && showContent == true"></app-projects-table>
                    <app-leaves-table :selected-type="selectedType" :selected-status="selectedStatus" v-if="selectedType !== 'PR' && showContent == true"></app-leaves-table>
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
            selectedStatus: null
        }
    },
    created() {
        window.addEventListener("resize", this.showMenu)
    },
    destroyed() {
        window.removeEventListener("resize", this.showMenu)
    },
    components: {
        'app-menu': Menu,
        'app-projects-table': ProjectsTable,
        'app-leaves-table': LeavesTable,
        'app-projects-tile': ProjectsTile,
        'app-leaves-tile': LeavesTile
    },
    computed: {
        ...mapGetters({
            departmentList: 'depList',
            branchList: 'branchList',
            usersList: 'usersList',
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
            displayMenu: "getShowMenu",
            newProject: 'getNewProjectForUser',
            userProjects: 'userProjectsList',
            userAvail: 'getUserAvail'
        }),
        filteredUsers() {
            const usersList = this.usersList
            let filteredUsers = []

            for (let i = 0; i < usersList.length; i++) {
                // usersList[i].SectionName === this.selectedBranch.toString() &&
                if (usersList[i].DepartmentName === this.selectedDepartment) {
                    filteredUsers.push(usersList[i])
                }
            }
            return filteredUsers
        },
        leavesAttr() {
            return this.userAvail.map(t => ({
                key: t.EntryId,
                highlight: {
                    backgroundColor: t.Color,
                    borderRadius: '0px',
                    height: '100%'
                },
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
                    label: t.ProjectId + ' (' + t.Engag + '%)'
                },
                customData: t
            }))
        },
        themeStyles() {
            return {
                dayCell: {
                    backgroundColor: '#cff09e',
                }
            }
        }
    },
    beforeCreate() {
        this.showBranchSelect = (localStorage.getItem('role') === 'leader') ? false : true

        if (this.$store.getters.isDataLoaded === false) {
            this.$store.dispatch('loadData', localStorage.getItem('token'))
        }

    },
    watch: {
        selectedType(value) {
            this.newLeave.TypeId = value
        },
        selectedUser(value){
            this.newLeave.UserId = value.UserAlias
            this.newProject.UserAlias = value.UserAlias
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
            var x = window.matchMedia("(max-width: 40rem)")
            if (x.matches && event.type === "resize") {
                this.$store.commit("SET_DISPLAY_MENU", false)
            } else {
                this.$store.commit("SET_DISPLAY_MENU", true);
            }
        },
        loadUserProjects(userId) {
            this.$store.dispatch('getUserProjects', userId)
            this.$store.dispatch('getUserAvail', userId)
        }
    }
}
</script>
<style>

</style>
