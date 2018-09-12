<template>
<div class="plane-component" >
    <div class="component-nav-and-content">
        <app-menu v-show="displayMenu"></app-menu>
        <div name="testname" class="component-content delegations-content" >
            <div class="content-header">
                <div class="content-header-title-and-menu">
                    <!-- <img src="../../assets/images/nav/if_menu-32.png" width="32px" class="content-header-menu"> -->
                    <div @click="showMenu" class="content-header-menu">&#9776;</div>
                    <p class="content-header-title">{{ $t("header.delegations") }}</p>
                </div>
            </div>
            <confirm-dialog v-if="showDialog"></confirm-dialog>
            <div class="delegations-tiles">
                <div class="delegations-tile delegations-inputs">
                    <div class="delegations-tile-header">
                        <div class="delegations-tile-title"> 
                            <p  v-if="showUsername">{{userData.Fullname}}</p>
                            <div class="delegations-div-cool-head" v-if="showSelectForAllUsers">
                                <select required  class="delegations-select-cool" v-model="newDelegation.userId" @change="setUsername">
                                    <option v-for="user in usersList" :key="user.id" :value="user.id">{{ user.Fullname }}</option>
                                </select> 
                                <label class="delegations-label-cool-select">Wybierz pracownika</label>
                            </div>
                             <div  v-if="showSelectForTeam" class="delegations-div-cool-head">
                                <select required class="delegations-select-cool" v-model="newDelegation.userId" @change="setUsername">
                                    <option v-for="user in filteredTeamUsers" :key="user.UserAlias" :value="user.UserAlias">{{ user.Fullname }}</option>
                                </select> 
                                <label  class="delegations-label-cool-select">Wybierz członka zespołu</label>
                            </div>
                            <button class="del-generate-pdf" @click="generatePdf">GENERUJ PDF</button>
                        </div>
                        <div class="delegations-tile-underscore"></div>
                    </div>
                    <div class="delegations-tile-content delegations-tile-content-1">
                        <div class="del-inputs-sections">
                            <div class="delegation-number">Numer Delegacji: <span>&nbsp; {{ delegationNumber }} </span> </div>
                            <div class="delegations-inputs-section">
                                <!-- <div class="delegations-div-unders">
                                    <div class="del-underscore">1</div>
                                </div> -->
                                <p class="del-inputs-header">Cel / Czas</p>
                                <div class="delegations-div-cool">
                                    <input required class="delegations-input-cool" ref="autocomplete" placeholder=""  onfocus="value = ''" v-model="newDelegation.destination" @input="checkNewDelegation" />
                                    <span class="delegations-div-bar"></span>
                                    <label class="delegations-label-cool">{{ $t("label.to") }} </label>
                                </div>
                                <div class="delegations-div-cool">
                                    <input required class="delegations-input-cool" v-model="newDelegation.purpose" @input="checkNewDelegation" />
                                    <span class="delegations-div-bar"></span>
                                    <label class="delegations-label-cool">{{ $t("label.target") }} </label>
                                </div>
                                <div class="delegations-div-cool">
                                    <v-date-picker class="delegations-input-date" @input="checkNewDelegation" v-model="newDelegation.createDate">
                                        <input value="newDelegation.createDate" />
                                    </v-date-picker>
                                    <label class="delegations-label-cool-select">{{ $t("label.day") }} </label>
                                </div>
                                <div class="delegations-div-cool">
                                    <v-date-picker class="delegations-input-date" @input="setDelegationNo" is-expanded mode="range" v-model="newDelegation.dates">
                                        <input value="newDelegation.dates" />
                                    </v-date-picker>
                                    <label class="delegations-label-cool-select">{{ $t("label.forTime") }} </label>
                                </div>
                            </div>
                            <!-- <div class="del-vline"></div> -->
                            <div class="delegations-inputs-section">
                                
                                <!-- <div class="delegations-div-cool">     -->
                                    <!-- <p class="del-p-cool"> DJA/0203/2018  </p> -->
                                    <!-- {{ setDelegationNo() }} -->
                                    <!-- <label class="delegations-label-cool">{{ $t("label.delegationNo") }} </label> -->
                                <!-- </div> -->
                                <div class="delegations-div-cool">
                                    <select required class="delegations-select-cool" v-model="newDelegation.currency" @change="countAllCosts">
                                        <option v-for="currency in currencyList" :key="currency.id" :value="currency.id">{{ currency.id }}</option>
                                    </select>
                                    <label class="delegations-label-cool-select">{{ $t("table.delegations.currency") }} </label>
                                </div>
                                
                                <div class="delegations-div-cool">
                                    <p class="del-p-cool">{{dailyAllowance}} PLN </p>
                                    <label class="delegations-label-cool">{{ $t("label.dailyAllowance") }} </label>
                                </div>
                                <div class="delegations-div-cool">
                                    <p class="del-p-cool">{{newDelegation.totalAllowance}} {{newDelegation.currency}} </p>
                                    <label class="delegations-label-cool">{{ $t("label.totalAllowance") }}: </label>
                                </div>
                                <div class="delegations-div-cool-curr">
                                    <p class="del-inp-curr">{{newDelegation.currency}}</p>
                                    <input required id="del-inp-curr1" class="delegations-input-cool" v-model="newDelegation.allowanceDeduction" @input="checkNewDelegation" />
                                    <span class="delegations-div-bar"></span>
                                    <label class="delegations-label-cool">{{ $t("label.allowanceDeduction") }}: </label>
                                </div>
                            </div>
                            <!-- <div class="del-vline"></div> -->
                            <div class="delegations-inputs-section">
                                <!-- <div class="delegations-div-unders"> -->
                                    <!-- <div class="del-underscore">3</div> -->
                                    <!-- <p class="del-div-p" style="display:none;">Sumaryczne</p>
                                    <div class="del-underscore"></div> -->
                                <!-- </div> -->
                                <div class="delegations-div-cool">
                                    <p class="del-p-cool">{{ newDelegation.hours }}</p>
                                    <label class="delegations-label-cool">{{ $t("label.hoursInDelegation") }} </label>
                                </div>
                                <div class="delegations-div-cool">
                                    <p class="del-p-cool"> {{ totalCostsInCurr.amount}}  {{newDelegation.currency}}</p>
                                    <label class="delegations-label-cool">{{ $t("label.totalDelegationAmount") }}: </label>
                                </div>
                                <div class="delegations-div-cool">
                                    <p class="del-p-cool"> {{ totalCostsInCurr.advance}}  {{newDelegation.currency}}</p>
                                    <label class="delegations-label-cool">{{ $t("label.advanceAmount") }}: </label>
                                </div>
                                <div class="delegations-div-cool-curr">
                                    <p class="del-inp-curr">{{newDelegation.currency}}</p>
                                    <input required class="delegations-input-cool" v-model="totalCostsInCurr.totalPayback"/>
                                    <span class="delegations-div-bar"></span>
                                    <label class="delegations-label-cool-s">{{ $t("label.totalReturnAmount") }}: </label>
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


