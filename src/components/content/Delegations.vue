<template>
<div class="plane-component" >
    <div class="component-nav-and-content">
        <app-menu v-show="displayMenu"></app-menu>
        <div class="modal-overlay" v-show="displayOverlay"></div>
        <div name="testname" class="component-content delegations-content" >
            <div class="content-header">
                <div class="content-header-title-and-menu">
                    <div @click="showMenu" class="content-header-menu">&#9776;</div>
                    <p class="content-header-title">{{ $t("header.delegations") }}</p>
                </div>
            </div>
            <confirm-dialog v-if="showDialog"></confirm-dialog>
            <success-dialog v-if="showSuccessDialog"></success-dialog>
            <div class="delegations-tiles">
                <div class="delegations-tile delegations-inputs">
                    <div class="delegations-tile-header">
                        <div class="delegations-tile-title">
                            <p  v-if="authType==='OWN'">{{userData.Fullname}}</p>
                            <div class="cd-for-select" v-if="authType==='*'">
                                <select class="cd-select" v-model="newDelegation.userId" @change="setUsername" required>
                                    <option v-for="user in usersList" :key="user.UserAlias" :value="user.UserAlias">{{ user.Fullname }}</option>
                                </select>
                                <label class="cd-slabel">{{ $t("label.selectEmployee") }}</label>
                            </div>
                            <div v-if="authType==='TEAM'" class="cd-for-select">
                                <select class="cd-select" v-model="newDelegation.userId" @change="setUsername" required>
                                    <option v-for="user in filteredTeamUsers" :key="user.UserAlias" :value="user.UserAlias">{{ user.Fullname }}</option>
                                </select>
                                <label class="cd-slabel">{{ $t("label.selectTeamMember") }}</label>
                            </div>
                            <button class="func-btn" :disabled="disableGenerating" @click="generatePdf">{{ $t("button.generatePDF") }}</button>
                        </div>
                        <div class="delegations-tile-underscore"></div>
                    </div>
                    <div class="delegations-tile-content delegations-tile-content-1">
                        <div class="del-sections">
                            <div class="delegation-number">
                                <span class="delegation-number-title">{{ $t("label.delegationNo") }}:&nbsp;</span>
                                <div v-if="delegationNumber !== null ? true : false" class="del-number-cd">
                                    <div v-if="showDelegationNoError" class="del-number-error">{{ $t('label.delegationNoError') }}</div>
                                    <masked-input @input="changeDelegationNumber" v-if="oldDelegationNumber === null ? false : true" :class="disableDelegationNumber ? 'delegation-number-input' : 'delegation-number-input-edit'" mask="11/11/1111/AAA" type="text" v-model="oldDelegationNumber" :disabled="disableDelegationNumber"></masked-input>
                                    <span class="cd-span"></span>
                                </div>
                                <div v-if="oldDelegationNumber === null ? true : false" class="delegation-number-label">{{$t('label.delegationNoLabel')}}</div>
                                <button class="delegation-number-btnc" @click="setNewDelegationNumber" v-if="delegationNumber !== oldDelegationNumber && !showDelegationNoError" style="transform: rotate(0deg)">&#10003; <span>{{ $t('button.saveNewDelegNumber') }}</span></button>
                                <button class="delegation-number-btn" v-if="oldDelegationNumber === null ? false : true" @click="disableDelegationNumber = !disableDelegationNumber" :title="$t('title.editDelegationNumber')" >&#9998;</button>
                            </div>
                            <div class="del-inputs-sections">
                                <div class="delegations-inputs-section">
                                    <!-- <p class="del-inputs-header">{{ $t("label.targetTime") }}</p> -->
                                    <div class="del-div-cool">
                                        <input required class="delegations-input-cool" v-model="newDelegation.destination" @input="checkNewDelegation" />
                                        <span class="del-div-bar"></span>
                                        <label class="delegations-label-cool">{{ $t("label.to") }} </label>
                                    </div>
                                    <div class="del-div-cool">
                                        <v-date-picker class="delegations-input-date" @input="setDelegationNo" is-expanded mode="range" v-model="newDelegation.dates">
                                            <input value="newDelegation.dates" />
                                        </v-date-picker>
                                        <label class="del-slabel">{{ $t("label.forTime") }} </label>
                                    </div>
                                    <div class="del-div-cool">
                                        <v-date-picker class="delegations-input-date" @input="checkNewDelegation" v-model="newDelegation.createDate">
                                            <input value="newDelegation.createDate" />
                                        </v-date-picker>
                                        <label class="del-slabel">{{ $t("label.day") }} </label>
                                    </div>
                                    <div class="del-div-cool">
                                        <input required class="delegations-input-cool" v-model="newDelegation.purpose" @input="checkNewDelegation" />
                                        <span class="del-div-bar"></span>
                                        <label class="delegations-label-cool">{{ $t("label.target") }} </label>
                                    </div>
                                </div>
                                <div class="delegations-inputs-section">
                                    <div class="del-div-cool">
                                        <select ref="meanOfTransport" class="delegations-select-cool" v-model="selectedMeanOfTransport" @change="showRegistrationInput" required>
                                            <option v-for="transport in transportList" :key="transport.Key" :value="transport.Key">{{ transport.Value }}</option>
                                        </select>
                                        <label class="del-slabel">{{ $t("table.delegations.transport") }} </label>
                                    </div>
                                    <div class="del-div-cool" v-if="showRegNoInput">
                                        <input required class="delegations-input-cool" v-model="newDelegation.carRegistrationNo" @input="checkNewDelegation" />
                                        <span class="del-div-bar"></span>
                                        <label class="delegations-label-cool">{{ $t("label.carRegistrationNo") }} </label>
                                    </div>
                                    <div class="del-div-cool">
                                        <select required class="delegations-select-cool" v-model="newDelegation.currency" @change="countAllCosts">
                                            <option v-for="currency in currencyList" :key="currency.id" :value="currency.id">{{ currency.id }}</option>
                                        </select>
                                        <label class="del-slabel">{{ $t("table.delegations.currency") }} </label>
                                    </div>
                                    <div class="del-div-currs">
                                        <div class="del-div-cool-curr">
                                            <p class="del-inp-curr">{{newDelegation.currency}}</p>
                                            <input required id="del-inp-curr1" class="delegations-input-cool" v-model="newDelegation.allowanceDeduction" @input="checkNewDelegation" />
                                            <span class="del-div-bar"></span>
                                            <label class="delegations-label-cool">{{ $t("label.allowanceDeduction") }}: </label>
                                        </div>
                                        <div class="del-div-cool-curr">
                                            <p class="del-inp-curr">{{newDelegation.currency}}</p>
                                            <input required class="delegations-input-cool" v-model="totalCostsInCurr.totalPayback"/>
                                            <span class="del-div-bar"></span>
                                            <label class="delegations-label-cool-s">{{ $t("label.totalReturnAmount") }}: </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="delegations-inputs-section-l">
                                    <div class="del-div-line">
                                        <label class="delegations-label-line">{{ $t("label.dailyAllowance") }} </label>
                                        <p class="del-p-line">{{dailyAllowance}} PLN</p>
                                    </div>
                                    <div class="del-div-line">
                                        <label class="delegations-label-line">{{ $t("label.totalAllowance") }}: </label>
                                        <p class="del-p-line">{{newDelegation.totalAllowance}} {{newDelegation.currency}} </p>
                                    </div>
                                    <div class="del-div-line">
                                        <label class="delegations-label-line">{{ $t("label.hoursInDelegation") }} </label>
                                        <p class="del-p-line">{{ newDelegation.hours }}</p>
                                    </div>
                                    <div class="del-div-line">
                                        <label class="delegations-label-line">{{ $t("label.advanceAmount") }}: </label>
                                        <p class="del-p-line"> {{ totalCostsInCurr.advance}}  {{newDelegation.currency}}</p>
                                    </div>
                                    <div class="del-div-line">
                                        <label class="delegations-label-line">{{ $t("label.totalDelegationAmount") }}: </label>
                                        <p class="del-p-line">{{ totalCostsInCurr.amount}}  {{newDelegation.currency}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <delegation-table></delegation-table>
                <advance-table></advance-table>
                <travel-costs-table></travel-costs-table>
                <accomodation-costs-table></accomodation-costs-table>
                <other-costs-table></other-costs-table>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import moment from "moment"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
window.html2canvas = html2canvas

import {mapGetters, mapActions} from 'vuex'
import MaskedInput from "vue-masked-input";
import Menu from '../Menu.vue'
import AccomodationCosts from './delegationComponents/accomodationCosts'
import OtherCosts from './delegationComponents/OtherCosts'
import TravelCosts from './delegationComponents/TravelCosts'
import AdvanceTable from './delegationComponents/AdvanceTable'
import DelegationTable from './delegationComponents/DelegationTable'
import Dialog from '../dialogs/ConfirmDelegationDialog'
import Modal from '../dialogs/MessageLogDialog'
import SuccessDialog from '../dialogs/SuccessDelegationDialog'

let utils = require('../../utils')

export default {
    data() {
        return {
            delegationUsername: localStorage.getItem('id'),
            generatingPdfMode: false,
            disableDelegationNumber: true,
            showDelegationNoError: false
        }
    },
    components: {
        'app-menu': Menu,
        'accomodation-costs-table': AccomodationCosts,
        'other-costs-table': OtherCosts,
        'travel-costs-table': TravelCosts,
        'advance-table': AdvanceTable,
        'delegation-table': DelegationTable,
        'confirm-dialog': Dialog,
        'modal': Modal,
        MaskedInput,
        'success-dialog': SuccessDialog
    },
    created(){
        let oStore = this.$store;
        oStore.commit('SET_PROMISE_TO_READ', oStore.getters.getDelegationToRead);
        oStore.dispatch('getData', null);
        utils.checkAuthLink(this.$router, oStore.getters.getUserAuth.ZMENU);
        this.$store.dispatch('clearDelegationForm')
    },
    computed: {
        ...mapGetters({
            userData: 'getUserInfo',
            accCostValidated: 'getAccCostValidated',
            currencyList: 'getCurrencyList',
            totalCosts: 'getTotalCosts',
            newDelegation: 'getNewDelegation',
            newDelegationValidated: 'getNewDelegationValidated',
            delegationTableValidated: 'getDelegationTableValidated',
            dailyAllowance: 'getDailyAllowance',
            usersList: 'usersList',
            totalCostsInCurr: 'getTotalCostsInCurr',
            advanceData: 'getAdvanceData',
            delegationNumber: 'getNewDelegationNumber',
            showDialog: 'getShowConfirmDelegation',
            displayMenu: 'getShowMenu',
            displayOverlay: 'getShowMenuOverlay',
            authType: 'getDelegationAuth',
            showSuccessDialog: 'getSuccessDelegationDialog',
            transportList: 'getTransportList',
            showRegNoInput: 'getShowRegistrationNoInput' 
        }),
        oldDelegationNumber: {
            set (number) { this.$store.commit('SET_OLD_DELEG_NO', number) },
            get () { return this.$store.state.delegations.OldDelegationNumber }
        },
        selectedMeanOfTransport: {
            set (key) { this.$store.commit('SET_MEAN_OF_TRANSPORT', key) },
            get () { return this.$store.state.delegations.meanOfTransport }
        },
        disableSaveBtn() {
            return (this.newDelegationValidated && this.delegationTableValidated && this.accCostValidated) ? false : true
        },
        disableGenerating(){
            return (this.newDelegation.dates && this.delegationUsername) ? false : true
        },
        filteredTeamUsers() {
            let aFilteredUsers = this.usersList,
                sTeam = this.userData.DepartmentName

            aFilteredUsers = aFilteredUsers.filter(function(oData){ return oData.DepartmentName === sTeam });
            return aFilteredUsers
        }
    },
    methods: {
        ...mapActions({
            checkNewDelegation: 'checkNewDelegation',
            countAllowance: 'countAllowance',
            countAllCosts: 'countAllCosts'
        }),
        showRegistrationInput(evt) {
            let key = evt.target.value
            if (key === 'PRVCAR' || key === 'COMCAR' || key === 'MOTOR' || key === 'MOPED') {
                this.$store.commit('SET_SHOW_REGISTRATION_INPUT', true)
            } else {
                this.$store.commit('SET_SHOW_REGISTRATION_INPUT', false)
            }
        },
        setNewDelegationNumber() {
            this.disableDelegationNumber = true
            this.$store.commit('SET_NEW_DELEG_NO', this.oldDelegationNumber)
            this.$store.commit('SET_OLD_DELEG_NO', this.oldDelegationNumber)
        },
        changeDelegationNumber(value) {
            const regexp = new RegExp("([0-3][0-9]\/[0-1][0-9]\/[0-2][0-9]{3}\/[A-Z]{3})")
            if (value === "") {
                this.oldDelegationNumber = this.delegationNumber
                this.changeDelegationNumber(this.oldDelegationNumber) 
            } else if (regexp.test(value)) {
                this.showDelegationNoError = false
            } else {
                this.showDelegationNoError = true
            }
        },
        setDelegationNo(){
            if (this.newDelegation.dates && this.delegationUsername) {
                const data = {
                    UserAlias: this.delegationUsername,
                    // DelegDate: utils.formatDateForBackend(this.newDelegation.dates.start)
                    DelegDate: "datetime'" + moment(this.newDelegation.dates.start).format("YYYY-MM-DD") + "T00:00:00'"
                }
                this.$store.dispatch('getDelegationNumber', data)
                this.countAllowance()
            }
        },
        setUsername(){
            this.delegationUsername = this.newDelegation.userId;
            this.setDelegationNo()
        },
        generatePdf() {
            this.generatingPdfMode = true
            // this.loopClasses()
            const source = document.body.getElementsByClassName('delegations-content')[0]

            html2canvas(source).then(canvas => {
                    let contentWidth = canvas.width,
                    contentHeight = canvas.height,
                    pageHeight = contentWidth / 540 * 841.89,
                    leftHeight = contentHeight,
                    position = 0,
                    imgWidth = 540,
                    imgHeight = 540/contentWidth * contentHeight,
                    pageData = canvas.toDataURL('image/jpeg', 1.0),
                    pdf = new jsPDF('', 'pt', 'a4')
                    if (leftHeight < pageHeight) {
                        pdf.addImage(pageData, 'JPEG', 30, 30, imgWidth, imgHeight );
                    } else {
                        while(leftHeight > 0) {
                            pdf.addImage(pageData, 'JPEG', 30, position, imgWidth, imgHeight)
                            leftHeight -= pageHeight;
                            position -= 841.89;
                            if(leftHeight > 0) {
                                pdf.addPage();
                            }
                        }
                    }
                    let fileName = this.delegationNumber ? this.delegationNumber : 'Delegacja'
                    pdf.save(fileName + '.pdf');
                    this.$store.commit('SET_SHOW_CONFIRM_DELEG', true)
            })
        },

        loopClasses() {
            let cSelect = document.getElementsByClassName("delegations-select-cool")
            let cInput = document.getElementsByClassName("delegations-input-cool")
            let cSelectHeader = document.getElementsByClassName("del-div-cool-head")
            let cDate = document.getElementsByClassName("delegations-input-date")
            let cGeneratePDF = document.getElementsByClassName("func-btn")

            this.loop(cInput, "delegations-dinput-cool")
            this.loop(cSelect, "delegations-dselect-cool")
            this.loop(cSelectHeader, "del-div-cool-dhead")
            this.loop(cDate, "delegations-dinput-date")
        },

        loop(cClasses, sClassName) {
            let i = cClasses.length
            while (i--) {
                cClasses[i].className = sClassName
            }
        },
        showMenu(event) {
            this.$store.commit('SET_MENU_CLICKED', true)
            let obj = {window, event}
            this.$store.dispatch("setSideMenu", obj);
        },
        setCurrency(e) {
            let el = this.$el
        }
    }
}
</script>