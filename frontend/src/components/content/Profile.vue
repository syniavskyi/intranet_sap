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
                <div v-if="!editMode" class="prof-input-lang"> 
                    <select required class="selectLang" v-model="selectedCvLang" @change="getNewData">
                        <option v-for="language in cvLanguageList" :key="language.id" :value="language.id">{{ language.description }}</option>
                    </select>
                    <label class="label-select-lang">{{ $t("label.language") }}</label>
                </div>
                <button class="profile-header-button" @mouseout="onHoverOut" @mouseover="onHover" v-if="!editMode" @click="onEdit">{{ $t("button.editData") }}</button>
                <div v-if="editMode" class="header-button-save-reject">
                    <p class="profile-error profile-error-data" v-if="!saveChangesSuccess">{{ $t("message.saveChangesError") }}</p>
                    <button class="border-btn save-btn" @click="onSaveChanges" :disabled="disableSaveBtn">{{ $t("button.saveChanges") }}</button>
                    <button class="border-btn reject-btn" @click="onCancelEdit">{{ $t("button.cancel") }}</button>
                </div>
            </div>
            <h3 class="prof-user-header-name">{{userData.Fullname}}</h3>
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
                                                <input required v-model="userData.Street"/>
                                                <span class="prof-div-bar"></span>
                                                <label class="prof-ainput-lbl">{{ $t("label.Street") }}</label>
                                            </div>
                                            <div class="prof-input-uno">
                                                <input required v-model="userData.BuildingNumber"/>
                                                <span class="prof-div-bar"></span>
                                                <label class="prof-ainput-lbl">{{ $t("label.buildingNumber") }}</label>
                                            </div>
                                            <div class="prof-input-uno">
                                                <input required v-model="userData.ApartmentNumber">
                                                <span class="prof-div-bar"></span>
                                                <label class="prof-ainput-lbl">{{ $t("label.apartmentNumber") }}</label>
                                            </div>
                                            <div class="prof-input-uno">
                                                <vue-google-autocomplete required types="geocode" id="autocomplete" placeholder="" onfocus="value = ''" @input="userData.City = value" :value="selectedCity"  @change="checkFormFields"></vue-google-autocomplete>
                                                <span class="prof-div-bar"></span>
                                                <label class="prof-ainput-lbl">{{ $t("label.city") }}</label>
                                            </div>
                                            <div class="prof-input-uno">
                                                <input required v-model="userData.PostalCode">
                                                <span class="prof-div-bar"></span>
                                                <label class="prof-ainput-lbl">{{ $t("label.postalCode") }}</label>
                                            </div>
                                        </div>
                                        <p v-if="!editMode" disabled class="inputProfile inputDisabled">{{formatAddress}}</p>
                                        <!-- <label class="label-profile">{{ $t("label.address") }}</label> -->
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
                            <h2 class="prof-tile-h2">Komunikatory</h2>
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
                        <div class="profile-tile-header">
                            <!-- <div class="tile-underscore"></div> -->
                        </div>
                        <div class="profile-tile-content">
                            <div class="profile-user-header">
                                <div class="profile-user-img">
                                    <img class="img-user-class" id="userProfilePhoto" :src="setImageSrc()" width="150px">
                                    <!-- <img class="img-user-class" id="userProfilePhoto" src="nw5.local.pl:8050/sap/opu/odata/sap/ZGW_INTRANET_SRV/AttachmentMedias(FileType='USER-PHOTO',Language='PL',UserAlias='UIO')/$value" width="150px"> -->
                                    <!-- <img class="img-user-class" id="userProfilePhoto" :src="userData.imgUrl" width="150px"> -->
                                    <p class="profile-error profile-error-image" v-if="photoUploadError">{{ $t("message.photoUploadError") }}</p>
                                    <label for="change-user-image" class="profile-edit-btn">{{ $t("button.changePhoto") }}
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
                                <button @click="showChangePassword" class="func-btn"><span class="prof-btn-txt">zmień hasło</span><span class="prof-btn-icon">&#x1f513;</span></button>
                            </div>
                            <div class="tile-underscore"></div>
                        </div>
                        <div class="profile-tile-content">
                            <div class="profile-tile-inputs-section">
                                <div class="profile-tile-inputs">
                                    <div class="prof-input-s">
                                        <!-- <input class="inputDisabled inputProfile" :disabled="true" v-model="userData.branch"> -->
                                        <input disabled class="inputDisabled inputProfile" v-model="userData.DepartmentName">
                                        <label class="label-profile">{{ $t("label.department") }}</label>
                                    </div>
                                    <div class="prof-input-s">
                                        <!-- <input class="inputDisabled inputProfile" :disabled="true" v-model="userData.section"> -->
                                        <input disabled class="inputProfile inputDisabled" v-model="userData.SectionName">
                                        <label class="label-profile">{{ $t("label.branch") }}</label>
                                    </div>
                                    <div class="prof-input-s">
                                        <!-- <input class="inputDisabled inputProfile" :disabled="true" v-model="userData.position"> -->
                                        <input disabled class="inputProfile inputDisabled" v-model="userData.JobPosition">
                                        <label class="label-profile">{{ $t("label.position") }}</label>
                                    </div>
                                    <!-- dodawanie nowej pozycji przez BO lub Management -->
                                    <div v-if="editMode" class="prof-input-s">
                                        <input disabled v-if="!editMode" class="inputProfile inputDisabled" v-model="newPosition"/>
                                        <input v-on:keyup.enter="addNewPositionForUser" required v-if="editMode" class="inputProfile inputEditPos" v-model="newPosition"/>
                                        <span class="prof-div-bar"></span>
                                        <label class="label-profile">Position</label>
                                        <button class="prof-div-pos-btn" @click="addNewPositionForUser">+</button>
                                        <button class="prof-div-pos-elem" v-for="position in userPositions" :key="position" @click="removeUserPosition(position)">{{position}}</button>
                                    </div>
                                    <div class="prof-input-s">
                                        <input v-if="editMode" required class="inputProfile inputEdit" @input="checkFormFields" v-model="userData.CurrentProject">
                                        <input disabled v-if="!editMode" class="inputDisabled inputProfile" v-model="userData.CurrentProject">
                                        <span class="prof-div-bar"></span>
                                        <label class="label-profile">{{ $t("label.project") }}</label>
                                    </div>
                                </div>
                                <div class="profile-tile-inputs">
                                    <div class="prof-input-s">
                                        <!-- <select v-model="userData.state" @change="checkFormFields" class="selectProfile" :class="editMode ? 'selectEdit' : 'selectDisabled'" :disabled="!editMode"> -->
                                        <select required v-if="editMode" v-model="userData.WorkTime" @change="checkFormFields" class="selectProfile selectEdit" >
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
                                        <!-- <p v-if="!editMode" class="inputDisabled">{{ userData.state }}</p> -->
                                        <select disabled v-if="!editMode" v-model="userData.WorkTime" @change="checkFormFields" class="selectProfile selectDisabled"></select>
                                        <label class="label-profile">{{ $t("label.worktime") }}</label>
                                    </div>
                                    <div class="prof-input-s">
                                        <!-- <masked-input mask="11.11.1111" @input="dateValidation" class="inputProfile" :class="editMode ? 'inputEdit' : 'inputDisabled'" :disabled="!editMode" v-model="userData.employmentDate" /> -->
                                        <!-- <masked-input required v-if="editMode" mask="11.11.1111" @input="dateValidation" class="inputProfile inputEdit" v-model="userData.EmploymentDate" /> -->
                                        <v-date-picker  class="delegations-input-date" v-model="userData.EmploymentDate" :disabled-dates='{}'>
                                            <input :disabled="!editMode" value="userData.employmentDate"/>
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
                                        <input required v-if="editMode" :disabled="true" class="inputDisabled inputProfile" v-model="userData.WorkExperience">
                                        <!-- <p v-if="!editMode" class="inputDisabled">{{userData.WorkExperience}}</p> -->
                                        <input disabled class="inputProfile inputDisabled" v-if="!editMode">
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

