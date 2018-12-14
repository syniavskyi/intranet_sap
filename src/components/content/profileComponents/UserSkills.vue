<template>
  <div class="profile-tile">
    <!-- SPi -->
      <div class="prof-skills-hint" v-if="showHint.show">
        <button class="prof-hint-close" @click="showHintFn({name: '', show: false})">X</button>
          <div class="prof-hint-item" v-for="hint in showSingleHint(userSkillsDfLang)" :key="hint">
            {{hint}}&nbsp;
         </div>
     </div>
      <!-- SPi -->
    <div class="profile-tile-header">
      <div class="profile-tile-header-row">
        <h2 class="profile-tile-title">{{ $t("header.skills") }}</h2>
          <button class="btn-hint" @click="getNewDataForHint" v-if="editMode">&#63;</button>
          <div class="prof-hint-tt" v-if="!editMode">{{ $t("message.hintReminder") }}</div>
          <div class="prof-hint-tt" v-if="editMode">{{ $t("message.hintInfoSkill") }}</div>
        <div class="profile-table-buttons">
          <button class="profile-edit-btn" :disabled="disabledBtnToEdit" v-if="!editMode" @mouseover="onHover" @mouseout="onHoverOut" @click="edit">{{ $t("button.edit") }}</button>
          <button class="profile-edit-btn-e" v-if="editMode" @click="cancel"><span class="prof-btn-txt">{{ $t("button.cancel") }}</span><span class="prof-btn-icon">&#10005;</span></button>
          <button class="profile-edit-btn-e" :disabled="bDisabled" v-if="editMode" @click="save()"><span class="prof-btn-txt">{{ $t("button.save") }}</span><span class="prof-btn-icon">&#10004;</span></button>
        </div>
      </div>
      <div class="tile-underscore"></div>
    </div>
    <!-- remove style after adding appropriate classes, it is only for testing purposes  -->
    <div class="profile-tile-content">
      <div class="prof-skills">
        <div class="prof-skills-inputs">
          <div class="prof-input-xl">
            <!-- languages -->
            <label class="label-skills">{{ $t("label.foreignLanguages") }}</label>
            <button class="prof-skills-btn" @click="addLanguageSkillsRow" v-if="editMode">+</button>
            <div class="prof-div-skills" v-for="(lang, index) in userLangs" :id="index" :key="index">
              <div class="prof-div-slang">
                <select v-if="editMode" class="selectProfileSkills selectEdit" v-model="lang.LanguageId" @change="checkFieldsLangs(index)" :id="index"> 
                  <option v-for="fullLang in fullLanguageList" :value="fullLang.LanguageId" :key="fullLang.LanguageId">{{fullLang.LangName}}</option>
                </select>
                <select v-if="!editMode" class="selectProfileSkills selectDisabled" v-model="lang.LanguageId">
                  <option v-for="fullLang in fullLanguageList" :value="fullLang.LanguageId" :key="fullLang.LanguageId">{{fullLang.LangName}}</option>
                </select>
                <label class="label-select-profile">{{ $t("label.language") }}</label>
              </div>
              <div class="prof-div-slang">
                <select v-if="editMode" class="selectProfileSkills selectEdit" v-model="lang.LangLevel" @change="checkFieldsLangs(index)" :id="index">
                  <option v-for="level in langLevels" :value="level.Key" :key="level.Key">{{level.Value}}</option>
                </select>
                <select v-if="!editMode" class="selectProfileSkills selectDisabled" v-model="lang.LangLevel">
                  <option v-for="level in langLevels" :value="level.Key" :key="level.Key">{{level.Value}}</option>
                </select>
                <label class="label-select-profile">{{ $t("label.level") }}</label>
              </div>
              <div class="prof-skills-btns">
                <button class="prof-skills-delete" @click="remove(index)" v-if="editMode" :title="$t('title.delete')" >&#10005;</button>
                <!-- {{ $t("button.delete") }} -->
                <button class="prof-skills-save" :disabled="true" @click="saveLang(index)" v-if="editMode" :title="$t('title.save')">&#10004;</button>
                <!-- {{ $t("button.save") }} -->
              </div>
            </div>
          </div>
          <div class="prof-input-xl">
            <!-- Sap modules -->
            <select required class="selectProfileSkills selectEdit" v-if="editMode" @change="addModule">
              <option disabled selected value>{{ $t("table.addModule") }}:</option>
              <option v-for="sapModule in modulesList" :key="sapModule.Key" :value="sapModule.Key" :id="sapModule.id" > {{ sapModule.Value }}</option>
            </select>
            <button class="btn-hint hint-abs" @click="showHintFn({name: 'SapModules', show: true})" v-if="editMode">?</button>
            <label :class="editMode ? 'label-select-profile' : 'label-skills'">{{ $t("label.sapModulesExp") }}</label>
            <div class="prof-skills-elems">
              <button :title="$t('title.delete')" class="prof-div-pos-elem" :disabled="!editMode" v-for="sapModule in userSkills.SapModules" :key="sapModule"  @click="removeModule(sapModule)">{{sapModule}}</button>
            </div>
          </div>
          <div class="prof-input-xl">
            <!-- Języki programowania -->
            <input v-on:keyup.enter="addProgramLang" required class="inputProfile inputEditPos" v-if="editMode" v-model="newProgramLang"/>
            <span class="prof-div-bar"></span>
            <button class="prof-div-pos-btn" v-if="editMode" @click="addProgramLang">&#43;</button>
            <button class="btn-hint hint-abs" @click="showHintFn({name: 'ProgramLang', show: true})" v-if="editMode">?</button>
            <label :class="editMode ? 'label-profile': 'label-skills'">{{ $t("label.programmingLanguages") }}</label>
            <div class="prof-skills-elems">
              <button :title="$t('title.delete')" class="prof-div-pos-elem" :disabled="!editMode" v-for="lang in userSkills.ProgramLang" :key="lang"  @click="removeProgramLang(lang)">{{lang}}</button>
            </div>
          </div>
        </div>
        <div class="prof-skills-inputs">
          <div class="prof-input-xl">
            <!-- Technologie -->
            <input v-on:keyup.enter="addTechnology" required class="inputProfile inputEditPos" v-if="editMode" v-model="newTechnology"/>
            <span class="prof-div-bar"></span>
            <button tooltip="usuń" class="prof-div-pos-btn" v-if="editMode" @click="addTechnology">&#43;</button>
            <button class="btn-hint hint-abs" @click="showHintFn({name: 'Technologies', show: true})" v-if="editMode">?</button>
            <label :class="editMode ? 'label-profile': 'label-skills'">{{ $t("label.technologies") }}</label>
            <div class="prof-skills-elems">
              <button :title="$t('title.delete')" class="prof-div-pos-elem" :disabled="!editMode" v-for="tech in userSkills.Technologies" :key="tech"  @click="removeTechnology(tech)">{{tech}}</button>
            </div>
          </div>
          <div class="prof-input-xl">
            <!-- Extensions -->
            <input v-on:keyup.enter="addExtension" required class="inputProfile inputEditPos" v-if="editMode" v-model="newExtension"/>
            <span class="prof-div-bar"></span>
            <button class="prof-div-pos-btn" v-if="editMode" @click="addExtension">&#43;</button>
            <button class="btn-hint hint-abs" @click="showHintFn({name: 'Extensions', show: true})" v-if="editMode">?</button>
            <label :class="editMode ? 'label-profile': 'label-skills'">{{ $t("label.extensions") }}</label>
            <div class="prof-skills-elems">
              <button :title="$t('title.delete')" class="prof-div-pos-elem" :disabled="!editMode" v-for="ext in userSkills.Extensions" :key="ext"  @click="removeExtension(ext)">{{ext}}</button>
            </div>
          </div>
          <div class="prof-input-xl">
            <!-- Additional experience -->
            <input v-on:keyup.enter="addAdditional" required class="inputProfile inputEditPos" v-if="editMode" v-model="newAdditional"/>
            <span class="prof-div-bar"></span>
            <button class="prof-div-pos-btn" v-if="editMode" @click="addAdditional">&#43;</button>
            <button class="btn-hint hint-abs" @click="showHintFn({name: 'AdditionalSkills', show: true})" v-if="editMode">?</button>
            <label :class="editMode ? 'label-profile': 'label-skills'">{{ $t("label.additionalSkills") }}</label>
            <div class="prof-skills-elems">
              <button :title="$t('title.delete')" class="prof-div-pos-elem" :disabled="!editMode" v-for="add in userSkills.AdditionalSkills" :key="add"  @click="removeAdditional(add)">{{add}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
let utils = require("../../../utils");
export default {
  data() {
    return {
      editMode: false,
      _beforeEditingCacheSkills: null,
      _beforeEditingCacheLangs: null,
      newSapModule: null,
      newProgramLang: null,
      newTechnology: null,
      newExtension: null,
      newAdditional: null,
      langBtn: true,
      bSapModules: false,
      bProgramLangs: false,
      bTechnologies: false,
      bExtensions: false,
      bAdditionalSkills: false,
      bDisabled: true
    };
  },
  computed: {
    ...mapGetters({
      userSkills: "getUserSkills",
      modulesList: "getModulesList",
      userLangs: "getUserLanguages",
      langLevels: "getLangLevels",
      fullLanguageList: "getFullLanguageList",
      disabledBtnToEdit: "getDisabledBtnToEdit",
      showHint: "getShowHintSkill",
      userSkillsDfLang: "getUserSkillsDfLang"
    })
  },
  methods: {
    ...mapActions([
      "removeModuleForSkills",
      "removeSkill",
      "addLanguageSkillsRow",
      "updateUserLangs",
      "saveUserSkills",
      "saveUserLangs",
      "addSkill",
      "removeSkill",
      "showHintFn",
      "getNewDataForHint"
    ]),
    onHover(el) {
      this.$store.dispatch("onLightUp", el.style ? el : this.$el);
    },
    onHoverOut(el) {
      this.$store.dispatch("onLightOut", el.style ? el : this.$el);
    },
    edit() {
      this.editMode = true;
      this.onHover(this.$el);
      this._beforeEditingCacheSkills = utils.createClone(this.userSkills);
      this._beforeEditingCacheLangs = utils.createClone(this.userLangs);
    },
    remove(index) {
      let newData = utils.createClone(this.userLangs[index]);
      newData.Action = 'D';
      this.updateUserLangs(newData);
      this.userLangs.splice(index, 1);
      this._beforeEditingCacheLangs = utils.createClone(this.userLangs)
    },
    // undo changes
    cancel() {
      this.onHoverOut(this.$el);
      this.$store.commit("SET_USER_SKILLS", this._beforeEditingCacheSkills);
      this.$store.commit("SET_USER_LANGS", this._beforeEditingCacheLangs);
      this.editMode = false;
    },
    // check if new data should be updated or created
    save() {
      this.onHoverOut(this.$el);
      let data = utils.createClone(this.userSkills);
      this.saveUserSkills(data);
      this._beforeEditingCacheSkills = utils.createClone(this.userSkills);
      this._beforeEditingCacheLangs = utils.createClone(this.userLangs);
      this.editMode = false;
    },
    // validate fields
    checkFieldsLangs(index) {
      // if (this._beforeEditingCacheLangs[index]!==undefined) {
        if (this._beforeEditingCacheLangs[index]===undefined ||
          this._beforeEditingCacheLangs[index].LanguageId !==
            this.userLangs[index].LanguageId ||
          (this._beforeEditingCacheLangs[index].LangLevel !==
            this.userLangs[index].LangLevel &&
            this.userLangs[index].LanguageId &&
            this.userLangs[index].LangLevel)
        ) {
          document.getElementsByClassName("prof-skills-save")[
            index
          ].disabled = false;
        } else {
          document.getElementsByClassName("prof-skills-save")[index].disabled = true;
        }
      // }  
    },
    // check fields for skills
    checkFieldsSkills(event) {
      if (
        this.bSapModules ||
        this.bProgramLangs ||
        this.bTechnologies ||
        this.bExtensions ||
        this.bAdditionalSkills
      ) {
        this.bDisabled = false;
      } else {
        this.bDisabled = true;
      }
    },
    checkSingleSkill(skillKey) {
      let beforeEdit = this._beforeEditingCacheSkills,
        userSkills = this.userSkills;
    if(beforeEdit[skillKey]) {
        if (beforeEdit[skillKey].length !== userSkills[skillKey].length) {
        this.checkSkillKey(skillKey, true);
      } else {
        for (const item of beforeEdit[skillKey]) {
          if (!userSkills[skillKey].find(o => o === item)) {
            this.checkSkillKey(skillKey, true);
          } else {
            this.checkSkillKey(skillKey, false);
          }
        }
      }
    } else {
      this.checkSkillKey(skillKey, true);
    }
      
      this.checkFieldsSkills();
    },
    checkSkillKey(skillKey, bBool) {
      if (skillKey === "SapModules") {
        this.bSapModules = bBool;
      } else if (skillKey === "AdditionalSkills") {
        this.bAdditionalSkills = bBool;
      } else if (skillKey === "Extensions") {
        this.bExtensions = bBool;
      } else if (skillKey === "ProgramLang") {
        this.bProgramLangs = bBool;
      } else if (skillKey === "Technologies") {
        this.bTechnologies = bBool;
      }
    },
    saveLang(index) {
     const dataToChange = this._beforeEditingCacheLangs[index];
     const newData = utils.createClone(this.userLangs[index]);
     newData.Action = 'U';
      if(dataToChange) {
        newData.LanguageToChange = dataToChange.LanguageId;
        this.updateUserLangs(newData);
      } else {
        this.saveUserLangs(newData);
      }
      this._beforeEditingCacheLangs = utils.createClone(this.userLangs);
    },
    addModule(value) {
      const moduleId = value.target.value;
      this.$store.dispatch("addModuleForSkills", moduleId);
      this.checkSingleSkill("SapModules");
    },
    removeModule(sapModule) {
      this.removeModuleForSkills(sapModule);
      this.checkSingleSkill("SapModules");
    },
    addProgramLang() {
      if (this.newProgramLang) {
        const data = {
          name: "ProgramLang",
          value: this.newProgramLang
        };
        this.addSkill(data);
        this.newProgramLang = null;
      }
      this.checkSingleSkill("ProgramLang");
    },
    removeProgramLang(lang) {
      const data = {
        name: "ProgramLang",
        value: lang
      };
      this.removeSkill(data);
      this.checkSingleSkill("ProgramLang");
    },
    addTechnology() {
      if (this.newTechnology) {
        const data = {
          name: "Technologies",
          value: this.newTechnology
        };
        this.addSkill(data);
        this.newTechnology = null;
      }
      this.checkSingleSkill("Technologies");
    },
    removeTechnology(tech) {
      const data = {
        name: "Technologies",
        value: tech
      };
      this.removeSkill(data);
      this.checkSingleSkill("Technologies");
    },
    addExtension() {
      if (this.newExtension) {
        const data = {
          name: "Extensions",
          value: this.newExtension
        };
        this.addSkill(data);
        this.newExtension = null;
      }
      this.checkSingleSkill("Extensions");
    },
    removeExtension(ext) {
      const data = {
        name: "Extensions",
        value: ext
      };
      this.removeSkill(data);
      this.checkSingleSkill("Extensions");
    },
    addAdditional() {
      if (this.newAdditional) {
        const data = {
          name: "AdditionalSkills",
          value: this.newAdditional
        };
        this.addSkill(data);
        this.newAdditional = null;
      }
      this.checkSingleSkill("AdditionalSkills");
    },
    removeAdditional(add) {
      const data = {
        name: "AdditionalSkills",
        value: add
      };
      this.removeSkill(data);
      this.checkSingleSkill("AdditionalSkills");
    },
    showSingleHint(data) {
      let name = this.showHint.name;
      return data[name];
    }    
  }
};
</script>
