<template>
<div class="plane-component">
    <div class="component-nav-and-content">
        <app-menu></app-menu>
        <div class="component-content">
            <div class="content-header">
                <div class="content-header-title-and-menu">
                    <img src="../../assets/images/nav/if_menu-32.png" width="32px" class="content-header-menu">
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
                                              <option v-for="department in departmentList" :key="department.Key" :value="department.Key">{{ department.Value }}</option>
                                        </select>
                                        <label class="ava-select-label-cool">{{ $t("label.branch") }}</label>
                                    </div>
                                    <div class="ava-div-select-cool" v-if="selectedDepartment != null">
                                        <select required class="ava-select-cool" v-model="selectedUser" @change="loadUserProjects(selectedUser.id)">
                                            <option v-for="user in filteredUsers" :value="user" :key="user.id">{{ user.firstName }} {{ user.lastName }}</option>
                                        </select>
                                        <label class="ava-select-label-cool">{{ $t("label.employee") }}</label>
                                    </div>
                                    <div class="ava-div-select-cool" v-if="selectedUser != null">
                                        <select required class="ava-select-cool" v-model="selectedType">
                                            <option  key="p" value="p">projekt</option>
                                            <option  key="l" value="l">urlop</option>
                                            <option  key="o" value="o">inne</option>
                                            <option  key="r" value="r">praca zdalna</option>
                                            <!-- <option v-for="branch in branchList" :key="branch.branchId" :value="selectedBranch = branch.branchId">{{ branch.branchName }}</option> -->
                                        </select>
                                        <label class="ava-select-label-cool">Rodzaj wpisu</label>
                                    </div>
                                    <div class="ava-div-select-cool" v-if="selectedUser != null">
                                        <select required class="ava-select-cool" v-model="selectedStatus">
                                            <option  key="c" value="c">potwierdzony</option>
                                            <option  key="p" value="p">planowany</option>
                                            <!-- <option v-for="branch in branchList" :key="branch.branchId" :value="selectedBranch = branch.branchId">{{ branch.branchName }}</option> -->
                                        </select>
                                        <label class="ava-select-label-cool">Status</label>
                                    </div>
                                    <button class="ava-button ava-button-edit" v-if="selectedUser != null" @click="showContent=true">Wyświetl</button>
                                </div>

                                <!-- <div class="calendar" v-if="selectedUser != null"> -->
                                <div class="ava-calendar">
                                    <v-calendar class="availability-calendar" :theme-styles="themeStyles" v-if="selectedUser != null" :attributes="attributes" mode='single' is-inline></v-calendar>
                                </div>

                            </div>

                        </div>
                    </div>

                    <!-- for adding new project -->
                    <div class="availability-tile ava-tile-2" v-if="selectedType === 'p' && showContent == true">
                        <div class="availability-tile-header">
                            <div class="ava-tile-header-title">
                                <h2>{{ $t("header.addProject") }}</h2>
                                <div class="availability-tile-underscore"></div>
                            </div>
                            <!-- <button class="ava-button ava-button-add" @click="showAddProjectDialog = true"> Dodaj projekt </button> -->
                        </div>
                        <div class="availability-tile-content">
                            <div id="add-project-dialog">
                                <div class="ava-add-1">
                                    <div class="ava-div-select-cool">
                                        <select required class="ava-select-cool" @change="removeSelectedProject" v-model="newProjectForUser.contractorId">
                                            <option v-for="contractor in contractorsList" :key="contractor.id" :value="contractor.id"> {{ contractor.name }}</option>
                                        </select>
                                        <label class="ava-select-label-cool">{{ $t("label.contractor") }}</label>
                                    </div>
                                </div>
                                <div class="ava-add-2">
                                    <div class="ava-div-input-cool">
                                        <select required class="ava-select-cool" @change="validateNewProject" v-model="newProjectForUser.projectId">
                                            <option v-for="project in filteredProjects" :key="project.id" :value="project.id"> {{ project.name }}</option>
                                        </select>
                                        <label class="ava-select-label-cool">{{ $t("label.project") }}</label>
                                    </div>
                                    <div class="ava-div-input-cool">
                                        <input required class="ava-input-range-perc" v-model="newProjectForUser.engag" @input="validateNewEngag(newProjectForUser.engag)" type="number" min="0" max="100" /><span class="ava-perc-span">%</span>
                                        <span class="ava-div-bar"></span>
                                        <label class="ava-input-label-cool">{{ $t("label.engag") }}</label>
                                    </div>

                                </div>
                                <div class="ava-add-3">
                                    <div class="ava-div-select-cool">
                                        <v-date-picker required class="ava-input-range-wide" @input="validateNewProject" popoverDirection="top" is-expanded mode="range" v-model="newProjectForUser.dates">
                                            <input class="ava-input-range-wide" value="newProjectForUser.dates" />
                                        </v-date-picker>
                                        <label class="ava-input-label-cool">{{ $t("label.dates") }}</label>
                                    </div>
                                    <div class="ava-div-input-cool">
                                        <textarea class="ava-textarea" required maxlength="50" @change="validateNewProject" v-model="newProjectForUser.notes" />
                                        <label class="ava-select-label-cool">Uwagi</label>
                                    </div>
                                    <div class="ava-div-buttons">
                                        <button class="ava-button" @click="onCancelCreate">{{ $t("button.cancel") }}</button>
                                        <button class="ava-button ava-button-edit" :disabled="disableSaveNewProject" @click="addNewProjectForUser">{{ $t("button.addProject") }}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="availability-tile ava-tile-2" v-if="selectedType !== 'p' && showContent == true">
                        <div class="availability-tile-header">
                            <div class="ava-tile-header-title">
                                <h2>Dodaj wpis</h2>
                                <div class="availability-tile-underscore"></div>
                            </div>
                            <!-- <button class="ava-button ava-button-add" @click="showAddProjectDialog = true"> Dodaj projekt </button> -->
                        </div>
                        <div class="availability-tile-content">
                            <div id="add-project-dialog">
                                <div class="ava-add-1">
                                    <div class="ava-div-select-cool">
                                        <v-date-picker required class="ava-input-range-wide" popoverDirection="top" is-expanded mode="range">
                                            <input class="ava-input-range-wide" />
                                        </v-date-picker>
                                        <label class="ava-input-label-cool">{{ $t("label.dates") }}</label>
                                    </div>
                                </div>
                                <div class="ava-add-2">
                                    <div class="ava-div-input-cool" v-if="selectedType == 'o'">
                                        <textarea class="ava-textarea" required maxlength="50" />
                                        <label class="ava-select-label-cool">Uwagi</label>
                                    </div>

                                    <div class="ava-div-buttons">
                                        <button class="ava-button" >{{ $t("button.cancel") }}</button>
                                        <button class="ava-button ava-button-edit" >Dodaj wpis</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="availability-tiles-row">
                    <app-availability-projects-table v-if="selectedType === 'p' && showContent == true"></app-availability-projects-table>
                    <app-leaves-table v-if="selectedType !== 'p' && showContent == true"></app-leaves-table>
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
import AvailabilityProjectsTable from '../tables/AvailabilityProjectsTable'
import LeavesTable from '../tables/LeavesTable'

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
    components: {
        'app-menu': Menu,
        'app-availability-projects-table': AvailabilityProjectsTable,
        'app-leaves-table': LeavesTable
    },
    computed: {
        ...mapGetters({
            departmentList: 'depList',
            branchList: 'branchList',
            usersList: 'usersList',
            userProjectsList: 'userProjectsList',
            sectionsList: 'sectionsList',
            projectsList: 'projectsList',
            contractorsList: 'contractorsList',
            disableSaveNewProject: 'getDisableSaveNewProject',
            disableSaveEditProject: 'getDisableSaveEditProject',
            beforeEditingCache: 'getBeforeEditingCache',
            hasDataChanged: 'getHasDataChanged',
            addingError: "getAddingError",
            removeError: "getRemoveError",
            editError: "getEditError",
            saveSuccess: "getSaveDataSucccess",
            removeSuccess: "getRemoveSuccess",
            newProjectForUser: 'getNewProjectForUser',
            projectToEdit: 'getProjectToEdit'
        }),
        filteredUsers() {
            const usersList = this.usersList
            let filteredUsers = []

            for (let i = 0; i < usersList.length; i++) {
                if (usersList[i].SectionName === this.selectedBranch.toString() && usersList[i].DepartmentName === this.selectedDepartment) {
                    filteredUsers.push(usersList[i])
                }
            }
            return filteredUsers
        },
        filteredProjects() {
            const projectsList = this.projectsList
            let filteredProjects = []

            for (let i = 0; i < projectsList.length; i++) {
                if (projectsList[i].contractorId === this.newProjectForUser.contractorId) {
                    filteredProjects.push(projectsList[i])
                }
            }
            return filteredProjects
        },
        attributes() {
            return this.userProjectsList.map(t => ({
                key: t.id,
                highlight: {
                    backgroundColor: t.color,
                    borderRadius: '0px',
                    height: '100%'
                },
                order: t.order,
                dates: {
                    start: t.startDate,
                    end: t.endDate
                },
                popover: {
                    label: t.projName + ' (' + t.engag + '%)'
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
        if (this.showMenu === false) {
            this.$store.commit('DISPLAY_MENU', true)
        }
        this.showBranchSelect = (localStorage.getItem('role') === 'leader') ? false : true

        if (this.$store.getters.isDataLoaded === false) {
            this.$store.dispatch('loadData', localStorage.getItem('token'))
        }

    },
    methods: {
        ...mapActions({
            validateNewProject: 'validateNewProject',
            validateEditProject: 'validateEditProject',
            closeAlert: 'hideAllMessages',
            addNewProjectForUser: 'addUserProject',
            validateNewEngag: 'validateNewEngag',
            validateEditEngag: 'validateEditEngag'
        }),
        loadUserProjects(userId) {
            this.$store.commit('SET_USER_ID', userId)
            this.$store.dispatch('getUserProjects', userId)
        },
        onEdit() {
            const beforeEditingCache = Object.assign({}, this.projectToEdit)
            this.$store.commit('SET_BEFORE_EDIT_CACHE', beforeEditingCache)
        },
        onCancelEdit() {
            Object.assign(this.projectToEdit, this.beforeEditingCache)
            this.$store.commit('SET_BEFORE_EDIT_CACHE', null)
            this.$store.commit('SET_PROJECT_TO_EDIT', {})
            this.$store.commit('SET_DISABLE_SAVE_EDIT', true)
        },
        onCancelCreate() {
            this.$store.commit('SET_DISABLE_SAVE_NEW', true)
            this.$store.commit('SET_NEW_PROJECT_FOR USER', {})
        },
        editProjectForUser() {
            this.projectToEdit.userId = this.selectedUser.id
            this.$store.dispatch('editUserProject', this.projectToEdit)
        },
        removeUserProject() {
            const data = {
                projectId: this.projectToEdit.id,
                userId: this.selectedUser.id
            }
            this.$store.dispatch('removeUserProject', data)
        },

        removeNewProjectData(userId) {
            const newProjectForUser = {
                userId: userId,
                projectId: null,
                contractorId: null,
                engag: null,
                notes: null,
                statusId: null
            }
            this.$store.dispatch('SET_NEW_PROJECT_FOR_USER', newProjectForUser)
        },
        removeSelectedProject() {
            const userId = this.newProjectForUser.userId,
                contractorId = this.newProjectForUser.contractorId,
                newProjectForUser = {
                    userId: userId,
                    projectId: null,
                    contractorId: contractorId,
                    engag: null,
                    notes: null,
                    statusId: null
                }

            this.$store.dispatch('SET_NEW_PROJECT_FOR_USER', newProjectForUser)
        }
    }
}
</script>
<style>

</style>