import { required, email } from "vuelidate/lib/validators";
import htmlDocx from "html-docx-js/dist/html-docx";
import { saveAs } from "file-saver";
import { mapGetters, mapActions } from "vuex";

import VueGoogleAutocomplete from "vue-google-autocomplete";
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
      showLeavePageDialog: false,
      routeToGo: null,
      newPosition: null,
      selectedCity: null,
      selectedCvLang: i18n.locale
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
  watch: {
    selectedCvLang(lang) {
      // this.$store.commit('SET_LANG', lang);
      // this.setCvLanguage(lang);
    }
  },
  beforeCreate() {
    if (this.$store.getters.isDataLoaded === false) {
      this.$store.dispatch("loadData");
    }
  },
  // mounted() {
  //   const sUserId = localStorage.getItem("id"),
  //               sLanguage = 'PL',
  //               sFileType = "USER-PHOTO",
  //               image = document.getElementById('userProfilePhoto');

  //           const url =
  //               "http://nw5.local.pl:8050/sap/opu/odata/sap/ZGW_INTRANET_SRV/AttachmentMedias(FileType='" +
  //               sFileType +
  //               "',Language='" +
  //               sLanguage +
  //               "',UserAlias='" +
  //               sUserId +
  //               "')/$value";

  //         image.src = url
  // },
  beforeRouteLeave(to, from, next) {
    //   const answer = window.confirm('Zmiana')
    //   if(answer) {
    let lang = this.loginLanguage;
    if (lang == "") {
      lang = "pl";
    }
    this.$store.commit('SET_LANG', lang);
    // this.setLanguage(lang);
    next();
    //   } else {
    //       next(false);
    //   }
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
    VueGoogleAutocomplete: VueGoogleAutocomplete
  },
  computed: {
    ...mapGetters({
      userData: "getUserInfo",
      saveChangesSuccess: "isSaveChangesSuccess",
      photoUploadError: "isSavePhotoError",
      userPositions: "getUserJobPositions",
      cvLanguageList: "getCvLanguageList",
      loginLanguage: "getLoginLanguage",
      showSelectCv: "getShowSelectCvDialog",
      showPasswordDialog: "getShowSelectChangePasswordDialog"
    }),
    formatAddress() {
      const data = this.userData;
      let address = data.Street + " " + data.BuildingNumber;
      if (data.ApartmentNumber) {
        address = address + "/" + data.ApartmentNumber;
      }
      address = address + ", " + data.PostalCode + " " + data.City;
      return address;
    }
  },
  // beforeRouteLeave (to, from , next) {
  // this.showLeavePageDialog = true
  //     this.routeToGo = to.name
  // },
  methods: {
    onEdit() {
      this.showNoChangesAlert = false;
      this.editMode = !this.editMode;
      this._beforeEditingCache = Object.assign({}, this.userData);
    },
    showChangePassword() {
      this.$store.commit('SET_SHOW_CHANGE_PASSWORD_DIALOG', true)
    },
    formatDate(date) {
      return date !== null && date !== undefined
        ? moment(date).format("DD.MM.YYYY")
        : "-";
    },
    onCancelEdit() {
      Object.assign(this.userData, this._beforeEditingCache);
      this._beforeEditingCache = null;
      this.showNoChangesAlert = false;
      this.editMode = !this.editMode;
    },
    onSaveChanges() {
      this.showNoChangesAlert = false;
      this.checkIfDataChanged();
      if (this.hasDataChanged === false) {
        this.showNoChangesAlert = true;
      } else {
        this.$store.dispatch("saveUserData", this.userData);
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
        userId: localStorage.getItem("id"),
        type: "USER-PHOTO",
        language: "PL"
      };
      this.$store.dispatch("submitPhoto", data);
    },
    setImageSrc() {
      // e.g. AttachmentMedias(FileType='CV',Language='PL',UserAlias='MHA')/$value
      const sUserId = localStorage.getItem("id"),
        sLanguage = "PL",
        sFileType = "USER-PHOTO";

      const url =
        "https://nw5.local.pl:8050/sap/opu/odata/sap/ZGW_INTRANET_SRV/AttachmentMedias(FileType='" +
        sFileType +
        "',Language='" +
        sLanguage +
        "',UserAlias='" +
        sUserId +
        "')/$value";

      return url;
    },
    phoneValidation(value) {
      const regex = new RegExp("^(?=.*[0-9])[- +()0-9]+$");
      this.invalidPhone = regex.test(value.target.value) ? false : true;
      this.checkFormFields();
    },
    dateValidation(value) {
      const day = parseInt(value.slice(0, 2)),
        month = parseInt(value.slice(3, 5));

      this.invalidDate = day > 31 || month > 12 ? true : false;
      this.disableSaveBtn = day > 31 || month > 12 ? true : false;

      this.checkFormFields();
    },
    checkFormFields() {
      if (
        this.invalidPhone ||
        this.invalidDate ||
        this.$v.userData.Email.$invalid
      ) {
        this.disableSaveBtn = true;
      } else {
        this.checkIfDataChanged();
        this.disableSaveBtn = this.hasDataChanged === true ? false : true;
      }
    },
    generateCV() {},
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
    // setCvLanguage(language) {
    //   this.$store.dispatch("setCvLanguage", language);
    // },
    // setLanguage(language) {
    //   this.$store.dispatch("setLanguage", language);
    // },
    getNewData() {
      this.$store.commit('SET_LANG', this.selectedCvLang);
      let cvLang = this.selectedCvLang.toUpperCase();
      let userData = {};
      userData.user = "UIO";
      userData.lang = cvLang;
      this.$store.dispatch("loadData", userData);
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
};
</script>

<style>
.prof-input-adr {
  display: flex;
  list-style: none;

  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  /* overflow: hidden; */
}
.prof-input-uno:first {
  width: 25%;
}
.prof-input-uno {
  position: relative;
  width: 20%;
  transition: all 0.5s ease;
}

.prof-input-uno input:focus ~ span:before,
.prof-input-uno input:focus ~ span:after,
.prof-input-uno input:hover ~ span:before,
.prof-input-uno input:hover ~ span:after {
  width: 50%;
}

.prof-input-uno input {
  display: flex;
  flex: initial;
  width: 100%;
  flex: 1;
  transition: flex 0.5s ease;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  border: 0;
  border-bottom: 1px solid #ccc;
  height: 2.2rem;
  /* position: relative; */
  flex-basis: 0;
  padding-left: 0.4rem;
}

input:focus {
  outline: none;
  /* border-bottom: 2px solid orange; */
}

.prof-input-uno:hover,
.prof-input-uno:focus,
.prof-input-uno:focus-within {
  width: 70%;
}

.prof-input-uno input:hover ~ label,
.prof-input-uno input:focus ~ label,
.prof-input-uno input:valid ~ label {
  transform: rotate(0deg);
  /* font-size: .8rem; */
  color: orange;
  top: -0.4rem;
  left: 0.2rem;
  background: white;
  /* padding:.2rem; */
}

.prof-ainput-lbl {
  display: flex;
  flex-wrap: nowrap;
  position: absolute;
  width: 100%;
  font-size: 0.75rem;
  /* transform: rotate(-90deg); */
  transition: all 0.5s ease;
  color: #999;
  /* left: -.8rem; */
  top: 0.6rem;
  pointer-events: none;
  /* padding:0 .15rem; */
}

.checkbox-wrap input {
  height: 1.19rem;
}

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
