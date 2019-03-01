<template>
  <div :class="hoverOrEdit ?  'profile-tile profile-main-edit' : 'profile-tile'">
    <div class="profile-tile-header">
      <div class="profile-tile-header-row">
        <h2 class="profile-tile-title">{{ $t("header.education") }}</h2>
        <div class="profile-table-buttons">
          <button class="profile-edit-btn" :disabled="disabledBtnToEdit" v-if="!editMode" @mouseover="hoverOrEdit = true" @mouseout="hoverOrEdit = false" @click="edit">{{ $t("button.edit") }}</button>
          <button class="profile-edit-btn-e" v-if="editMode" @click="addUserEduRow"><span class="prof-btn-icon">&plus;</span><span class="prof-btn-txt">{{ $t("button.addNewEntry")}}</span></button>
          <button class="profile-edit-btn-e" v-if="editMode" @click="cancel"><span class="prof-btn-txt">{{ $t("button.finishEdit") }}</span><span class="prof-btn-icon">&#10004;</span></button>
        </div>
      </div>
      <div class="tile-underscore"></div>
    </div>
    <!-- remove style after adding appropriate classes, it is only for testing purposes  -->
    <div class="profile-tile-content">
      <div class="prof-tile-column">
        <div class="prof-div-row" v-for="(education, index) in sortedEducation" :key='index'>
          <div class="prof-row-dates">
            <div :class="editMode ? 'prof-row-dates-left' : 'prof-row-dates-left-s'">
              <p class="prof-date-label" v-if="!editMode"> {{ formatDate(education.DateStart) }} </p>
              <div v-if="editMode" class="prof-input-xxs">
                <v-date-picker class="prof-input-date" popoverDirection="top" v-if="editMode" :max-date="education.IsCurrent ? new Date() : education.DateEnd" @input="validateDates(index)" is-expanded mode="single" v-model="education.DateStart">
                  <input value="education.DateStart" >
                </v-date-picker>
                <label v-if="editMode">{{ $t("label.from") }}</label>
              </div>
              <span class="prof-span-0">&#8212;</span>
              <!-- &#9472; -->
              <div name="endDateDiv" :id="index">
                <p class="prof-date-label" v-if="!editMode && !education.IsCurrent"> {{ formatDate(education.DateEnd) }} </p>
                <div v-if="editMode && !education.IsCurrent" class="prof-input-xxs">
                  <v-date-picker class="prof-input-date" popoverDirection="top" v-if="editMode" @input="validateDates(index)" is-expanded mode="single" :min-date="education.DateStart" v-model="education.DateEnd">
                    <input value="education.DateEnd">
                  </v-date-picker>
                  <label>{{ $t("label.to") }}</label>
                </div>
              </div>
              <label class="checkbox-wrap">
                <input class="checkbox-margin" :disabled="!editMode" type="checkbox" @change="checkFields(index)" :checked="education.IsCurrent" :name="index" v-model="education.IsCurrent">
                <div class="checkbox-in"></div>
                <p class="p-empty">{{ $t("label.present") }}</p>
              </label>
            </div>
            <!-- SPI wywalić? <div class="prof-row-btns">
              <button class="prof-row-btn" :disabled="true" v-if="editMode" @click="save(index)">&#x2714;</button>
              <button class="prof-row-btn" v-if="editMode" @click="remove(index)">X</button>
            </div> -->
          </div>
          <div class="prof-row-inputs">
            <div class="prof-inputs-div">
              <div class="prof-input-l">
                <select required v-if="editMode" class="selectProfile selectEdit" v-model="education.FieldOfStudy" @change="checkFields(index)">
                  <option v-for="fieldOfStudy in fieldOfStudyDescList" :key="fieldOfStudy.SchoolId" :value="fieldOfStudy.SchoolId">{{fieldOfStudy.SchoolDescription}}</option>
                </select>
                <select disabled v-if="!editMode" class="selectProfile selectDisabled" v-model="education.FieldOfStudy">
                  <option v-for="fieldOfStudy in fieldOfStudyDescList" :key="fieldOfStudy.SchoolId" :value="fieldOfStudy.SchoolId">{{fieldOfStudy.SchoolDescription}}</option>
                </select>
                <!-- :disabled="!editMode" -->
                <span class="cd-span"></span>
                <label class="label-profile">{{ $t("label.fieldOfStudy") }}</label>
              </div>
              <div class="prof-input-l">
                <select required v-if="editMode" class="selectProfile selectEdit" v-model="education.University" @change="checkFields(index)">
                  <option v-for="school in schoolDescList" :key="school.SchoolId" :value="school.SchoolId">{{school.SchoolDescription}}</option>
                </select>
                <select disabled v-if="!editMode" class="selectProfile selectDisabled" v-model="education.University">
                  <option v-for="school in schoolDescList" :key="school.SchoolId" :value="school.SchoolId">{{school.SchoolDescription}}</option>
                </select>
                <span class="cd-span"></span>
                <label class="label-profile">{{ $t("label.university") }}</label>
              </div>
            </div>
            <div class="prof-inputs-div">
              <div class="prof-input-xs">
                <select required v-if="editMode" class="selectProfile selectEdit" @change="checkFields(index)" v-model="education.StudyType">
                  <option v-for="type in studyTypes" :key="type.Key" :value="type.Key">{{type.Value}}</option>
                </select>
                <select disabled v-if="!editMode" class="selectProfile selectDisabled" v-model="education.StudyType">
                  <option v-for="type in studyTypes" :key="type.Key" :value="type.Key">{{type.Value}}</option>
                </select>
                <!-- :disabled="!editMode" -->
                <span class="cd-span"></span>
                <label class="label-profile">{{ $t("label.formOfStudy") }}</label>
              </div>
              <div class="prof-input-xs">
                <!-- <input required v-if="editMode" class="inputProfile inputEdit"  v-model="education.AcademicTitle"> -->
                <!-- <input disabled class="inputProfile inputDisabled" v-if="!editMode" v-model="education.AcademicTitle"> -->
                <select required v-if="editMode" class="selectProfile selectEdit" @change="checkFields(index)" v-model="education.AcademicTitle">
                  <option v-for="type in academicTitles" :key="type.Key" :value="type.Key">{{type.Value}}</option>
                </select>
                <select disabled v-if="!editMode" class="selectProfile selectDisabled" v-model="education.AcademicTitle">
                  <option v-for="type in academicTitles" :key="type.Key" :value="type.Key">{{type.Value}}</option>
                </select>
                <!-- :disabled="!editMode -->
                <span class="cd-span"></span>
                <label class="label-profile">{{ $t("label.degree") }}</label>
              </div>
            </div>
          </div>
          <div class="prof-row-btns eduButtons">
            <button :disabled="true" class="prof-row-btn" v-if="editMode" @click="save(index)">&#x2714;</button>
            <button class="prof-row-dbtn" v-if="editMode" @click="remove(index)">X</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters, mapActions, mapState } from "vuex";
