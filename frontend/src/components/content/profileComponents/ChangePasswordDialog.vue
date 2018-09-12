<template>
    <div>
        <div class="modal-overlay"></div>
        <div class="modal-new-s">
            <div class="modal-header-new">
                <h1 class="modal-title-new">Zmień hasło</h1>
                <div @click="close" class="modal-exit-new">&#10006;</div>
            </div>
            <div class="modal-content-new">
                <div class="cd-for-input">
                    <input required class="cd-input" id="oldPass">
                    <span class="cd-span"></span>
                    <label class="cd-label">Stare hasło</label>
                </div>
                <div class="cd-for-input">
                    <input required class="cd-input" id="newPass">
                    <span class="cd-span"></span>
                    <label class="cd-label">Nowe hasło</label>
                </div>
                <div class="cd-for-input">
                    <input required class="cd-input" id="newPassConfirm">
                    <span class="cd-span"></span>
                    <label class="cd-label">Potwierdź nowe hasło</label>
                </div>
                <button class="button login-button" @click="onSubmit">
                    <span class="loading-icon"></span>
                    <span class="span-arrow">Wyślij</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import i18n from "../../../lang/lang";
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
        
        }
    },
    computed: {
        ...mapGetters({
            userData: "getUserInfo",
        })
    },
    methods: {
        close() {
            this.$store.commit('SET_SHOW_CHANGE_PASSWORD_DIALOG', false)
        },

        onSubmit() {
        let userData = this.userData;
        userData.UserAlias = "SJI"
        userData.Password = document.getElementById("oldPass").value;
        userData.NewPassword = document.getElementById("newPass").value;
           this.$store.dispatch("submitPassword", userData)
        }

    }
}
</script>

