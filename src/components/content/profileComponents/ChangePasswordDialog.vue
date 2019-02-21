<template>
    <div>
        <div class="modal-overlay"></div>
        <div class="modal-new-s">
            <div class="m-header">
                <h1 class="m-title">{{ $t("header.changePassword") }}</h1>
                <button @click="close" class="m-close">&#10006;</button>
            </div>
            <div class="m-content">
                <div class="cd-for-input">
                    <input :type="oldPasswordType" required class="cd-input" id="oldPass">
                    <span class="cd-span"></span>
                    <label class="cd-label">{{ $t("label.oldPassword") }}</label>
                    <button class="show-pass-eyef"  @click="switchPasswordVisibility('old')"><icon :name="oldEyeType"></icon></button>
                </div>
                <div class="cd-for-input">
                    <input :type="newPasswordType" required class="cd-input" id="newPass" v-model="newPassword" @input="checkChars(newPassword)">
                    <span class="cd-span"></span>
                    <label class="cd-label">{{ $t("label.newPassword") }}</label>
                    <button class="show-pass-eyef"  @click="switchPasswordVisibility('new')"><icon :name="newEyeType"></icon></button>
                </div>
                <div class="cd-for-input">
                    <input :type="confirmPasswordType" required class="cd-input" id="newPassConfirm" v-model="newPasswordRepeat">
                    <span class="cd-span"></span>
                    <label class="cd-label">{{ $t("label.confirmPassword") }}</label>
                    <button class="show-pass-eyef"  @click="switchPasswordVisibility('confirm')"><icon :name="confirmEyeType"></icon></button>
                </div>
                <div>
                    <p class="password-error" v-if="bDisabled.bln">{{bDisabled.msg}}</p>
                    <button class="button" @click="onSubmit" :disabled="bDisabled.bln || newPassword === '' || newPasswordRepeat === ''">
                        <span class="loading-icon"></span>
                        <span class="span-arrow">{{ $t("button.send") }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Icon from "vue-awesome/components/Icon";
import i18n from "../../../lang/lang";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      oldPasswordType: "password",
      oldEyeType: "eye",
      newPasswordType: "password",
      newEyeType: "eye",
      confirmPasswordType: "password",
      confirmEyeType: "eye",
      newPassword: "",
      newPasswordRepeat: "",
      bDisabled: {
          bln: true,
          msg: ''
      }
    };
  },
  components: {
    Icon
  },
  computed: {
    ...mapGetters({
      userData: "getUserInfo"
    })
  },
  methods: {
    close(evt) {
        let el = evt.target.parentElement.parentElement;
            el.classList.add("animate-modal-close")


        setTimeout(() => {this.$store.commit("SET_SHOW_CHANGE_PASSWORD_DIALOG", false)
                          el.classList.remove("animate-modal-close")  }, 550);
    },
    switchPasswordVisibility(type){
        switch(type) {
            case "old":
                this.oldPasswordType = this.oldPasswordType === "password" ? "text" : "password";
                this.oldEyeType = this.oldEyeType === "eye" ? "eye-slash" : "eye";
                break;
            case "new":
                this.newPasswordType = this.newPasswordType === "password" ? "text" : "password";
                this.newEyeType = this.newEyeType === "eye" ? "eye-slash" : "eye";
                break;
            case "confirm":
                this.confirmPasswordType = this.confirmPasswordType === "password" ? "text" : "password";
                this.confirmEyeType = this.confirmEyeType === "eye" ? "eye-slash" : "eye";
                break;
        }
    },
    onSubmit() {
      if(this.newPassword !== this.newPasswordRepeat){
        this.bDisabled = {bln: true, msg: i18n.t("message.notEqualPasswords")}
      } else {
        this.bDisabled = {bln: false, msg: ''};
        let userData = this.userData;
        userData.Password = document.getElementById("oldPass").value;
        userData.NewPassword = document.getElementById("newPass").value;
        this.$store.dispatch("submitPassword", userData);
      }
    },
    checkChars(string){
        string.includes('&') || string.includes('%') || string.includes('#')? this.bDisabled = {bln: true, msg: i18n.t("message.unacceptableChar")} : this.bDisabled = {bln: false, msg: ''};
    }
  }
};
</script>

