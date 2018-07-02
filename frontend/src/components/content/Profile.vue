<template>
<div class="plane-profile">
    <div class="profile-nav-and-content">
        <app-menu></app-menu>
        <!-- <leave-page-dialog v-if="showLeavePageDialog" @action-selected="leavePage" @close="showLeavePageDialog = false"></leave-page-dialog> -->
        <div class="profile-content">
            <div class="profile-header">
                <div class="profile-header-title-and-menu">
                    <img src="../../assets/images/nav/if_menu-32.png" width="32px" class="profile-header-menu">
                    <p class="profile-header-title">{{ $t("header.profile") }}</p>
                </div>
                <button class="profile-header-button" v-if="!editMode" @click="onEdit">{{ $t("button.editData") }}</button>
                <div v-if="editMode" class="header-button-save-reject">
                    <p class="profile-error profile-error-data" v-if="!saveChangesSuccess">{{ $t("message.saveChangesError") }}</p>
                    <button class="border-btn save-btn" @click="onSaveChanges" :disabled="disableSaveBtn">{{ $t("button.saveChanges") }}</button>
                    <button class="border-btn reject-btn" @click="onCancelEdit">{{ $t("button.cancel") }}</button>
                </div>
            </div>

            <h3 class="user-header-name">{{userData.firstName}} {{userData.lastName}}</h3>
            <div class="profile-tiles">
                <div class="profile-tile">
                    <!-- container for section -->
                    <div class="profile-tile-header">
                        <h2>{{ $t("header.contact") }}</h2>
                        <div class="tile-underscore"></div>
                    </div>
                    <div class="profile-tile-content">
                        <div class="profile-tile-inputs-section profile-inputs-sections-1">
                            <div class="profile-tile-inputs">
                                <div>
                                    <!-- <input required v-if="editMode" class="inputProfile" @input="checkFormFields" :class="editMode ? 'inputEdit' : 'inputDisabled'" :disabled="!editMode" v-model="userData.address"> -->
                                    <input required v-if="editMode" @input="checkFormFields" class="inputProfile inputEdit" v-model="userData.address">
                                    <input v-if="!editMode" disabled class="inputProfile inputDisabled" v-model="userData.address">
                                    <span class="prof-div-bar"></span>
                                    <label class="label-profile">{{ $t("label.address") }}</label>
                                </div>
                                <div>
                                    <!-- <input required class="inputProfile" @input="checkFormFields" :class="editMode ? 'inputEdit' : 'inputDisabled'" :disabled="!editMode" v-model="userData.email" @blur="$v.userData.email.$touch()"> -->
                                    <input required v-if="editMode" class="inputEdit inputProfile" @input="checkFormFields"  v-model="userData.email" @blur="$v.userData.email.$touch()">
                                    <input v-if="!editMode" disabled type="text" class="inputDisabled inputProfile " v-model="userData.email">
                                    <span class="prof-div-bar"></span>
                                    <label class="label-profile">{{ $t("label.email") }}</label>
                                    <div class="error-wrapper">
                                        <p class="profile-error profile-error-email" v-if="$v.userData.email.$invalid">{{ $t("message.emailValidation") }}</p>
                                    </div>
                                </div>
                                <div>
                                    <!-- <input class="inputProfile" :class="editMode ? 'inputEdit' : 'inputDisabled'" :disabled="!editMode" v-model="userData.phone" @input="phoneValidation"> -->
                                    <input required v-if="editMode" class="inputEdit inputProfile" v-model="userData.phone" @input="phoneValidation">
                                    <input v-if="!editMode" disabled class="inputDisabled inputProfile" v-model="userData.phone">
                                    <span class="prof-div-bar"></span>
                                    <label class="label-profile">{{ $t("label.phone") }}</label>
                                    <div class="error-wrapper">
                                        <p class="profile-error profile-error-phone" v-if="invalidPhone">{{ $t("message.phoneValidation") }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="profile-tile-inputs">
                                <div>
                                    <!-- <input class="inputProfile" @input="checkFormFields" :class="editMode ? 'inputEdit' : 'inputDisabled'" :disabled="!editMode" v-model="userData.skype"> -->
                                    <input required v-if="editMode" class="inputProfile inputEdit" @input="checkFormFields" v-model="userData.skype">
                                    <input v-if="!editMode" disabled class="inputProfile inputDisabled" v-model="userData.skype">
                                    <span class="prof-div-bar"></span>
                                    <label class="label-profile">{{ $t("label.skype") }}</label>
                                </div>
                                <div>
                                    <!-- <input class="inputProfile" @input="checkFormFields" :class="editMode ? 'inputEdit' : 'inputDisabled'" :disabled="!editMode" v-model="userData.slack"> -->
                                    <input required v-if="editMode" class="inputProfile inputEdit" @input="checkFormFields" v-model="userData.slack">
                                    <input disabled v-if="!editMode" class="inputProfile inputDisabled" v-model="userData.slack">
                                    <span class="prof-div-bar"></span>
                                    <label class="label-profile">{{ $t("label.slack") }}</label>
                                </div>
                            </div>
                        </div>
                        <div class="profile-user-header">
                            <div class="profile-user-img">
                                <img class="img-user-class" :src="userData.image" width="150px">
                                <p class="profile-error profile-error-image" v-if="photoUploadError">{{ $t("message.photoUploadError") }}</p>
                                <label for="change-user-image" class="change-user-img">{{ $t("button.changePhoto") }}
                                    <input accept="image/*" style="width: 1rem;" type="file" ref="photo" @change="handlePhotoUpload" id="change-user-image">
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="profile-tile">
                    <div class="profile-tile-header">
                        <div class="profile-tile-header-row">
                            <h2>{{ $t("header.employee") }}</h2>
                            <button class="profile-change-password">zmień hasło</button>
                        </div>
                        <div class="tile-underscore"></div>
                    </div>
                    <div class="profile-tile-content">
                        <div class="profile-tile-inputs-section">
                            <div class="profile-tile-inputs">
                                <div>
                                    <!-- container for single label + input/p -->
                                    
                                    <!-- <input class="inputDisabled inputProfile" :disabled="true" v-model="userData.branch"> -->
                                    <input disabled class="inputDisabled inputProfile" v-model="userData.branch">
                                    <label class="label-profile">{{ $t("label.department") }}</label>
                                </div>
                                <div>
                                    <!-- container for single label + input/p -->
                                    <!-- <input class="inputDisabled inputProfile" :disabled="true" v-model="userData.section"> -->
                                    <input disabled class="inputProfile inputDisabled" v-model="userData.section">
                                    <label class="label-profile">{{ $t("label.branch") }}</label>
                                </div>
                                <div>
                                    <!-- container for single label + input/p -->
                                    <!-- <input class="inputDisabled inputProfile" :disabled="true" v-model="userData.position"> -->
                                    <input disabled class="inputProfile inputDisabled" v-model="userData.position">
                                    <label class="label-profile">{{ $t("label.position") }}</label>
                                </div>
                                <div>
                                    <!-- container for single label + input/p -->
                                    <input v-if="editMode" required class="inputProfile inputEdit" @input="checkFormFields" v-model="userData.currentProject">
                                    <input v-if="!editMode" class="inputDisabled inputProfile" v-model="userData.currentProject">
                                    <label class="label-profile">{{ $t("label.project") }}</label>
                                </div>
                            </div>
                            <div class="profile-tile-inputs">
                                <div>
                                    <!-- container for single label + input/p -->
                                    <!-- <select v-model="userData.state" @change="checkFormFields" class="selectProfile" :class="editMode ? 'selectEdit' : 'selectDisabled'" :disabled="!editMode"> -->
                                    <select v-if="editMode" v-model="userData.state" @change="checkFormFields" class="selectProfile selectEdit" >
                                        <option value="Full">{{ $t("label.fulltime") }}</option>
                                        <option value="1/2">1/2</option>
                                        <option value="1/3">1/3</option>
                                        <option value="2/3">2/3</option>
                                        <option value="1/4">1/4</option>
                                        <option value="3/4">3/4</option>
                                        <option value="1/5">1/5</option>
                                        <option value="2/5">2/5</option>
                                        <option value="3/5">3/5</option>
                                        <option value="4/5">4/5</option>
                                    </select>
                                    <p v-if="!editMode" class="inputDisabled">{{ userData.state }}</p>
                                    <label class="label-profile">{{ $t("label.worktime") }}</label>
                                    <!-- <input  value="Pełny" class="inputDisabled inputProfile" :disabled="true" v-model="userData.worktime"> -->
                                </div>
                                <div>
                                    <!-- container for single label + input/p -->
                                    
                                    <!-- <masked-input mask="11.11.1111" @input="dateValidation" class="inputProfile" :class="editMode ? 'inputEdit' : 'inputDisabled'" :disabled="!editMode" v-model="userData.employmentDate" /> -->
                                    <masked-input required v-if="editMode" mask="11.11.1111" @input="dateValidation" class="inputProfile inputEdit" v-model="userData.employmentDate" />
                                    <!-- <v-date-picker :max-date="new Date()" v-if="projectEditMode" class="inputProfile" :class="editMode ? 'inputEdit' : 'inputDisabled'" :disabled="!editMode" is-expanded mode="single" v-model="userData.employmentDate">
                                            <input value="userData.employmentDate" />
                                        </v-date-picker> -->
                                    <p v-if="!editMode" class="inputDisabled">{{userData.employmentDate}}</p>
                                    <label class="label-profile">{{ $t("label.employmentDate") }}</label>
                                    <div class="error-wrapper">
                                        <p class="profile-error profile-error-date" v-if="invalidDate">{{ $t("message.dateValidation") }}</p>
                                    </div>
                                </div>
                                <div>
                                    <!-- container for single label + input/p -->
                                    <!-- <input class="inputDisabled inputProfile" :disabled="true" v-model="userData.seniority"> -->
                                    <input required v-if="editMode" class="inputDisabled inputProfile" v-model="userData.seniority">
                                    <p v-if="!editMode" class="inputDisabled">{{userData.seniority}}</p>
                                    <label class="label-profile">{{ $t("label.workExperience") }}</label>
                                </div>
                            </div>
                        </div>
                        <div class="side-content">
                            <p class="cv-title">{{ $t("label.cv") }}</p>
                            <div class="cv-buttons">
                                <div class="button-cv">
                                    <a>
                                        <span class="button-circle lang-circle">PL</span>
                                    </a>
                                    <div class="add-download">
                                        <p class="profile-error profile-error-upload-top" v-if="fileUploadError">{{ $t("message.fileUploadError") }}</p>
                                        <label class="add" for="add-docx-pl">+
                                            <input accept=".doc,.docx" id="add-docx-pl" type="file" class="add doc-add-pl" ref="file" @change="handleCvUpload">
                                        </label>

                                        <div class="docx">.docx</div>
                                        <a :href="userData.cv" class="download doc-download-pl">&#x21e3;</a>
                                    </div>
                                    <div class="add-download">
                                        <p v-show="false" class="profile-error profile-error-upload-bottom">{{ $t("message.fileUploadError") }}</p>
                                        <label for="add-pdf-pl" class="add">+
                                            <input id="add-pdf-pl" accept=".pdf" class="add pdf-add-pl" type="file">
                                        </label>

                                        <div class="pdf">.pdf</div>
                                        <a class="download pdf-add-pl">&#x21e3;</a>
                                    </div>
                                </div>
                                <div class="button-cv">
                                    <a>
                                        <span class="button-circle lang-circle">EN</span></a>
                                    <div class="add-download">
                                        <p v-show="false" class="profile-error profile-error-upload-top">{{ $t("message.fileUploadError") }}</p>
                                        <label class="add" for="add-docx-en">+
                                            <input accept=".doc,.docx" id="add-docx-en" class="add" type="file">
                                        </label>

                                        <div class="docx">.docx</div>
                                        <a class="download">&#x21e3;</a>
                                    </div>
                                    <div class="add-download">
                                        <p v-show="false" class="profile-error profile-error-upload-bottom">{{ $t("message.fileUploadError") }}</p>
                                        <label class="add" for="add-pdf-en">+
                                            <input id="add-pdf-en" accept=".pdf" class="add" type=file>
                                        </label>
                                        <div class="pdf">.pdf</div>
                                        <a class="download">&#x21e3;</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="profile-tile">
                    <div class="profile-tile-header">
                        <div class="profile-tile-header-row">
                            <h2 class="profile-tile-title">{{ $t("header.experience") }}</h2>
                            <div class="profile-table-buttons">
                                <button class="profile-edit-experience" @click="editProjects" v-if="!projectEditMode">{{ $t("button.editProjects") }}</button>
                                <button class="profile-edit-experience-e" v-if="projectEditMode" @click="addRow">{{ $t("button.addProject") }}</button>
                                <button class="profile-edit-experience-e" v-if="projectEditMode" @click="finishEditing">{{ $t("button.finishEdit") }}</button>
                            </div>
                        </div>
                        <div class="tile-underscore"></div>
                    </div>
                    <!-- remove style after adding appropriate classes, it is only for testing purposes  -->
                    <div class="profile-tile-content">
                        <p class="profile-error" name="error" v-if="showProjectError">Wprowadzone dane w projekcie {{ errorProjectNo }} są niekompletne. Uzupełnij wszystkie pola. </p>
                        <p class="profile-error" name="error" v-if="invalidDates">W projekcie {{invalidDatePos}} data rozpoczęcia nie może być późniejsza niż data zakończenia </p>
                        <div class="profile-table-wrapper">
                            <div class="profile-table">
                                <div class="prof-thead">
                                    <!-- class="prof-thead-item" -->
                                    <div class="prof-thead-item">Np.</div>
                                    <div class="prof-thead-item">{{ $t("table.projectName") }}</div>
                                    <div class="prof-thead-item">{{ $t("table.contractor") }}</div>
                                    <div class="prof-thead-item">{{ $t("table.duration") }}</div>
                                    <div class="prof-thead-item">{{ $t("table.Industry") }}</div>
                                    <div class="prof-thead-item">{{ $t("table.Modules") }}</div>
                                    <div class="prof-thead-item">{{ $t("table.Descr") }}</div>
                                    <div class="prof-thead-item">---</div>
                                </div>
                                <div class="prof-tbody">
                                    <div class="prof-tbody-row" v-for="(exp, index) in experience" :key="index">
                                        <!-- class="prof-tbody-item" -->
                                        <div class="prof-tbody-item">
                                            <div class="prof-tbody-item-title">Np.</div>
                                            <!-- class="prof-tbody-item-txt" -->
                                            <div class="prof-tbody-item-txt">
                                                <p class="table-p">{{index + 1}}</p>
                                            </div>
                                        </div>
                                        <div class="prof-tbody-item">
                                            <div class="prof-tbody-item-title">{{ $t("table.projectName") }} </div>
                                            <!-- class="prof-tbody-item-txt" -->
                                            <div class="prof-tbody-item-txt">
                                                <input :disabled="!projectEditMode" class="profile-table-input" v-model="experience[index].project" />
                                            </div>
                                        </div>
                                        <div class="prof-tbody-item">
                                            <div class="prof-tbody-item-title"> {{ $t("table.contractor") }}</div>
                                            <div class="prof-tbody-item-txt">
                                                <select :disabled="!projectEditMode" class="profile-table-select profile-table-select-contractor" v-model="experience[index].contractor"> 
                                                    <option v-for="contractor in contractorsList" :key="contractor.id" :value="contractor.id"> {{ contractor.name }}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="prof-tbody-item">
                                            <div class="prof-tbody-item-title">{{ $t("table.duration") }} </div>
                                            <div class="prof-tbody-item-txt">
                                                <p class="table-p">Rozpoczęcie</p>
                                                <p class="table-p" v-if="!projectEditMode"> {{ formatDate(experience[index].startDate) }} </p>
                                                <v-date-picker :max-date="new Date()" popoverDirection="top" v-if="projectEditMode" @input="validateDates(index)" class="profile-table-date-picker" is-expanded mode="single" v-model="experience[index].startDate">
                                                    <input value="experience[index].startDate" />
                                                </v-date-picker>
                                                <p class="table-p">Zakończenie</p>
                                                <div name="endDateDiv" :id="index">
                                                    <p class="table-p" v-if="!projectEditMode"> {{ formatDate(experience[index].endDate) }} </p>
                                                    <v-date-picker :max-date="new Date()" popoverDirection="top" v-if="projectEditMode" @input="validateDates(index)" class="profile-table-date-picker" is-expanded mode="single" v-model="experience[index].endDate">
                                                        <input value="experience[index].endDate" />
                                                    </v-date-picker>
                                                </div>
                                                <input :disabled="!projectEditMode" type="checkbox" @change="disableEndDateInput" id="checkbox" :name="index" v-model="experience[index].isCurrent" />
                                                <label for="checkbox">Obecnie</label>
                                            </div>
                                        </div>
                                        <div class="prof-tbody-item">
                                            <div class="prof-tbody-item-title">{{ $t("table.Industry") }} </div>
                                            <div class="prof-tbody-item-txt">
                                                <select :disabled="!projectEditMode" class="profile-table-select profile-table-select-industry" v-model="experience[index].industry"> 
                                                    <option v-for="industry in industryList" :key="industry.id" :value="industry.id"> {{ industry.name }}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="prof-tbody-item">
                                            <div class="prof-tbody-item-title"> {{ $t("table.Modules") }}</div>
                                            <div class="prof-tbody-item-txt profile-table-td-module">
                                                <div id="for">
                                                    <button :disabled="!projectEditMode" class="profile-table-module-button" @click="removeModule" :name="index" v-for="sapModule in experience[index].modules" :key="sapModule.id" :value="sapModule.id"> {{ sapModule.id }} </button>
                                                </div>
                                                <!-- <div id="addButtons"></div> -->
                                                <select v-if="projectEditMode" class="profile-table-select profile-table-select-modules" @change="addModule" :id="index"> 
                                                <option disabled selected value>{{ $t("table.addModule") }}:</option>
                                                <option v-for="sapModule in modulesList" :key="sapModule.id" :value="sapModule.id"> {{ sapModule.name }}</option>
                                            </select>
                                            </div>

                                        </div>
                                        <div class="prof-tbody-item">
                                            <div class="prof-tbody-item-title">{{ $t("table.projectName") }} </div>
                                            <div class="prof-tbody-item-txt">
                                                <textarea :disabled="!projectEditMode" class="profile-table-textarea" v-model="experience[index].descr" />
                                            </div>
                                        </div>
                                        <div class="prof-tbody-item">
                                            <div class="prof-tbody-item-title">{{ $t("table.projectName") }} </div>
                                            <div class="prof-tbody-item-txt">
                                                <button v-if="projectEditMode" class="profile-table-delete-btn" @click="removeRow(index)">X</button>
                                                <button v-if="projectEditMode" class="profile-table-save-btn" @click="saveExp(index)">&#x2714;</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import moment from "moment"
import MaskedInput from 'vue-masked-input'
import {
    required,
    email
} from 'vuelidate/lib/validators'
import {
    mapGetters, mapActions
} from 'vuex'
import Menu from '../Menu.vue'
import LeavePageDialog from '../dialogs/LeavePageDialog'
export default {
    data() {
        return {
            editMode: false,
            _beforeEditingCache: null,
            file: '',
            photo: '',
            hasDataChanged: false,
            showNoChangesAlert: false,
            invalidPhone: false,
            invalidDate: false,
            disableSaveBtn: true,
            showEndInput: true,
            projectEditMode: false,
            invalidDates: false,
            invalidDatePos: null,
            _beforeEditingProjects: null,
            showLeavePageDialog: false,
            routeToGo: null
        }
    },
    validations: {
        userData: {
            email: {
                required,
                email
            }
        }
    },
    components: {
        MaskedInput,
        'app-menu': Menu,
        'leave-page-dialog': LeavePageDialog
    },
    beforeCreate() {
        if (this.$store.getters.isDataLoaded === false) {
            this.$store.dispatch('loadData', localStorage.getItem('token'))
        }
    },
    computed: {
        ...mapGetters({
            userData: 'userData',
            saveChangesSuccess: 'isSaveChangesSuccess',
            photoUploadError: 'isSavePhotoError',
            fileUploadError: 'isFileUploadError',
            contractorsList: 'contractorsList',
            industryList: "getIndustryList",
            modulesList: "getModulesList",
            experience: "getExperienceList",
            showProjectError: 'getShowProjectError',
            ifModuleExist: 'getModuleExist',
            errorProjectNo: 'getErrorProjectNo'            
        })
    },
    // beforeRouteLeave (to, from , next) {
        // this.showLeavePageDialog = true
    //     this.routeToGo = to.name
    // },
    methods: {
        ...mapActions({
            addRow: 'addExpRow'
        }),
        onEdit() {
            this.showNoChangesAlert = false
            this.editMode = !this.editMode
            this._beforeEditingCache = Object.assign({}, this.userData)
        },
        onCancelEdit() {
            Object.assign(this.userData, this._beforeEditingCache)
            this._beforeEditingCache = null
            this.showNoChangesAlert = false
            this.editMode = !this.editMode
        },
        onSaveChanges() {
            this.showNoChangesAlert = false
            this.checkIfDataChanged()
            if (this.hasDataChanged === false) {
                this.showNoChangesAlert = true
            } else {
                this.$store.dispatch('saveContactData', this.userData)
                this.$store.dispatch('saveUserData', this.userData)
                this.editMode = !this.editMode
            }
            this.disableSaveBtn = true
        },
        checkIfDataChanged() {
            let currentData = Object.assign({}, this.userData),
                currDataProps = Object.getOwnPropertyNames(currentData),
                beforeDataProps = Object.getOwnPropertyNames(this._beforeEditingCache)

            for (let i = 0; i < beforeDataProps.length; i++) {
                let propName = beforeDataProps[i];
                if (currentData[propName] !== this._beforeEditingCache[propName]) {
                    this.hasDataChanged = true
                    return
                } else {
                    this.hasDataChanged = false
                }
            }
        },
        handlePhotoUpload() {
            this.photo = this.$refs.photo.files[0];
            this.disableSubmit = false
            let data = {
                file: this.photo,
                id: localStorage.getItem('id')
            }
            this.$store.dispatch('submitPhoto', data)
        },
        handleCvUpload() {
            this.file = this.$refs.file.files[0];
            let data = {
                file: this.file,
                id: localStorage.getItem('id')
            }
            this.$store.dispatch('submitCv', data)
        },
        phoneValidation(value) {
            const regex = new RegExp("^(?=.*[0-9])[- +()0-9]+$")
            this.invalidPhone = (regex.test(value.target.value)) ? false : true
            this.checkFormFields()
        },
        dateValidation(value) {
            const day = parseInt(value.slice(0, 2)),
                month = parseInt(value.slice(3, 5))

            this.invalidDate = (day > 31 || month > 12) ? true : false
            this.disableSaveBtn = (day > 31 || month > 12) ? true : false

            this.checkFormFields()
        },
        checkFormFields() {
            if (this.invalidPhone || this.invalidDate || this.$v.userData.email.$invalid) {
                this.disableSaveBtn = true
            } else {
                this.checkIfDataChanged()
                this.disableSaveBtn = (this.hasDataChanged === true) ? false : true
            }
        },
        removeRow(index) {
            this.$store.dispatch('removeExpRow', index)
        },
        saveExp(index) {
            this.$store.dispatch('saveExpPosition', index)
            this._beforeEditingProjects = JSON.parse(JSON.stringify(this.experience))
        },
        addModule(value) {
            const data = {
                index: value.target.id,
                moduleId: value.target.value
            }
            this.$store.dispatch('addModule', data)
        },
        removeModule(value) {
            const data = {
                index: value.target.name,
                moduleId: value.target.value
            }
            this.$store.dispatch('removeModule', data)
        },
        disableEndDateInput(value) {
            const isCurrent = value.target.checked,
                index = value.target.name,
                input = document.getElementById(index)

            if (isCurrent) {
                input.setAttribute("style", "opacity: 0")
                this.experience[index].endDate = null
            } else {
                input.setAttribute("style", "opacity: 1")
            }
        },
        finishEditing() {
            this.$store.commit('SET_PROJECT_ERROR', false)
            this.$store.commit('SET_EXP_LIST', this._beforeEditingProjects)
            this.projectEditMode = false
        },
        editProjects() {
            this.projectEditMode = true
            this._beforeEditingProjects = JSON.parse(JSON.stringify(this.experience))
        },
        formatDate(date) {
            return (date !== null && date !== undefined) ? moment(date).format('DD.MM.YYYY') : "-"
        },
        validateDates(index) {
            const startDate = this.experience[index].startDate,
                endDate = this.experience[index].endDate,
                isCurrent = this.experience[index].isCurrent

            if (endDate && startDate && isCurrent === false) {
                const formatStartDate = moment(startDate).format('YYYY-MM-DD'),
                    formatEndDate = moment(endDate).format('YYYY-MM-DD')

                this.invalidDates = (formatStartDate > formatEndDate) ? true : false
                this.invalidDatePos = (formatStartDate > formatEndDate) ? index + 1 : null
            }
        }
        // leavePage() {
        //     if (this._beforeEditingProjects){
        //         this.$store.commit('SET_EXP_LIST', this._beforeEditingProjects)
        //     } 
        //     if (this._beforeEditingCache) {
        //         Object.assign(this.userData, this._beforeEditingCache)
        //     }
        //     this.$router.push({name: this.routeToGo})
        // }
    }
}
</script>

<style>
.input {
    text-align: center;
}

.inputEdit {
    text-align: center;
}

.inputDisabled {
    text-align: center;
}

.table-p {
    padding: 0;
    margin: 0;
}

@keyframes slide-down {
    100% {
        transform: translateY(0rem);
        opacity: 1;
    }
    0% {
        transform: translateY(-8rem);
        opacity: 0;
    }
}
</style>
