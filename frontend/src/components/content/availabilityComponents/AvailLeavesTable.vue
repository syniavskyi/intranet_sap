<template>
    <div class="availability-tile ava-tile-3">
        <div class="availability-tile-header">
            <div class="ava-tile-header-title">
                            <!-- <h2>{{ $t("header.addProject") }}</h2> -->
                <h2>Zestawienie dyspozycyjności</h2>
                <div class="availability-tile-underscore"></div>
            </div>
             <button class="profile-edit-btn" v-if="!editMode"  @click="edit">{{ $t("button.edit") }}</button>
             <button class="profile-edit-btn-e" v-if="editMode" @click="cancel"><span class="prof-btn-txt">{{ $t("button.finishEdit") }}</span><span class="prof-btn-icon">&#10004;</span></button>
        </div>
        <p v-if="noAvailEntries">Brak wpisów dla podanych kryteriów</p>
        <div class="availability-tile-content" v-if="!noAvailEntries">
            <div class="ava-table-s" v-for="(avail, index) in filteredUserAvail" :key="index">
                <div class="ava-thead-s">
                    <div class="ava-ths-item">Rodzaj wpisu</div>
                    <div class="ava-ths-item">Od</div>
                    <div class="ava-ths-item">Do</div>
                    <div class="ava-ths-item">Status</div>
                    <div class="ava-ths-item">Opcje</div>
                </div>
                <div class="ava-tbody-s">
                    <div class="ava-tbs-item">
                        <div class="ava-tbs-ititle">Rodzaj wpisu</div>
                         <select v-if="!editMode" class="selectProfile selectDisabled" v-model="avail.TypeId">
                            <option v-for="type in availTypes" :key="type.Key" :value="type.Key">{{type.Value}}</option>
                        </select>
                        <select v-if="editMode" class="selectProfile selectEdit" v-model="avail.TypeId">
                            <option v-for="type in filteredAvailTypes" :key="type.Key" :value="type.Key">{{type.Value}}</option>
                        </select>
                    </div>
                    <div class="ava-tbs-item">
                        <div class="ava-tbs-ititle">Od</div>
                        <p class="prof-date-label" v-if="!editMode"> {{ formatDate(avail.DateStart) }} </p>
                        <v-date-picker v-if="editMode" class="prof-input-date" popoverDirection="top" @input="validateDates(index)" is-expanded mode="single" v-model="avail.DateStart">
                            <input value="avail.DateStart" />
                        </v-date-picker>
                    </div>
                    <div class="ava-tbs-item">
                        <div class="ava-tbs-ititle">Do</div>
                        <p class="prof-date-label" v-if="!editMode"> {{ formatDate(avail.DateEnd) }} </p>
                        <v-date-picker v-if="editMode" class="prof-input-date" popoverDirection="top" @input="validateDates(index)" is-expanded mode="single" v-model="avail.DateEnd">
                            <input value="avail.DateEnd" />
                        </v-date-picker>
                    </div>
                    <div class="ava-tbs-item">
                        <div class="ava-tbs-ititle">Status</div>
                        <select v-if="editMode" class="selectProfile selectEdit" v-model="avail.StatusId">
                            <option v-for="status in availStatus" :key="status.Key" :value="status.Key">{{status.Value}}</option>
                        </select>
                         <select v-if="!editMode" class="selectProfile selectDisabled" v-model="avail.StatusId">
                            <option v-for="status in availStatus" :key="status.Key" :value="status.Key">{{status.Value}}</option>
                        </select>
                    </div>
                    <div class="ava-tbs-item">
                        <div class="ava-tbs-ititle">Opcje</div>
                         <button v-if="editMode">Zapisz</button>
                         <button v-if="editMode">Usuń</button>
                    </div>
                </div>
            </div>
        </div>
    </div>                
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import moment from 'moment'
export default {
    props: ['selected-type', 'selected-status'],
    data () {
        return {
            invalidDates: false,
            editMode: false,
            _beforeEditingCache: null
                
        }
    },
    computed: {
        ...mapGetters({
            userAvail: 'getUserAvail',
            availTypes: 'getAvailType',
            availStatus: 'getAvailStatus'
        }),
        filteredUserAvail() {
            let aFilteredAvail = this.userAvail,
                sType = this.selectedType,
                sStatus = this.selectedStatus,
                fnFilter;
            
           
           if(sType === null && sStatus === null){
               return aFilteredAvail
           } else {
                if(sType && sStatus){ 
                    fnFilter = function(oItem){
                        return oItem.TypeId === sType && oItem.StatusId === sStatus;
                    }
                }else if (sType){
                    fnFilter = function(oItem){
                        return oItem.TypeId === sType;
                    }
                }else if(sStatus){
                    fnFilter = function(oItem){
                        return oItem.StatusId === sStatus;
                    }
                }
                aFilteredAvail = aFilteredAvail.filter(fnFilter)
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
                aFilteredTypes = this.availTypes

            for(let i = 0; i < aAvailTypes.length; i++){
                if (aAvailTypes[i].Key === 'PR') {
                    aFilteredTypes.splice(i, 1)
                    return aFilteredTypes
                }
            }
        }
    },
    methods: {
        ...mapActions(["removeUserAvail"]),
         edit() {
            this.editMode = true;
            this._beforeEditingCache = JSON.parse(JSON.stringify(this.userAvail));
        },
        remove(index) {
            this._beforeEditingCache.splice(index, 1);
            this.removeUserAvail(index);
        },
        cancel() {
            this.$store.commit("SET_USER_AVAIL", this._beforeEditingCache);
            this.editMode = false;
        },
        validateDates(index) {
           const startDate = this.userAvail[index].DateStart,
                endDate = this.userAvail[index].DateEnd

            if (endDate && startDate) {
                const formatStartDate = moment(startDate).format("YYYY-MM-DD"),
                formatEndDate = moment(endDate).format("YYYY-MM-DD");

                this.invalidDates = formatStartDate  > formatEndDate ? true : false;
            }
        },
        formatDate(date) {
            return date !== null && date !== undefined
            ? moment(date).format("DD.MM.YYYY")
            : "-";
        },
    }
}
</script>

