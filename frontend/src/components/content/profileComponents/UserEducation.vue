<template>
  <div class="profile-tile">
    <div class="profile-tile-header">
      <div class="profile-tile-header-row">
        <h2 class="profile-tile-title">{{ $t("header.education") }}</h2>
        <div class="profile-table-buttons">
          <button class="profile-edit-btn" v-if="!editMode" @mouseover="onHover" @mouseout="onHoverOut" @click="edit">{{ $t("button.edit") }}</button>
          <button class="profile-edit-btn-e" v-if="editMode" @click="addUserEduRow"><span class="prof-btn-icon">&plus;</span><span class="prof-btn-txt">{{ $t("button.addNewEntry")}}</span></button>
          <button class="profile-edit-btn-e" v-if="editMode" @click="cancel"><span class="prof-btn-txt">{{ $t("button.finishEdit") }}</span><span class="prof-btn-icon">&#10004;</span></button>
        </div>
      </div>
      <div class="tile-underscore"></div>
    </div>
    <!-- remove style after adding appropriate classes, it is only for testing purposes  -->
    <div class="profile-tile-content">
      <div class="prof-tile-column">
        <div class="prof-div-row" v-for="(education, index) in userEducation" :key='index'>
          <div class="prof-row-dates">
            <div :class="editMode ? 'prof-row-dates-left' : 'prof-row-dates-left-s'">
              <p class="prof-date-label" v-if="!editMode"> {{ formatDate(education.DateStart) }} </p>
              <div v-if="editMode" class="prof-input-xxs">
                <!-- :max-date="new Date()" -->
                <v-date-picker class="prof-input-date" popoverDirection="top" v-if="editMode" @input="validateDates(index)" is-expanded mode="single" v-model="education.DateStart">
                   <!-- <v-date-picker class="prof-input-date" :max-date="education.DateEnd === null ? new Date() : education.DateEnd" popoverDirection="top" v-if="editMode" @input="validateDates(index)" is-expanded mode="single" v-model="education.DateStart"> -->
                  <input value="education.DateStart" >
                </v-date-picker>
                <label v-if="editMode">{{ $t("label.from") }}</label>
              </div>
              <span class="prof-span-0">&#8212;</span>
              <!-- &#9472; -->
              <div name="endDateDiv" :id="index">
                <p class="prof-date-label" v-if="!editMode"> {{ formatDate(education.DateEnd) }} </p>
                <div v-if="editMode" class="prof-input-xxs">
                  <v-date-picker class="prof-input-date" popoverDirection="top" v-if="editMode" @input="validateDates(index)" is-expanded mode="single" v-model="education.DateEnd">
                  <!-- <v-date-picker class="prof-input-date" popoverDirection="top" :min-date="education.DateStart" :max-date="new Date()" v-if="editMode" @input="validateDates(index)" is-expanded mode="single" v-model="education.DateEnd"> -->
                    <input value="education.DateEnd" />
                  </v-date-picker>
                  <label>{{ $t("label.to") }}</label>
                </div>
              </div>
              <label class="checkbox-wrap">
                <input class="checkbox-margin" :disabled="!editMode" type="checkbox" @change="disableEndDateInput" :name="index" v-model="education.IsCurrent"/>
                <div class="checkbox-in"></div>
                <p style="padding:0;margin:0;">{{ $t("label.present") }}</p>
              </label>
            </div>
            <!-- <div class="prof-row-btns">
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
                <span class="prof-div-bar"></span>
                <label class="label-profile">{{ $t("label.fieldOfStudy") }}</label>       
              </div>
              <div class="prof-input-l">
                <select required v-if="editMode" class="selectProfile selectEdit" v-model="education.University" @change="checkFields(index)">
                  <option v-for="school in schoolDescList" :key="school.SchoolId" :value="school.SchoolId">{{school.SchoolDescription}}</option>
                </select>
                <select disabled v-if="!editMode" class="selectProfile selectDisabled" v-model="education.University">
                  <option v-for="school in schoolDescList" :key="school.SchoolId" :value="school.SchoolId">{{school.SchoolDescription}}</option>
                </select>
                <span class="prof-div-bar"></span>
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
                <span class="prof-div-bar"></span>
                <label class="label-profile">{{ $t("label.formOfStudy") }}</label>
              </div>
              <div class="prof-input-xs">
                <!-- <input required v-if="editMode" class="inputProfile inputEdit"  v-model="education.AcademicTitle"/> -->
                <!-- <input disabled class="inputProfile inputDisabled" v-if="!editMode" v-model="education.AcademicTitle"/> -->
                <select required v-if="editMode" class="selectProfile selectEdit" @change="checkFields(index)" v-model="education.AcademicTitle">
                  <option v-for="type in academicTitles" :key="type.Key" :value="type.Key">{{type.Value}}</option>
                </select>
                <select disabled v-if="!editMode" class="selectProfile selectDisabled" v-model="education.AcademicTitle">
                  <option v-for="type in academicTitles" :key="type.Key" :value="type.Key">{{type.Value}}</option>
                </select>
                <!-- :disabled="!editMode -->
                <span class="prof-div-bar"></span>
                <label class="label-profile">{{ $t("label.degree") }}</label>
              </div>
            </div>
          </div>
          <div class="prof-row-btns eduButtons">
              <button title="" :disabled="true" class="prof-row-btn" v-if="editMode" @click="save(index)">&#x2714;</button>
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
export default {
  data() {
    return {
      editMode: false,
      _beforeEditingCache: null,
      invalidDates: false
    };
  },
  beforeCreate() {
    if (this.$store.getters.isDataLoaded === false) {
      this.$store.dispatch("loadData");
    }
  },
  updated() {
    this.setEduCheckbox();
  },
  // updated() {
  //   if (this.$el) {
  //     var list = this.$el.querySelectorAll("input[type='checkbox']")
  //     for (var i=0;i < list.length; i++) {
  //       var endDate = list[i].parentElement.parentElement.children[2],
  //       checkboxWrap = list[i].parentElement.parentElement.children[3];
  //       if (list[i].checked) {
  //         endDate.setAttribute("style", "display: none;")
  //       } else {
  //         checkboxWrap.setAttribute("style", "display: none;")
  //       }
  //     }
  //   }
  // },
  computed: {
    ...mapGetters({
      userEducation: "getUserEducation",
      studyTypes: "studyTypes",
      academicTitles: "academicTitles",
      schoolDescList: "schoolDescList",
      fieldOfStudyDescList: "fieldOfStudyDescList"
    })
  },
  mounted() {
    // var list = this.$el.querySelectorAll("input[type='checkbox']");
    // for (var i = 0; i < list.length; i++) {
    //   var endDate = list[i].parentElement.parentElement.children[2],
    //     checkboxWrap = list[i].parentElement.parentElement.children[3];
    //   if (list[i].checked) {
    //     endDate.setAttribute("style", "display: none;");
    //   } else {
    //     checkboxWrap.setAttribute("style", "display: none;");
    //   }
    // }
  },
  methods: {
    ...mapActions(["addUserEduRow", "removeUserEducation"]),
    edit() {
      this.editMode = true;
      this.onHover(this.$el)
      this._beforeEditingCache = this.userEducation;
      //  JSON.parse(JSON.stringify(this.userEducation));
      var checkboxes = this.$el.querySelectorAll(".checkbox-wrap");
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].setAttribute("style", "display: flex;");
      }
    },
    onHover(el) {
      const shadow = "0 0 20px orange"
      if (el.style) {
        el.style.boxShadow = shadow
      } else {
        this.$el.style.boxShadow = shadow
      }
    },
    onHoverOut(el) {
      const shadow = "0 0 10px grey"
      if (el.style) {
        el.style.boxShadow = shadow
      } else {
        this.$el.style.boxShadow = shadow 
      }
    },
    checkFields(index) {
      if (this.userEducation.length > 0) {
        // for (let i = 0; i < this.userEducation.length; i++) {
          if (
            this.userEducation[index].FieldOfStudy &&
            this.userEducation[index].University &&
            this.userEducation[index].StudyType &&
            this.userEducation[index].AcademicTitle &&
            this.userEducation[index].DateStart &&
            (this.userEducation[index].DateEnd !== null ||
              this.userEducation[index].IsCurrent)
          ) {
            document.getElementsByClassName("eduButtons")[index].children[0].disabled = false;
          } else {
            document.getElementsByClassName("eduButtons")[index].children[0].disabled = true;
          }
        // }
      }
    },
    remove(index) {
      this._beforeEditingCache.splice(index, 1);
      this.removeUserEducation(index);
    },
    cancel() {
      this.onHoverOut(this.$el);
      this.$store.commit("SET_EDUCATION_ERROR", false);
      this.$store.commit("SET_USER_EDUCATION", this._beforeEditingCache);
      this.editMode = false;
    },
    save(index) {
      const dataToChange = this._beforeEditingCache[index],
        newData = this.userEducation[index];

      if (dataToChange) {
          newData.AcademicTitleToChange = dataToChange.AcademicTitle;
          newData.FieldOfStudyToChange = dataToChange.FieldOfStudy;
          newData.UniversityToChange = dataToChange.University;
          this.$store.dispatch("editUserEducation", newData);
        } else {
          this.$store.dispatch("addUserEducation", newData);
        }

        this._beforeEditingCache = this.userEducation;
        //  = JSON.parse(
          // JSON.stringify(this.userEducation)
        // );
    },
    formatDate(date) {
      return date !== null && date !== undefined ? moment(date).format("DD.MM.YYYY") : "-";
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
    },
    disableEndDateInput(value) {
      const isCurrent = value.target.checked,
        index = value.target.name,
        input = document.getElementById(index);

      if (isCurrent) {
        // input.setAttribute("style", "opacity: 0");
        input.setAttribute("style", "display: none;");
        this.userEducation[index].DateEnd = null;
      } else {
        // input.setAttribute("style", "opacity: 1");
        input.setAttribute("style", "display: flex;");
      }
      this.checkFields(index);
    },
    setEduCheckbox(index) {
      let edu = this.$store.getters.getUserEducation;
      let input;

      for(let i = 0; i < edu.length; i++) {
         if(edu[i].IsCurrent === true) {
              input = document.getElementById(i);
              input.setAttribute("style", "display: none");
          }
      }
    }
  }
};
</script>

<style>
</style>
