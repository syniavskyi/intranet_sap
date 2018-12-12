<template>
  <div class="profile-tile">
    <div class="profile-tile-header">
      <div class="profile-tile-header-row">
        <h2 class="profile-tile-title">{{ $t("header.experience") }}</h2>
        <div class="profile-table-buttons">
          <button class="profile-edit-btn" :disabled="disabledBtnToEdit" v-if="!editMode" @mouseover="onHover" @mouseout="onHoverOut" @click="edit">{{ $t("button.edit") }}</button>
          <button class="profile-edit-btn-e" v-if="editMode" @click="addUserExperience"><span class="prof-btn-txt">{{ $t("button.addNewEntry") }}</span><span class="prof-btn-icon">&plus;</span> </button>
          <button class="profile-edit-btn-e" v-if="editMode" @click="cancel"><span class="prof-btn-icon">&#10004;</span><span class="prof-btn-txt">{{ $t("button.finishEdit") }}</span></button>
        </div>
      </div>
      <div class="tile-underscore"></div>
    </div>
    <!-- remove style after adding appropriate classes, it is only for testing purposes  -->
    <div class="profile-tile-content">
      <div class="prof-tile-column">
        <div id="prof-user-exp" class="prof-div-row" v-for="(experience, index) in userExperience" :key='index'>
          <div class="prof-row-dates">
            <div :class="editMode ? 'prof-row-dates-left' : 'prof-row-dates-left-s'">
              <p class="prof-date-label" v-if="!editMode"> {{ formatDate(experience.DateStart) }} </p>
              <div v-if="editMode" class="prof-input-xxs">
                <v-date-picker class="prof-input-date" popoverDirection="top" v-if="editMode" @input="validateDates(index)" :max-date="experience.IsCurrent ? new Date() : experience.DateEnd" is-expanded mode="single" v-model="experience.DateStart">
                  <input value="experience.DateStart" />
                </v-date-picker>
                <label v-if="editMode">{{ $t("label.from") }}</label>
              </div>
              <span class="prof-span-0">&#8212;</span>
              <div name="endDateDiv" :id="formatId(index)">
                <p class="prof-date-label" v-if="!editMode && !experience.IsCurrent"> {{ formatDate(experience.DateEnd) }} </p>
                <div v-if="editMode && !experience.IsCurrent" class="prof-input-xxs">
                  <v-date-picker class="prof-input-date" popoverDirection="top" :min-date="experience.DateStart" :max-date="new Date()" v-if="editMode" @input="validateDates(index)" is-expanded mode="single" v-model="experience.DateEnd">
                    <input value="experience.DateEnd" />
                  </v-date-picker>
                  <label v-if="editMode">{{ $t("label.to") }}</label>
                </div>
              </div>
              <label class="checkbox-wrap">
                <input class="checkbox-margin" :disabled="!editMode" type="checkbox" @change="checkFields(index)" :checked="experience.IsCurrent" :name="index" v-model="experience.IsCurrent" />
                <div class="checkbox-in"></div>
                <p style="padding:0;margin:0;">{{ $t("label.present") }}</p>
              </label>
            </div>
          </div>
          <div class="prof-row-inputs">
            <div class="prof-input-ss">
              <input required v-if="editMode" class="inputProfile inputEdit" v-model="experience.Employer" @input="checkFields(index)">
              <input disabled class="inputProfile inputDisabled" v-if="!editMode" v-model="experience.Employer"/>
              <span class="prof-div-bar"></span>
              <label class="label-profile">{{ $t("label.employer") }}</label>
            </div>
            <div class="prof-input-ss">
              <select required v-if="editMode" class="selectProfile selectEdit" @change="checkFields(index)" v-model="experience.WorkPos">
                <option v-for="workPos in workPositions" :key="workPos.Key" :value="workPos.Key">{{workPos.Value}}</option>
              </select>
              <select disabled v-if="!editMode" class="selectProfile selectDisabled" v-model="experience.WorkPos">
                <option v-for="workPos in workPositions" :key="workPos.Key" :value="workPos.Key">{{workPos.Value}}</option>
              </select>
              <!-- :disabled="!editMode" -->
              <span class="prof-div-bar"></span>
              <label class="label-profile">{{ $t("label.jobPosition") }}</label>
            </div>
          </div>
          <div class="prof-row-btns expButtons">
            <button class="prof-row-btn" :disabled="true" v-if="editMode" @click="save(index)">&#x2714;</button>
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
let utils = require("../../../utils");
export default {
  data() {
    return {
      editMode: false,
      _beforeEditingCache: null,
      invalidDates: false
    };
  },
  computed: {
    ...mapGetters({
      userExperience: "getUserExperience",
      workPositions: "getWorkPositions",
      disabledBtnToEdit: "getDisabledBtnToEdit"
    })
  },
  methods: {
    ...mapActions(["addUserExperience", "updateUserExp", "saveNewUserExp"]),
    edit() {
      this.editMode = true;
      this.onHover(this.$el);
      this._beforeEditingCache = utils.createClone(this.userExperience);
      var checkboxes = this.$el.querySelectorAll(".checkbox-wrap");
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].setAttribute("style", "display: flex;");
      }
    },
    onHover(el) {
      this.$store.dispatch("onLightUp", el.style ? el : this.$el);
    },
    onHoverOut(el) {
      this.$store.dispatch("onLightOut", el.style ? el : this.$el);
    },
    // validate fields and set button to disabled or not
    checkFields(index) {
      let bChanged, bEmployer, bWorkPos, bDateStart, sProStart, sEditStart,  bCurrent, bDateChange, bDateEnd,
          beforeEdit = this._beforeEditingCache[index],
          userExp = this.userExperience[index];
      if(beforeEdit) {
         bEmployer = beforeEdit.Employer !== userExp.Employer;
         bWorkPos = beforeEdit.WorkPos !== userExp.WorkPos;
         bDateStart = utils.dateToValid(beforeEdit.DateStart, userExp.DateStart);
         bCurrent = beforeEdit.IsCurrent !== userExp.IsCurrent;
          if(userExp.DateEnd) {
              bDateEnd = utils.dateToValid(beforeEdit.DateEnd, userExp.DateEnd);
          }
          bDateChange = bCurrent || bDateEnd;
          bChanged = bEmployer || bWorkPos || bDateStart || bDateChange ? true : false;
     } else {
          bChanged  = true;
      }

      if (this.userExperience.length > 0) {
        if (
          bChanged &&
          userExp.Employer &&
          userExp.WorkPos &&
          userExp.DateStart &&
          (userExp.DateEnd !== null || userExp.IsCurrent)
        ) {
          document.getElementsByClassName("expButtons")[
            index
          ].children[0].disabled = false;
        } else {
          document.getElementsByClassName("expButtons")[
            index
          ].children[0].disabled = true;
        }
      }
    },
    formatId(index) {
      return index + "e";
    },
    //undo changes
    cancel() {
      this.onHoverOut(this.$el);
      this.$store.commit("SET_EXPERIENCE_ERROR", false);
      this.$store.commit("SET_USER_EXPERIENCE", this._beforeEditingCache);
      this.editMode = false;
    },
    remove(index) {
      let newData = utils.createClone(this.userExperience[index]);
      newData.Action = 'D';
      this.updateUserExp(newData);
      this.userExperience.splice(index, 1);
      this._beforeEditingCache = utils.createClone(this.userExperience);
    },
    // check if new data should be updated or created
    save(index) {
      const dataToChange = this._beforeEditingCache[index],
      newData = utils.createClone(this.userExperience[index]);
      newData.Language = "PL";
      newData.Action = 'U';
      if (dataToChange) {
        newData.WorkPosToChange = dataToChange.WorkPos;
        newData.EmployerToChange = dataToChange.Employer;
        newData.DateStartToChange = dataToChange.DateStart;
        this.updateUserExp(newData);
      } else {
        this.saveNewUserExp(newData);
      }
      this._beforeEditingCache = utils.createClone(this.userExperience);
      document.getElementsByClassName("expButtons")[
            index
          ].children[0].disabled = true;
        },
    formatDate(date) {
      return date !== null && date !== undefined
        ? moment(date).format("DD.MM.YYYY")
        : "-";
    },
    validateDates(index) {
      const startDate = this.userExperience[index].DateStart,
        endDate = this.userExperience[index].DateEnd,
        isCurrent = this.userExperience[index].isCurrent;

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
