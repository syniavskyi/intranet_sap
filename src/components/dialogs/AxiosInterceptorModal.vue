<template>
    <div>
        <div class="modal-overlay" v-if="showError"/>
        <div class="modal-new-xs" v-if="showError">
            <div class="m-header">
                <h1 class="m-title">{{ $t("header.error") }}</h1>
                <button @click="hideDialog" class="modal-close">&#10006;</button>
            </div>
            <div class="m-content-hs">
                <div class="del-modal-section">
                    <h3 class="del-modal-hgrey"> {{ t("message.responseError") }} </h3>
                    <div class="del-modal-btns">
                        <button class="oclear-btn" @click="hideDialog">OK</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    name: 'AxiosInterceptorModal',
    computed: {
        ...mapGetters({
            showError: 'getAxiosInterceptorModal'
        })
    },
    methods: {
        hideDialog() {
            this.$store.commit('SET_INTERCEPTOR_ERROR_MODAL', false)
        }
    }
}
</script>

<style>

</style>
