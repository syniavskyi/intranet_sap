<template>
  <div class="profile-tile">
    <div class="profile-tile-header">
      <div class="profile-tile-header-row">
        <h2 class="profile-tile-title">{{ $t("header.projects") }}</h2>
        <button class="btn-hint" @click="getNewDataForHint" v-if="projectEditMode">?</button>
        <div
          class="prof-hint-tt"
          v-if="projectEditMode && !showHintAfterSave"
        >{{ $t("message.hintInfoProject") }}</div>
        <div class="prof-hint-tt" v-if="showHintAfterSave">{{ $t("message.hintReminder") }}</div>
        <div class="profile-table-buttons">
          <button
            class="profile-edit-btn"
            :disabled="disabledBtnToEdit"
            @click="editProjects"
            @mouseover="onHover"
            @mouseout="onHoverOut"
            v-if="!projectEditMode"
          >{{ $t("button.editProjects") }}</button>
          <button class="profile-edit-btn-e" v-if="projectEditMode" @click="addRow">
            <span class="prof-btn-txt">{{ $t("button.addProject") }}</span>
            <span class="prof-btn-icon">&plus;</span>
          </button>
          <button class="profile-edit-btn-e" v-if="projectEditMode" @click="finishEditing">
            <span class="prof-btn-txt">{{ $t("button.finishEdit") }}</span>
            <span class="prof-btn-icon">&#10004;</span>
          </button>
        </div>
      </div>
      <div class="tile-underscore"></div>
    </div>
    <!-- remove style after adding appropriate classes, it is only for testing purposes  -->
    <div class="profile-tile-content">
      <i18n
        path="message.incompleteData"
        tag="p"
        class="profile-error"
        name="error"
        v-if="showProjectError"
      >
        <span place="errorProNo">{{ errorProjectNo }}</span>
      </i18n>
      <i18n
        path="message.invalidDate"
        tag="p"
        class="profile-error"
        name="error"
        v-if="invalidDates"
      >
        <span place="invalid">{{invalidDatePos}}</span>
      </i18n>
      <div class="profile-table-wrapper">
        <div class="profile-table">
          <div class="prof-thead">
            <div class="prof-thead-item">{{ $t("label.eg") }}</div>
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
              <div class="prof-tbody-item">
                <div class="prof-tbody-item-title">{{ $t("label.eg") }}</div>
                <div class="prof-tbody-item-txt">
                  <p class="table-p">{{index + 1}}</p>
                </div>
              </div>
              <div class="prof-tbody-item">
                <div class="prof-tbody-item-title">{{ $t("table.projectName") }}</div>
                <div class="prof-tbody-item-txt">
                  <input
                    :disabled="!projectEditMode"
                    @input="checkFields(index)"
                    :class="projectEditMode ? 'profile-table-input-edit' : 'profile-table-input' "
                    v-model="userProjects[index].ProjectName"
                  >
                </div>
              </div>
              <div class="prof-tbody-item">
                <div class="prof-tbody-item-title">{{ $t("table.contractor") }}</div>
                <div class="prof-tbody-item-txt">
                  <p
                    v-if="projectEditMode"
                    style="padding:0; margin:0; display: flex; text-align: center; align-items: center; font-size: .8rem; color: #ccc;"
                  >{{$t('table.currentContractor')}}</p>
                  <input
                    v-if="!projectEditMode"
                    class="profile-table-input"
                    :disabled="!projectEditMode"
                    v-model="userProjects[index].ContractorName"
                  >
                  <!-- <input v-if="projectEditMode" class="profile-table-input-view" :disabled="projectEditMode" v-model="_beforeEditingProjects[index].ContractorName""> -->
                  <!-- <p v-if="projectEditMode"> {{ setEditedProjectContractor(index)}} </p> -->
                  <p
                    class="profile-table-input-view"
                    v-if="projectEditMode && _beforeEditingProjects[index]"
                    v-once
                  >{{ _beforeEditingProjects[index].ContractorName }}</p>
                  <p
                    class="profile-table-input-view"
                    v-if="projectEditMode && !_beforeEditingProjects[index]"
                    v-once
                  >{{ userProjects[index].ContractorName }}</p>
                  <select
                    @input="checkFields(index)"
                    v-if="projectEditMode"
                    class="profile-table-select profile-table-select-industry"
                    @change="selectContractor($event, index)"
                  >
                    <!-- @input="checkFields(index)" -->
                    <option disabled selected value>{{ $t("table.addContractor") }}:</option>
                    <option
                      v-for="contractor in contractorsList"
                      :key="contractor.ContractorId"
                      :value="contractor.ContractorId"
                      :id="index"
                    >{{ contractor.ContractorName }}</option>
                  </select>
                </div>
              </div>
              <div class="prof-tbody-item">
                <div class="prof-tbody-item-title">{{ $t("table.duration") }}</div>
                <div class="prof-tbody-item-txt">
                  <p class="prof-table-p" v-if="projectEditMode">{{ $t("label.startDate") }}</p>
                  <p
                    class="table-p"
                    v-if="!projectEditMode"
                  >{{ formatDate(userProjects[index].DateStart) }}</p>
                  <v-date-picker
                    popoverDirection="top"
                    :max-date="new Date()"
                    v-if="projectEditMode"
                    @input="validateDates(index)"
                    class="profile-table-date-picker"
                    is-expanded
                    mode="single"
                    v-model="userProjects[index].DateStart"
                  >
                    <!-- project.IsCurrent ? new Date() : project.DateEnd -->
                    <input value="userProjects[index].DateStart">
                  </v-date-picker>
                  <div class="table-p">&#8722;</div>
                  <p class="prof-table-p" v-if="projectEditMode">{{ $t("label.endDate") }}</p>
                  <div name="endDateDiv" :id="formatId(index)">
                    <p
                      class="table-p"
                      v-if="!projectEditMode && !project.IsCurrent"
                    >{{ formatDate(userProjects[index].DateEnd) }}</p>
                    <v-date-picker
                      popoverDirection="top"
                      :max-date="new Date()"
                      :min-date="project.DateStart"
                      v-if="projectEditMode && !project.IsCurrent"
                      @input="validateDates(index)"
                      class="profile-table-date-picker"
                      is-expanded
                      mode="single"
                      v-model="userProjects[index].DateEnd"
                    >
                      <input value="userProjects[index].DateEnd">
                    </v-date-picker>
                  </div>
                  <label class="checkbox-wrap">
                    <input
                      class="checkbox-margin"
                      :disabled="!projectEditMode"
                      type="checkbox"
                      :checked="project.IsCurrent"
                      @change="checkFields(index)"
                      :name="index"
                      v-model="userProjects[index].IsCurrent"
                    >
                    <div class="checkbox-in"></div>
                    <p style="padding:0;margin:0;color:#7a7a7a;">{{ $t("label.present") }}</p>
                  </label>
                </div>
              </div>
              <div class="prof-tbody-item">
                <div class="prof-tbody-item-title">{{ $t("table.Industry") }}</div>
                <div class="prof-tbody-item-txt">
                  <div ref="addedIndustries" class="prof-table-btns industry">
                    <button
                      v-for="industry in userProjects[index].Industries"
                      :key="industry.id"
                      :disabled="!projectEditMode"
                      class="profile-table-industry-button"
                      @click="removeIndustry"
                      :name="index"
                      :title="$t('button.delete')"
                      :value="industry.id"
                    >{{ industry.name }}</button>
                  </div>
                  <select
                    ref="industryEmpty"
                    v-if="projectEditMode"
                    class="profile-table-select profile-table-select-industry"
                    @mousedown="contrIndustries($event, index)"
                    @change="addIndustry"
                    :id="index"
                  >
                    <option disabled selected value>{{ $t("table.addIndustry") }}:</option>
                    <!-- <option v-for=" industry in contrIndustries" :key="industry.IndustryId" :value="industry.IndustryId"> {{ industry.IndustryName }}</option> -->
                    <!-- <option v-for="industry in contractorIndustries" :key="industry.IndustryId" :value="industry.IndustryId"> {{ industry.IndustryName }}</option> -->
                  </select>
                </div>
                <Toast v-if="showToast">{{ $t('message.requiredContractor')}}</Toast>
              </div>
              <div class="prof-tbody-item">
                <div class="prof-tbody-item-title">{{ $t("table.Modules") }}</div>
                <div class="prof-tbody-item-txt profile-table-td-module">
                  <div class="prof-table-btns sapModule">
                    <button
                      v-for="sapModule in userProjects[index].Modules"
                      :disabled="!projectEditMode"
                      class="profile-table-module-button"
                      @click="removeModule"
                      :name="index"
                      :title="$t('button.delete')"
                      :key="sapModule.id"
                      :value="sapModule.id"
                    >{{ sapModule.id }}</button>
                  </div>
                  <select
                    v-if="projectEditMode"
                    class="profile-table-select profile-table-select-modules"
                    @change="addModule"
                    :id="index"
                  >
                    <option disabled selected value>{{ $t("table.addModule") }}:</option>
                    <option
                      v-for="sapModule in modulesList"
                      :key="sapModule.Key"
                      :value="sapModule.Key"
                    >{{ sapModule.Value }}</option>
                  </select>
                </div>
              </div>
              <div class="prof-tbody-item">
                <div class="prof-tbody-item-title">{{ $t("table.Descr") }}</div>
                <button
                  class="btn-hint-item"
                  v-if="projectEditMode"
                  @click="showHintFnProject({show: true, index: index})"
                >?</button>
                <div class="prof-tbody-item-txt">
                  <textarea
                    class="cd-textarea"
                    :disabled="!projectEditMode"
                    @input="checkFields(index)"
                    v-model="userProjects[index].Description"
                  />
                </div>
                <div
                  class="prof-skills-hint prof-skills-hint-project"
                  v-if="showHintProject.show && index===showHintProject.index"
                >
                  <button
                    class="prof-hint-close"
                    @click="showHintFnProject({index: '', show: false})"
                  >X</button>
                  <div class="prof-hint-item">{{showSingleHint()}}</div>
                </div>
              </div>
              <div class="prof-tbody-item">
                <div class="prof-tbody-item-title">---</div>
                <div class="prof-tbody-item-txt">
                  <button
                    v-if="projectEditMode"
                    class="prof-tbtn"
                    @click="remove(index)"
                  >{{ $t("button.delete") }}</button>
                  <button
                    v-if="projectEditMode"
                    :disabled="true"
                    class="prof-tbtn projSaveButton"
                    @click="save(index)"
                  >{{ $t("button.save") }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div  class="toast">Cosoosoos</div> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Toast from "../../dialogs/Toast";
import moment from "moment";
let utils = require("../../../utils");

export default {
  props: ["selected-user"],
  data() {
    return {
      projectEditMode: false,
      invalidDates: false,
      invalidDatePos: null,
      showEndInput: true,
      _beforeEditingProjects: null,
      showHintAfterSave: false,
      contractorIndustries: []
    };
  },
  watch: {
    selectedUser(value) {
      this.projectEditMode = false;
    }
  },
  components: {
    Toast
  },
  computed: {
    ...mapGetters({
      showProjectError: "getShowProjectError",
      contractorsList: "getContractorsList",
      industryList: "getIndustryList",
      modulesList: "getModulesList",
      userProjects: "getUserProjectsList",
      ifModuleExist: "getModuleExist",
      errorProjectNo: "getErrorProjectNo",
      disabledBtnToEdit: "getDisabledBtnToEdit",
      userProjectsDfLang: "getUserProjectsListDfLang",
      showHintProject: "getShowHintProject",
      contractorsBranches: "getContractorsBranches",
      showToast: "getDisplayToast",
      editedProjectIdx: "getEditedProjectIdx",
      editedProjectContractor: "getEditedProjectContractor"
    }),
    filterProject() {
      let filterPro;
      this.projectEditMode
        ? (filterPro = this.userProjects)
        : (filterPro = this.userProjects.sort((a, b) =>
            a.DateStart < b.DateStart ? 1 : b.DateStart < a.DateStart ? -1 : 0
          ));
      return filterPro;
    }
  },
  methods: {
    ...mapActions({
      addRow: "addUserProjectsRow",
      adjustProjects: "adjustProject",
      getNewDataForHint: "getNewDataForHint",
      showHintFnProject: "showHintFnProject"
    }),
    setEditedProjectContractor(index) {
      this.$nextTick(function() {
        if (this.editedProjectIdx === index) {
          return this.editedProjectContractor;
        } else if (this.editedProjectIdx === "") {
          if (
            this._beforeEditingProjects !== null &&
            this._beforeEditingProjects !== undefined
          ) {
            return this._beforeEditingProjects[index].ContractorName;
          } else return this.userProjects[index].ContractorName;
        } else {
          return this.userProjects[index].ContractorName;
        }
      });
    },
    contrIndustries(event, index) {
      if (index === undefined) return;
      let selectIndus = this.$refs.industryEmpty[index],
        optionsLength = selectIndus.options.length,
        contrIndus = this.contractorIndustries[index],
        i = optionsLength,
        option,
        idx;
      if (contrIndus === undefined || contrIndus === null) {
        this.$store.dispatch("displayToast");
        return;
      }
      while (selectIndus.options.length > 1) {
        i--;
        selectIndus.remove(i);
      }
      for (i = 0; i < contrIndus.length; i++) {
        option = new Option(
          contrIndus[i].IndustryName,
          contrIndus[i].IndustryId
        );
        option.setAttribute("id", contrIndus[i].IndustryId);
        selectIndus.add(option);
      }
      selectIndus.options.selectedIndex = 0;
    },
    selectContractor(evt, index) {
      let selectIndus = this.$refs.industryEmpty[index],
        contrId = evt.target.value,
        contrBranches = this.contractorsBranches,
        indusList = this.industryList,
        arr = [],
        idx;

      for (var i = 0; i < contrBranches.length; i++) {
        if (contrId === contrBranches[i].ContractorId) {
          idx = indusList
            .map(industry => {
              return industry.IndustryId;
            })
            .indexOf(contrBranches[i].IndustryId);

          if (idx === -1) {
          } else {
            let industryId = indusList[idx].IndustryId,
              industryName = indusList[idx].IndustryName;

            arr.push({
              IndustryId: industryId,
              IndustryName: industryName
            });
          }
        }
      }
      if (arr.length === 0) {
        this.contractorIndustries[index] = this.industryList;
      } else {
        this.contractorIndustries[index] = arr;
      }
      selectIndus.options.selectedIndex = 0;
      this.userProjects[index].ContractorName =
        evt.target.children[evt.target.selectedIndex].text;
      this.checkFields(index);
      this.$refs.industryEmpty[0].options[0].selected = true;
      this.checkIndustriesButtons(arr, index);
    },
    checkIndustriesButtons(contrIndustries, index) {
      let btnsIndus = this.$refs.addedIndustries[index],
        idx;

      for (var i = 0; i < btnsIndus.childElementCount; i++) {
        let btnValue = btnsIndus.children[i].value,
          btnName = btnsIndus.children[i].name;

        idx = contrIndustries
          .map(industry => {
            return industry.IndustryId;
          })
          .indexOf(btnValue);

        if (idx === -1) {
          this.removeIndustry({
            target: {
              value: btnValue,
              name: btnName
            }
          });
        }
      }
    },
    remove(index) {
      let newData = utils.createClone(this.userProjects[index]);
      newData.Action = "D";
      this.$store.dispatch("updateUserProjectsPosition", newData);
      this.userProjects.splice(index, 1);
      this._beforeEditingProjects = utils.createClone(this.userProjects);
      this.$store.commit("SET_DATA_CHANGE_PROF", {
        changed: false,
        editMode: false
      });
    },
    save(index) {
      const dataToChange = this._beforeEditingProjects[index],
        newData = utils.createClone(this.userProjects[index]);
      // newData.index = index;
      newData.Action = "U";
      newData.Language = localStorage.getItem("lang"); //temp
      if (dataToChange) {
        newData.DateStartToChange = dataToChange.DateStart;
        newData.DateEndToChange = dataToChange.DateEnd;
        newData.ProjectNameToChange = dataToChange.ProjectName;
        this.$store.dispatch("updateUserProjectsPosition", newData);
      } else {
        this.$store.dispatch("saveUserProjectsPosition", newData);
        // newData.Action ='A';
      }
      this._beforeEditingProjects = utils.createClone(this.userProjects);
      document.getElementsByClassName("projSaveButton")[index].disabled = true;
      this.showHintAfterSave = true;
      this.$store.commit("SET_DATA_CHANGE_PROF", {
        changed: false,
        editMode: false
      });
    },
    checkFields(index) {
      let bChanged,
        bProjectName,
        bContractor,
        bIndustries,
        bModules,
        bDateStart,
        bDateEnd,
        bCurrent,
        bDateChange,
        bDesc,
        beforeEdit = this._beforeEditingProjects[index],
        userPro = this.userProjects[index];
      if (beforeEdit) {
        bProjectName = beforeEdit.ProjectName !== userPro.ProjectName;
        bContractor = beforeEdit.Contractor !== userPro.Contractor;
        if (beforeEdit.Industries.length !== userPro.Industries.length) {
          bIndustries = true;
        } else {
          for (const item of beforeEdit.Industries) {
            if (!userPro.Industries.find(o => o.id === item.id)) {
              bIndustries = true;
            }
          }
        }
        if (beforeEdit.Modules.length !== userPro.Modules.length) {
          bModules = true;
        } else {
          for (const item of beforeEdit.Modules) {
            if (!userPro.Modules.find(o => o.id === item.id)) {
              bModules = true;
            }
          }
        }
        bDateStart = utils.dateToValid(beforeEdit.DateStart, userPro.DateStart);
        bCurrent = beforeEdit.IsCurrent !== userPro.IsCurrent;
        if (userPro.DateEnd) {
          bDateEnd = utils.dateToValid(beforeEdit.DateEnd, userPro.DateEnd);
        }
        bDateChange = bCurrent || bDateEnd;
        bDesc = beforeEdit.Description !== userPro.Description;
        bChanged =
          bProjectName ||
          bContractor ||
          bIndustries ||
          bModules ||
          bDateStart ||
          bDateChange ||
          bDesc
            ? true
            : false;
      } else {
        bChanged = true;
      }
      this.$store.commit("SET_DATA_CHANGE_PROF", {
        changed: bChanged,
        editMode: this.projectEditMode
      });
      if (
        userPro.ProjectName &&
        userPro.ContractorName &&
        userPro.Industries.length !== 0 &&
        userPro.Modules.length !== 0 &&
        userPro.DateStart &&
        userPro.Description &&
        bChanged &&
        (userPro.DateEnd !== null || userPro.IsCurrent)
      ) {
        document.getElementsByClassName("projSaveButton")[
          index
        ].disabled = false;
      } else {
        document.getElementsByClassName("projSaveButton")[
          index
        ].disabled = true;
      }
    },
    onHover(el) {
      this.$store.dispatch("onLightUp", el.style ? el : this.$el);
    },
    onHoverOut(el) {
      this.$store.dispatch("onLightOut", el.style ? el : this.$el);
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
    finishEditing() {
      this.onHoverOut(this.$el);
      this.$store.commit("SET_PROJECT_ERROR", false);
      this.$store.commit("SET_USER_PROJECTS_LIST", this._beforeEditingProjects);
      this.projectEditMode = false;
      this.showHintAfterSave = false;
      this.showHintFnProject({ index: "", show: false });
      this.$store.commit("SET_DATA_CHANGE_PROF", {
        changed: false,
        editMode: false
      });
    },
    editProjects() {
      this.projectEditMode = true;
      this._beforeEditingProjects = utils.createClone(this.userProjects);
      this.onHover(this.$el);
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
      this.checkFields(index);
    },
    showSingleHint() {
      let index = this.showHintProject.index;
      if (this.userProjectsDfLang.length !== 0) {
        return this.userProjectsDfLang[index].Description;
      } else {
        return;
      }
    }
  }
};
</script>