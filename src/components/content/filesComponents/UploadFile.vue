<template>
    <div class="file-upload" >

            <!-- BEGIN OF MESSAGEBOX   v-if="this.authType !== 'OWN'" -->
            <MessageBox v-if="showMessageBox">
            <template slot="modal-title">
            {{ $t("header.warning") }}
            </template>
            <template slot="modal-text">
            {{ $t("message.listWillRefresh") }}
            </template>
            <slot name="myConfirm" :confirmMethod="confirmMethod"></slot>
            </MessageBox>
            <!-- END OF MESSAGEBOX -->

        <h3 class="content-header-title content-header-title-h3">{{ $t("header.addNewFile") }}</h3>
        <div class="drag-drop">
            <div id="drop" class="drag-drop__container" draggable="true" @dragover.prevent="handleDragOver" @dragleave="handleLeave"
             @dragenter="handleDragEnter" @drop.prevent="handleDrop">
                <div class="drag-drop__container--border">
                    <img src="../../../assets/images/icons/upload-icon-grey.svg" class="drag-drop__container--image">
                    <p class="p-empty" style="padding: 0; margin: 0;">
                        {{ $t("message.dragToUpade") }}
                    </p> 
                </div>
            </div>       
        </div>
        <!-- FILES TABLE -->
        <h4 class="content-header-title content-header-title-h4">{{ $tc("label.filesToUpload", 1, { amount: files.length } )}} </h4>
        <div class="drag-drop__list">     
            <div class="dd-table">
                <header class="dd-table__header">
                    <label class="dd-table__cell dd-table__c-files dd-table__label">{{ $t("label.fileFormatUpl") }}</label>
                    <label class="dd-table__cell dd-table__c-files dd-table__label">{{ $t("label.fileNameUpl") }}</label>
                    <label class="dd-table__cell dd-table__c-files dd-table__label">{{ $t("label.fileTypeUpl") }}</label>
                    <label class="dd-table__cell dd-table__c-files dd-table__label">{{ $t("label.addToSPUpl") }}</label>
                    <label class="dd-table__cell dd-table__c-files dd-table__label">{{ $t("label.sendEmailUpl") }}</label>
                    <label for="" class="dd-table__cell dd-table__c-files dd-table__label">&nbsp;</label>
                    <label class="dd-table__cell dd-table__c-files dd-table__label dd-table__label--refresh">&nbsp;
                        <!-- <button @click="refreshFileList" :disabled="files.length === 0"
                        :title="$t('message.refreshFileList')" class="dd-table__refresh-btn">
                            &#x21bb;
                        </button> -->
                    </label>
                </header>
                <section>
                        <div class="dd-table__body" v-if="files.length > 0">
                            <div class="dd-table__row" v-for="(file, index) in files" :key="file.fileId">
                                <div class="dd-table__cell dd-table__c-files" :class="file.typeClass">
                                    &nbsp;
                                </div>
                                <div class="dd-table__cell dd-table__c-files cd-for-input">
                                    <input type="text" class="cd-input" v-model="file.fileName">
                                    <span class="cd-span"></span>
                                </div>
                                <div class="dd-table__cell dd-table__c-files cd-for-select">
                                    <select class="cd-select" name="" v-model="file.fileType">
                                        <option v-for="fileType in fileTypes" :key="fileType.Key" :value="fileType.Key">
                                            {{ fileType.Value }}
                                        </option>
                                    </select>
                                </div>
                                <div class="dd-table__cell dd-table__c-files">
                                    <label class="checkbox-wrap">
                                        <input type="checkbox" class="checkbox-new" v-model="file.addToStarter" />
                                        <div class="checkbox-in"></div>
                                    </label>
                                </div>
                                <div class="dd-table__cell dd-table__c-files">
                                    <label class="checkbox-wrap">
                                        <input type="checkbox" class="checkbox-new" v-model="file.sendEmail" />
                                        <div class="checkbox-in"></div>
                                    </label>
                                </div>
                                <div class="dd-table__cell dd-table__c-files">
                                    <label class="sk-folding-label">
                                        <!-- Loading -->
                                        <div class="sk-folding-cube" v-if="file.status === 'P'">
                                            <div class="sk-cube1 sk-cube"></div>
                                            <div class="sk-cube2 sk-cube"></div>
                                            <div class="sk-cube4 sk-cube"></div>
                                            <div class="sk-cube3 sk-cube"></div>
                                        </div>
                                        <!-- Completed -->
                                        <div class="sk-container-compl" v-if="file.status === 'C'">
                                            <button :disabled="true" class="upload-compl-btn">&#x2714;</button>
                                        </div>
                                    </label>
                                </div>
                                <div class="dd-table__cell dd-table__c-files">
                                    <button @click="removeFile(index)" class="dd-table__remove-btn">X</button>
                                </div>
                            </div>
                        </div>
                        <div class="dd-table__no-files-choosen" v-else>
                            {{ $t("message.noFilesChosen") }}
                        </div>
                </section>
            </div>
        </div>
        <div class="drag-drop__btn">
            <button :disabled="$v.files.$invalid" @click="sendFiles" class="func-btn cd-b">{{ $t("button.sendFiles")}}</button>
        </div>
        <!-- LINK TABLE -->
        <h3 class="content-header-title content-header-title-h3">{{ $t("header.addNewLink") }}</h3>
        <div class="drag-drop__list">     
            <div class="dd-table">
                <header class="dd-table__header">
                    <label class="dd-table__cell dd-table__c-link dd-table__label">{{ $t("label.fileFormatUpl") }}</label>
                    <label class="dd-table__cell dd-table__c-link dd-table__label">{{ $t("label.fileNameUpl") }}</label>
                    <label class="dd-table__cell dd-table__c-link dd-table__label">{{ $t("label.fileUrlUpl") }}</label>
                    <label class="dd-table__cell dd-table__c-link dd-table__label">{{ $t("label.fileTypeUpl") }}</label>
                    <label class="dd-table__cell dd-table__c-link dd-table__label">{{ $t("label.addToSPUpl") }}</label>
                    <label class="dd-table__cell dd-table__c-link dd-table__label">{{ $t("label.sendEmailUpl") }}</label>
                    <label class="dd-table__cell dd-table__c-link dd-table__label">&nbsp;</label>
                </header>
                <section>
                        <div class="dd-table__body">
                            <div class="dd-table__row">
                                <div class="dd-table__cell dd-table__c-link new-doc-file-img doc-file-link">
                                    &nbsp;
                                </div>
                                <div class="dd-table__cell dd-table__c-link cd-for-input">
                                    <input type="text" class="cd-input" v-model="link.fileName">
                                    <span class="cd-span"></span>
                                </div>
                                 <div class="dd-table__cell dd-table__c-link cd-for-input">
                                    <input type="text" class="cd-input" v-model="link.url">
                                    <span class="cd-span"></span>
                                </div>
                                <div class="dd-table__cell dd-table__c-link cd-for-select">
                                    <select class="cd-select" name="" v-model="link.type">
                                        <option v-for="fileType in fileTypes" :key="fileType.Key" :value="fileType.Key">
                                            {{ fileType.Value }}
                                        </option>
                                    </select>
                                </div>
                                <div class="dd-table__cell dd-table__c-link">
                                    <label class="checkbox-wrap">
                                        <input type="checkbox" class="checkbox-new" v-model="link.addToStarter" />
                                        <div class="checkbox-in"></div>
                                    </label>
                                </div>
                                <div class="dd-table__cell dd-table__c-link">
                                    <label class="checkbox-wrap">
                                        <input type="checkbox" class="checkbox-new" v-model="link.sendEmail" />
                                        <div class="checkbox-in"></div>
                                    </label>
                                </div>
                                <div class="dd-table__cell dd-table__c-link dd-table__links-btn">
                                    <button :disabled="$v.link.$invalid" @click="sendLink" class="func-btn cd-b">{{ $t("button.send")}}</button>
                                </div>
                            </div>
                        </div>
                </section>
            </div>
        </div>
        <Toast v-if="showToast">{{ $t('message.mailWillBeSend')}}</Toast>
        <h3 class="content-header-title content-header-title-h3">{{ $t("header.prevDocuments") }}</h3>
    </div>
