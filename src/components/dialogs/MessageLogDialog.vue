<template>
  <div>
    <div class="modal-overlay"></div>
    <transition name="modal-fade">
        <div class="modal-new-stretch" role="dialog">
          <header class="modal-header-err" :class="headerClass">
            <h1 v-if="messageLog.length > 1" class="modal-title">{{ formatHeader(message.severity) }}</h1>
            <h1 v-if="messageLog[0]" class="modal-title">{{ formatHeader(messageLog[0].severity) }}</h1>
            <button @click="closeModal" class="modal-close">&#10006;</button>
          </header>
          <div class="modal-content-list">
            <div v-if="messageLog.length > 1">
               <section :class="message.severity" class="modal-item" v-for="(message, index) in messageLog" :key="index">
                   {{index+1}}. {{message.message}}
               </section>
            </div>
            <section v-if="messageLog[0]" :class="messageLog[0].severity" class="modal-item">
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
        showModal: "getShowModal",
        headerClass: "getHeaderModalClass"}),
    },
    methods:  {
      ...mapActions(["closeModal"]),
      formatHeader(header) {
        return i18n.t("header.info");
      }
    }
}
</script>
