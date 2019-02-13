<template>
    <!-- for adding new project -->
    <div class="availability-tile ava-tile-2">
        <div class="tile-header">
            <div class="tile-head-title">
                <i18n path="message.addProjectforUser" tag="h2">
                    <span place="user"> {{formattedUsername}} </span>
                </i18n>
            </div>
            <div class="tile-underscore"/>
            <!-- <button class="ava-button ava-button-add" @click="showAddProjectDialog = true"> Dodaj projekt </button> -->
        </div>
        <div class="availability-tile-content">
            <div id="add-project-dialog">
                <div class="ava-add">
                    <div class="cd-for-select cd-b">
                        <select required class="cd-select" @change="removeSelectedProject" v-model="newProjectForUser.ContractorId">
                            <option v-for="contractor in contractorsList" :key="contractor.ContractorId" :value="contractor.ContractorId"> {{ contractor.ContractorName }}</option>
                        </select>
                        <label class="cd-slabel">{{ $t("label.contractor") }}</label>
                    </div>
                </div>
                <div class="ava-add">
                    <div class="cd-for-select cd-b">
                        <select required class="cd-select" @change="validateNewProject" v-model="newProjectForUser.ProjectId">
                            <option v-for="project in filteredProjects" :key="project.ProjectId" :value="project.ProjectId"> {{ project.ProjectName }}</option>
                        </select>
                        <label class="cd-slabel">{{ $t("label.project") }}</label>
                    </div>
                    <div class="cd-for-input cd-b">
                        <input required class="cd-input" v-model="newProjectForUser.Engag" @input="validateNewEngag(newProjectForUser.Engag)" type="number" min="0" max="100" ><span class="cd-perc-span">%</span>
                        <span class="cd-span"></span>
                        <label class="cd-label">{{ $t("label.engag") }}</label>
                    </div>
                </div>
                <div class="ava-add">
                    <div class="cd-for-input">
                        <v-date-picker required class="cd-rangex cd-b" @input="validateNewProject" popoverDirection="top" is-expanded mode="range" v-model="selectedDates">
                            <input value="newProjectForUser.dates" >
                        </v-date-picker>
                        <label class="cd-slabel">{{ $t("label.dates") }}</label>
                    </div>
                    <div class="cd-for-select cd-b">
                        <select required class="cd-select" v-model="newProjectForUser.StatusId" @change="validateNewProject">
                            <option v-for="status in availStatusList" :key="status.Key" :value="status.Key">{{ status.Value }}</option>
                            <!-- <option v-for="branch in branchList" :key="branch.branchId" :value="selectedBranch = branch.branchId">{{ branch.branchName }}</option> -->
                        </select>
                        <label class="cd-slabel">{{ $t("label.status") }}</label>
                    </div>
                    <div class="cd-for-input cd-b">
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
    props: ['selected-user'],
    data() {
        return {
            selectedDates: null,
            disableSave: true
        }
    },
    watch: {
        selectedDates(value){
            if(value){
                this.$store.commit('SET_NEW_PROJ', { StartDate: value.start, EndDate: value.end })
                // this.newProjectForUser.StartDate = utils.formatDateForBackend(value.start)
                // this.newProjectForUser.EndDate = utils.formatDateForBackend(value.end)
            } else {
                this.$store.commit('SET_NEW_PROJ', { StartDateIsNull: true, EndDateIsNull: true })
                // this.newProjectForUser.StartDate = this.newProjectForUser.EndDate = null
            }
            this.validateNewProject(this.newProjectForUser);

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

            for (let project of projectsList) {
                if (project.ContractorId === this.newProjectForUser.ContractorId) {
                    filteredProjects.push(project)
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
            this.$store.commit('SET_NEW_PROJ', { StartDateIsNull: true, EndDateIsNull: true} )
            // this.selectedDates = null
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
            this.selectedDates = null;
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