</template>

<script>


import i18n from "../../../lang/lang";
import { mapGetters } from 'vuex';
import { required, minLength, url } from "vuelidate/lib/validators";
import Toast from "../../dialogs/Toast";
import axios from "axios";
import MessageBox from '../../dialogs/MessageBox';

const insideElements = new Set();

export default {
    name: 'upload-file',
    data() {
      return {
      files: [],
    //   authType: this.$store.getters.getUserAuth.ZPROF_ATCV
      }
    },
    computed: {
        ...mapGetters({
            fileTypes: "getUploadFileTypes",
            showToast: "getDisplayToast",
            link: "getLinkStructure",
            showMessageBox: "getDisplayMessageBox"
        }),
        showEmailToast() {
            return this.link.sendEmail
        }
    },
    watch: {
        showEmailToast(val){
            if(val){
                this.$store.dispatch("displayToast")
            } else {
                this.$store.commit("SET_SHOW_TOAST", false)
            }
        }
    },
    validations: {
        files: {
            required,
            $each: {
                fileName: { required, minLength: minLength(3) },
                fileType: { required }
            }
        },
        link: {
            fileName: { required, minLength: minLength(3) },
            type: { required },
            url: { required, url}
        }
    },
    components: {
        Toast,
        MessageBox
    },
    methods: {
        handleDragEnter(e) {
            this.$emit("drag-enter", e);
            // alert("Entered!")
        },
        handleDragOver(e) {
            this.$emit("drag-over", e);
        },
        handleDrop(e) {
            if(!e.dataTransfer){
                return;
            }

            let files = [],
                items = [];

            this.$emit("drop")
            files = e.dataTransfer.files
            this.$emit("added-files", files)

            if(!e.dataTransfer.items){
                //handle files
                return;
            }

            items = Array.from(e.dataTransfer.items);

            if( !items || !items.length || !(items[0].getAsFile || items[0].webkitGetAsEntry)){
                // handle files
                return;
            }

            this.addFilesFromItems(items)
        },

        addFilesFromItems(items){
            let entry;
            for(const item of items){
                if(item.getAsFile && item.kind == "file"){
                    let file = item.getAsFile(),
                        fileDefined = this.defineFile(file);
                    if(file){
                        this.files.push(fileDefined)
                    }
                    continue;
                }
            }
        },

        defineFile(file){
            let fName = file.name,
                oFile = {
                        nativeFile: file,
                        fileId: fName,
                        fileName: fName.split(".").slice(0, -1).join("."),
                        format: fName.substr(fName.lastIndexOf('.') + 1),
                        name: undefined,
                        size: file.size,
                        type: file.type,
                        typeClass: "",
                        fileType: "",
                        addToStarter: false,
                        sendEmail: false,
                        status: "",
                        upload: {
                            total: file.size
                        }
            }
            oFile.typeClass = this._determineFileClass(oFile.format);
            oFile.name = `${oFile.fileName}.${oFile.format}`
            return oFile;
        },

        refreshFileList({}) {
            this.$store.commit('SET_MESSAGE_BOX', true);
            // this.files = []
        },

        confirmMethod(){
            this.files = []
        },

        _determineFileClass(fileType){
            let className;
            switch(fileType.toLowerCase()){
                case 'doc':
                className = 'doc-file-doc'
                break;
                case 'gif':
                className = 'doc-file-gif'
                break;
                case 'jpg':
                case 'jpeg':
                className = 'doc-file-jpg'
                break;
                case 'mp3':
                className = "doc-file-mp3"
                break;                
                case 'mp4':
                className = "doc-file-mp4"
                break;
                case 'pdf':
                className = "doc-file-pdf"
                break;                
                case 'png':
                className = 'doc-file-png'
                break;
                case 'ppt':
                className = 'doc-file-ppt'
                break;
                case 'xls':
                className = "doc-file-xls"
                break;
                case 'zip':
                className = 'doc-file-zip'
                break;
                default:
                className = ""
                break;
            }
            className = `${className} new-doc-file-img`;
            return className;
        },

        handleLeave(e){
            this.$emit("drag-leave", e);
            // alert("Left!")
        },
        sendFiles({getters, commit, dispatch}){
            let files = this.files,
                oStore = this.$store,
                currIndex;

            for(let i = 0; i < files.length; i++){
                let file = files[i],
                    newFileName = `${file.fileName}.${file.fileId.substr(file.fileId.lastIndexOf('.') + 1)}`,
                    addToStarter = file.addToStarter ? "X" : "",
                    sendEmail = file.sendEmail ? "X" : "",
                    slugHeader = `${newFileName};${file.fileType};PL;;${file.type};${addToStarter};${sendEmail};UPL`; 
                    file = file.nativeFile;
                    oStore.commit('SET_DISPLAY_LOADER', true)
                    this.files[i].status = "P"
                    axios({
                    method: 'POST',
                    url: 'AttachmentMedias',
                    data: file,
                    headers: {
                        "Content-type": file.type,
                        "X-Requesteg-With": "XMLHttpRequest",
                        "Slug": slugHeader,
                        "x-csrf-token": oStore.getters.getToken
                    }
                    }).then(res=>{
                        if(currIndex || currIndex === 0){
                            currIndex += 1;
                        } else {
                            currIndex = 0;
                        }
                        this.files[currIndex].status = "C"
                        oStore.dispatch('proceedFile', {res: res, index: currIndex, totalAmount: files.length})
                    }).catch(error=>{
                        oStore.commit('SET_DISPLAY_LOADER', false)
                        oStore.dispatch('displayModal', res.headers)
                    })
            }
        },

        sendLink({getters}){
            let link = this.link
            this.$store.dispatch("uploadLink", link)
        },

        removeFile(index){
            this.files.splice(index, 1);
        }

    }
}
</script>
