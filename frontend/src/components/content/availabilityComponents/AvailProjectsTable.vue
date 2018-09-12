<template>
    <div class="availability-tile" >
        <div class="availability-tile-header">
            <div class="ava-tile-header-title">
                            <!-- <h2>{{ $t("header.addProject") }}</h2> -->
                <h2>Zestawienie projektów</h2>
                <div class="availability-tile-underscore"></div>
            </div>
            <button class="profile-edit-btn" v-if="!editMode"  @click="edit">{{ $t("button.edit") }}</button>
             <button class="profile-edit-btn-e" v-if="editMode" @click="cancel"><span class="prof-btn-txt">{{ $t("button.finishEdit") }}</span><span class="prof-btn-icon">&#10004;</span></button>
        </div>
        <p v-if="noAvailEntries">Brak wpisów dla podanych kryteriów</p>
        <div v-if="!noAvailEntries" class="availability-tile-content">
            <div class="ava-proj-table">
                <div class="ava-proj-thead">
                    <div class="ava-thproj-item">Rodzaj wpisu</div>
                    <div class="ava-thproj-item">Nazwa Projektu</div>
                    <div class="ava-thproj-item">Obłożenie</div>
                    <div class="ava-thproj-item">Od</div>
                    <div class="ava-thproj-item">Do</div>
                    <div class="ava-thproj-item">Status</div>
                    <div class="ava-thproj-item">Uwagi</div>
                </div>
                <div class="ava-proj-tbody" v-for="(project, index) in filteredUserProjects" :key="index">
                    <div class="ava-tbproj-item">
                        <div class="ava-tbproj-ititle">Rodzaj wpisu</div>
                        <p>{{formattedProjectType()}}</p>
                    </div>
                    <div class="ava-tbproj-item">
                        <div class="ava-tbproj-ititle">Nazwa projektu</div>
                        <select v-if="!editMode" class="selectProfile selectDisabled" v-model="project.ProjectId">
                            <option v-for="proj in allProjects" :key="proj.ProjectId" :value="proj.ProjectId">{{proj.ProjectName}}</option>
                        </select>
                        <select v-if="editMode" class="selectProfile selectEdit" v-model="project.ProjectId">
                            <option v-for="proj in allProjects" :key="proj.ProjectId" :value="proj.ProjectId">{{proj.ProjectName}}</option>
                        </select>
                    </div>
                    <div class="ava-tbproj-item">
                        <div class="ava-tbproj-ititle">Obłożenie</div>
                        <p v-if="!editMode">{{project.Engag}}</p>
                        <div v-if="editMode">
                            <input required class="ava-input-range-perc" v-model="project.Engag" @input="validateNewEngag(index)" type="number" min="0" max="100" /><span class="ava-perc-span">%</span>
                            <span class="ava-div-bar"></span>
                            <label class="ava-input-label-cool">{{ $t("label.engag") }}</label>
                        </div>
                    </div>
                    <div class="ava-tbproj-item">
                        <div class="ava-tbproj-ititle">Od</div>
                        <p class="prof-date-label" v-if="!editMode"> {{ formatDate(project.StartDate) }} </p>
                        <v-date-picker v-if="editMode" class="prof-input-date" popoverDirection="top" @input="validateDates(index)" is-expanded mode="single" v-model="project.StartDate">
                            <input value="project.StartDate" />
                        </v-date-picker>
                    </div>
                    <div class="ava-tbproj-item">
                        <div class="ava-tbproj-ititle">Do</div>
                        <p class="prof-date-label" v-if="!editMode"> {{ formatDate(project.EndDate) }} </p>
                        <v-date-picker v-if="editMode" class="prof-input-date" popoverDirection="top" @input="validateDates(index)" is-expanded mode="single" v-model="project.EndDate">
                            <input value="project.EndDate" />
                        </v-date-picker>
                    </div>
                    <div class="ava-tbproj-item">
                        <div class="ava-tbproj-ititle">Status</div>
                        <select v-if="editMode" class="selectProfile selectEdit" v-model="project.StatusId">
                            <option v-for="status in availStatus" :key="status.Key" :value="status.Key">{{status.Value}}</option>
                        </select>
                         <select v-if="!editMode" class="selectProfile selectDisabled" v-model="project.StatusId">
                            <option v-for="status in availStatus" :key="status.Key" :value="status.Key">{{status.Value}}</option>
                        </select>
                    </div>
                    <div class="ava-tbproj-item">
                        <div class="ava-tbproj-ititle">Uwagi</div>
                        <div class="ava-tbproj-itxt"><textarea :disabled="!editMode" v-model="project.Description"></textarea></div>
                    </div>
                </div>
            </div>
        </div>
    </div>                
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import moment from 'moment'
export default {
    props: ['selected-type', 'selected-status'],
    data () {
        return {
            invalidDates: false,
            editMode: false,
            _beforeEditingCache: null     
        }
    },
    computed: {
        ...mapGetters({
            userProjects: 'userProjectsList',
            availTypes: 'getAvailType',
            availStatus: 'getAvailStatus',
            allProjects: 'projectsList'
        }),
        noAvailEntries() {
            if (this.filteredUserProjects.length === 0) {
                return true
            } else {
                return false
            }
        },
        filteredUserProjects() {
            let aFilteredProjets = this.userProjects,
                sStatus = this.selectedStatus;            
           
           if(sStatus === null){
               return aFilteredProjets
           } else {
               aFilteredProjets = aFilteredProjets.filter(function(oItem){
                  return oItem.StatusId === sStatus;
              })
            return aFilteredProjets
            }
            
        }
    },
    methods: {
        ...mapActions(["removeUserProject"]),
         edit() {
            this.editMode = true;
            this._beforeEditingCache = JSON.parse(JSON.stringify(this.userProjects));
        },
        remove(index) {
            this._beforeEditingCache.splice(index, 1);
            this.removeUserProject(index);
        },
        cancel() {
            this.$store.commit("SET_USER_AVAIL_PROJECTS", this._beforeEditingCache);
            this.editMode = false;
        },
        validateDates(index) {
           const startDate = this.userProjects[index].DateStart,
                endDate = this.userProjects[index].DateEnd

            if (endDate && startDate) {
                const formatStartDate = moment(startDate).format("YYYY-MM-DD"),
                formatEndDate = moment(endDate).format("YYYY-MM-DD");

                this.invalidDates = formatStartDate  > formatEndDate ? true : false;
            }
        },
        formatDate(date) {
            return date !== null && date !== undefined
            ? moment(date).format("DD.MM.YYYY")
            : "-";
        },
        validateNewEngag(index){
            let project = this.userProjects[index]
            if (project.Engag < 0) project.Engag = null;
            if (project.Engag > 100) project.Engag = 100;
        },
        formattedProjectType() {
            for(let i = 0; i < this.availTypes.length; i++) {
                if (this.availTypes[i].Key === "PR") {
                    return this.availTypes[i].Value
                }
            }
        },
    }
}
</script>


