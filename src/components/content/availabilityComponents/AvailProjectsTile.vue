<template>
    <!-- for adding new project -->
    <div class="availability-tile ava-tile-2">
        <div class="availability-tile-header">
            <div class="ava-tile-header-title">
                <i18n path="message.addProjectforUser" tag="h2">
                    <span place="user"> {{formattedUsername}} </span>
                    </i18n>
                <div class="availability-tile-underscore"></div>
            </div>
            <!-- <button class="ava-button ava-button-add" @click="showAddProjectDialog = true"> Dodaj projekt </button> -->
        </div>
        <div class="availability-tile-content">
            <div id="add-project-dialog">
                <div class="ava-add">
                    <div class="ava-div-select-cool">
                        <select required class="ava-select-cool" @change="removeSelectedProject" v-model="newProjectForUser.ContractorId">
                            <option v-for="contractor in contractorsList" :key="contractor.ContractorId" :value="contractor.ContractorId"> {{ contractor.ContractorName }}</option>
                        </select>
                        <label class="ava-select-label-cool">{{ $t("label.contractor") }}</label>
                    </div>
                </div>
                <div class="ava-add">
                    <div class="ava-div-input-cool">
                        <select required class="ava-select-cool" @change="validateNewProject" v-model="newProjectForUser.ProjectId">
                            <option v-for="project in filteredProjects" :key="project.ProjectId" :value="project.ProjectId"> {{ project.ProjectName }}</option>
                        </select>
                        <label class="ava-select-label-cool">{{ $t("label.project") }}</label>
                    </div>
                    <div class="ava-div-input-cool">
                        <input required class="ava-input-range-perc" v-model="newProjectForUser.Engag" @input="validateNewEngag(newProjectForUser.Engag)" type="number" min="0" max="100" /><span class="ava-perc-span">%</span>
                        <span class="ava-div-bar"></span>
                        <label class="ava-input-label-cool">{{ $t("label.engag") }}</label>
                    </div>
                </div>
                <div class="ava-add">
                    <div class="ava-div-select-cool">
                        <v-date-picker required class="ava-input-range-wide" @input="validateNewProject" popoverDirection="top" is-expanded mode="range" v-model="selectedDates">
                            <input class="ava-input-range-wide" value="newProjectForUser.dates" />
                        </v-date-picker>
                        <label class="ava-input-label-cool">{{ $t("label.dates") }}</label>
                    </div>
                    <div class="ava-div-select-cool">
                        <select required class="ava-select-cool" v-model="newProjectForUser.StatusId" @change="validateNewProject">
                            <option v-for="status in availStatusList" :key="status.Key" :value="status.Key">{{ status.Value }}</option>
                            <!-- <option v-for="branch in branchList" :key="branch.branchId" :value="selectedBranch = branch.branchId">{{ branch.branchName }}</option> -->
                        </select>
                        <label class="ava-select-label-cool">{{ $t("label.status") }}</label>
                    </div>
                    <div class="cd-for-input">
                        <textarea class="cd-textarea" required maxlength="50" @input="validateNewProject" v-model="newProjectForUser.Description" />
                        <label class="cd-slabel">{{ $t("label.remarks") }}</label>
                    </div>
                    <div class="ava-div-buttons">
                        <button class="ava-button" @click="onCancelCreate">{{ $t("button.cancel") }}</button>
                        <button class="ava-button ava-button-edit" :disabled="disableSave" @click="addNewProjectForUser">{{ $t("button.addProject") }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
let utils = require('../../../utils')

export default {
    props: ['selected-user', 'auth-type'],
    data() {
        return {
            selectedDates: null,
            disableSave: true
        }
    },
    watch: {
        selectedDates(value){
            this.newProjectForUser.StartDate = utils.formatDateForBackend(value.start)
            this.newProjectForUser.EndDate = utils.formatDateForBackend(value.end)
        }
    },
    computed: {
        ...mapGetters({
            newProjectForUser: 'getNewProjectForUser',
            projectsList: 'projectsList',
            contractorsList: 'getContractorsList',
            availStatusList: 'getAvailStatus',
            usersList: 'usersList'
        }),
        filteredProjects() {
            const projectsList = this.projectsList
            let filteredProjects = []

            for (let i = 0; i < projectsList.length; i++) {
                if (projectsList[i].ContractorId === this.newProjectForUser.ContractorId) {
                    filteredProjects.push(projectsList[i])
                }
            }
            return filteredProjects
        },
        formattedUsername() {
            const userId = this.selectedUser
            for (let i = 0; i < this.usersList.length; i++){
                if (this.usersList[i].UserAlias === userId) {
                     return this.usersList[i].Fullname
                }
            }
        }
    },
    methods: {
        ...mapActions({
            validateNewProject: 'validateNewProject'
        }),
        addNewProjectForUser(){
            this.$store.dispatch('addUserProject')
            this.selectedDates = null
        },
        removeSelectedProject() {
            const userId = this.newProjectForUser.UserAlias,
                  contractorId = this.newProjectForUser.ContractorId,
                newProjectForUser = {
                    UserAlias: userId,
                    ProjectId: null,
                    ContractorId: contractorId,
                    Engag: null,
                    Description: null,
                    StatusId: null,
                    StartDate: null,
                    EndDate: null
                }

            this.$store.commit('SET_NEW_PROJECT_FOR_USER', newProjectForUser)
        },
        onCancelCreate() {
            this.disableSave = true
            this.$store.commit('SET_NEW_PROJECT_FOR_USER', {
                UserAlias: null,
                ProjectId: null,
                ContractorId: null,
                Engag: null,
                StatusId: null,
                Description: null,
                StartDate: null,
                EndDate: null
            })
        },
        validateNewProject(){
            let obj = this.newProjectForUser
            for (let key in obj) {
                if (!obj[key]){
                    this.disableSave = true
                    return
                } else {
                    this.disableSave = false
                }
            }
        },
        validateNewEngag(engag){
            let project = this.newProjectForUser
            if (project.Engag < 0) project.Engag = null;
            if (project.Engag > 100) project.Engag = 100;
        },
    }
};
</script>

