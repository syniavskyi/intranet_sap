<template>
    <div>
        <div class="modal-overlay"/>
        <div class="modal-s modal-leave-page">
            <h1 class="leave-page-header">{{ $t("message.confirmPageLeaving") }}</h1>
            <p class="leave-page-info">{{ $t("message.unsavedData") }}</p>
            <div class="leave-buttons">
                <button class="leave-page-btn func-btn" @click="resolvePageLeave">{{ $t("button.yes") }}</button>
                <button class="leave-page-btn func-btn" @click="rejectPageLeave">{{ $t("button.close") }}</button>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex'
export default {
    methods: Object.assign(
    mapActions([
      "resolvePageLeave",
      "rejectPageLeave",
    ]), {}
  )
}
</script>