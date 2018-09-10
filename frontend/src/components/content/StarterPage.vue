<template>
  <div class="plane-component">
    <div class="component-nav-and-content">
      <app-menu></app-menu>
      <div class="component-content">
        <div class="content-header">
          <div class="content-header-title-and-menu">
            <img src="../../assets/images/nav/if_menu-32.png" width="32px" class="content-header-menu">
            <p class="content-header-title">{{ $t("header.starterPage") }}</p>
          </div>
        </div>
        <h3 class="starter-page-user-header">{{ $t("header.welcome") }}</h3>
          <div class="starter-page-lists">
            <div class="starter-page-list">
              <div class="starter-page-list-header">
                <p class="starter-page-list-title">{{ $t("label.documentListNew") }}</p>
              </div>
              <div class="starter-page-list-content">
                <ul class="starter-page-ul">
                  <li class="starter-page-item" v-for="list in docListNew" :key="list.FileId">
                    <div class="starter-page-list-item-btns">
                      <a class="starter-page-file-btn" :href="list.link">&#x21e3;</a>
                      <div v-if="checkFileFormat(list.Filename) == '.pdf'">
                         <p class="starter-page-pdf"> {{  checkFileFormat(list.Filename)}}</p>
                      </div>
                      <div v-if="checkFileFormat(list.Filename) == '.doc'"> 
                          <p class="starter-page-docx">{{checkFileFormat(list.Filename)}} </p> 
                      </div>
                    </div>
                    <div class="starter-page-list-item-wrapper">
                      <div class="starter-page-item-text" :class="list.Status ? 'line-through' : 'none'">
                        {{ list.Filename }}
                        <p class="starter-list-item-popover">{{ list.FileId }}</p>
                      </div>
                    </div>
                    <input class="starter-page-checkbox" :checked="list.Status" @change="changeCheckbox(list)" type="checkbox">
                  </li>
                </ul>
                <div class="starter-page-list-bottom">
                  <button class="starter-page-docs-btn button" disabled="this.setButton">{{ $t("button.documentComplete") }}</button>
                  <!-- <button class="starter-page-docs-btn button" :disabled="setButton" @click="submitDocuments">{{ $t("button.documentComplete") }}</button> -->
                </div>
              </div>
            </div>
            <div class="starter-page-list">
              <div class="starter-page-list-header">
                <p class="starter-page-list-title">{{ $t("label.documentListInfo") }}</p>
              </div>
              <div class="starter-page-list-content">
                <ul class="starter-page-ul">
                  <li class="starter-page-item" v-for="list in docListInfo" :key="list.FileId">
                    <div class="starter-page-list-item-btns">
                      <a class="starter-page-file-btn" :href="list.link">&#x21e3;</a>
                     <div v-if="checkFileFormat(list.Filename) == '.pdf'">
                         <p class="starter-page-pdf"> {{  checkFileFormat(list.Filename)}}</p>
                      </div>
                      <div v-if="checkFileFormat(list.Filename) == '.doc'"> 
                          <p class="starter-page-docx">{{checkFileFormat(list.Filename)}} </p> 
                      </div>
                    </div>
                    <div class="starter-page-list-item-wrapper">
                      <div class="starter-page-item-text" :class="list.Status ? 'line-through' : 'none'">
                        {{ list.FileId }}
                        <p class="starter-list-item-popover">{{ list.FileName }}</p>
                      </div>
                    </div>
                    <input class="starter-page-checkbox" :checked="list.Status" @change="changeCheckbox(list)" type="checkbox">
                  </li>
                </ul>
                <div class="starter-page-list-bottom">
                  <!-- <button class="starter-page-docs-btn button" :disabled="setButton" @click="submitDocuments">{{ $t("button.documentComplete") }}</button> -->
                     <button class="starter-page-docs-btn button">{{ $t("button.documentComplete") }}</button>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '../Menu.vue';
import axios from 'axios';
import i18n from '../../lang/lang';
import { mapGetters, mapActions } from "vuex";

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
    // this.getId();
    this.getNewDocs();
    this.getInfoDocs();
    // this.getDocStatus();
    // this.setStatusToDoc();
  },
    computed: {
      ...mapGetters({
      setBuTton: 'returnCheckList',
      docListNew: 'docListNew',
      listForStatus: 'getListForStatus',
      docListInfo: 'docListInfo'
      // docStatusList: 'docStatusList',
      //  statusToDoc: 'getFullListOfDoc'
      }),
    //   getFullListOfDoc() {
    //     return this.setStatusToDoc();
    // }
  },
  methods: {
     ...mapActions([
       'getUserId',
       'getNewDocs', // używam
       'getInfoDocs',
       'getDocsStatus',
       'checkList', // używam
       'saveDocs',
       'checkFileFormat'
    ]),
    changeCheckbox(data) {
      if(data.Status === undefined) {
        data["status"] = true;
      } else {
        data.Status = !data.Status;
      }
      this.checkList(this.listForStatus);
      this.saveDocs(data)
      // this.$store.dispatch("saveDocs", {
      //   data
      // });
    },
      checkFileFormat(name) {
         return name.slice(name.lastIndexOf('.'));
    // let docs = this.docList;
    // for(let i = 0; i < docs.length; i++) {
      //  return docs[i].Filename.slice(docs[i].Filename.lastIndexOf('.'));
      //  docs[i].Filename = docs[i].Filename.slice(docs[i].Filename.lastIndexOf('.'));
    // }
  }

    // checkList(data) {
    //   this.$store.dispatch("checkList", {
    //     listOfDoc: data
    //   })
    // },

    // getId() {
    //   this.$store.dispatch("getUserId");
    // },

    // getDocList(){
    //   this.$store.dispatch("getDocs");
    // },

    // getDocStatus(){
    //   this.$store.dispatch("getDocsStatus");
    // },

    // setStatusToDoc() {
    //   var docs = this.getDocs;
    //   const status = this.getDocsListStatus;

    //     for(let i = 0; i < docs.length; i++){
    //       for(let j = 0; j < status.length; j++) {
    //         if(docs[i].id == status[j].docId) {
    //           docs[i]["status"] = status[j].status;
    //         }
    //       }
    //     }
    //     this.checkList(docs);
    //     return this.listOfDoc = docs;
    // },

    // submitDocuments() {
    //   this.$store.dispatch("sentDocuments");
    // }
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