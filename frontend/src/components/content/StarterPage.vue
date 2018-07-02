<template>
  <div class="plane-starter-page">
    <div class="starter-page-nav-and-content">
      <app-menu></app-menu>
      <div class="starter-page-content">
        <div class="starter-header">
          <div class="starter-header-title-and-menu">
            <img src="../../assets/images/nav/if_menu-32.png" width="32px" class="starter-header-menu">
            <p class="starter-header-title">{{ $t("header.starterPage") }}</p>
          </div>
        </div>
        <h3 class="starter-page-user-header">{{ $t("header.welcome") }}</h3>
          <div class="starter-page-lists">
            <div class="starter-page-list">
              <div class="starter-page-list-header">
                <p class="starter-page-list-title">{{ $t("label.documentList") }}</p>
              </div>
              <div class="starter-page-list-content">
                <ul class="starter-page-ul">
                  <li class="starter-page-item" v-for="list in getFullListOfDoc" :key="list.title">
                    <div class="starter-page-list-item-btns">
                      <a class="starter-page-file-btn" :href="list.link">&#x21e3;</a>
                      <div v-if="list.format === 'pdf'" class="starter-page-pdf">.pdf</div>
                      <div v-else class="starter-page-docx">.docx</div>
                    </div>
                    <div class="starter-page-list-item-wrapper">
                      <div class="starter-page-item-text" :class="list.status ? 'line-through' : 'none'">
                        {{ list.title }}
                        <p class="starter-list-item-popover">{{ list.description }}</p>
                      </div>
                    </div>
                    <input class="starter-page-checkbox" :checked="list.status" @change="changeCheckbox(list)" type="checkbox">
                  </li>
                </ul>
                <div class="starter-page-list-bottom">
                  <button class="starter-page-docs-btn button" :disabled="setButton" @click="submitDocuments">{{ $t("button.documentComplete") }}</button>
                </div>
              </div>
            </div>
            <div class="starter-page-list">
              <div class="starter-page-list-header">
                <p class="starter-page-list-title">{{ $t("label.documentList") }}</p>
              </div>
              <div class="starter-page-list-content">
                <ul class="starter-page-ul">
                  <li class="starter-page-item" v-for="list in getFullListOfDoc" :key="list.title">
                    <div class="starter-page-list-item-btns">
                      <a class="starter-page-file-btn" :href="list.link">&#x21e3;</a>
                      <div v-if="list.format === 'pdf'" class="starter-page-pdf">.pdf</div>
                      <div v-else class="starter-page-docx">.docx</div>
                    </div>
                    <div class="starter-page-list-item-wrapper">
                      <div class="starter-page-item-text" :class="list.status ? 'line-through' : 'none'">
                        {{ list.title }}
                        <p class="starter-list-item-popover">{{ list.description }}</p>
                      </div>
                    </div>
                    <input class="starter-page-checkbox" :checked="list.status" @change="changeCheckbox(list)" type="checkbox">
                  </li>
                </ul>
                <div class="starter-page-list-bottom">
                  <button class="starter-page-docs-btn button" :disabled="setButton" @click="submitDocuments">{{ $t("button.documentComplete") }}</button>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '../Menu.vue'
import axios from 'axios'
import i18n from '../../lang/lang'

export default {
  data() {
    return {
      listOfDoc: []
    }
  },
  components: {
    'app-menu': Menu
  },
  beforeCreate() {
    this.$store.commit('DISPLAY_MENU', false);
    if (this.$store.getters.idDataLoaded === false) {
      this.$store.dispatch('loadData', localStorage.getItem('token'))
    }
  },
  created() {
    this.getId();
    this.getDocList();
    this.getDocStatus();
    this.setStatusToDoc();
  },
  methods: {
    changeCheckbox(data) {
      if(data.status === undefined) {
        data["status"] = true;
      } else {
        data.status = !data.status;
      }
      this.checkList(this.listOfDoc);
      this.$store.dispatch("saveDocs", {
        data
      });
    },
    checkList(data) {
      this.$store.dispatch("checkList", {
        listOfDoc: data
      })
    },
    getId() {
      this.$store.dispatch("getUserId");
    },
    getDocList(){
      this.$store.dispatch("getDocs");
    },
    getDocStatus(){
      this.$store.dispatch("getDocsStatus");
    },
    setStatusToDoc() {
      var docs = this.getDocs;
      const status = this.getDocsListStatus;

        for(let i = 0; i < docs.length; i++){
          for(let j = 0; j < status.length; j++) {
            if(docs[i].id == status[j].docId) {
              docs[i]["status"] = status[j].status;
            }
          }
        }
        this.checkList(docs);
        return this.listOfDoc = docs;
    },
    submitDocuments() {
      this.$store.dispatch("sentDocuments");
    }
  },
  computed: {
    setButton() {
      return this.$store.getters.returnCheckList;
    },
    getDocs(){
      return this.$store.getters.docLists;
    },
    getDocsListStatus() {
      return this.$store.getters.docStatusList;
    },
    getFullListOfDoc() {
      return this.setStatusToDoc();
    }
  }
}
</script>

<style scoped>
  .line-through {
    text-decoration: line-through;
    color: grey;
  }
  .none {
    text-decoration: none;
  }
</style>