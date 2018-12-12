<template>
  <div>
    <div class="modal-overlay"></div>
    <transition name="modal-fade">
        <div class="modal-new-stretch" role="dialog">
          <header class="modal-header-err">
            <h1 class="modal-title">{{ $t("header.error") }}</h1>
            <button @click="closeModal" class="modal-close">&#10006;</button>
          </header>
          <div class="modal-content-list">
            <section v-if="messageLog.length > 1" class="modal-item-err" v-for="(message, index) in messageLog" :key="index">
              {{index+1}}. {{message.message}}
            </section>
            <section v-if="messageLog[0]" class="modal-item-err">
                {{messageLog[0].message}}
            </section>
          </div>
        </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import i18n from "../../lang/lang";
export default {
    name: 'modal',
    computed: {
      ...mapGetters({
        messageLog: "getMessageLog",
        showModal: "getShowModal"})
    },
    methods:  { 
      ...mapActions(["closeModal"])
    }
}
</script>
