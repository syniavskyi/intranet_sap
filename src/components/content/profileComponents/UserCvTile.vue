<template>
  <div class="profile-tile-1-2">
    <div class="profile-tile-header">
      <div class="profile-tile-header-row">
        <h2 class="prof-tile-h2">{{ $t("label.cv") }}</h2>
        <button class="func-btn" @click="showSelectDialog">{{ $t("header.generateCV") }}</button>
      </div>
      <div class="tile-underscore"></div>
    </div>
    <div class="profile-tile-content">
      <div class="cv-buttons">
        <div class="button-cv">
          <div class="prof-input-100">
            <select class="selectProfile selectEdit" required  v-model="selectedDownloadLang" @change="checkIfFileExist">
              <option v-for="language in cvLanguageList" :key="language.id" :value="language.id">{{ language.description }}</option>
            </select>
            <label class="label-profile">{{ $t("label.language") }}</label>
          </div>
          <div class="prof-input-100">
            <select class="selectProfile selectEdit" required v-model="selectedFormat" @change="setSelectedFormat">
              <option v-for="format in formats" :key="format">{{format}}</option>
            </select>
            <label class="label-profile">{{ $t("label.format") }}</label>
          </div>
          <div class="add-download" v-if="selectedFormat">
            <p class="profile-error profile-error-upload-top" v-if="fileUploadError">{{ $t("message.fileUploadError") }}</p>
            <div v-if="selectedFormat==='DOCX'">
              <label class="add" for="add-docx-pl">+
                <input accept=".docx" id="add-docx-pl" type="file" class="add doc-add-pl" ref="file" @change="handleCvUpload('DOCX')">
              </label>
            </div>
            <div v-if="selectedFormat==='DOC'">
              <label class="add" for="add-docx-pl">+
                <input accept=".doc" id="add-docx-pl" type="file" class="add doc-add-pl" ref="file" @change="handleCvUpload('DOC')">
              </label>
            </div>
            <div v-if="selectedFormat==='PDF'">
              <label class="add" for="add-docx-pl">+
                <input accept=".pdf" id="add-docx-pl" type="file" class="add doc-add-pl" ref="file" @change="handleCvUpload('PDF')">
              </label>
            </div>
            <a title="ściągnij" :disabled="disableFileOptions" class="download pdf-add-pl" :href="setDownloadLink()">&#x21e3;</a>
            <button title="usuń" :disabled="disableFileOptions" class="download pdf-add-pl" @click="deleteFile">X</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from "../../../lang/lang";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      selectedDownloadLang: i18n.locale,
      selectedFormat: null,
      disableFileOptions: null
    };
  },
  computed: {
    ...mapGetters({
      cvLanguageList: "getCvLanguageList",
      fileUploadError: "isFileUploadError",
      showSelectCv: "getShowSelectCvDialog",
      formats: "getCvFormats",
      userFilesList: "getUserFiles"
    })
  },
  methods: {
    showSelectDialog() {
      this.$store.commit("SET_SHOW_CV_DIALOG", true);
    },
    setSelectedFormat(value) {
      this.selectedFormat = value.target.value;
      this.checkIfFileExist();
    },
    checkIfFileExist() {
      let formatToCheck = "CV-" + this.selectedFormat;
      for (let i = 0; i < this.userFilesList.length; i++) {
        if (this.userFilesList[i].FileType == formatToCheck) {
          this.disableFileOptions = false;
          return;
        } else {
          this.disableFileOptions = true;
        }
      }
    },
    setDownloadLink(format) {
      // e.g. AttachmentMedias(FileType='CV',Language='PL',UserAlias='MHA')/$value
      const sUserId = localStorage.getItem("id"),
        sLanguage = this.selectedDownloadLang.toUpperCase(),
        sFileType = "CV-" + this.selectedFormat;

      const url =
        "http://nw5.local.pl:8050/sap/opu/odata/sap/ZGW_INTRANET_SRV/AttachmentMedias(FileType='" +
        sFileType +
        "',Language='" +
        sLanguage +
        "',UserAlias='" +
        sUserId +
        "')/$value";

      return url;
    },
    handleCvUpload() {
      this.file = this.$refs.file.files[0];

      let data = {
        file: this.file,
        language: this.selectedDownloadLang.toUpperCase(),
        userId: localStorage.getItem("id"),
        type: "CV-" + this.selectedFormat
      };

      let isToChange = null;
      for (let i = 0; i < this.userFilesList.length; i++) {
        if (
          this.userFilesList[i].FileType == data.type &&
          this.userFilesList[i].Language == data.language
        ) {
          isToChange = true;
          this.$store.dispatch("updateCv", data);
          return;
        } else {
          isToChange = false;
        }
      }
      if (isToChange == false) {
        this.$store.dispatch("submitCv", data);
      }
      this.checkIfFileExist();
    },
    deleteFile() {
      let data = {
        language: this.selectedDownloadLang.toUpperCase(),
        userId: localStorage.getItem("id"),
        type: "CV-" + this.selectedFormat
      };
      this.$store.dispatch("deleteCv", data);
      this.checkIfFileExist();
    }
  }
};
</script>

