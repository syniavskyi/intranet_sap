<template>
<div>
    <div class="modal-s">
        <div class="m-header">
            <h1 class="m-title">{{ $t("header.delegationConfirm") }}</h1>
            <button @click="hideDialog" class="m-close">&#10006;</button>
        </div>
        <div class="m-content">
            <div class="m-section">
                <h3 class="m-h3" v-if="!isSuccess">{{ $t("message.successfullySaved") }}</h3>
                <h2 class="m-h2">{{ $t("message.delegationConfirmQuestion") }}</h2>
                <p v-if="isSuccess">{{ $t("message.failureDuringDelegationSaving") }}</p>
                <div class="m-btns">
                    <button class="clear-btn" @click="saveDelegationNumber">{{ $t("button.yes") }}</button>
                    <button class="oclear-btn" @click="hideDialog">{{ $t("button.cancel") }}</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-overlay"></div>
</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    computed: {
        ...mapGetters({
            newDelegation: 'getNewDelegation',
            isSuccess: 'getCreateDelegSuccess'
        })
    },
    methods: {
        ...mapActions(['saveDelegationNumber']),
        hideDialog() {
            this.$store.commit('SET_SHOW_CONFIRM_DELEG', false)
        }
    }
}
</script>

