<template>
    <div class="delegations-tile">
        <div @click="toggleTile" id="del-tile-head-1" class="delegations-tile-header">
            <div class="delegations-tile-title">
                {{ $t("header.travelExp") }}
                <button class="del-add-row" @click.prevent="toggleTile" @click="addRow" > dodaj wiersz </button>
            </div>
            <div class="delegations-tile-underscore"></div>
            </div>
                <div id="del-tile-content-1" class="delegations-tile-content">
                        <div class="delegations-table-1">
                            <div class="del-thead-1">
                                <div class="del-table-row">
                                    <div class="del-thead-title">{{ $t("table.delegations.leave") }}</div>
                                    <div class="del-table-items">
                                        <div class="del-table-item">{{ $t("table.delegations.place") }}</div>
                                        <div class="del-table-item">{{ $t("table.delegations.date") }}</div>
                                        <div class="del-table-item">{{ $t("table.delegations.time") }}</div>
                                    </div>
                                </div>
                                <div class="del-table-row">
                                    <div class="del-thead-title">{{ $t("table.delegations.arrival") }}</div>
                                    <div class="del-table-items">
                                        <div class="del-table-item">{{ $t("table.delegations.place") }}</div>
                                        <div class="del-table-item">{{ $t("table.delegations.date") }}</div>
                                        <div class="del-table-item">{{ $t("table.delegations.time") }}</div>
                                    </div>
                                </div>
                                <div class="del-table-btns">przyciski</div>
                            </div>
                            <!-- first default row -->
                            <div class="del-tbody-1">
                                <div class="del-table-row">
                                    <div class="del-tbody-title">{{ $t("table.delegations.leave") }}</div>
                                    <div class="del-table-items">
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.place") }}</div>
                                            <div class="del-tbody-item">
                                                  <vue-google-autocomplete types="geocode" required class="delegations-input-cool" placeholder="" id="firstLeavePlace" onfocus="value = ''" v-model="defaultCostsData.firstLeavePlace"></vue-google-autocomplete>
                                                <!-- <select class="delegations-tselect" @change="checkDelegationTable" v-model="defaultCostsData.firstLeavePlace">
                                                    <option v-for="department in departmentList" :key="department.depId" :value="department.depId">{{ department.depName }}</option>
                                                </select> -->
                                            </div>
                                        </div>
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.date") }}</div>
                                            <div class="del-tbody-item">{{ delegationStartDate}} </div>
                                        </div>
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.time") }}</div>
                                            <div class="del-tbody-item">
                                                <input class="delegations-tinput-time" type="time" v-model="defaultCostsData.firstLeaveHour" @change="countAllowance" /> </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="del-table-row">
                                    <div class="del-tbody-title">{{ $t("table.delegations.arrival") }}</div>
                                    <div class="del-table-items">
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.place") }}</div>
                                            <div class="del-tbody-item">{{ newDelegation.destination}}</div>
                                        </div>
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.date") }}</div>
                                            <div class="del-tbody-item">{{ delegationStartDate }}</div>
                                        </div>
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.time") }}</div>
                                            <div class="del-tbody-item">
                                                <input class="delegations-tinput-time" type="time" v-model="defaultCostsData.firstArrivalHour" @change="countAllowance" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="del-tbody-cols">
                                    <div class="del-tbody-title">przyciski</div>
                                    <div class="del-tbody-col"></div>
                                </div>
                                <!-- <div class="del-tbody-cols">
                                    <div class="del-tbody-title">przyciski</div>
                                    <div class="del-tbody-col"></div>
                                </div>
                                <div class="del-tbody-cols">
                                    <div class="del-tbody-title">przyciski</div>
                                    <div class="del-tbody-col"></div>
                                </div> -->
                            </div>
                            <!-- second default row  -->

                            <div class="del-tbody-1">
                                <div class="del-table-row">
                                    <div class="del-tbody-title">{{ $t("table.delegations.leave") }}</div>
                                    <div class="del-table-items">
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.place") }}</div>
                                            <div class="del-tbody-item"> {{ newDelegation.destination}}</div>
                                        </div>
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.date") }}</div>
                                            <div class="del-tbody-item">{{ delegationEndDate}} </div>
                                        </div>
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.time") }}</div>
                                            <div class="del-tbody-item">
                                                <input class="delegations-tinput-time" type="time" v-model="defaultCostsData.secondLeaveHour" @change="countAllowance" /> </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="del-table-row">
                                    <div class="del-tbody-title">{{ $t("table.delegations.arrival") }}</div>
                                    <div class="del-table-items">
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.place") }}</div>
                                            <div class="del-tbody-item">
                                                <vue-google-autocomplete types="geocode" required class="delegations-input-cool" placeholder=""  id="secondArrivalPlace" onfocus="value = ''" @input="defaultCostsData.secondArrivalPlace = value"></vue-google-autocomplete>
                                                <!-- <select class="delegations-tselect" @change="checkDelegationTable" v-model="defaultCostsData.secondArrivalPlace">
                                                    <option v-for="department in departmentList" :key="department.depId" :value="department.depId">{{ department.depName }}</option>
                                                </select> -->
                                            </div>
                                        </div>
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.date") }}</div>
                                            <div class="del-tbody-item">{{ delegationEndDate }}</div>
                                        </div>
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.time") }}</div>
                                            <div class="del-tbody-item">
                                                <input class="delegations-tinput-time" type="time" v-model="defaultCostsData.secondArrivalHour" @change="countAllowance" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="del-tbody-cols">
                                    <div class="del-tbody-title">przyciski</div>
                                    <div class="del-tbody-col"></div>
                                </div>
                                <!-- <div class="del-tbody-cols">
                                    <div class="del-tbody-title">przyciski</div>
                                    <div class="del-tbody-col"></div>
                                </div>
                                <div class="del-tbody-cols">
                                    <div class="del-tbody-title">przyciski</div>
                                    <div class="del-tbody-col"></div>
                                </div> -->
                            </div>


                            <!-- rows that are added -->
                            <div class="del-tbody-1" v-for="(cost, index) in customCosts" :key="index">
                                <div class="del-table-row">
                                    <div class="del-tbody-title">{{ $t("table.delegations.leave") }}</div>
                                    <div class="del-table-items">
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.place") }}</div>
                                            <div class="del-tbody-item">
                                                <vue-google-autocomplete types="geocode" required class="delegations-input-cool" placeholder=""  :id="index + 'leave'" onfocus="value = ''" @input="customCosts[index].leavePlace = value"></vue-google-autocomplete>
                                                <!-- <input class="delegations-tinput-w" @input="checkDelegationTable" v-model="customCosts[index].leavePlace" /> -->
                                            </div>
                                        </div>
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.date") }}</div>
                                            <div class="del-tbody-item">
                                                <v-date-picker class="delegations-tinput-date" @input="checkDelegationTable" mode="single" v-model="customCosts[index].leaveDate">
                                                    <input value="customCosts[index].leaveDate" />
                                                </v-date-picker>
                                            </div>
                                        </div>
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.time") }}</div>
                                            <div class="del-tbody-item">
                                                <input class="delegations-tinput-time" type="time" v-model="customCosts[index].leaveHour" @change="checkDelegationTable" /> </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="del-table-row">
                                    <div class="del-tbody-title">{{ $t("table.delegations.arrival") }}</div>
                                    <div class="del-table-items">
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.place") }}</div>
                                            <div class="del-tbody-item">
                                                <vue-google-autocomplete types="geocode" required class="delegations-input-cool" placeholder="" :id="index +'arrival'" onfocus="value = ''" @input="customCosts[index].arrivalPlace = value"></vue-google-autocomplete>
                                                <!-- <input class="delegations-tinput-w" @input="checkDelegationTable" v-model="customCosts[index].arrivalPlace" /> -->
                                            </div>
                                        </div>
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.date") }}</div>
                                            <div class="del-tbody-item">
                                                <v-date-picker class="delegations-tinput-date" @input="checkDelegationTable" mode="single" v-model="customCosts[index].arrivalDate">
                                                    <input value="customCosts[index].arrivalDate" />
                                                </v-date-picker>
                                            </div>
                                        </div>
                                        <div class="del-tbody-wrap">
                                            <div class="del-tbody-title">{{ $t("table.delegations.time") }}</div>
                                            <div class="del-tbody-item">
                                                <input class="delegations-tinput-time" type="time" v-model="customCosts[index].arrivalHour" @change="checkDelegationTable" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="del-tbody-cols">
                                    <div class="del-tbody-title">przyciski</div>
                                    <div class="del-tbody-col"><button @click="removeRow(index)"> X </button></div>
                                </div>
                                <!-- <div class="del-tbody-cols">
                                    <div class="del-tbody-title">przyciski</div>
                                    <div class="del-tbody-col"><button @click="removeRow(index)"> X </button></div>
                                </div>
                                <div class="del-tbody-cols">
                                    <div class="del-tbody-title">przyciski</div>
                                    <div class="del-tbody-col"><button @click="removeRow(index)"> X </button></div>
                                </div> -->
                            </div>
                        </div>
                    </div>
                    
                    <!--  -->
        <!-- </div> -->
    </div>
            
