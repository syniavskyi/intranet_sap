<template>
  <div class="modal-new">
      <header class="modal-header-new">
        <h1 class="modal-title-new">{{ $t("header.generateCV") }}</h1>
        <button class="modal-close" @click="close">&#10006;</button>
      </header>
      <div class="cv-modal-content">
        <div class="cv-modal-tbuttons">
          <button class="cv-modal-btn-bclear" @click="selectAllCvElements">{{ $t("button.checkAll") }}</button>
          <button class="cv-modal-btn-bclear" @click="deselectAllCvElements">{{ $t("button.uncheckAll") }}</button>
        </div>
        <div class="cv-modal-middle">
          <div class="cv-modal-chkbxs">
            <label class="checkbox-wrap cv-chkbx">
              <input type="checkbox" name="name" v-model="cvElements.name">
              <div class="checkbox-in"></div>
              <p class="checkbox-label">{{ $t("label.fullName") }}</p>
            </label>
            <label class="checkbox-wrap cv-chkbx">
              <input type="checkbox" name="photo" v-model="cvElements.photo">
              <div class="checkbox-in"></div>
              <p class="checkbox-label">{{ $t("label.photo") }}</p>
            </label>
            <label class="checkbox-wrap cv-chkbx">
              <input type="checkbox" name="address" v-model="cvElements.address">
              <div class="checkbox-in"></div>
              <p class="checkbox-label">{{ $t("label.emailAdress") }}</p>
            </label>
          </div>
          <div class="cv-modal-chkbxs">
            <label class="checkbox-wrap cv-chkbx">
              <input type="checkbox" name="phone" v-model="cvElements.phone">
              <div class="checkbox-in"></div>
              <p class="checkbox-label">{{ $t("label.phoneNumber") }}</p>
            </label>
            <!-- <label class="checkbox-wrap cv-chkbx">
              <input type="checkbox" name="date" v-model="cvElements.date">
              <div class="checkbox-in"></div>
              <p class="checkbox-label">{{ $t("label.dateOfBirth") }}</p>
            </label> -->
            <label class="checkbox-wrap cv-chkbx">
              <input type="checkbox" name="date" v-model="cvElements.contractor">
              <div class="checkbox-in"></div>
              <p class="checkbox-label">{{ $t("label.contractorName") }}</p>
            </label>
          </div>
        </div>
        <div class="cv-modal-selects">
          <div class="cv-modal-div">
          <!-- Wybierz język -->
            <select class="cv-modal-select" v-model="cvElements.language" @blur="$v.cvElements.language.$touch()" required>
              <option v-for="language in languageList" :key="language.id" :value="language.id.toUpperCase()"> {{language.description}}</option>
            </select>
            <label class="cv-modal-label">{{ $t("label.selectLanguage") }}</label>
          </div>
          <div class="cv-modal-div">
            <!-- Wybierz format -->
            <select required class="cv-modal-select" v-model="cvElements.format" @blur="$v.cvElements.format.$touch()">
              <option v-for="format in formats" :value="format" :key="format"> {{format}} </option>
            </select>
            <label class="cv-modal-label">{{ $t("label.selectFormat") }}</label>
          </div>
          <div class="cv-modal-div">
            <input required class="cv-modal-input" v-model="cvElements.position" @blur="$v.cvElements.position.$touch()">
            <span class="cd-span"></span>
            <label class="cv-modal-label">{{ $t("label.position") }}</label>
            <p v-if='!cvElements.position' class="avail-error p-error"> {{ $t("message.requiredField") }} </p>
          </div>
          <div class="cv-modal-div">
            <input required class="cv-modal-input" v-model="cvElements.entity">
            <span class="cd-span"></span>
            <label class="cv-modal-label">{{ $t("label.entity") }}</label>
          </div>
        </div>
      </div>
      <div class="cv-modal-bbuttons">
        <button :disabled="$v.$invalid" class="cv-modal-btn" @click="showCv">{{ $t("button.seePreview") }}</button>
        <button class="cv-modal-btn-clear" @click="close">{{ $t("button.close") }}</button>
      </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import i18n from "../../../lang/lang";
