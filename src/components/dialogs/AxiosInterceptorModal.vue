<template>
    <div>
        <div class="m-overlay" v-if="showError"/>
        <div class="modal-xs" v-if="showError">
            <div class="m-header">
                <h1 class="m-title">{{ $t("header.error") }}</h1>
                <button @click="hideDialog" class="m-close">&#10006;</button>
            </div>
            <div class="m-content-hs">
                <div class="m-section">
                    <h3 class="m-hgrey"> {{ t("message.responseError") }} </h3>
                    <div class="m-btns">
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
