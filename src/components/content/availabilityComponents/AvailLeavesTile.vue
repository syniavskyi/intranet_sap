<template>
    <div class="availability-tile ava-tile-2">
        <div class="tile-head">
            <div class="tile-head-title">
                <i18n path="message.addEntryforUser" tag="h2">
                    <span place="user">{{formattedUsername}}</span>
                </i18n>
            </div>
            <div class="tile-underscore"/>
        <!-- <button class="ava-button ava-button-add" @click="showAddProjectDialog = true"> Dodaj projekt </button> -->
        </div>
        <div class="availability-tile-content">
            <div id="add-project-dialog">
                <div class="ava-add">
                    <p class="ava-content-header" v-if="newLeave.TypeId === null">{{ $t("message.selectTypeToAddEntry") }}</p>
                    <p class="ava-content-header" v-if="newLeave.TypeId !== null">{{ $t("label.entryType") }}:
                        <span class="ava-tile-entry">&nbsp;{{formattedType}}</span>
                    </p>
                    <div class="cd-for-input cd-b">
                        <v-date-picker v-if="authAcc === '*'" required class="cd-rangex" popoverDirection="top" is-expanded mode="range" v-model="selectedDates" @change="checkFields">
                            <input value="selectedDates">
                        </v-date-picker>
                        <v-date-picker  v-if="authAcc !== '*'" :min-date="new Date()" required class="cd-rangex" popoverDirection="top" is-expanded mode="range" v-model="selectedDates" @change="checkFields">
                            <input value="selectedDates">
                        </v-date-picker>
                        <label class="cd-slabel">{{ $t("label.dates") }}</label>
                    </div>
                    <div class="cd-for-input cd-b" v-if="authAcc === '*' || authAcc === 'TEAM' && selectedUser!==loginAlias && filteredTeamUsers.find(o => o.UserAlias === newLeave.UserId)">
                        <select required class="cd-select" v-model="newLeave.StatusId" @change="checkFields">
                            <option v-for="status in availStatusList" :key="status.Key" :value="status.Key">{{ status.Value }}</option>
                        </select>
                        <label class="cd-slabel">{{ $t("label.status") }}</label>
                    </div>
                </div>
                <div class="ava-add">
                    <div class="cd-for-input cd-b" v-if="newLeave.TypeId == 'OT'">
                        <textarea class="cd-textarea" required maxlength="50" @change="checkFields"/>
                        <label class="cd-label">{{ $t("label.remarks") }}</label>
                    </div>
                    <div class="ava-div-buttons">
                        <button class="ava-button" >{{ $t("button.cancel") }}</button>
                        <button :disabled="disableAddNew" class="ava-button ava-button-edit" @click="addNewLeave" >{{ $t("button.addNewEntry") }}</button>
                        <label class="avail-error" v-if="disabledBtnToEditAvail">{{ $t("label.editProject") }}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
let utils = require('../../../utils')
export default {
    props: ['selected-type', 'selected-user', 'auth-acc'],
    data() {
        return {
            selectedDates: null,
            disableAddNew: true,
            loginAlias: localStorage.getItem("id")
        }
    },
    computed: {
        ...mapGetters({
            newLeave: 'getNewLeaveForUser',
            availStatusList: 'getAvailStatus',
            usersList: 'usersList',
            availTypesList: 'getAvailType',
            filteredTeamUsers: 'getFilteredTeamUsers',
            disabledBtnToEditAvail: "getDisabledBtnToEditAvail"
        }),
        formattedUsername() {
            const userId = this.selectedUser
            for (let i = 0; i < this.usersList.length; i++){
                if (this.usersList[i].UserAlias === userId) {
                     return this.usersList[i].Fullname
                }
            }
        },
        formattedType() {
            const typeId = this.newLeave.TypeId
            for (let i = 0; i < this.availTypesList.length; i++){
                if (this.availTypesList[i].Key === typeId) {
                     return this.availTypesList[i].Value;
                }
            }
        }
    },
    watch: {
        selectedDates(value){
            this.newLeave.DateStart = utils.formatDateForBackend(value.start);
            this.newLeave.DateEnd = utils.formatDateForBackend(value.end);
            this.checkFields();
        },
        selectedType(value){
            if (value){
                this.checkFields();
            } else {
                this.disableAddNew = true;
                this.$emit("change-selected-type", false)
                // this.selectedType = false;
            }
        }
    },
    methods: {
        ...mapActions({addNewLeave: 'addUserLeave'}),
        checkFields() {
            this.$store.commit('SET_NEW_LEAVE', {UserId: this.selectedUser});
            let obj = this.newLeave;
            if(this.disabledBtnToEditAvail===false) {
                if(this.selectedUser === this.loginAlias && this.authAcc !== '*' && obj.DateStart && obj.DateEnd && this.selectedType !== false && this.selectedUser) {
                    this.disableAddNew = false;
                } else {
                    for (let key in obj) {
                        if (!obj[key]){
                            this.disableAddNew = true;
                            return;
                        } else {
                            this.disableAddNew = false;
                        }
                     }
                }
            }
        },
    }
};
</script>