</template>
<script>
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import moment from "moment"
import {
    mapGetters,
    mapActions
} from 'vuex'
export default {
    computed: {
        ...mapGetters({
            departmentList: 'depList',
            customCosts: 'getDelegationCostsList',
            defaultCostsData: 'getDefaultCostsData',
            fullExpences: 'getFullExpences',
            currencyList: 'getCurrencyList',
            newDelegation: 'getNewDelegation',
        }),
        delegationStartDate() {
            if (this.newDelegation.dates) {
                return moment(this.newDelegation.dates.start).format("DD.MM.YYYY")
            } else {
                return null
            }
        },
        delegationEndDate() {
            if (this.newDelegation.dates) {
                return moment(this.newDelegation.dates.end).format("DD.MM.YYYY")
            } else {
                return null
            }
        }
    },
    components: {VueGoogleAutocomplete },
    methods: {
        ...mapActions({
            addRow: 'addDelegationRow',
            removeRow: 'removeDelegationRow',
            checkDelegationTable: 'checkDelegationTable',
            countAllowance: 'countAllowance'
        }),

        toggleTile() {
            let el = this.$el.lastChild,
                style = window.getComputedStyle(el)
            
           const name = {el, style}
           this.$store.dispatch('toggleTile', name)
        }
    }
}
</script>

