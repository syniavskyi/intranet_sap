<template>
    <div>
        <div class="m-overlay"/>
        <div class="modal-xs">
            <div class="m-header">
                <h1 class="m-title">{{ $t("header.photoErr") }}</h1>
                <button @click="close" class="m-close">&#10006;</button>
            </div>
            <div class="m-content">
                <div class="modal-h">{{ $t("message.photoToLarge") }}</div>
            </div>
            <div class="modal-fbtns">
                <button class="func-btnm" @click="close">OK</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SubmitPhotoErrDialog',
    methods: {
        close() {
            this.$store.commit('SET_SUBMIT_PHOTO_ERR_DIALOG', false)
        }
    }
}
</script>
