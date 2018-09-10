<template>
  <div class="profile-tile">
    <div class="profile-tile-header">
      <div class="profile-tile-header-row">
        <h2 class="profile-tile-title">{{ $t("header.projects") }}</h2>
        <div class="profile-table-buttons">
          <button class="profile-edit-btn" @click="editProjects" @mouseover="onHover" @mouseout="onHoverOut" v-if="!projectEditMode">{{ $t("button.editProjects") }}</button>
          <button class="profile-edit-btn-e" v-if="projectEditMode" @click="addRow"><span class="prof-btn-txt">{{ $t("button.addProject") }}</span><span class="prof-btn-icon">&plus;</span></button>
          <button class="profile-edit-btn-e" v-if="projectEditMode" @click="finishEditing"><span class="prof-btn-txt">{{ $t("button.finishEdit") }}</span><span class="prof-btn-icon">&#10004;</span></button>
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
            <div class="prof-tbody-row" v-for="(project, index) in userProjects" :key="index">
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
                <input :disabled="!projectEditMode" @input="checkFields(index)" class="profile-table-input" v-model="userProjects[index].ProjectName" />
              </div>
            </div>
            <div class="prof-tbody-item">
              <div class="prof-tbody-item-title"> {{ $t("table.contractor") }}</div>
              <div class="prof-tbody-item-txt">
              <!-- <select :disabled="!projectEditMode" class="profile-table-select profile-table-select-contractor" v-model="userProjects[index].ContractorId"> 
              <option v-for="contractor in contractorsList" :key="contractor.id" :value="contractor.id"> {{ contractor.name }}</option>
              </select> -->
                <input :disabled="!projectEditMode" @input="checkFields(index)" class="profile-table-input" v-model="userProjects[index].ContractorName" />
              </div>
            </div>
            <div class="prof-tbody-item">
              <div class="prof-tbody-item-title">{{ $t("table.duration") }} </div>
              <div class="prof-tbody-item-txt">
                <p class="table-p">Rozpoczęcie</p>
                <p class="table-p" v-if="!projectEditMode"> {{ formatDate(userProjects[index].DateStart) }} </p>
               <v-date-picker popoverDirection="top" v-if="projectEditMode" @input="validateDates(index)" class="profile-table-date-picker" is-expanded mode="single" v-model="userProjects[index].DateStart">
                <!-- <v-date-picker :max-date="userProjects[index].DateEnd === null ? new Date() : userProjects[index].DateEnd" popoverDirection="top" v-if="projectEditMode" @input="validateDates(index)" class="profile-table-date-picker" is-expanded mode="single" v-model="userProjects[index].DateStart"> -->
                  <input value="userProjects[index].DateStart" />
                </v-date-picker>
                <p class="table-p">Zakończenie</p>
                <div name="endDateDiv" :id="formatId(index)">
                  <p class="table-p" v-if="!projectEditMode"> {{ formatDate(userProjects[index].DateEnd) }} </p>
                  <v-date-picker popoverDirection="top" v-if="projectEditMode" @input="validateDates(index)" class="profile-table-date-picker" is-expanded mode="single" v-model="userProjects[index].DateEnd">
                      <!-- <v-date-picker :max-date="new Date()" :min-date="userProjects[index].DateStart" popoverDirection="top" v-if="projectEditMode" @input="validateDates(index)" class="profile-table-date-picker" is-expanded mode="single" v-model="userProjects[index].DateEnd"> -->
                    <input value="userProjects[index].DateEnd"/>
                  </v-date-picker>
                </div>
                <label class="checkbox-wrap" >
                  <input class="checkbox-margin" :disabled="!projectEditMode" type="checkbox" @change="disableEndDateInput" :name="index" v-model="userProjects[index].IsCurrent" />
                  <div class="checkbox-in"></div>
                  <p style="padding:0;margin:0;">Obecnie</p>
                </label>
              </div>
            </div>
            <div class="prof-tbody-item">
              <div class="prof-tbody-item-title">{{ $t("table.Industry") }} </div>
              <div class="prof-tbody-item-txt">
              <!-- :disabled="!projectEditMode" -->
                <div class="prof-table-btns industry">
                  <button :disabled="!projectEditMode" class="profile-table-industry-button" @click="removeIndustry" :name="index" v-for="industry in userProjects[index].Industries" :key="industry.id" :value="industry.id"> {{ industry.name }}</button>
                </div>
                <select v-if="projectEditMode" class="profile-table-select profile-table-select-industry" @change="addIndustry" :id="index" >
                  <option disabled selected value>{{ $t("table.addIndustry") }}:</option>
                  <option v-for="industry in industryList" :key="industry.IndustryId" :value="industry.IndustryId"> {{ industry.IndustryName }}</option>
                </select>
              </div>
            </div>
            <div class="prof-tbody-item">
              <div class="prof-tbody-item-title"> {{ $t("table.Modules") }}</div>
              <div class="prof-tbody-item-txt profile-table-td-module">
                <div class="prof-table-btns sapModule">
                  <button :disabled="!projectEditMode" class="profile-table-module-button" @click="removeModule" :name="index" v-for="sapModule in userProjects[index].Modules" :key="sapModule.id" :value="sapModule.id"> {{ sapModule.id }} </button>
                </div>
                <!-- <div id="addButtons"></div> -->
                <select v-if="projectEditMode" class="profile-table-select profile-table-select-modules" @change="addModule" :id="index">
                  <option disabled selected value>{{ $t("table.addModule") }}:</option>
                  <option v-for="sapModule in modulesList" :key="sapModule.Key" :value="sapModule.Key"> {{ sapModule.Value }}</option>
                </select>
              </div>
            </div>
            <div class="prof-tbody-item">
              <div class="prof-tbody-item-title">{{ $t("table.Descr") }} </div>
              <div class="prof-tbody-item-txt">
                <textarea :disabled="!projectEditMode" @input="checkFields(index)" class="profile-table-textarea" v-model="userProjects[index].Description" />
              </div>
            </div>
            <div class="prof-tbody-item">
              <div class="prof-tbody-item-title"> --- </div>
              <div class="prof-tbody-item-txt">
                <button v-if="projectEditMode" class="prof-tbtn" @click="remove(index)">USUŃ</button>
                <button v-if="projectEditMode" :disabled="true" class="prof-tbtn projSaveButton" @click="save(index)">ZAPISZ</button>
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
import { mapGetters, mapActions } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      projectEditMode: false,
      invalidDates: false,
      invalidDatePos: null,
      showEndInput: true,
      _beforeEditingProjects: null
    };
  },
