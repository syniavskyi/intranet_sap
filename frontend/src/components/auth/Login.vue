<template>
	<div class="plane-parent plane-parent-login">
        <div class="modal-overlay" v-if="showRemindPassword"></div>
        <div class="modal-new-s" v-if="showRemindPassword">
            <div class="modal-header">
                <h1 class="modal-title">{{ $t("header.forgotPass") }}</h1>
                <button class="modal-exit" @click="switchForgotPassword">&#10006;</button>
            </div>
            <div class="modal-email">
              <div class="cd-for-input-xxl">
                <input required class="cd-input" v-model="email">
                <span class="cd-span"></span>
                <label class="cd-label">{{ $t("label.enterEmail") }}</label>
              </div>
                <transition name="fade-alert">
                    <p class="success-alert" v-if="sendEmailSuccess">{{ $t("message.sendEmailSuccess") }}</p>
                </transition>
                <transition name="fade-alert">
                    <p class="success-alert" v-if="sendEmailError">{{ $t("message.sendEmailError") }}</p>
                </transition>
            </div>
            <button class="button modal-button" :disabled="$v.email.$invalid" type="button" @click="onResetPassword"><span class="span-arrow">{{ $t("button.resetPass") }}</span></button>
        </div>
            <div class="plane plane-login">
                <div class="plane-left">
                    <img class="img-user" src="../../assets/images/grouper-256.png">
                    <p class="p-login">{{ $t("header.login") }}</p>
                </div>
                <div class="login-credentials">
                    <input class="input input-login-email" v-model="username" @blur="$v.username.$touch()">
                    <label class="label label-login-email"> {{ $t("label.user") }}</label>
                    <div class="login-pass-div">
                        <input :type="passwordFieldType" @keyup.enter="onSubmit" class="input input-login-pass" v-model="password" @blur="$v.password.$touch()">
                        <button class="show-pass-eye"  @click="switchPasswordVisibility"><icon :name="eyeType"></icon></button>
                    </div>
                    <label for="password" class="label label-login-pass">{{ $t("label.password") }}</label>
                    <p class="forgot-pass" @click="switchForgotPassword">{{ $t("button.forgotPass") }}</p>
                    <div class="div-select-login">
                        <label class="label" for="role">{{ $t("label.language") }}</label>
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
        </div>
</template>

<script>
import { required, minLength, email } from "vuelidate/lib/validators";
import Icon from "vue-awesome/components/Icon";
import { mapGetters } from "vuex";
import i18n from "../../lang/lang";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      showRemindPassword: false,
      isLoading: false,
      passwordFieldType: "password",
      eyeType: "eye",
      email: "",
      selectedLang: i18n.locale
    };
  },
  watch: {
    selectedLang(newVal) {
      this.setLanguage(newVal);
    }
  },
  beforeCreate() {
    this.$store.commit("DISPLAY_MENU", false);
  },
  components: { Icon },
  validations: {
    password: { required, minLen: minLength(6) },
    username: { required },
    email: { required, email }
  },
  methods: {
    onSubmit() {
      this.isLoading = true;
      this.$store.dispatch("login", {
        username: this.username,
        password: this.password,
        language: this.selectedLang
      });
      this.isLoading = false;

        this.$store.commit('SET_LOGIN_LANGUAGE', this.selectedLang);
    },
    switchForgotPassword() {
      this.showRemindPassword = !this.showRemindPassword;
    },
    switchPasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
      this.eyeType = this.eyeType === "eye" ? "eye-slash" : "eye";
    },
    onResetPassword() {
      this.$store.dispatch("sendEmailWithPass", this.email);
    },
    setLanguage(language) {
      this.$store.dispatch("setLanguage", language);
    }
  },
  computed: {
    ...mapGetters({
      loginError: "isLoginError",
      sendEmailSuccess: "isSendEmailSuccess",
      sendEmailError: "isSendEmailError",
      newPAssword: "password",
      languageList: "languageList"
    })
  },
  created() {
    this.$store.dispatch("tryAutoLogin");
  }
};
</script>

<style scoped>
</style>