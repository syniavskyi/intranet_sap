<template>
<div class="plane-component" >
  <div class="component-nav-and-content">
    <app-menu v-show="displayMenu"></app-menu>
    <div class="component-content"> 
      <div class="content-header">
        <div class="content-header-title-and-menu">
          <!-- <img @click="showMenu" src="../../assets/images/nav/if_menu-32.png" width="32px" class="content-header-menu"> -->
          <div @click="showMenu"  class="content-header-menu">&#9776;</div>
          <p class="content-header-title">{{ $t("header.registration") }}</p>
        </div>
      </div>
      <div class="reg-tile">
        <div class="registration-credentials">
          <div class="cd-for-input">
            <input required class="cd-input" type="text" name="fullName" @input="getFullNameToEmail()" v-model="fullName" @change="checkEmail()" @blur="$v.fullName.$touch()">
            <span class="cd-span"></span>
            <label for="fullName" class="cd-label">{{ $t("label.fullName") }}</label>
          </div>
          <div class="cd-for-input-s">
            <!-- <div class="input-with-checkbox"> -->
            <input required class="cd-input" :disabled="isEmail" @blur="$v.fullNameToEmail.$touch()" :value="fullNameToEmail" @change="checkEmail($event.target.value)">
            <div class="checkbox-absolute">              
              <div class="checkbox-wrap">
                <input class="checkbox" :checked="isEmail" type="checkbox" disabled>
                <div class="checkbox-in"></div>
              </div>
            </div>
            <!-- </div> -->
            <span class="cd-span"></span>
            <label for="email" class="cd-label">{{ $t("label.email") }}</label>
          </div>
          <div class="cd-for-select">
            <select required class="cd-select">
              <option v-for="role in getRoleList" :value="roleChosen = role" :key="role.roleId">{{ role }}</option>
            </select>
            <label class="cd-slabel" for="role">{{ $t("label.role") }}</label>
          </div>
          <div class="cd-for-select">
            <select required class="cd-select">
              <option v-for="department in getDepartmentList" :value="depId = department.depId" :key="department.depId">{{ department.depName }}</option>
            </select>
            <label class="cd-slabel" for="role">{{ $t("label.department") }}</label>
          </div>
          <button class="button" :disabled="$v.$invalid" @click="submit">
            <span class="loading-icon"><img  src="../../assets/images/loading-white.png" v-show="isLoading"></span>
            <span class="span-arrow" v-show="!isLoading">{{ $t("button.register") }}</span>
          </button>
        </div>
      </div>
    </div>

        <!-- SUCCESS DIALOG -->
        <transition name="slide-backdrop" v-if="closeSuccessDialog">
          <div class="backdrop" v-if="closeSuccessDialog"></div>
        </transition>
        <transition name="slide" v-if="closeSuccessDialog">
          <div class="modal" v-if="closeSuccessDialog">
            <div class="modal-header">
              <h1 class="modal-title">{{ $t("header.accountCreated") }}</h1>
              <button class="modal-exit" @click="closeDialog">&#10006;</button>
            </div>
            <div class="modal-text">
              <p>{{ $t("message.newAccountPassword") }}</p>
            </div>
          </div>
        </transition>
        <!-- END OF SUCCESS DIALOG -->
        <!-- FAILED DIALOG -->
        <transition name="slide-backdrop" v-if="openDialogFalse">
          <div class="backdrop" v-if="openDialogFalse"></div>
        </transition>
        <transition name="slide" v-if="openDialogFalse">
          <div class="modal" v-if="openDialogFalse">
            <div class="modal-header">
              <h1 class="modal-title">Niepowodzenie podczas wysyłania wiadomości.</h1>
              <button class="modal-exit" @click="closeDialog">&#10006;</button>
            </div>
            <div class="modal-text">
              <p>{{ $t("message.newAccountPassword") }}</p>
            </div>
          </div>
        </transition>
        <!-- END OF FAILED DIALOG -->
      </div>
    </div>
  <!-- </div> -->
</template>

<script>
import axios from "axios";
import { required, minLength, email } from "vuelidate/lib/validators";
import i18n from "../../lang/lang";

import Menu from "../Menu.vue";
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      fullName: "",
      email: "",
      mail: "",
      role: [],
      roleChosen: "",
      department: [],
      depId: "",
      closeSuccessDialog: false,
      isLoading: false
    };
  },
  validations: {
    fullNameToEmail: {
      required,
      email
    },
    fullName: {
      required
    }
    // ,
    // setPassword: {
    //   required,
    //   minLen: minLength(8)
    // }
  },
  beforeCreate() {
    // this.$store.commit("DISPLAY_MENU", false);
    if (this.$store.getters.isDataLoaded === false) {
      this.$store.dispatch("loadData");
    }
  },
  created() {
    window.addEventListener("resize", this.showMenu)
  },
  destroyed() {
    window.removeEventListener("resize", this.showMenu)
  },
  components: {
    "app-menu": Menu
  },
  methods: {
    showMenu(event) {
      var x = window.matchMedia("(max-width: 40rem)")
      if (x.matches && event.type === "resize") {
        this.$store.commit("DISPLAY_MENU", false)
      } else {
        this.$store.commit("DISPLAY_MENU", true);
      }
    },
    checkEmail(value) {
      this.mail = value;
      this.$store.dispatch("checkEmail", {
        fullNameToEmail: this.fullNameToEmail,
        mail: this.mail
      });
    },
    getFullNameToEmail() {
      this.$store.dispatch("fullNameToEmail", {
        name: this.fullName,
        email: this.email,
        isEmail: this.isEmail
      });
    },
    // generatePassword() {
    //   this.$store.dispatch("generatePassword");
    // },
    submit() {
      this.isLoading = true;
      this.$store.dispatch("generatePassword");
      this.$store.dispatch("submitRegistration", {
        name: this.fullName,
        email: this.mail,
        password: this.setPassword,
        department: this.depId,
        role: this.roleChosen,
        openDialog: this.closeSuccessDialog
      });
      this.isLoading = false;
    },
    closeDialog() {
      this.closeSuccessDialog = !this.closeSuccessDialog;
    }
  },
  computed: {
    ...mapGetters({
      displayMenu: "getShowMenu"
    }),
    getRoleList() {
      return this.$store.getters.roleList;
    },
    getDepartmentList() {
      return this.$store.getters.depList;
    },
    fullNameToEmail() {
      return this.$store.getters.prefixEmail;
    },
    hashedPassword() {
      return this.$store.getters.hashedPassword;
    },
    setPassword() {
      return this.$store.getters.password;
    },
    isEmail() {
      return this.$store.getters.isEmail;
    },
    openDialog() {
      return this.$store.getters.openDialog;
    },
    setMail() {
      return this.$store.getters.setMail;
    },
    openDialogFalse() {
      return this.$store.getters.openFailedDialog;
    }
  }
};
</script>