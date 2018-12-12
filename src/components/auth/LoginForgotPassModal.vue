<template>
    <div>
        <div class="modal-overlay"></div>
        <div class="modal-new-s">
            <div class="modal-header">
                <h1 class="modal-title">{{ $t("header.forgotPass") }}</h1>
                <button class="modal-close" @click="switchForgotPassword">&#10006;</button>
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
            <button class="button" :disabled="$v.email.$invalid" type="button" @click="onResetPassword"><span class="span-arrow">{{ $t("button.resetPass") }}</span></button>
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
            email: ""
        }
    },
    validations: {
        email: { required, email }
    },
    computed: Object.assign(
        mapGetters({
            sendEmailSuccess: "isSendEmailSuccess",
            sendEmailError: "isSendEmailError"
        })
    ),
    methods: {
        onResetPassword() {
            this.$store.dispatch("sendEmailWithPass", this.email);
        },
        switchForgotPassword() {
            this.$store.commit("SET_LOG_FORGOT_PASS_MODAL", false)
        }
    }
}
</script>