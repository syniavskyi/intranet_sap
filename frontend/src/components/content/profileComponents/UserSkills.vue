<template>
  <div class="profile-tile">
    <div class="profile-tile-header">
      <div class="profile-tile-header-row">
        <h2 class="profile-tile-title">{{ $t("header.skills") }}</h2>
        <div class="profile-table-buttons">
          <button class="profile-edit-btn" v-if="!editMode" @mouseover="onHover" @mouseout="onHoverOut" @click="edit">{{ $t("button.edit") }}</button>
          <button class="profile-edit-btn-e" v-if="editMode" @click="cancel"><span class="prof-btn-txt">{{ $t("button.cancel") }}</span><span class="prof-btn-icon">&plus;</span></button>
          <button class="profile-edit-btn-e" v-if="editMode" @click="save()"><span class="prof-btn-txt">{{ $t("button.save") }}</span><span class="prof-btn-icon">&#10004;</span></button>
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
                  <select v-if="editMode" class="selectProfileSkills selectEdit" v-model="lang.Language" @change="checkFields">
                    <option v-for="fullLang in fullLanguageList" :value="fullLang.Language" :key="fullLang.Language">{{fullLang.LangName}}</option>
                  </select>
                  <select v-if="!editMode" class="selectProfileSkills selectDisabled" v-model="lang.Language">
                    <option v-for="fullLang in fullLanguageList" :value="fullLang.Language" :key="fullLang.Language">{{fullLang.LangName}}</option>
                  </select>
                  <label class="label-select-profile">{{ $t("label.language") }}</label>
                </div>
                <div class="prof-div-slang">
                  <select v-if="editMode" class="selectProfileSkills selectEdit" v-model="lang.LangLevel" @change="checkFields">
                    <option v-for="level in langLevels" :value="level.Key" :key="level.Key">{{level.Value}}</option>
                  </select>
                  <select v-if="!editMode" class="selectProfileSkills selectDisabled" v-model="lang.LangLevel">
                    <option v-for="level in langLevels" :value="level.Key" :key="level.Key">{{level.Value}}</option>
                  </select>
                  <label class="label-select-profile">{{ $t("label.level") }}</label>
                </div>
                <div class="prof-skills-btns">
                  <button class="prof-skills-delete" @click="removeLanguageSkillsRow(index)" v-if="editMode">Usuń</button>
                  <button class="prof-skills-save saveLangBtn" :disabled="true" @click="saveLang" v-if="editMode">{{ $t("button.save") }}</button>
                </div>
              </div>
          </div>
          <div class="prof-input-xl">
            <!-- Sap modules -->
            <select required class="selectProfileSkills selectEdit" v-if="editMode" @change="addModule">
              <option disabled selected value>{{ $t("table.addModule") }}:</option>
              <option v-for="sapModule in modulesList" :key="sapModule.Key" :value="sapModule.Key" :id="sapModule.id" > {{ sapModule.Value }}</option>
            </select>
            <label :class="editMode ? 'label-select-profile' : 'label-skills'">{{ $t("label.sapModulesExp") }}</label>
            <div class="prof-skills-elems">
              <button title="usuń" class="prof-div-pos-elem" :disabled="!editMode" v-for="sapModule in userSkills.SapModules" :key="sapModule"  @click="removeModuleForSkills(sapModule)">{{sapModule}}</button>
            </div>
          </div>
          <div class="prof-input-xl">
            <!-- Języki programowania -->
            <input v-on:keyup.enter="addProgramLang" required class="inputProfile inputEditPos" v-if="editMode" v-model="newProgramLang"/>
            <span class="prof-div-bar"></span>
            <button class="prof-div-pos-btn" v-if="editMode" @click="addProgramLang">+</button>
            <label :class="editMode ? 'label-profile': 'label-skills'">{{ $t("label.programmingLanguages") }}</label>
            <div class="prof-skills-elems">
              <button title="usuń" class="prof-div-pos-elem" :disabled="!editMode" v-for="lang in userSkills.ProgramLang" :key="lang"  @click="removeProgramLang(lang)">{{lang}}</button>
            </div>
          </div>
        </div>
        <div class="prof-skills-inputs">
          <div class="prof-input-xl">
            <!-- Technologie -->
            <input v-on:keyup.enter="addTechnology" required class="inputProfile inputEditPos" v-if="editMode" v-model="newTechnology"/>
            <span class="prof-div-bar"></span>
            <button tooltip="usuń" class="prof-div-pos-btn" v-if="editMode" @click="addTechnology">+</button>
            <label :class="editMode ? 'label-profile': 'label-skills'">{{ $t("label.technologies") }}</label>
            <div class="prof-skills-elems">
              <button title="usuń" class="prof-div-pos-elem" :disabled="!editMode" v-for="tech in userSkills.Technologies" :key="tech"  @click="removeTechnology(tech)">{{tech}}</button>
            </div>
          </div>
          <div class="prof-input-xl">
            <!-- Extensions -->
            <input v-on:keyup.enter="addExtension" required class="inputProfile inputEditPos" v-if="editMode" v-model="newExtension"/>
            <span class="prof-div-bar"></span>
            <button class="prof-div-pos-btn" v-if="editMode" @click="addExtension">+</button>
            <label :class="editMode ? 'label-profile': 'label-skills'">{{ $t("label.extensions") }}</label>
            <div class="prof-skills-elems">
              <button title="usuń" class="prof-div-pos-elem" :disabled="!editMode" v-for="ext in userSkills.Extensions" :key="ext"  @click="removeExtension(ext)">{{ext}}</button>
            </div>
          </div>
          <div class="prof-input-xl">
            <!-- Additional experience -->
            <input v-on:keyup.enter="addAdditional" required class="inputProfile inputEditPos" v-if="editMode" v-model="newAdditional"/>
            <span class="prof-div-bar"></span>
            <button class="prof-div-pos-btn" v-if="editMode" @click="addAdditional">+</button>
            <label :class="editMode ? 'label-profile': 'label-skills'">{{ $t("label.additionalSkills") }}</label>
            <div class="prof-skills-elems">
              <button title="usuń" class="prof-div-pos-elem" :disabled="!editMode" v-for="add in userSkills.AdditionalSkills" :key="add"  @click="removeAdditional(add)">{{add}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
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
      newAdditional: null
    };
  },
  computed: {
    ...mapGetters({
      userSkills: "getUserSkills",
      modulesList: "getModulesList",
      userLangs: "getUserLanguages",
      langLevels: "langLevels",
      fullLanguageList: "fullLanguageList"
    })
  },
  methods: {
    ...mapActions([
      "removeModuleForSkills",
      "removeSkill",
      "addLanguageSkillsRow",
      "removeLanguageSkillsRow"
    ]),
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
    edit() {
      this.editMode = true;
      this.onHover(this.$el)
      this._beforeEditingCacheSkills = JSON.parse(
        JSON.stringify(this.userSkills)
      );
      this._beforeEditingCacheLangs = JSON.parse(
        JSON.stringify(this.userLangs)
      );
    },
    cancel() {
      this.onHoverOut(this.$el)
      this.$store.commit("SET_USER_SKILLS", this._beforeEditingCacheSkills);
      this.$store.commit("SET_USER_LANGS", this._beforeEditingCacheLangs);
      this.editMode = false;
    },
    save() {
      this.onHoverOut(this.$el)
      let data = this.userSkills;
      this.$store.dispatch("saveUserSkills", data);
      this._beforeEditingCacheSkills = this.userSkills;
      // JSON.parse(
      //   JSON.stringify(this.userSkills)
      // );
      this._beforeEditingCacheLangs = this.userLangs;
      // JSON.parse(
      //   JSON.stringify(this.userLangs)
      // );

      this.editMode = false;
    },
    checkFields() {
      if (this.userLangs.length > 0) {
        for (let i = 0; i < this.userLangs.length; i++) {
          if (this.userLangs[i].Language && this.userLangs[i].LangLevel) {
            document.getElementsByClassName("saveLangBtn")[i].disabled = false;
          } else {
            document.getElementsByClassName("saveLangBtn")[i].disabled = true;
          }
        }
      }
    },
    saveLang() {
      this._beforeEditingCacheLangs = JSON.parse(
        JSON.stringify(this.userLangs)
      );
    },
    addModule(value) {
      const moduleId = value.target.value;
      this.$store.dispatch("addModuleForSkills", moduleId);
    },
    addProgramLang() {
      if (this.newProgramLang) {
        const data = {
          name: "ProgramLang",
          value: this.newProgramLang
        };
        this.$store.dispatch("addSkill", data);
        this.newProgramLang = null;
      }
    },
    removeProgramLang(lang) {
      const data = {
        name: "ProgramLang",
        value: lang
      };
      this.$store.dispatch("removeSkill", data);
    },
    addTechnology() {
      if (this.newTechnology) {
        const data = {
          name: "Technologies",
          value: this.newTechnology
        };
        this.$store.dispatch("addSkill", data);
        this.newTechnology = null;
      }
    },
    removeTechnology(tech) {
      const data = {
        name: "Technologies",
        value: tech
      };
      this.$store.dispatch("removeSkill", data);
    },
    addExtension() {
      if (this.newExtension) {
        const data = {
          name: "Extensions",
          value: this.newExtension
        };
        this.$store.dispatch("addSkill", data);
        this.newExtension = null;
      }
    },
    removeExtension(ext) {
      const data = {
        name: "Extensions",
        value: ext
      };
      this.$store.dispatch("removeSkill", data);
    },
    addAdditional() {
      if (this.newAdditional) {
        const data = {
          name: "AdditionalSkills",
          value: this.newAdditional
        };
        this.$store.dispatch("addSkill", data);
        this.newAdditional = null;
      }
    },
    removeAdditional(add) {
      const data = {
        name: "AdditionalSkills",
        value: add
      };
      this.$store.dispatch("removeSkill", data);
    }
  }
};
</script>
