<template>
  <div class="plane-profile">
    <div class="profile-nav-and-content">
      <app-menu v-show="displayMenu"></app-menu>
      <div class="modal-overlay" v-show="displayOverlay"></div>
      <leave-page-dialog v-if="showLeavePageDialog"></leave-page-dialog>
      <div class="profile-content">
        <div class="profile-header">
          <div class="profile-header-title-and-menu">
            <div @click="showMenu" class="content-header-menu">&#9776;</div>
            <p class="profile-header-title">{{ $t("header.profile") }}</p>
          </div>
          <div v-if="!editMode" class="prof-input-lang">
            <select required class="selectLang" v-model="selectedCvLang" @change="getNewData">
              <option v-for="language in cvLanguageList" :key="language.id" :value="language.id">{{ language.description }}</option>
            </select>
            <label class="label-select-lang">{{ $t("label.language") }}</label>
          </div>
          <button  :disabled="disabledBtnToEdit" class="profile-header-button" @mouseout="onHoverOut" @mouseover="onHover" v-if="!editMode" @click="onEdit">{{ $t("button.editData") }}</button>
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
              <div class="profile-tile-1-3 profile-main-edit">
                <div class="profile-tile-header">
                  <h2 class="prof-tile-h2">{{ $t("header.contact") }}</h2>
                  <div class="tile-underscore"></div>
                </div>
                <div class="profile-tile-content">
                  <!-- <div class="profile-tile-inputs-section profile-inputs-sections-1"> -->
                  <div class="profile-tile-inputs">
                    <div class="prof-input">
                      <!-- <input required v-if="editMode" class="inputProfile" @input="checkFormFields" :class="editMode ? 'inputEdit' : 'inputDisabled'" :disabled="!editMode" v-model="userData.address"> -->
                      <!-- <input required v-if="editMode" @input="checkFormFields" class="inputProfile inputEdit" v-model="userData.address"> -->
                      <div class="prof-input-adr" v-if="editMode">
                        <div class="prof-input-uno">
                          <input required v-model="userData.Street" v-on:input="checkFormFields()" />
                          <span class="prof-div-bar"></span>
                          <label class="prof-ainput-lbl">{{ $t("label.street") }}</label>
                        </div>
                        <div class="prof-input-uno">
                          <input required v-model="userData.BuildingNumber" v-on:input="checkFormFields()"/>
                          <span class="prof-div-bar"></span>
                          <label class="prof-ainput-lbl">{{ $t("label.buildingNumber") }}</label>
                        </div>
                        <div class="prof-input-uno">
                          <input required v-model="userData.ApartmentNumber" v-on:input="checkFormFields()">
                          <span class="prof-div-bar"></span>
                          <label class="prof-ainput-lbl">{{ $t("label.apartmentNumber") }}</label>
                        </div>
                        <div class="prof-input-uno">
                          <input required v-model="userData.City" v-on:input="checkFormFields()">
                          <span class="prof-div-bar"></span>
                          <label class="prof-ainput-lbl">{{ $t("label.city") }}</label>
                        </div>
                        <div class="prof-input-uno">
                          <input required v-model="userData.PostalCode" v-on:input="checkFormFields()">
                          <span class="prof-div-bar"></span>
                          <label class="prof-ainput-lbl">{{ $t("label.postalCode") }}</label>
                        </div>
                      </div>
                      <p v-if="!editMode" disabled class="inputProfile inputDisabled">{{ formatAddress }}</p>
                      <!-- <input v-if="!editMode" :value="formatAddress" disabled class="inputProfile inputDisabled"> -->
                      <label v-if="!editMode" class="label-profile">{{ $t("label.address") }}</label>
                    </div>
                    <div class="prof-input">
                      <!-- <input required class="inputProfile" @input="checkFormFields" :class="editMode ? 'inputEdit' : 'inputDisabled'" :disabled="!editMode" v-model="userData.email" @blur="$v.userData.email.$touch()"> -->
                      <input required v-if="editMode" class="inputEdit inputProfile" @input="checkFormFields"  v-model="userData.Email" @blur="$v.userData.Email.$touch()">
                      <input v-if="!editMode" disabled type="text" class="inputDisabled inputProfile " v-model="userData.Email">
                      <span class="prof-div-bar"></span>
                      <label class="label-profile">{{ $t("label.email") }}</label>
                      <!-- <div class="error-wrapper">
                        <p class="profile-error profile-error-email" v-if="$v.userData.email.$invalid">{{ $t("message.emailValidation") }}</p>
                      </div> -->
                      <p class="prof-error" v-if="$v.userData.Email.$invalid">{{ $t("message.emailValidation") }}</p>
                    </div>
                    <div class="prof-input">
                      <!-- <input class="inputProfile" :class="editMode ? 'inputEdit' : 'inputDisabled'" :disabled="!editMode" v-model="userData.phone" @input="phoneValidation"> -->
                      <input required v-if="editMode" class="inputEdit inputProfile" v-model="userData.Telephone" @input="phoneValidation">
                      <input v-if="!editMode" disabled class="inputDisabled inputProfile" v-model="userData.Telephone">
                      <span class="prof-div-bar"></span>
                      <label class="label-profile">{{ $t("label.phone") }}</label>
                      <!-- <div class="error-wrapper">
                        <p class="profile-error profile-error-phone" v-if="invalidPhone">{{ $t("message.phoneValidation") }}</p>
                      </div> -->
                      <p class="prof-error" v-if="invalidPhone">{{ $t("message.phoneValidation") }}</p>
                    </div>
                  </div>
                  <!-- </div> -->
                </div>
              </div>
              <div class="profile-tile-1-3 profile-main-edit">
                <div class="profile-tile-header">
                  <h2 class="prof-tile-h2">{{ $t("header.communicators") }}</h2>
                  <div class="tile-underscore"></div>
                </div>
                <div class="profile-tile-content">
                  <div class="profile-tile-inputs">
                    <div class="prof-input-m">
                      <!-- <input class="inputProfile" @input="checkFormFields" :class="editMode ? 'inputEdit' : 'inputDisabled'" :disabled="!editMode" v-model="userData.skype"> -->
                      <input required v-if="editMode" class="inputProfile inputEdit" @input="checkFormFields" v-model="userData.SkypeId">
                      <input v-if="!editMode" disabled class="inputProfile inputDisabled" v-model="userData.SkypeId">
                      <span class="prof-div-bar"></span>
                      <label class="label-profile">{{ $t("label.skype") }}</label>
                      <img class="prof-comm-img" src="../../assets/images/comm/grey/skype.png"/>
                    </div>
                    <div class="prof-input-m">
                      <!-- <input class="inputProfile" @input="checkFormFields" :class="editMode ? 'inputEdit' : 'inputDisabled'" :disabled="!editMode" v-model="userData.slack"> -->
                      <input required v-if="editMode" class="inputProfile inputEdit" @input="checkFormFields" v-model="userData.SlackId">
                      <input disabled v-if="!editMode" class="inputProfile inputDisabled" v-model="userData.SlackId">
                      <span class="prof-div-bar"></span>
                      <label class="label-profile">{{ $t("label.slack") }}</label>
                      <img class="prof-comm-img" src="../../assets/images/comm/grey/slack.png"/>
                    </div>
                  </div>
                </div>
              </div>
              <div class="profile-tile-1-3-emp">
                <!-- <div class="profile-tile-header"> -->
                  <!-- <div class="tile-underscore"></div> -->
                <!-- </div> -->
                <div class="profile-tile-content">
                  <div class="profile-user-header">
                    <div class="profile-user-img">
                      <div class="picture-loader" v-if="!userPhoto">
                      </div>
                      <img class="img-user-class" id="userProfilePhoto" :src="userPhoto" width="150px">
                      <p class="profile-error profile-error-image" v-if="photoUploadError">{{ $t("message.photoUploadError") }}</p>
                      <label v-if="!disabledBtnToEdit" for="change-user-image" class="profile-edit-btn">{{ $t("button.changePhoto") }}
                        <input accept="image/*" style="width: 1rem;" type="file" ref="photo" @change="handlePhotoUpload" id="change-user-image">
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="profile-tiles-row">
              <div class="profile-tile-1-2 profile-main-edit">
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
                        <input disabled class="inputProfile inputDisabled" v-model="userData.JobPosition">
                        <label class="label-profile">{{ $t("label.position") }}</label>
                      </div>
                      <!-- dodawanie nowej pozycji przez BO lub Management -->
                      <!-- <div v-if="editMode" class="prof-input-s">
                        <input disabled v-if="!editMode" class="inputProfile inputDisabled" v-model="newPosition"/>
                        <input v-on:keyup.enter="addNewPositionForUser" required v-if="editMode" class="inputProfile inputEditPos" v-model="newPosition"/>
                        <span class="prof-div-bar"></span>
                        <label class="label-profile">{{ $t("label.position") }}</label>
                        <button class="prof-div-pos-btn" @click="addNewPositionForUser">+</button>
                        <button class="prof-div-pos-elem" v-for="position in userPositions" :key="position" @click="removeUserPosition(position)">{{position}}</button>
                      </div> -->
                      <div class="prof-input-s">
                        <input v-if="editMode" required class="inputProfile inputEdit" @input="checkFormFields" v-model="userData.CurrentProject">
                        <input disabled v-if="!editMode" class="inputDisabled inputProfile" v-model="userData.CurrentProject">
                        <span class="prof-div-bar"></span>
                        <label class="label-profile">{{ $t("label.project") }}</label>
                      </div>
                    </div>
                    <div class="profile-tile-inputs">
                      <div class="prof-input-s">
                      <select required v-if="editMode" v-model="userData.WorkTime" @change="checkFormFields" class="selectProfile selectEdit">
                        <option v-bind:key="key" v-for="(value,key) in workTime" :value="key">{{value}}</option>
                      </select>
                      <!-- <select v-model="userData.state" @change="checkFormFields" class="selectProfile" :class="editMode ? 'selectEdit' : 'selectDisabled'" :disabled="!editMode"> -->
                      <!-- <p v-if="!editMode" class="inputDisabled">{{ userData.state }}</p> -->
                      <select disabled v-if="!editMode" v-model="userData.WorkTime" @change="checkFormFields" class="selectProfile selectDisabled">
                        <option v-bind:key="key" v-for="(value,key) in workTime" :value="key">{{value}}</option>
                      </select>
                      <label class="label-profile">{{ $t("label.worktime") }}</label>
                    </div>
                    <div class="prof-input-s">
                      <!-- <masked-input mask="11.11.1111" @input="dateValidation" class="inputProfile" :class="editMode ? 'inputEdit' : 'inputDisabled'" :disabled="!editMode" v-model="userData.employmentDate" /> -->
                      <!-- <masked-input required v-if="editMode" mask="11.11.1111" @input="dateValidation" class="inputProfile inputEdit" v-model="userData.EmploymentDate" /> -->
                      <input :value="formatDate" disabled class="inputProfile inputDisabled" v-if="!editMode">
                      <v-date-picker  @input="checkFormFields" v-if="editMode" class="delegations-input-date inputDisabled" v-model="userData.EmploymentDate" :max-date="new Date()">
                        <input value="userData.employmentDate"/>
                      </v-date-picker>
                      <!-- <input required v-if="editMode" @input="dateValidation" class="inputProfile inputEdit" v-model="userData.EmploymentDate"> -->
                      <!-- <v-date-picker :max-date="new Date()" v-if="projectEditMode" class="inputProfile" :class="editMode ? 'inputEdit' : 'inputDisabled'" :disabled="!editMode" is-expanded mode="single" v-model="userData.employmentDate">
                        <input value="userData.employmentDate" />
                      </v-date-picker> -->
                      <!-- <input disabled v-if="!editMode" class="inputProfile inputDisabled" v-model="userData.EmploymentDate"> -->
                      <!-- <v-date-picker disabled v-model="userData.EmploymentDate">
                        <input value="userData.EmploymentDate" />
                      </v-date-picker> -->
                      <span class="prof-div-bar"></span>
                      <label class="label-profile">{{ $t("label.employmentDate") }}</label>
                      <!-- <div class="error-wrapper">
                        <p class="profile-error profile-error-date" v-if="invalidDate">{{ $t("message.dateValidation") }}</p>
                      </div> -->
                      <p class="prof-error" v-if="invalidDate">{{ $t("message.dateValidation") }}</p>
                    </div>
                    <div class="prof-input-s">
                      <!-- <input class="inputDisabled inputProfile" :disabled="true" v-model="userData.seniority"> -->
                      <input required v-if="editMode" :disabled="true" class="inputDisabled inputProfile" :value="setFormatedDate">
                      <!-- <p v-if="!editMode" class="inputDisabled">{{userData.WorkExperience}}</p> -->
                      <input disabled class="inputProfile inputDisabled" v-if="!editMode" :value="setFormatedDate">
                      <label class="label-profile">{{ $t("label.workExperience") }}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <user-cv-tile></user-cv-tile>
          </div>
        </div>
        <user-education-component></user-education-component>
        <user-experience-component></user-experience-component>
        <user-projects-component></user-projects-component>
        <user-skills-component></user-skills-component>
        <select-cv-content v-show="showSelectCv"></select-cv-content>
        <div v-show="showSelectCv" class="modal-overlay"></div>
        <change-user-password v-show="showPasswordDialog"></change-user-password>
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
      selectedUser: this.$store.getters.getSelectedForCvUser || localStorage.getItem("id")
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
  mounted() {
  },
  // set login language
  beforeRouteLeave(to, from, next) {
    let lang = this.loginLanguage.toLowerCase();
    if (lang == "") {
      lang = "pl";
    }
    this.$store.commit("SET_LANG", lang);
    this.$store.commit("SET_SELECTED_FOR_CV_USER", localStorage.getItem("id"));

    if (this.editMode && this.hasDataChanged) {
      this.$store.commit('SET_LEAVE_PAGE_DIALOG', true)
      if (this.leavePageFlag !== null) {
        if (this.leavePageFlag === false) {
          return
        } else {
          next()
        }
      }      
    } else {
      next()
    }
    // next();
  },
  beforeRouteEnter(to, from, next) {
    if(from.name  ===  "Employees") {
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
    if(oStore.getters.getCookie){
      if(oStore.getters.getGoFromCv && oStore.getters.getRoleList.length > 0){ // if go from CV - do not read data
        oStore.commit("SET_GO_FROM_CV", false);
      } else {   
        oStore.dispatch('getData', null);
      }
    }
    utils.checkAuthLink(this.$router, oStore.getters.getUserAuth.ZMENU);
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
    "modal": Modal
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
      leavePageFlag: "getLeavePageFlag"
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

      return date !== null && date !== undefined
        ? moment(date).format("DD.MM.YYYY")
        : "-";
    },
    setFormatedDate() {
      let oCalculateDifference = moment.preciseDiff(this.userData.EmploymentDate, new Date(), true),
          oFormatedDate;
        // if there is some differences - show work experience
        if(oCalculateDifference){
          oFormatedDate = utils.setWorkExperience(oCalculateDifference);
        }
        if(oFormatedDate.day.includes('NaN')) {
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
  // beforeRouteLeave(to, from , next) {
  //   if (this.editMode && this.hasDataChanged) {
  //     this.$store.commit('SET_LEAVE_PAGE_DIALOG', true)
  //     if (this.leavePageFlag !== null) {
  //       if (this.leavePageFlag === false) {
  //         return
  //       } else {
  //         next()
  //       }
  //     }      
  //   } else {
  //     next()
  //   }
  // },
  watch: {
    selectedUser(value) {
      let profileActivityAuth = this.$store.getters.getUserAuth.ZPROF_ATCV;
      if(profileActivityAuth === '*') {
        this.$store.commit('SET_DISABLED_BTN_TO_EDIT', false);
      } else if(profileActivityAuth === 'TEAM' && this.filteredTeamUsers.find(o => o.UserAlias === this.selectedUser)) {
        this.$store.commit('SET_DISABLED_BTN_TO_EDIT', false);
      } else if(this.selectedUser === this.loginAlias) {
       this.$store.commit('SET_DISABLED_BTN_TO_EDIT', false);
      } else {
       this.$store.commit('SET_DISABLED_BTN_TO_EDIT', true);
      }
      localStorage.setItem('cvUser', this.selectedUser);
    },
    leavePageFlag(newFlag, oldFlag) {

    }
  },
  methods: {
    ...mapActions({
      getUserData: "getUserData",
      getGoFromCv: "getGoFromCv"
    }),
      showMenu(event) {
      let obj = { window, event };
      this.$store.dispatch("setSideMenu", obj);
    },
    onEdit() {
      this.showNoChangesAlert = false;
      this.editMode = !this.editMode;
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
    handlePhotoUpload() {
      this.photo = this.$refs.photo.files[0];
      this.disableSubmit = false;
      let data = {
        file: this.photo,
        userId:  this.selectedUser,//localStorage.getItem("id"),
        type: "USER-PHOTO",
        language: "PL"
      };
      this.$store.dispatch("submitPhoto", data);
    },
    phoneValidation(value) {
      const regex = new RegExp("^(?=.*[0-9])[- +()0-9]+$");
      this.invalidPhone = regex.test(value.target.value) ? false : true;
      this.checkFormFields();
    },
    // dateValidation(value) {
    //   const day = parseInt(value.slice(0, 2)),
    //       month = parseInt(value.slice(3, 5));

    //   this.invalidDate = day > 31 || month > 12 ? true : false;
    //   this.disableSaveBtn = day > 31 || month > 12 ? true : false;

    //   this.checkFormFields();
    // },
    checkFormFields() {
      if (this.invalidPhone || this.invalidDate || this.$v.userData.Email.$invalid) {
        this.disableSaveBtn = true;
      } else {
        this.checkIfDataChanged();
        this.disableSaveBtn = this.hasDataChanged === true ? false : true;
      }
    },
    // generateCV() {},
    addNewPositionForUser() {
      const userPos = this.userPositions;
      userPos.push(this.newPosition);
      this.$store.commit("SET_USER_JOB_POS", userPos);
    },
    removeUserPosition(position) {
      const userPos = this.userPositions;
      for (let i = 0; userPos.length; i++) {
        if (userPos[i] == position) {
          userPos.splice(i, 1);
          this.$store.commit("SET_USER_JOB_POS", userPos);
          return;
        }
      }
    },
    // get data for selected language
    getNewData() {
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
    onHover() {
      let mainEdits = document.querySelectorAll(".profile-main-edit");
      for (let i = 0; i < mainEdits.length; i++) {
        mainEdits[i].style.boxShadow = "0 0 20px orange";
      }
    },
    onHoverOut() {
      let mainEdits = document.querySelectorAll(".profile-main-edit");
      for (let i = 0; i < mainEdits.length; i++) {
        mainEdits[i].style.boxShadow = "0 0 10px grey";
      }
    },
    setUserCity: function (addressData, placeResultData, id) {
      this.userData.City = addressData.locality;
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
    },
  }
};
</script>

<style>

</style>
