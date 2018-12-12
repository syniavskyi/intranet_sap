<template>
    <div>
        <div class="modal-overlay"></div>
        <div class="modal-new-s">
            <div class="modal-header-new">
                <h1 class="modal-title-new">{{ $t("header.changePassword") }}</h1>
                <button @click="close" class="modal-close">&#10006;</button>
            </div>
            <div class="modal-content-new">
                <div class="cd-for-input">
                    <input required class="cd-input" id="oldPass">
                    <span class="cd-span"></span>
                    <label class="cd-label">{{ $t("label.oldPassword") }}</label>
                </div>
                <div class="cd-for-input">
                    <input required class="cd-input" id="newPass">
                    <span class="cd-span"></span>
                    <label class="cd-label">{{ $t("label.newPassword") }}</label>
                </div>
                <div class="cd-for-input">
                    <input required class="cd-input" id="newPassConfirm">
                    <span class="cd-span"></span>
                    <label class="cd-label">{{ $t("label.confirmPassword") }}</label>
                </div>
                <button class="button" @click="onSubmit">
                    <span class="loading-icon"></span>
                    <span class="span-arrow">{{ $t("button.send") }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import i18n from "../../../lang/lang";
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
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
    onSubmit() {
      let userData = this.userData;
    //   userData.UserAlias = "SJI";
      userData.Password = document.getElementById("oldPass").value;
      userData.NewPassword = document.getElementById("newPass").value;
      this.$store.dispatch("submitPassword", userData);
    }
  }
};
</script>

