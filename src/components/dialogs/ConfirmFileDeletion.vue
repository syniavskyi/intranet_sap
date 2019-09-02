<template>
    <div @click="closeConfirmDialog">
        <div class="modal-xs" style="box-shadow: 0px 0px 50px 1px #e6e6e6;" @click.stop>
            <header class="m-header">
                <h1 class="m-title"> {{ $tc("title.deleteConfirm", 1, { docName: doc.Filename} ) }} </h1>
            </header>
            <div class="m-content">
                <div class="m-section" style="flex-direction: row; margin-top: 2.5rem;">
                    <button @click="deleteDoc" class="m-close">{{ $t("button.yes") }}</button>
                    <button @click="closeConfirmDialog" class="m-close">{{ $t("button.no") }}</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
    name: "ConfirmFileDeletion",
    computed: {
    ...mapGetters({
      doc: "getDocToDelete",
    })
  },
    methods: {
        ...mapActions(["deleteFile"]),
        closeConfirmDialog() {
            this.$store.commit("SET_SHOW_FILE_CONF_DIALOG", false);
        },
        deleteDoc() {
             this.$store.commit("SET_SHOW_FILE_CONF_DIALOG", false);
             this.deleteFile();
        }
    }
}
</script>
