<template>
    <div>
        <div class="modal-new-xs">
            <div class="m-header">
                <h1 class="m-title">{{ $t("header.delegationConfirm") }}</h1>
                <button @click="hideDialog" class="m-close">&#10006;</button>
            </div>
            <div class="m-content-hs">
                <div class="m-section">
                    <i18n class="m-hgrey" path="message.savedDelegationBackend" tag="h3">
                        <span class="m-h3" place="delegNo" style="color: orange">{{ savedDelegationNumber }}</span>
                    </i18n>
                    <div class="m-btns">
                        <button class="oclear-btn" @click="hideDialog">OK</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-overlay"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'SuccessDelegationDialog',
    computed: {
        ...mapGetters({
            showSuccessDialog: 'getSuccessDelegationDialog',
            savedDelegationNumber: 'getSavedDelegationFromBackend'
        })
    }, 
    methods: {
        hideDialog() {
            this.$store.commit('SET_SAVED_DELEGATION_FROM_BACKEND', null)
            this.$store.commit('SET_SHOW_SUCCESS_DELEGATION', false)
            this.$store.commit('SET_MEAN_OF_TRANSPORT', null)
        }
    }
}
</script>
