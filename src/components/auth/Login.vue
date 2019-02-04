<template>
	<div class="plane-parent plane-parent-login">
    <div class="plane plane-login">
      <div class="plane-left">
        <img class="img-user" src="../../assets/images/grouper-256.png">
        <p class="p-login">{{ $t("header.login") }}</p>
      </div>
      <div class="login-credentials">
        <div class="cd-for-input logini-margin">
          <input class="cd-input" v-model="username" @blur="$v.username.$touch()" required>
          <span class="cd-span"/>
          <label class="cd-tlabel">{{ $t("label.user")}}</label>
        </div>
        <div class="cd-for-input logini-margin">
          <input class="cd-input" :type="passwordFieldType" @keyup.enter="onSubmit" v-model="password" @blur="$v.password.$touch()" :trim="password" autocomplete="new-password" required>
          <span class="cd-span"/>
          <button class="show-pass-eye"  @click="switchPasswordVisibility"><icon :name="eyeType"></icon></button>
          <label class="cd-tlabel cd-llogin">{{ $t("label.password") }}</label>
        </div>
        <p class="forgot-pass" @click="switchForgotPassword">{{ $t("button.forgotPass") }}</p>
        <div class="div-select-login">
          <label class="label">{{ $t("label.language") }}</label>
            <select class="select-login" v-model="selectedLang">
              <option v-for="language in languageList" :key="language.id" :value="language.id">{{ language.description }}</option>
            </select>
        </div>
        <transition name="show-alert">
          <p class="login-error" v-if="loginError">{{ $t("message.loginError") }}</p>
        </transition>
        <button class="button login-button" :disabled="$v.password.$invalid" @click="onSubmit">
          <span class="loading-icon"><img  src="../../assets/images/loading-white.png" v-show="isLoading"></span>
          <span class="span-arrow" v-show="!isLoading">{{ $t("button.login") }}</span>
        </button>
      </div>
    </div>
    <LoginForgotPassModal v-if="showRemindPassword" :language="this.selectedLang"></LoginForgotPassModal>
  </div>
</template>

<script>
import { required, minLength} from "vuelidate/lib/validators";
import Icon from "vue-awesome/components/Icon";
import LoginForgotPassModal from './LoginForgotPassModal';
import { mapGetters } from "vuex";
import i18n from "../../lang/lang";

export default {
  data() {
    return {
      username: "",
      password: "",
      isLoading: false,
      passwordFieldType: "password",
      eyeType: "eye",
      selectedLang: i18n.locale
    };
  },
  watch: {
    selectedLang(newVal) {
      this.setLanguage(newVal);
    }
  },
  components: {
    Icon,
    LoginForgotPassModal
  },
  validations: {
    password: { required, minLen: minLength(6) },
    username: { required }
  },
  methods: {
    onSubmit() {
      this.isLoading = true;
      this.$store.commit("SET_DISPLAY_LOADER", true);
      this.SelectedLang = this.SelectedLang === undefined ? "PL" : this.SelectedLang;

      this.$store.dispatch("login", {
          username: this.username,
          password: this.password,
          language: this.selectedLang.toUpperCase()
        })
        .then((this.isLoading = false));

      this.$store.commit("SET_LOGIN_LANGUAGE", this.selectedLang.toUpperCase());
    },
    switchForgotPassword() {
      this.$store.commit("SET_LOG_FORGOT_PASS_MODAL", true);
    },
    switchPasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
      this.eyeType = this.eyeType === "eye" ? "eye-slash" : "eye";
    },
    setLanguage(language) {
      this.$store.dispatch("setLanguage", language);
    }
  },
  computed: Object.assign(mapGetters({
      loginError: "isLoginError",
      newPassword: "password",
      languageList: "getLanguageList",
      showRemindPassword: "getLoginPassModal"
    })
  )
};
</script>