import { required, minLength } from "vuelidate/lib/validators";
const utils = require("../../../utils");
export default {
  props: ['selected-user'],
  data() {
    return {
      editMode: false,
      _beforeEditingCache: null,
      invalidDates: false,
      hoverOrEdit: false,
      allowToSort: true
    };
  },
  watch: {
    selectedUser(value) {
      this.editMode = false;
    }
  },
  computed: {
    ...mapGetters({
      userEducation: "getUserEducation",
      studyTypes: "getStudyTypes",
      academicTitles: "getAcademicTitles",
      schoolDescList: "getSchoolDescList",
      fieldOfStudyDescList: "getFieldOfStudyDescList",
      disabledBtnToEdit: "getDisabledBtnToEdit"
    }),
    sortedEducation() {
      let sortedEdu = [];
      sortedEdu = this.userEducation;
      for(let edu of sortedEdu) {
        if(edu.IsCurrent) {
          edu.DateEnd = new Date()
        }
      }
      this.editMode  && !this.allowToSort ? sortedEdu : sortedEdu.sort((a,b) => ((a.DateEnd < b.DateEnd) ? 1 : (b.DateEnd < a.DateEnd) ? -1 : (a.DateStart < b.DateStart) ? 1 : (a.DateStart < b.DateStart) -1));
      return sortedEdu;
    }
  },
  methods: {
    ...mapActions(["addUserEduRow", "editUserEducation", "addUserEducation"]),
    edit() {
      this.editMode = true;
      this.hoverOrEdit = true;
      this.allowToSort = false;
      this._beforeEditingCache = utils.createClone(this.userEducation);
      var checkboxes = this.$el.querySelectorAll(".checkbox-wrap");
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].setAttribute("style", "display: flex;");
      }
    },
    // validate fields and set button to disabled or not
    checkFields(index) {
      let bChanged,
        bFieldOfStudy,
        bUniversity,
        bStudyType,
        bAcademicTitle,
        bDateStart,
        bDateEnd,
        bCurrent,
        bDateChange,
        beforeEdit = this._beforeEditingCache[index],
        userEdu = this.userEducation[index];
    if(beforeEdit) {
      bFieldOfStudy = beforeEdit.FieldOfStudy !== userEdu.FieldOfStudy;
      bUniversity = beforeEdit.University !== userEdu.University;
      bStudyType = beforeEdit.StudyType !== userEdu.StudyType;
      bAcademicTitle = beforeEdit.AcademicTitle !== userEdu.AcademicTitle;
      bDateStart = utils.dateToValid(beforeEdit.DateStart, userEdu.DateStart, "equal");
      bCurrent = beforeEdit.IsCurrent !== userEdu.IsCurrent;
      if(userEdu.DateEnd) {
          bDateEnd = utils.dateToValid(beforeEdit.DateEnd, userEdu.DateEnd, "equal");
      }
      bDateChange = bCurrent || bDateEnd;
      bChanged =
        bFieldOfStudy ||
        bUniversity ||
        bStudyType ||
        bAcademicTitle ||
        bDateStart ||
        bDateChange
          ? true
          : false;
      }   else {
            bChanged = true;
      }
      this.$store.commit("SET_DATA_CHANGE_PROF", {changed: bChanged, editMode: this.editMode});
      if (this.userEducation.length > 0) {
        if (
          userEdu.FieldOfStudy &&
          userEdu.University &&
          userEdu.StudyType &&
          userEdu.AcademicTitle &&
          userEdu.DateStart &&
          bChanged &&
          (userEdu.DateEnd !== null || userEdu.IsCurrent)
        ) {
          document.getElementsByClassName("eduButtons")[
            index
          ].children[0].disabled = false;
        } else {
          document.getElementsByClassName("eduButtons")[
            index
          ].children[0].disabled = true;
        }
      }
    },
    remove(index) {
      let newData = utils.createClone(this.userEducation[index]);
          newData.Action = 'D';

      if(this.userEducation[index].newRow) {
        return this.userEducation.splice(index, 1)
      } else {
        this.editUserEducation(newData);
        this.userEducation.splice(index, 1);
        this._beforeEditingCache = utils.createClone(this.userEducation)
        this.$store.commit("SET_DATA_CHANGE_PROF", {changed: false, editMode: false});
      }
    },
    //undo changes
    cancel() {
      this.$store.commit("SET_EDUCATION_ERROR", false);
      this.$store.commit("SET_USER_EDUCATION", this._beforeEditingCache);
      this.editMode = false;
      this.allowToSort = true;
      this.hoverOrEdit = false;
      this.$store.commit("SET_DATA_CHANGE_PROF", {changed: false, editMode: false});
    },
    // check if new data should be updated or created
    save(index) {
      delete this.userEducation[index].newRow;

      const dataToChange = this._beforeEditingCache[index],
        newData = utils.createClone(this.userEducation[index]);
        newData.Action = 'U';
      if (dataToChange) {
        newData.AcademicTitleToChange = dataToChange.AcademicTitle;
        newData.FieldOfStudyToChange = dataToChange.FieldOfStudy;
        newData.UniversityToChange = dataToChange.University;
        this.editUserEducation(newData);
      } else {
        this.addUserEducation(newData);
      }
      this._beforeEditingCache = utils.createClone(this.userEducation);
       document.getElementsByClassName("eduButtons")[
            index
          ].children[0].disabled = true;
      this.$store.commit("SET_DATA_CHANGE_PROF", {changed: false, editMode: false});
    },
    formatDate(date) {
      return date !== null && date !== undefined
        ? moment(date).format("DD.MM.YYYY")
        : "-";
    },
    validateDates(index) {
      const startDate = this.userEducation[index].DateStart,
        endDate = this.userEducation[index].DateEnd,
        isCurrent = this.userEducation[index].IsCurrent;

      if (endDate && startDate && isCurrent === false) {
        const formatStartDate = moment(startDate).format("YYYY-MM-DD"),
          formatEndDate = moment(endDate).format("YYYY-MM-DD");

        this.invalidDates = formatStartDate > formatEndDate ? true : false;
      }
      this.checkFields(index);
    }
  }
};
</script>

<style>
</style>