import { app } from "../../../main";
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      cvElements: "getCvElements",
      languageList: "getLanguageList",
      industryList: "getIndustryList",
      getSelectedCvLang: "getSelectedCvLang",
      userData: "getUserInfo",
      formats: "getCvFormats"
    })
  },
  validations: {
      cvElements: {
        language: {
          required
        },
        format: {
          required
        },
        position: {
          required
        }
      }
  },
  methods: {
    ...mapActions([
      "selectAllCvElements",
      "deselectAllCvElements",
      "getDomainValues",
      "getIndustryList",
      "getUserData"
    ]),
    close() {
      this.$store.commit("SET_SHOW_CV_DIALOG", false);
    },
    showCv() {
      if(!this.cvElements.language){
        this.cvElements.language = this.$i18n.locale.toUpperCase();
      }
      this.cvElements.position = this.cvElements.position ? this.cvElements.position : this.userData.JobPosition;
      this.cvElements.entity = this.cvElements.entity || null
      this.$store.commit("SET_CV_ELEMENTS", this.cvElements);
      localStorage.setItem("Object", JSON.stringify(this.cvElements));
      this.$router.push({ name: "CV" });
    }
  }
};
</script>

<style>

.cv-modal-content {
  display: flex;
  flex-direction: column;
  height: 79%;
  justify-content: space-around;
}
.cv-modal-tbuttons {
  display: flex;
  align-self: center;
  width: 80%;
  justify-content: space-around;
}
.cv-modal-middle {
  display: flex;
  align-self: center;
  align-items: flex-start;
  width: 100%;
  justify-content: space-around;
}

.cv-modal-chkbxs {
  display: flex;
  width: 48%;
  flex-direction: column;
  justify-content: space-between;
}
.cv-chkbx {
  display: flex;
  align-self: flex-start;
  margin-bottom: 1rem;
}

.cv-modal-div {
  display: flex;
  position: relative;
  margin-top: 0.4rem;
  margin-bottom: 1rem;
  width: 10.1rem;
  flex-direction: column;
}

.cv-modal-input {
  display: flex;
  text-align: center;
  height: 2rem;
  font-family: "Roboto";
  font-size: 1rem;
  background: transparent;
  border: 0;
  width: 100%;
  text-indent: 0.5rem;
  position: relative;
  border-bottom: 1px solid #757575;
}

/* active state */
.cv-modal-input:focus ~ span:before,
.cv-modal-input:focus ~ span:after {
  width: 50%;
}

.cv-modal-select {
  display: flex;
  width: 100%;
  height: 2rem;
  border-radius: 3px;
  flex-shrink: 0;
  border: 0;
  font-family: "Roboto";
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  font-size: 1rem;
  background: white;
  text-indent: 0.5rem;
  background-image: url("../../../assets/images/expand2.png");
  background-repeat: no-repeat;
  background-position: right;
  border: 1px solid lightgrey;
}

.cv-modal-select:valid ~ label,
.cv-modal-select:focus ~ label,
.cv-modal-input:valid ~ label,
.cv-modal-input:focus ~ label {
  top: -0.65rem;
  font-size: 1rem;
  color: rgb(255, 145, 0);
  padding: 0 0.2rem;
}
.cv-modal-label {
  display: flex;
  align-items: flex-end;
  color: #999;
  position: absolute;
  pointer-events: none;
  background-color: white;
  transition: 0.3s ease all;
  font-weight: 400;
  left: 0.35rem;
  top: 0.25rem;
  font-size: 1.2rem;
}

.cv-modal-btn,
.cv-modal-btn-clear,
.cv-modal-btn-bclear {
  display: flex;
  cursor: pointer;
  color: #333;
  text-transform: capitalize;
  border: 0;
  border-radius: 4px;
  transition: all 0.2s ease;
  justify-content: center;
  align-items: center;
  margin: 0.2rem;
  outline: none;
  font-size: 0.85rem;
}

.cv-modal-btn {
  padding: 0.5rem 0.7rem;
  background: #ccc;
  box-shadow: 0 3px 3px -2px gray;
}

.cv-modal-btn-clear {
  padding: 0.5rem 0.7rem;
}

.cv-modal-btn-bclear {
  background: transparent;
  border: 2px solid rgb(61, 61, 61);
  padding: 0.6rem 0.8rem;
}

.cv-modal-btn-bclear:hover {
  box-shadow: 0px 0px 8px #333;
  background: #333;
  color: white;
}

.cv-modal-btn-clear {
  background: white;
}

.cv-modal-btn-clear:hover {
  color: orange;
}

.cv-modal-btn:hover {
  background: rgb(156, 156, 156);
}

.cv-modal-bbuttons {
  display: flex;
  align-self: flex-end;
  align-items: center;
  justify-content: flex-end;
}

.cv-modal-selects {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-self: center;
  justify-content: space-around;
  height: 35%;
}

@media (min-width: 30rem) {
  .cv-modal-middle {
    width: 80%;
    justify-content: space-around;
  }
  .cv-modal-chkbxs {
    width: 40%;
  }

  .cv-modal-selects {
    width: 80%;
  }
}
</style>