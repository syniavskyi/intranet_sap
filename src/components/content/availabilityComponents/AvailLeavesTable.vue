<template>
    <div class="availability-tile ava-tile-3">
        <div class="availability-tile-header">
            <div class="ava-tile-header-title">
               <h2>{{ $t("label.availabilityOverview") }}
                </h2>
                <div class="availability-tile-underscore"></div>
            </div>
            <button class="holiday-button-static" >
                <img src="../../../assets/images/island.png">
                <p>{{$t('title.openHoliday')}}</p>
            </button>
            <button class="profile-edit-btn" v-if="!editMode" :disabled="disabledBtnToEditAvail" @click="edit">{{ $t("button.edit") }}</button>
            <button class="profile-edit-btn-e" v-if="editMode" @click="cancel"><span class="prof-btn-txt">{{ $t("button.finishEdit") }}</span><span class="prof-btn-icon">&#10004;</span></button>
        </div>
        <p class="ava-content-header" v-if="noAvailEntries">{{ $t("message.noEntriesForParameters") }}</p>
        <div class="availability-tile-content" v-if="!noAvailEntries">
            <div class="ava-table-s" v-for="(avail, index) in filteredUserAvail" :key="index">
                <div class="ava-thead-s">
                    <div class="ava-ths-item">{{ $t("label.entryType") }}</div>
                    <div class="ava-ths-item">{{ $t("label.from") }}</div>
                    <div class="ava-ths-item">{{ $t("label.to") }}</div>
                    <div class="ava-ths-item">{{ $t("label.status") }}</div>
                    <div class="ava-ths-item">{{ $t("label.options") }}</div>
                </div>
                <div class="ava-tbody-s">
                    <div class="ava-tbs-item">
                        <div class="ava-tbs-ititle">{{ $t("label.entryType") }}</div>
                         <select disabled v-if="!editMode || avail.StatusId === 'CO'" class="selectProfile selectDisabled" v-model="avail.TypeId">
                            <option v-for="type in availTypes" :key="type.Key" :value="type.Key">{{type.Value}}</option>
                        </select>
                        <select v-if="editMode && avail.StatusId !== 'CO'" class="selectProfile selectEdit" v-model="avail.TypeId" @change="checkFields(index, avail.EntryId)">
                            <option v-for="type in filteredAvailTypes" :key="type.Key" :value="type.Key">{{type.Value}}</option>
                        </select>
                        <button v-if="avail.TypeId !== 'WR' && !editMode" class="holiday-button" :title="$t('title.openHoliday')" @click="setDataToLeave(avail)">
                            <img src="../../../assets/images/island.png">
                        </button>
                    </div>
                    <div class="ava-tbs-item">
                        <div class="ava-tbs-ititle">{{ $t("label.from") }}</div>
                        <p class="prof-date-label" v-if="!editMode || avail.StatusId !== 'PL'"> {{ formatDate(avail.DateStart) }} </p>
                        <v-date-picker v-if="editMode && avail.StatusId === 'PL' && authType === '*' " class="prof-input-date" popoverDirection="top" @input="validateDates(index, avail.EntryId)" is-expanded mode="single" v-model="avail.DateStart">
                            <input value="avail.DateStart"/>
                        </v-date-picker>
                        <v-date-picker :min-date="new Date()" v-if="editMode && avail.StatusId === 'PL' && authType !=='*'" class="prof-input-date" popoverDirection="top" @input="validateDates(index, avail.EntryId)" is-expanded mode="single" v-model="avail.DateStart">
                            <input value="avail.DateStart"/>
                        </v-date-picker>
                    </div>
                    <div class="ava-tbs-item">
                        <div class="ava-tbs-ititle">{{ $t("label.to") }}</div>
                        <p class="prof-date-label" v-if="!editMode || avail.StatusId !== 'PL' "> {{ formatDate(avail.DateEnd) }} </p>
                        <!-- <v-date-picker v-if="editMode && avail.StatusId === 'PL' && authType === '*'" class="prof-input-date" popoverDirection="top" @input="validateDates(index, avail.EntryId)" is-expanded mode="single" v-model="avail.DateEnd">
                            <input value="avail.DateEnd"/>
                        </v-date-picker> -->
                        <v-date-picker :min-date="avail.DateStart" v-if="editMode && avail.StatusId === 'PL'" class="prof-input-date" popoverDirection="top" @input="validateDates(index, avail.EntryId)" is-expanded mode="single" v-model="avail.DateEnd">
                            <input value="avail.DateStart"/>
                        </v-date-picker>
                    </div>
                    <div class="ava-tbs-item">
                        <div class="ava-tbs-ititle">{{ $t("label.status") }}</div>
                         <select disabled class="selectProfile selectDisabled" v-model="avail.StatusId">
                            <option v-for="status in availStatus" :key="status.Key" :value="status.Key">{{status.Value}}</option>
                        </select>
                    </div>
                    <div class="ava-tbs-item confirmButtonAvail" v-if="!editMode && authAcc && newLeave.UserId !== loginAlias && filteredTeamUsers.find(o => o.UserAlias === newLeave.UserId) || !editMode && authAcc ==='*'">
                         <button class="btn-delete-row" v-show="!editMode && authAcc && newLeave.UserId !== loginAlias && filteredTeamUsers.find(o => o.UserAlias === newLeave.UserId) || !editMode && authAcc ==='*'" :disabled="disabledBtnToEditAvail || avail.StatusId !== 'PL'" @click="operation({index, avail, operation: 'confirm'})">{{ $t("button.confirm") }}</button>
                         <button class="btn-delete-row" v-show="!editMode && authAcc && newLeave.UserId !== loginAlias && filteredTeamUsers.find(o => o.UserAlias === newLeave.UserId) || !editMode && authAcc ==='*'" :disabled="disabledBtnToEditAvail || avail.StatusId !== 'PL'" @click="operation({index, avail, operation: 'reject'})">{{ $t("button.reject") }}</button>
                    </div>
                    <div class="ava-tbs-item eduButtonsAvail" v-if="editMode && newLeave.UserId === loginAlias || editMode && authAcc && filteredTeamUsers.find(o => o.UserAlias === newLeave.UserId) || editMode && authAcc ==='*'">
                        <button class="btn-delete-row" v-if="editMode && newLeave.UserId === loginAlias || editMode && authAcc && filteredTeamUsers.find(o => o.UserAlias === newLeave.UserId) || editMode && authAcc ==='*'" :disabled="true" @click="operation({index, avail, operation: 'save'})">{{ $t("button.save") }}</button>
                        <button class="btn-delete-row" v-if="editMode && newLeave.UserId === loginAlias || editMode && authAcc && filteredTeamUsers.find(o => o.UserAlias === newLeave.UserId) || editMode && authAcc ==='*'" @click="remove(index, avail)">{{ $t("button.delete") }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import moment from 'moment'
let utils = require('../../../utils')
export default {
    props: ['selected-type', 'selected-status', 'auth-type'],
    data () {
        return {
            invalidDates: false,
            editMode: false,
            _beforeEditingCache: null,
            setFilterAllowed: true,
            loginAlias: localStorage.getItem("id")
        }
    },
    computed: {
        ...mapGetters({
            userAvail: 'getUserAvail',
            availTypes: 'getAvailType',
            availStatus: 'getAvailStatus',
            newLeave: "getNewLeaveForUser",
            authAcc: 'getAvailAcceptAuth',
            filteredTeamUsers: 'getFilteredTeamUsers',
            disabledBtnToEditAvail: "getDisabledBtnToEditAvail",
            userData: "getUserInfo"
        }),
        filteredUserAvail() {
            let aFilteredAvail = this.userAvail,
                sType = this.selectedType,
                sStatus = this.selectedStatus,
                checkFilter,
                fnFilter;

// checkFilter checks if data are during editing and does not allow to filter by type
                checkFilter = aFilteredAvail.find(o => o.Filter === true);

           if(sType === null && sStatus === null){
               return aFilteredAvail
           } else {
               if(sType && sStatus && checkFilter){
                    fnFilter = function(oItem){
                        return oItem.TypeId === sType && oItem.StatusId === sStatus || oItem.Filter === true;
                    }
                }
                else if(sType && sStatus){
                    fnFilter = function(oItem){
                        return oItem.TypeId === sType && oItem.StatusId === sStatus;
                    }
                }
                else if(sType && checkFilter) {
                    fnFilter = function(oItem){
                        return oItem.TypeId === sType || oItem.Filter === true;
                    }
                }
                else if (sType){
                    fnFilter = function(oItem){
                        return oItem.TypeId === sType;
                    }
                }else if(sStatus){
                    fnFilter = function(oItem){
                        return oItem.StatusId === sStatus;
                    }
               }
                aFilteredAvail = aFilteredAvail.filter(fnFilter);

                return aFilteredAvail
           }
        },
        noAvailEntries() {
            if (this.filteredUserAvail.length === 0) {
                return true
            } else {
                return false
            }
        },
        filteredAvailTypes() {
            let aAvailTypes = this.availTypes,
                aFilteredTypes = utils.createClone(this.availTypes)

            for(let i = 0; i < aAvailTypes.length; i++){
                if (aAvailTypes[i].Key === 'PR') {
                    aFilteredTypes.splice(i, 1)
                    return aFilteredTypes
                }
            }
        }
    },
    watch: {
         userAvail() {
             this.editMode = false;
         }
    },
    methods: {
        ...mapActions(["removeUserAvail", "updateUserAvail"]),
         edit() {
            this.editMode = true;
            this._beforeEditingCache = utils.createClone(this.userAvail);
        },
        remove(index, data) {
            let avail = utils.createClone(data);
            this.removeUserAvail(avail);
            this.userAvail.splice(index, 1);
            this._beforeEditingCache = this.userAvail;
        },
        cancel() {
            this.$store.commit("SET_USER_AVAIL", this._beforeEditingCache);
            this.editMode = false;
        },
        validateDates(index, entryId) {
           const startDate = this.userAvail[index].DateStart,
                endDate = this.userAvail[index].DateEnd

            if (endDate && startDate) {
                const formatStartDate = moment(startDate).format("YYYY-MM-DD"),
                formatEndDate = moment(endDate).format("YYYY-MM-DD");

                this.invalidDates = formatStartDate  > formatEndDate ? true : false;
            }
            this.checkFields(index, entryId);
        },
        formatDate(date) {
            return date !== null && date !== undefined
            ? moment(date).format("DD.MM.YYYY")
            : "-";
        },
        checkFields(index, entryId) {
         let bEnd, bStart, bType, bStatus, bChanged,
         userEntryId = this.userAvail[entryId],
         beforeEdit = this._beforeEditingCache[entryId]

// check if data was changed
             bEnd = beforeEdit.DateEnd.getTime() !== userEntryId.DateEnd.getTime(),
             bStart = beforeEdit.DateStart.getTime() !== userEntryId.DateStart.getTime(),
             bType = beforeEdit.TypeId !== userEntryId.TypeId,
             bStatus = beforeEdit.StatusId !== userEntryId.StatusId;

// if data was changed set boolean variable to true
       bChanged = bEnd || bStart || bType || bStatus ? true : false

// check if data are not empty and was changed and set button to disabled or not
// do not allow to filter by type when data are during changing
         if( bChanged &&
             userEntryId.TypeName &&
             userEntryId.DateStart &&
             userEntryId.DateEnd &&
             userEntryId.StatusId &&
             !this.invalidDates) {
                document.getElementsByClassName("eduButtonsAvail")[index].children[0].disabled = false;
            }    else {
                document.getElementsByClassName("eduButtonsAvail")[index].children[0].disabled = true;
            }

            userEntryId.Filter = true;
        },
       operation(fullData){
           let avail = utils.createClone(fullData.avail);
                if(fullData.operation === 'save') {
                this.userAvail[fullData.avail.EntryId].Filter = false;
                avail.Action = 'U';
                // document.getElementsByClassName("eduButtonsAvail")[fullData.index].children[0].disabled = true;
            } else if(fullData.operation === 'confirm' || fullData.operation === 'reject') {
                this._beforeEditingCache = utils.createClone(this.userAvail);
                // document.getElementsByClassName("confirmButtonAvail")[fullData.index].children[0].disabled = true;
                }   if(fullData.operation === "confirm") {
                        avail.StatusId = 'CO';
                        avail.Action = 'A';
                    } else if(fullData.operation === "reject") {
                        avail.StatusId = 'RE';
                        avail.Action = 'R'
                    }
         avail.DateStartToChange = this._beforeEditingCache[fullData.avail.EntryId].DateStart;
         avail.DateEndToChange = this._beforeEditingCache[fullData.avail.EntryId].DateEnd;
         this._beforeEditingCache[fullData.avail.EntryId] = fullData.avail;
         this.updateUserAvail(avail);
       },
       setDataToLeave(avail){
           let address = this.userData.Street + ' ' + this.userData.BuildingNumber + '/' + this.userData.ApartmentNumber + ' ' + this.userData.PostalCode;
           let holiday = {
               dateStart: moment(avail.DateStart).format("YYYY-MM-DD"),
               dateEnd: moment(avail.DateEnd).format("YYYY-MM-DD"),
               userAlias: avail.UserId,
               today: moment(new Date()).format("YYYY-MM-DD"),
               year: moment(new Date()).format("YYYY-MM-DD").slice(0,4),
               city: this.userData.BranchName,
               type: 'Wypoczynkowy',
               fullname: this.userData.Fullname,
               address: address,
               phone: this.userData.Telephone,
               email: this.userData.Email,
               forDay: '',
               countedDays: null
           }
           this.$store.commit('SET_NEW_HOLIDAY', holiday);
           this.$router.push({ name: "HolidayRequest"});
       }
    }
}
</script>

