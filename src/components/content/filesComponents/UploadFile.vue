<template>
    <div class="file-upload" v-if="this.authType !== 'OWN'">
    <!-- <div class="file-upload" v-if="this.authType !== 'OWN' && this.show"> -->
        <h3 v-if="this.show" class="content-header-title content-header-title-h3">{{ $t("header.addNewFile") }}</h3>
        <div v-if="this.show" class="drag-drop">
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
        <h4 v-if="this.show" class="content-header-title content-header-title-h4">{{ $tc("label.filesToUpload", 1, { amount: files.length } )}} </h4>
        <div v-if="this.show" class="drag-drop__list">     
            <div class="dd-table">
                <header class="dd-table__header">
                    <label class="dd-table__cell dd-table__c-files dd-table__label">{{ $t("label.fileFormatUpl") }}</label>
                    <label class="dd-table__cell dd-table__c-files dd-table__label">{{ $t("label.fileNameUpl") }}</label>
                    <label class="dd-table__cell dd-table__c-files dd-table__label">{{ $t("label.fileTypeUpl") }}</label>
                    <label class="dd-table__cell dd-table__c-files dd-table__label">{{ $t("label.addToSPUpl") }}</label>
                    <label class="dd-table__cell dd-table__c-files dd-table__label">{{ $t("label.sendEmailUpl") }}</label>
                    <label for="" class="dd-table__cell dd-table__c-files dd-table__label">&nbsp;</label>
                    <label class="dd-table__cell dd-table__c-files dd-table__label">&nbsp;</label>
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
                                    <label class="checkbox-wrap">
                                        <input type="checkbox" class="checkbox-new" v-model="file.status" />
                                        <div class="checkbox-in"></div>
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
        <div v-if="this.show" class="drag-drop__btn">
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

/* TO DO:
 * -obsłużyć dodawanie linków
 * -uporządkować CSS-y
 * -obsłużyć usuwanie przed zapisem
 * -obsłużyć backend
 * -dodać loadera 
 * -walidacja
 */

import i18n from "../../../lang/lang";
import { mapGetters } from 'vuex';
import { required, minLength, url } from "vuelidate/lib/validators";
import Toast from "../../dialogs/Toast";

const insideElements = new Set();

export default {
    name: 'upload-file',
    data() {
      return {
      files: [],
      show: false,
      authType: this.$store.getters.getUserAuth.ZPROF_ATCV
      }
    },
    computed: {
        ...mapGetters({
            fileTypes: "getUploadFileTypes",
            showToast: "getDisplayToast",
            link: "getLinkStructure"
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
        Toast
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
        sendFiles({getters}){
            let files = this.files;

            for(const file of files){
                // this.$store.dispatch("uploadDocument", file)
            }
        },

        sendLink({getters}){
            let link = this.link
            this.$store.dispatch("uploadLink", link)
        },

        removeFile(index){
            this.files.splice
            console.log(this.files);
        }

    }
}
</script>

<style>


.file-upload {
    display: flex;
    flex-direction: column;
    align-self: center;
    align-items: flex-start;
    width: 95%;
    
}

.drag-drop {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 20rem;
    width: 100%;
    position: relative;
}

.drag-drop__container {
    display: flex;
    flex: 1;
    min-height: 12rem;
    max-height: 14rem;
    width: 100%;
    align-items: center;
    justify-content: center;
    -webkit-background-image: linear-gradient(to right bottom, rgba(211, 211, 211, 0.5), #fff);
    background-image: linear-gradient(to right bottom, rgba(211, 211, 211, 0.5), #fff);
    border: 1px solid #d3d3d3;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    font-size: 1.8rem;
    color:	#888888;
    
}

.drag-drop__container--border {
    display: flex;
    flex: 0 1 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 90%;
    width: 98.5%;
    border: 2px dashed #d3d3d3;
}

.drag-drop__container--image {
    display: flex;
    width: 7rem;
}

.drag-drop__list {
    display: flex;
    margin:0;
    padding:0;
    display: flex;
    flex-direction: column;
    width: 100%;
    align-self: center;
    box-shadow: 0px 0px 10px #808080;
    border-radius: 5px;
    margin-bottom: 1rem;
    border-bottom-left-radius: .75rem;
    border-bottom-right-radius: .75rem;
}

.dd-table {
    margin:0;
    padding:0;
    display: flex;
    flex-direction: column;
    background: #ebebeb;
    border: 1px solid #d3d3d3;
}

.dd-table__header {
    display: flex;
}

.dd-table__body {
    display: flex;
    flex-direction: column;
}

.dd-table__row {
    align-self: center;
    width: 100%;
    display: flex;
    flex-direction: row;
    border-radius: 10px;
    margin-bottom: 1rem;
    transition: background-color .2s;
}

.dd-table__row:not(:last-child){
    margin-bottom: 3rem;
}

.dd-table__cell {
    display:flex;
    height: 3rem;
    transition: background-color .2s;
    padding: .1rem 1.5rem;
    justify-content: center;
}

.dd-table__links-btn {
    height: 100%;
}

.dd-table__label {
    color: #7b7777;
    height: 3rem;
    font-weight: 500;
    align-items: center;
    text-align: left;
    justify-content: left;
}

.dd-table__c-files:nth-of-type(1), 
.dd-table__c-files:nth-of-type(4), 
.dd-table__c-files:nth-of-type(5),
.dd-table__c-files:nth-of-type(6),
.dd-table__c-files:nth-of-type(7){
    width: 8%;
}

.dd-table__c-files:nth-of-type(2),
.dd-table__c-files:nth-of-type(3){
    width: 30%;
}

.dd-table__c-link:nth-of-type(5),
.dd-table__c-link:nth-of-type(6) {
    /* visibility: hidden; */
    width: 8%;
}

.dd-table__c-link:nth-of-type(1),
.dd-table__c-link:nth-of-type(7) {
    width: 10%;
}

.dd-table__c-link:nth-of-type(4) {
    width: 16%;
}

.dd-table__c-link:nth-of-type(2),
.dd-table__c-link:nth-of-type(3){
    width: 24%;
}

.dd-table__no-files-choosen {
    text-align: center;
    padding: 1.5rem 1.8rem;
    color: #7b7777;
    font-weight: 500;
}

.dd-table__remove-btn {
    width: 4rem;
    height: 2rem;
    cursor: pointer;
    color: #ffffff;
    border-radius: 4px;
    transition: all 0.2s ease;
    justify-content: center;
    align-items: center;
    margin: .2rem;
    outline-color: orange;
    text-transform: capitalize;
    box-shadow: 0 3px 3px -2px gray;
    border: 0;
    color: black;
    background: #e6e6e6;
}

.dd-table__remove-btn:hover {
    background: #b6b6b6;
}

.drag-drop__btn {
    align-self: center;
    text-align: center;
}


</style>