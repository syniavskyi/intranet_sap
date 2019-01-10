<template>
    <div>
        <div class="modal-overlay"/>
        <div class="modal-new-s">
            <h1>{{ $t("message.confirmPageLeaving") }}</h1>
            <p>{{ $t("message.unsavedData") }}</p>
            <button @click="resolvePageLeave">{{ $t("button.yes") }}</button>
            <button @click="rejectPageLeave">{{ $t("button.close") }}</button>
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