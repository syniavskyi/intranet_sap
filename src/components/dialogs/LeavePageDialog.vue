<template>
    <div>
        <div class="modal-overlay"/>
        <div class="modal-new-s">
            <h1>{{ $t("message.confirmPageLeaving") }}</h1>
            <p>{{ $t("message.unsavedData") }}</p>
            <button @click="toProfile">{{ $t("button.yes") }}</button>
            <button @click="close">{{ $t("button.close") }}</button>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
    methods: {
        toProfile() {
            this.$store.dispatch('resolvePageLeave')
        },
        close() {
            this.$store.dispatch('rejectPageLeave')
        }
    }
}
</script>