import {
    mapGetters,
    mapActions
} from 'vuex'
import Menu from '../Menu.vue'
import AccomodationCosts from './delegationComponents/accomodationCosts'
import OtherCosts from './delegationComponents/OtherCosts'
import TravelCosts from './delegationComponents/TravelCosts'
import AdvanceTable from './delegationComponents/AdvanceTable'
import DelegationTable from './delegationComponents/DelegationTable'
import Dialog from '../dialogs/ConfirmDelegationDialog'

let utils = require('../../utils')

export default {
    data() {
        return {
            showUsername: true,
            delegationUsername: null,
            generatingPdfMode: false,
            showSelectForTeam: false,
            showSelectForAllUsers: false
        }
    },
    mounted() {
    this.autocomplete = new google.maps.places.Autocomplete(
      (this.$refs.autocomplete),
      {types: ['geocode']}
    );
    this.autocomplete.addListener('place_changed', () => {
    let place = this.autocomplete.getPlace(),
      city = place.formatted_address
    this.newDelegation.destination = city
    });
    },
    components: {
        'app-menu': Menu,
        'accomodation-costs-table': AccomodationCosts,
        'other-costs-table': OtherCosts,
        'travel-costs-table': TravelCosts,
        'advance-table': AdvanceTable,
        'delegation-table': DelegationTable,
        'confirm-dialog': Dialog
    },
    beforeCreate() {
        if (this.$store.getters.isDataLoaded === false) {
            this.$store.dispatch('loadData', localStorage.getItem('token'))
        }
    },
    created(){
        // window.addEventListener("resize", this.showMenu)
        const roles = this.$store.getters.getUserAuth
        for (let i=0; i<roles.length; i++) {
            if (roles[i].Key === "ZDELEG" && roles[i].Value === "TEAM" && this.userData.DepartmentName !== ""){
                this.showSelectForTeam = true
                this.showUsername = false
            } else  if (roles[i].Key === "ZDELEG" && roles[i].Value === "*"){
                this.showUsername = false
                this.showSelectForAllUsers = true
            } else {
                this.showUsername = true
            }
        }
        // if (role === 'ROLE_ADMIN') {
        //     this.showUsername = false
        // } else {
        //     this.newDelegation.userId = localStorage.getItem('id')
        //     this.delegationUsername = localStorage.getItem('id')
        // }
    },
    // destroyed() {
    //     window.removeEventListener("resize", this.showMenu)
    // },
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
            displayMenu: 'getShowMenu'
        }),
        disableSaveBtn() {
            return (this.newDelegationValidated && this.delegationTableValidated && this.accCostValidated) ? false : true
        },
        filteredTeamUsers(){
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
            this.delegationUsername = this.newDelegation.userId
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
            let cSelectHeader = document.getElementsByClassName("delegations-div-cool-head")
            let cDate = document.getElementsByClassName("delegations-input-date")
            let cGeneratePDF = document.getElementsByClassName("del-generate-pdf")

            this.loop(cInput, "delegations-dinput-cool")
            this.loop(cSelect, "delegations-dselect-cool")
            this.loop(cSelectHeader, "delegations-div-cool-dhead")
            this.loop(cDate, "delegations-dinput-date")
        },

        loop(cClasses, sClassName) {
            let i = cClasses.length
            while (i--) {
                cClasses[i].className = sClassName
            }
        },
        showMenu(event) {
            var x = window.matchMedia("(max-width: 40rem)")
            if (x.matches && event.type === "resize") {
                this.$store.commit("SET_DISPLAY_MENU", false)
            } else {
                this.$store.commit("SET_DISPLAY_MENU", true);
            }
        },
        setCurrency(e) {
            let el = this.$el
        }
    }
}
</script>

<style>
.del-inputs-header {
    position: absolute;
    color: #ccc;
    top:-.5rem;
    left:auto;
    right: auto;
    border-radius: 2rem;
    transition: all 0.4s ease;
    padding: .2rem .3rem;
}


.del-inputs-sections {
    display:  flex;
    width: 100%;
    height: 90%;
    justify-content: space-around;
    align-items: flex-end;
}

</style>
