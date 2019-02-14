<template>
  <div class="plane-profile">
    <div class="profile-nav-and-content">
      <app-menu v-show="displayMenu"></app-menu>
      <div class="modal-overlay" v-show="displayOverlay"></div>
      <leave-page-dialog v-if="showLeavePageDialog"></leave-page-dialog>
      <div class="profile-content">
        <div class="profile-header">
          <div class="content-header-title-and-menu">
            <div @click="showMenu" class="content-header-menu">&#9776;</div>
            <p class="content-header-title">{{ $t("header.profile") }}</p>
          </div>
          <div v-if="!editMode" class="prof-input-lang">
            <select required class="selectLang" v-model="selectedCvLang" @change="getNewData">
              <option v-for="language in cvLanguageList" :key="language.id" :value="language.id">{{ language.description }}</option>
            </select>
            <label class="label-select-lang">{{ $t("label.language") }}</label>
          </div>
          <button :disabled="disabledBtnToEdit" class="profile-header-button" @mouseout="hoverOrEdit = false" @mouseover="hoverOrEdit = true" v-if="!editMode" @click="onEdit">{{ $t("button.editData") }}</button>
          <div v-if="editMode" class="header-button-save-reject">
            <p class="profile-error profile-error-data" v-if="!saveChangesSuccess">{{ $t("message.saveChangesError") }}</p>
            <button class="border-btn save-btn" @click="onSaveChanges" :disabled="disableSaveBtn">{{ $t("button.saveChanges") }}</button>
            <button class="border-btn reject-btn" @click="onCancelEdit">{{ $t("button.cancel") }}</button>
          </div>
        </div>
        <div class="profile-user-head">
          <div class="cd-for-select">
            <select v-model="selectedUser" @change="getNewData" required class="cd-tselect">
              <option v-for="user in usersList" :value="user.UserAlias" :key="user.UserAlias">
                  {{ user.Fullname }}
              </option>
            </select>
            <label class="cd-tlabel">{{ $t("label.selectEmployee") }}</label>
          </div>
        </div>
        <div class="profile-tiles">
          <div class="profile-tiles-row-wrap">
            <div class="profile-tiles-row">
              <div :class="hoverOrEdit ? 'profile-tile-1-3 profile-main-edit' : 'profile-tile-1-3'">  
                <div class="profile-tile-header">
                  <h2 class="prof-tile-h2">{{ $t("header.contact") }}</h2>
                  <div class="tile-underscore"></div>
                </div>
                <div class="profile-tile-content">
                  <div class="profile-tile-inputs">
                    <div class="prof-input">
                      <div class="prof-input-adr" v-if="editMode">
                        <div class="prof-input-uno">
                          <input required v-model="userData.Street" v-on:input="checkFormFields()" />
                          <span class="cd-span"></span>
                          <label class="prof-ainput-lbl">{{ $t("label.street") }}</label>
                        </div>
                        <div class="prof-input-uno">
                          <input required v-model="userData.BuildingNumber" v-on:input="checkFormFields()"/>
                          <span class="cd-span"></span>
                          <label class="prof-ainput-lbl">{{ $t("label.buildingNumber") }}</label>
                        </div>
                        <div class="prof-input-uno">
                          <input required v-model="userData.ApartmentNumber" v-on:input="checkFormFields()">
                          <span class="cd-span"></span>
                          <label class="prof-ainput-lbl">{{ $t("label.apartmentNumber") }}</label>
                        </div>
                        <div class="prof-input-uno">
                          <input required v-model="userData.City" v-on:input="checkFormFields()">
                          <span class="cd-span"></span>
                          <label class="prof-ainput-lbl">{{ $t("label.city") }}</label>
                        </div>
                        <div class="prof-input-uno">
                          <input required v-model="userData.PostalCode" v-on:input="checkFormFields()">
                          <span class="cd-span"></span>
                          <label class="prof-ainput-lbl">{{ $t("label.postalCode") }}</label>
                        </div>
                      </div>
                      <p v-if="!editMode && !disabledBtnToEdit" disabled class="inputProfile inputDisabled">{{ formatAddress }}</p>
                      <p v-if="!editMode && disabledBtnToEdit" class="inputProfile inputDisabled"> {{ $t("label.hiddenData") }} </p>
                      <label v-if="!editMode" class="label-profile">{{ $t("label.address") }}</label>
                    </div>
                    <div class="prof-input">
                      <input required v-if="editMode" class="inputEdit inputProfile" @input="checkFormFields"  v-model="userData.Email" @blur="$v.userData.Email.$touch()">
                      <input v-if="!editMode" disabled type="text" class="inputDisabled inputProfile " v-model="userData.Email">
                      <span class="cd-span"></span>
                      <label class="label-profile">{{ $t("label.email") }}</label>
                      <p class="prof-error" v-if="$v.userData.Email.$invalid">{{ $t("message.emailValidation") }}</p>
                    </div>
                    <div class="prof-input">
                      <masked-input required v-if="editMode" class="inputEdit inputProfile" mask="\+11 111 111 111" type="text" v-model="userData.Telephone" @input="phoneValidation"></masked-input>
                      <input v-if="!editMode" disabled class="inputDisabled inputProfile" v-model="userData.Telephone">
                      <span class="cd-span"></span>
                      <label class="label-profile">{{ $t("label.phone") }}</label>
                      <p class="prof-error" v-if="invalidPhone">{{ $t("message.phoneValidation") }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div :class="hoverOrEdit ? 'profile-tile-1-3 profile-main-edit' : 'profile-tile-1-3'">
                <div class="profile-tile-header">
                  <h2 class="prof-tile-h2">{{ $t("header.communicators") }}</h2>
                  <div class="tile-underscore"></div>
                </div>
                <div class="profile-tile-content">
                  <div class="profile-tile-inputs">
                    <div class="prof-input-m">
                      <input required v-if="editMode" class="inputProfile inputEdit" @input="checkFormFields" v-model="userData.SkypeId">
                      <input v-if="!editMode" disabled class="inputProfile inputDisabled" v-model="userData.SkypeId">
                      <span class="cd-span"></span>
                      <label class="label-profile">{{ $t("label.skype") }}</label>
                      <img class="prof-comm-img" src="../../assets/images/comm/grey/skype.png"/>
                    </div>
                    <div class="prof-input-m">
                      <input required v-if="editMode" class="inputProfile inputEdit" @input="checkFormFields" v-model="userData.SlackId">
                      <input disabled v-if="!editMode" class="inputProfile inputDisabled" v-model="userData.SlackId">
                      <span class="cd-span"></span>
                      <label class="label-profile">{{ $t("label.slack") }}</label>
                      <img class="prof-comm-img" src="../../assets/images/comm/grey/slack.png"/>
                    </div>
                  </div>
                </div>
              </div>
              <div class="profile-tile-1-3-emp">
                <div class="profile-tile-content">
                  <div class="profile-user-header">
                    <div class="profile-user-img">
                      <div class="picture-loader" v-if="!userPhoto">
                      </div>
                      <img class="img-user-class" id="userProfilePhoto" :src="userPhoto" width="150px">
                      <p class="profile-error profile-error-image" v-if="photoUploadError">{{ $t("message.photoUploadError") }}</p>
                      <label for="change-user-image" class="profile-edit-btn" v-if="!disabledBtnToEdit">{{ $t("button.changePhoto") }}
                        <input accept="image/*" style="width: 1rem;" type="file" ref="photo" @change="handlePhotoUpload($event)" id="change-user-image">
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="profile-tiles-row">
              <div :class="hoverOrEdit ? 'profile-tile-1-2 profile-main-edit' : 'profile-tile-1-2'">
                <div class="profile-tile-header">
                  <div class="profile-tile-header-row">
                    <h2 class="prof-tile-h2">{{ $t("header.employee") }}</h2>
                    <button @click="showChangePassword" :disabled="selectedUser !== loginAlias" class="func-btn">
                      <span class="prof-btn-txt">{{ $t("header.changePassword") }}</span>
                      <span class="prof-btn-icon">&#x1f513;</span>
                    </button>
                  </div>
                  <div class="tile-underscore"></div>
                </div>
                <div class="profile-tile-content">
                  <div class="profile-tile-inputs-section">
                    <div class="profile-tile-inputs">
                      <div class="prof-input-s">
                        <input disabled class="inputProfile inputDisabled" v-model="userData.BranchName">
                        <label class="label-profile">{{ $t("label.branch") }}</label>
                      </div>
                      <div class="prof-input-s">
                        <input disabled class="inputDisabled inputProfile" v-model="userData.DepartmentName">
                        <label class="label-profile">{{ $t("label.department") }}</label>
                      </div>
                      <div class="prof-input-s">
                        <select required v-if="editMode && this.authType !== 'OWN'" v-model="userData.JobPositionKey" @change="checkFormFields" class="selectProfile selectEdit">
                          <option v-bind:key="position.Key" v-for="position in workPositionList" :value="position.Key">{{position.Value}}</option>
                        </select>
                        <select required v-if="!editMode || this.authType === 'OWN'" disabled v-model="userData.JobPositionKey" @change="checkFormFields" class="selectProfile selectDisabled">
                          <option v-bind:key="position.Key" v-for="position in workPositionList" :value="position.Key">{{position.Value}}</option>
                        </select>
                        <label class="label-profile">{{ $t("label.position") }}</label> 
                      </div>
                      <div class="prof-input-s">
                        <input v-if="editMode" required class="inputProfile inputEdit" @input="checkFormFields" v-model="userData.CurrentProject">
                        <input disabled v-if="!editMode" class="inputDisabled inputProfile" v-model="userData.CurrentProject">
                        <span class="cd-span"></span>
                        <label class="label-profile">{{ $t("label.project") }}</label>
                      </div>
                    </div>
                    <div class="profile-tile-inputs">
                      <div class="prof-input-s">
                      <select required v-if="editMode" v-model="userData.WorkTime" @change="checkFormFields" class="selectProfile selectEdit">
                        <option v-bind:key="key" v-for="(value,key) in workTime" :value="key">{{value}}</option>
                      </select>
                      <select disabled v-if="!editMode" v-model="userData.WorkTime" @change="checkFormFields" class="selectProfile selectDisabled">
                        <option v-bind:key="key" v-for="(value,key) in workTime" :value="key">{{value}}</option>
                      </select>
                      <label class="label-profile">{{ $t("label.worktime") }}</label>
                    </div>
                    <div class="prof-input-s">
                      <input :value="formatDate" disabled class="inputProfile inputDisabled" v-if="!editMode">
                      <v-date-picker  @input="checkFormFields" v-if="editMode" class="delegations-input-date inputDisabled" v-model="userData.EmploymentDate" :max-date="new Date()">
                        <input value="userData.employmentDate"/>
                      </v-date-picker>
                      <span class="cd-span"></span>
                      <label class="label-profile">{{ $t("label.employmentDate") }}</label>
                      <p class="prof-error" v-if="invalidDate">{{ $t("message.dateValidation") }}</p>
                    </div>
                    <div class="prof-input-s">
                      <input required v-if="editMode" :disabled="true" class="inputDisabled inputProfile" :value="setFormatedDate">
                      <input disabled class="inputProfile inputDisabled" v-if="!editMode" :value="setFormatedDate">
                      <label class="label-profile">{{ $t("label.workExperience") }}</label>
                    </div>
                    <div class="prof-input-s">
                      <input :value="formatedBirthDate" disabled class="inputProfile inputDisabled" v-if="!editMode">
                      <v-date-picker  @input="checkFormFields" v-if="editMode" class="delegations-input-date inputDisabled" v-model="userData.DateBirth" :max-date="new Date()">
                        <input value="userData.dateBirth"/>
                      </v-date-picker>
                      <span class="cd-span"></span>
                      <label class="label-profile">{{ $t("label.dateOfBirth") }}</label>
                      <p class="prof-error" v-if="invalidDate">{{ $t("message.dateValidation") }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <user-cv-tile></user-cv-tile>
          </div>
        </div>
        <user-education-component :selected-user="selectedUser"></user-education-component>
        <user-experience-component :selected-user="selectedUser"></user-experience-component>
        <user-projects-component @set-reset-industries="onResetContractors" :selected-user="selectedUser" :reset-contractors="resetContractors"></user-projects-component>
        <user-skills-component :selected-user="selectedUser"></user-skills-component>
        <select-cv-content v-show="showSelectCv"></select-cv-content>
        <div v-show="showSelectCv" class="modal-overlay"></div>
        <change-user-password v-show="showPasswordDialog"></change-user-password>
        <submit-photo-err v-if="showPhotoErr"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import MaskedInput from "vue-masked-input";
require("moment-precise-range-plugin");

import { required, email } from "vuelidate/lib/validators";
import htmlDocx from "html-docx-js/dist/html-docx";
import { saveAs } from "file-saver";
import { mapGetters, mapActions } from "vuex";

import Menu from "../Menu.vue";
import LeavePageDialog from "../dialogs/LeavePageDialog";
import UserProjects from "./profileComponents/UserProjects";
import UserEducation from "./profileComponents/UserEducation";
import UserExperience from "./profileComponents/UserExperience";
import UserSkills from "./profileComponents/UserSkills";
import SelectCvContent from "./profileComponents/SelectCvContent";
import UserCvTile from "./profileComponents/UserCvTile";
import ChangePasswordDialog from "./profileComponents/ChangePasswordDialog";
import i18n from "../../lang/lang";
import Modal from '../dialogs/MessageLogDialog';
import SubmitPhotoErr from '../dialogs/SubmitPhotoErrDialog'
const utils = require("../../utils");

export default {
  data() {
    return {
      editMode: false,
      _beforeEditingCache: null,
      file: "",
      photo: "",
      hasDataChanged: false,
      showNoChangesAlert: false,
      invalidPhone: false,
      invalidDate: false,
      disableSaveBtn: true,
      routeToGo: null,
      newPosition: null,
      selectedCvLang: i18n.locale,
      authType: this.$store.getters.getUserAuth.ZPROF_ATCV,
      workTime: this.$store.getters.getWorkTime,
      loginAlias: localStorage.getItem("id"),
      selectedUser: this.$store.getters.getSelectedForCvUser || localStorage.getItem("id"),
      resetContractors: false,
      hoverOrEdit: false
    };
  },
  validations: {
    userData: {
      Email: {
        required,
        email
      }
    }
  },
  // set login language
  beforeRouteLeave(to, from, next) {
    let lang = this.loginLanguage.toLowerCase(),
        dataChangedProf = false,
        editModeProf = false,
        path = "";

    if (lang == "") {
      lang = "pl";
    }
    this.$store.commit("SET_LANG", lang);
    if (to.path !== '/cv') {
      this.$store.commit("SET_SELECTED_FOR_CV_USER", localStorage.getItem("id"));
    }
    dataChangedProf = this.hasDataChanged || this.$store.getters.getDataChangedProf.changed; // check if data was changed in profile components
    editModeProf = this.editMode || this.$store.getters.getDataChangedProf.editMode;
    if (editModeProf && dataChangedProf) {
      this.$store.commit('SET_NEXT_PATH', to.path)
      this.$store.commit('SET_LEAVE_PAGE_DIALOG', true)
      if (this.leavePageFlag !== false) {
        this.$store.commit('SET_LEAVE_PAGE_DIALOG', false)
        this.$store.commit('SET_LEAVE_PAGE_FLAG', false)
        this.$store.commit("SET_DATA_CHANGE_PROF", {changed: false, editMode: false});
        next()
      }
    } else {
      next()
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name  ===  "Employees") {
      next(vm  => {
        vm.selectedUser  =  vm.$route.params.user;
        vm.getNewData();
      });
    } else {
      next();
    }
  },
  created() {
    this.$store.commit('SET_DISABLED_BTN_TO_EDIT', false);
    let oStore = this.$store,
        sUserAlias = localStorage.getItem("id"),
        sLang = localStorage.getItem("lang");
    oStore.commit('SET_PROMISE_TO_READ', oStore.getters.getProfileToRead);
    if (oStore.getters.getCookie) {
      if (oStore.getters.getGoFromCv && oStore.getters.getRoleList.length > 0) { // if go from CV - do not read data
        oStore.commit("SET_GO_FROM_CV", false);
      } else {
        oStore.dispatch('getData', null);
      }
    }
    oStore.commit('SET_SHOW_CV_DIALOG', false);
    utils.checkAuthLink(this.$router, oStore.getters.getUserAuth.ZMENU);
    this.$nextTick(() => {
      this.authType = this.$store.getters.getUserAuth.ZPROF_ATCV;
    })
  },
  components: {
    MaskedInput,
    "app-menu": Menu,
    "leave-page-dialog": LeavePageDialog,
    "user-projects-component": UserProjects,
    "user-experience-component": UserExperience,
    "user-skills-component": UserSkills,
    "user-education-component": UserEducation,
    "select-cv-content": SelectCvContent,
    "user-cv-tile": UserCvTile,
    "change-user-password": ChangePasswordDialog,
    "modal": Modal,
    "submit-photo-err": SubmitPhotoErr
  },
  computed: {
    ...mapGetters({
      userData: "getUserInfo",
      saveChangesSuccess: "getSaveChangesSuccess",
      photoUploadError: "getSavePhotoError",
      cvLanguageList: "getCvLanguageList",
      loginLanguage: "getLoginLanguage",
      showSelectCv: "getShowSelectCvDialog",
      showPasswordDialog: "getShowSelectChangePasswordDialog",
      displayMenu: "getShowMenu",
      displayOverlay: "getShowMenuOverlay",
      usersList: "usersList",
      userPhoto: "getSelectedUserPhotoUrl",
      disabledBtnToEdit: "getDisabledBtnToEdit",
      showLeavePageDialog: "getLeavePageDialog",
      leavePageFlag: "getLeavePageFlag",
      showPhotoErr: 'getSubmitPhotoErr',
      workPositionList: "getWorkPositions"
    }),
    formatAddress() {
      const data = this.userData;
      let address = data.Street + " " + data.BuildingNumber;
      if (data.ApartmentNumber) {
        address = address + "/" + data.ApartmentNumber;
      }
      address = address + ", " + data.PostalCode + " " + data.City;
      return address;
    },
    formatDate() {
      let date = this.userData.EmploymentDate;
      return date !== null && date !== undefined ? moment(date).format("DD.MM.YYYY") : "-";
    },
    formatedBirthDate() {
      let date = this.userData.DateBirth;
      return date !== null && date !== undefined ? moment(date).format("DD.MM.YYYY") : "-";
    },
    setFormatedDate() {
      let oCalculateDifference = moment.preciseDiff(this.userData.EmploymentDate, new Date(), true),
          oFormatedDate;
        // if there is some differences - show work experience
        if (oCalculateDifference) {
          oFormatedDate = utils.setWorkExperience(oCalculateDifference);
        }
        if (oFormatedDate.day.includes('NaN')) {
          return i18n.t("message.lackOfData");
        } else {
          return oFormatedDate.year + oFormatedDate.month + oFormatedDate.day;
        }
    },
    filteredTeamUsers() {
      let aFilteredUsers = this.usersList,
      sTeam = this.usersList.find(o => o.UserAlias === localStorage.getItem('id')).DepartmentId;

      aFilteredUsers = aFilteredUsers.filter(function(oData) {
        return oData.DepartmentId === sTeam;
      });
      return aFilteredUsers;
    }
  },
  watch: {
    selectedUser(value) {
      if (!value) {
        this.selectedUser = localStorage.getItem('id');
        localStorage.setItem('cvUser', this.selectedUser);
      }
      let profileActivityAuth = this.$store.getters.getUserAuth.ZPROF_ATCV;
      if (profileActivityAuth === '*') {
        this.$store.commit('SET_DISABLED_BTN_TO_EDIT', false);
      } else if (profileActivityAuth === 'TEAM' && this.filteredTeamUsers.find(o => o.UserAlias === this.selectedUser)) {
        this.$store.commit('SET_DISABLED_BTN_TO_EDIT', false);
      } else if (this.selectedUser === this.loginAlias) {
        this.$store.commit('SET_DISABLED_BTN_TO_EDIT', false);
      } else {
        this.$store.commit('SET_DISABLED_BTN_TO_EDIT', true);
      }
      localStorage.setItem('cvUser', this.selectedUser);
    }
  },
  methods: {
    ...mapActions({
      getUserData: "getUserData",
      getGoFromCv: "getGoFromCv"
    }),
    onResetContractors(value) {
      this.resetContractors = value
    },
    showMenu(event) {
      this.$store.commit('SET_MENU_CLICKED', true)
      let obj = { window, event };
      this.$store.dispatch("setSideMenu", obj);
    },
    onEdit() {
      this.showNoChangesAlert = false;
      this.editMode = !this.editMode;
      this.hoverOrEdit = true;
      this._beforeEditingCache = Object.assign({}, this.userData);
    },
    showChangePassword() {
      this.$store.commit("SET_SHOW_CHANGE_PASSWORD_DIALOG", true);
    },
    onCancelEdit() {
      Object.assign(this.userData, this._beforeEditingCache);
      this._beforeEditingCache = null;
      this.showNoChangesAlert = false;
      this.editMode = !this.editMode;
      this.hoverOrEdit = false;
    },
    onSaveChanges() {
      let data;
      this.showNoChangesAlert = false;
      this.checkIfDataChanged();
      if (this.hasDataChanged === false) {
        this.showNoChangesAlert = true;
      } else {
        data = utils.createClone(this.userData)
        this.$store.dispatch("saveUserData", data);
        this.editMode = !this.editMode;
        this._beforeEditingCache = data;
      }
      this.disableSaveBtn = true;
    },
    checkIfDataChanged() {
      let currentData = Object.assign({}, this.userData),
        currDataProps = Object.getOwnPropertyNames(currentData),
        beforeDataProps = Object.getOwnPropertyNames(this._beforeEditingCache);

      for (let i = 0; i < beforeDataProps.length; i++) {
        let propName = beforeDataProps[i];
        if (currentData[propName] !== this._beforeEditingCache[propName]) {
          this.hasDataChanged = true;
          return;
        } else {
          this.hasDataChanged = false;
        }
      }
    },
    handlePhotoUpload(evt) {
      this.photo = this.$refs.photo.files[0];
      this.disableSubmit = false;
      let data = {
        file: this.photo,
        userId:  this.selectedUser,//localStorage.getItem("id"),
        type: "USER-PHOTO",
        language: "PL"
      };
      evt.target.value = null
      if (this.photo.size > 1000000) {
        this.$store.commit('SET_SUBMIT_PHOTO_ERR_DIALOG', true)
        return
      }
      this.$store.dispatch("submitPhoto", data);
    },
    phoneValidation(value) {
      this.checkFormFields();
    },
    checkFormFields() {
      if (this.invalidPhone || this.invalidDate || this.$v.userData.Email.$invalid) {
        this.disableSaveBtn = true;
      } else {
        this.checkIfDataChanged();
        this.disableSaveBtn = this.hasDataChanged === true ? false : true;
      }
    },
    // get data for selected language
    getNewData() {
      this.editMode = false;
      this.resetContractors = true;
      this.$store.dispatch('setLanguage', this.selectedCvLang);
      let cvLang = this.selectedCvLang.toUpperCase();
      localStorage.setItem("lang", this.selectedCvLang.toUpperCase());
      if (!cvLang) {
        let cvLang = loginLanguage.toUpperCase();
      }
      this.$store.commit("SET_SELECTED_FOR_CV_USER", this.selectedUser);
      let userData = {
        user: this.selectedUser,
        lang: cvLang,
        cvLang: cvLang,
        changePage: false
      };
      this.$store.commit("SET_PROMISE_TO_READ", this.$store.getters.getProfileToRead);
      this.$store.dispatch('getData', userData);
      this.$store.commit("SET_WORK_TIME");

    },
    leavePage() {
      let leave = true
      if (this._beforeEditingProjects){
        this.$store.commit('SET_EXP_LIST', this._beforeEditingProjects)
      }
      if (this._beforeEditingCache) {
        Object.assign(this.userData, this._beforeEditingCache)
        return leave
      }
      // this.$router.push({name: this.routeToGo})
    }
  }
};
</script>