updated() {
  this.setProCheckbox();
},
  computed: {
    ...mapGetters({
      showProjectError: "getShowProjectError",
      contractorsList: "contractorsList",
      industryList: "getIndustryList",
      modulesList: "getModulesList",
      userProjects: "getUserProjectsList",
      ifModuleExist: "getModuleExist",
      errorProjectNo: "getErrorProjectNo"
    })
  },
  methods: {
    ...mapActions({
      addRow: "addUserProjectsRow",
      removeRow: "removeUserProjectsRow",
      adjustProjects: "adjustProject"
    }),
    remove(index) {
      this.removeRow(index);
      this._beforeEditingProjects.splice(index, 1);
    },
    save(index) {
      const dataToChange = this._beforeEditingProjects[index],
      newData = this.userProjects[index];
      const aModules = dataToChange.Modules,
            aIndustries = dataToChange.Industries;
      newData.Language ='PL';

      if (dataToChange) {
        newData.DateStartToChange = dataToChange.DateStart;
        newData.DateEndToChange = dataToChange.DateEnd;
        newData.ProjectNameToChange = dataToChange.ProjectName;
        this.$store.dispatch('updateUserProjectsPosition', newData);
     } else {
        this.$store.dispatch('saveUserProjectsPosition', newData);
      }
      this._beforeEditingProjects = this.userProjects;
      this._beforeEditingProjects[index].Modules = aModules;
      this._beforeEditingProjects[index].Industries = aIndustries;
    },
    checkFields(index) {
      // if (this.userProjects.length > 0) {
        // for (let i = 0; i < this.userProjects.length; i++) {
          if (
            this.userProjects[index].ProjectName &&
            this.userProjects[index].ContractorName &&
            this.userProjects[index].Industries.length !== 0 &&
            this.userProjects[index].Modules.length !== 0 &&
            this.userProjects[index].DateStart &&
            this.userProjects[index].Description &&
            (this.userProjects[index].DateEnd !== null ||
              this.userProjects[index].IsCurrent)
          ) {
            document.getElementsByClassName(
              "projSaveButton"
            )[index].disabled = false;
          } else {
            document.getElementsByClassName(
              "projSaveButton"
            )[index].disabled = true;
          // }
        // }
      }
    },
    // saveUserProject(index) {
    //   this.$store.dispatch("saveUserProjectsPosition", index);
    //   this._beforeEditingProjects = JSON.parse(
    //     JSON.stringify(this.userProjects)
    //   );
    // },
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
    formatId(index) {
      return index + "p";
    },
    addModule(value) {
      const data = {
        index: value.target.id,
        moduleId: value.target.value
      };
      this.$store.dispatch("addModule", data);
      this.checkFields(data.index);
    },
    removeModule(value) {
      const data = {
        index: value.target.name,
        moduleId: value.target.value
      };
      this.$store.dispatch("removeModule", data);
      this.checkFields(data.index);
    },
    removeIndustry(value) {
      const data = {
        index: value.target.name,
        industryId: value.target.value
      };
      this.$store.dispatch("removeIndustry", data);
      this.checkFields(data.index);
    },
    addIndustry(value) {
      const data = {
        index: value.target.id,
        industryId: value.target.value
      };
      this.$store.dispatch("addIndustry", data);
      this.checkFields(data.index);
    },
    disableEndDateInput(value) {
      const isCurrent = value.target.checked,
        index = value.target.name,
        input = document.getElementById(index + "p");

      if (isCurrent) {
        input.setAttribute("style", "display: none");
        this.userProjects[index].DateEnd = null;
      } else {
        input.setAttribute("style", "display: flex");
      }
    },
    finishEditing() {
      this.onHoverOut(this.$el);
      this.$store.commit("SET_PROJECT_ERROR", false);
      this.$store.commit("SET_USER_PROJECTS_LIST", this._beforeEditingProjects);
      this.projectEditMode = false;
    },
    editProjects() {
      this.projectEditMode = true;
      this._beforeEditingProjects = this.userProjects;
      this.onHover(this.$el)
    },
    formatDate(date) {
      return date !== null && date !== undefined
        ? moment(date).format("DD.MM.YYYY")
        : "-";
    },

    formatIndustryName(id) {
      for (let i = 0; i < this.industryList.length; i++) {
        if (id === this.industryList[i].id) {
          return this.industryList[i].name;
        }
      }
    },
    validateDates(index) {
      const startDate = this.userProjects[index].DateStart,
        endDate = this.userProjects[index].DateEnd,
        isCurrent = this.userProjects[index].IsCurrent;

      if (endDate && startDate && isCurrent === false) {
        const formatStartDate = moment(startDate).format("YYYY-MM-DD"),
          formatEndDate = moment(endDate).format("YYYY-MM-DD");

        this.invalidDates = formatStartDate > formatEndDate ? true : false;
        this.invalidDatePos =
          formatStartDate > formatEndDate ? index + 1 : null;
      }
      this.checkFields();
    },
    setProCheckbox() {
      let projects = this.$store.getters.getUserProjectsList;
      let input;

      for(let i = 0; i < projects.length; i++) {
         if(projects[i].IsCurrent === true) {
              input = document.getElementById(i + "p");
              input.setAttribute("style", "display: none");
          }
          else {
            let checkBoxes = document.querySelectorAll("checkbox:not(:checked)")
          }
      }
    }
  }
};
</script>