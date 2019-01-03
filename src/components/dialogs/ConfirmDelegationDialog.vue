<template>
<div>
    <div class="modal-new-s">
        <div class="modal-header-new">
            <h1 class="modal-title-new">{{ $t("header.delegationConfirm") }}</h1>
            <button @click="hideDialog" class="modal-close">&#10006;</button>
        </div>
        <div class="modal-content-new">
            <div class="del-modal-section">
                <h3 class="del-modal-h3" v-if="!isSuccess">{{ $t("message.successfullySaved") }}</h3>
                <h2 class="del-modal-h2">{{ $t("message.delegationConfirmQuestion") }}</h2>
                <p v-if="isSuccess">{{ $t("message.failureDuringDelegationSaving") }}</p>
                <div class="del-modal-btns">
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

