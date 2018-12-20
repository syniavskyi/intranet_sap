<template>
  <div class="plane-component">
    <!-- BEGIN OF DIALOG -->
    <confirm-dialog v-if="showDialog">
     <template slot="modal-title">
       {{ !isError ? $t("header.userRegisteredTitle") : $t("header.userNotRegisteredTitle") }}
     </template>
     <template slot="modal-text">
       {{ !isError ? $tc("message.userRegistered", 2, { fullname: registerData.Fullname, email: registerData.Email} ) : $tc("message.userNotregistered", 2, { fullname: registerData.Fullname} ) }}
     </template>
    </confirm-dialog>
    <!-- END OF DIALOG -->
    <div class="component-nav-and-content">
      <app-menu v-show="displayMenu"></app-menu>
      <div class="modal-overlay" v-show="displayMenuOverlay"></div>
      <div class="component-content">
        <div class="content-header">
          <div class="content-header-title-and-menu">
            <div @click="showMenu"  class="content-header-menu">&#9776;</div>
            <p class="content-header-title">{{ $t("header.registration") }}</p>
          </div>
        </div>
        <div class="reg-tile">
          <div class="registration-credentials">
            <!-- FULLNAME -->
            <div class="cd-for-input">
              <input required type="text" class="cd-input" name="fullName" v-model="registerData.Fullname">
              <span class="cd-span"></span>
              <label for="Fullname" class="cd-label">{{ $t("label.fullName") }}</label>
            </div>
            <!-- EMAIL -->
            <!-- was class cd-for-input-s -->
            <div class="cd-for-input">
              <input required type="text" class="cd-input" v-model="registerData.Email">
              <span class="cd-span"></span>
              <label for="Email" class="cd-label">{{ $t("label.email") }}</label>
            </div>
            <!-- DEPARTMENT -->
            <div class="cd-for-select">
              <select required class="cd-select" v-model="registerData.DepartmentId" @change="checkToBackOffice(registerData.DepartmentId)">
                <option v-for="DepartmentId in departmentList" :key="DepartmentId.Value" :value="DepartmentId.Key">{{ DepartmentId.Value }}</option>
              </select>
              <label class="cd-slabel" for="DepartmentId">{{ $t("label.department") }}</label>
            </div>
            <!-- BRANCH -->
            <div class="cd-for-select">
              <select required class="cd-select" v-model="registerData.BranchId" @change="checkToBackOffice(registerData.DepartmentId)">
                <option v-for="BranchId in branchList" :key="BranchId.Key" :value="BranchId.Key">{{ BranchId.Value }}</option>
              </select>
              <label class="cd-slabel" for="BranchId">{{ $t("label.branch") }}</label>
            </div>
            <!-- ROLE -->
            <div class="cd-for-select">
              <select required :disabled="backOfficeClicked" class="cd-select" :class="backOfficeClicked ? 'cd-dselect' : 'cd-select'" v-model="registerData.Role" @change="checkToBackOffice(registerData.DepartmentId)">
                <option v-for="Role in roleList" :value="Role.Key" :key="Role.Key">{{ Role.Value }}</option>
                <!-- <option v-for="Role in roleList" :value="Role.Value" :key="Role.Key">{{ Role.Key }}</option> -->
              </select>
              <label class="cd-slabel" for="Role">{{ $t("label.role") }}</label>
            </div>
            <!-- LANGUAGE -->
            <div class="cd-for-select">
              <select required class="cd-select" v-model="registerData.Language">
                <option v-for="Language in cvLanguageList" v-bind:key="Language.id">{{ Language.description }}</option>
                <!-- <option v-for="Language in cvLanguageList" :key="Language.id" :value="Language.id">{{ Language.description }}</option> -->
              </select>
              <label class="cd-slabel" for="Language">{{ $t("label.language") }}</label>
            </div>
            <!-- CONFIRM BUTTON -->
            <button class="button" :disabled="$v.$invalid" @click="submit">
              <span class="loading-icon"><img  src="../../assets/images/loading-white.png" v-show="isLoading"></span>
              <span class="span-arrow" v-show="!isLoading">{{ $t("button.register") }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import i18n from "../../lang/lang";
import Menu from "../Menu.vue";
import { mapGetters } from "vuex";
import Dialog from '../dialogs/ConfirmDialog'
import Modal from '../dialogs/MessageLogDialog';
const utils = require("../../utils.js");

export default {
  data() {
    return {
      Fullname: "",
      Email: "",
      Role: "BTECH",
      DepartmentId: "",
      BranchId: "WRO",
      Language: "PL",
      showSuccessDialog: false,
      showFailDialog: false,
      isLoading: false,
      backOfficeClicked: false
    };
  },
  created() {
      let oStore = this.$store,
          aPromisesToRead = oStore.getters.getRegisterToRead;
      oStore.commit('SET_REGISTER_DEF_DATA');
      oStore.commit('SET_PROMISE_TO_READ', aPromisesToRead);
      oStore.dispatch('getData', null);
      // this.checkRegistrationAuth(oStore);
      utils.checkAuthLink(this.$router, oStore.getters.getUserAuth.ZMENU);
      oStore.commit("SET_DIALOG_ERROR_STATUS", false);
  },
  validations: {
    registerData: {
      Email: {
        required,
        email
      },
      Fullname: {
        required
      },
      BranchId: {
        required
      },
      DepartmentId: {
        required
      },
      Role: {
        required
      },
      Language: {
        required
      }
    }
  },
  components: {
    "app-menu": Menu,
    "confirm-dialog": Dialog,
    "modal": Modal
  },
  methods: {
    checkToBackOffice(passedValue) {
      if(passedValue === "BACKO") {
        this.registerData.Role = "BACKO";
        this.backOfficeClicked = true;
      } else {
        this.backOfficeClicked = false;
      }
    },
    showMenu(event) {
      let obj = { window, event };
      this.$store.dispatch("setSideMenu", obj);
    },
    submit() {
      this.isLoading = true;
      this.$store.dispatch("submitRegistration", {
        Fullname: this.Fullname,
        Email: this.Email,
        DepartmentId: this.DepartmentId,
        BranchId: this.BranchId,
        Role: this.Role,
        Language: this.Language.toUpperCase()
      });
      this.isLoading = false;
    },
    // checkRegistrationAuth(oStore) {
    //   var bAuth = oStore.getters.getUserAuth.ZMENU.registration;

    //   if(!bAuth) {
    //     this.$router.push({name: "News"})
    //   }
    // }
  },
  // computed: {
  //   ...mapGetters({
  //     displayMenu: "getShowMenu",
  //     displayMenuOverlay: "getShowMenuOverlay",
  //     isError: "getDialogErrorStatus",
  //     roleList: "getRoleList",
  //     departmentList: "getDepartmentList",
  //     cvLanguageList: "getCvLanguageList", 
  //     showDialog: "getDisplayConfirmDialog",
  //     branchList: "getBranchList",
  //     registerData: "getRegistratinData",
  //     menuAuth: "getMenuAuth"
  //   })
  // }
  computed: Object.assign(mapGetters({
      displayMenu: "getShowMenu",
      displayMenuOverlay: "getShowMenuOverlay",
      isError: "getDialogErrorStatus",
      roleList: "getRoleList",
      departmentList: "getDepartmentList",
      cvLanguageList: "getCvLanguageList", 
      showDialog: "getDisplayConfirmDialog",
      branchList: "getBranchList",
      registerData: "getRegistratinData",
      menuAuth: "getMenuAuth"
  }))
};
</script>