<template>
    <div>
        <div class="modal-overlay"></div>
        <div class="modal-new-s">
            <div class="m-header">
                <h1 class="m-title">{{ $t("header.forgotPass") }}</h1>
                <button class="modal-close" @click="switchForgotPassword">&#10006;</button>
            </div>
            <div class="modal-email">
                <!-- <div class="cd-for-input-xxl">
                    <input required class="cd-input" v-model="email">
                    <span class="cd-span"></span>
                    <label class="cd-label">{{ $t("label.enterEmail") }}</label>
                </div> -->
                <div class="cd-for-input-xxl">
                    <input required class="cd-input" v-model="username">
                    <span class="cd-span"></span>
                    <label class="cd-label">Podaj nazwę użytkownika</label>
                </div>
            </div>
            <!-- :disabled="$v.email.$invalid" -->
            <button class="button" type="button" @click="onResetPassword"><span class="span-arrow">{{ $t("button.resetPass") }}</span></button>
        </div>
    </div>
</template>

<script>
import { required, minLength, email } from "vuelidate/lib/validators";
import { mapGetters } from 'vuex'
export default {
    name: 'LoginForgotPassModal',
    data() {
        return {
            email: "",
            username: null
        }
    },
    props: [
        'language'
    ],
    validations: {
        email: { required, email }
    },
    methods: {
        onResetPassword() {
            const oUserData = {
                UserAlias: this.username.toUpperCase(),
                Language:  this.language === undefined ? "PL" : this.language,
                Action: 'R'
            }
            this.$store.dispatch("sendEmailWithPass", oUserData);

        },
        switchForgotPassword() {
            this.$store.commit("SET_LOG_FORGOT_PASS_MODAL", false)
        }
    }
}
</script>