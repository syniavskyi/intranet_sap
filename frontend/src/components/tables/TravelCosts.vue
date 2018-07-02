<template>
<div class="delegations-tile" refs="travelCosts">
    <!-- <input id="delegations-row-3" class="documents-tiles-row-header-input" type="checkbox">
    <label class="delegations-tiles-row-header" for="delegations-row-3"> -->
            <div @click="toggleTile" class="delegations-tile-header">
            <div class="delegations-tile-title">
                {{ $t("header.travelCosts") }}
                <button class="del-add-row" @click.prevent="toggleTile" @click="addCostRow"> dodaj wiersz </button>
            </div>
            <div class="delegations-tile-underscore"></div>
        </div>
        <!-- </label>
    <div class="delegations-tile-wrap"> -->

        <div class="delegations-tile-content">
            
            <div class="delegations-table-wrapper" id="delegations-table">
                <div class="delegations-table-2">
                    <div class="del-thead-2">
                        <div class="del-thead-item-cost">{{ $t("table.delegations.docDate") }}</div>
                        <div class="del-thead-item-cost-w">{{ $t("table.delegations.company") }}</div>
                        <div class="del-thead-item-cost">{{ $t("table.delegations.docNo") }}</div>
                        <div class="del-thead-item-cost-s">{{ $t("table.delegations.return") }}?</div>
                        <div class="del-thead-item-cost-xw">{{ $t("table.delegations.transport") }}</div>
                        <div class="del-thead-item-cost">{{ $t("table.delegations.paymentType") }}</div>
                        <div class="del-thead-item-cost">{{ $t("table.delegations.kilometers") }}</div>
                        <div class="del-thead-item-cost-s">{{ $t("table.delegations.currency") }}</div>
                        <div class="del-thead-item-cost">{{ $t("table.delegations.amount") }}</div>
                        <div class="del-thead-item-cost">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                        <div class="del-thead-item-cost">przyciski</div>
                    </div>
                    <div class="del-tbody-2" v-for="(cost, index) in travelCosts" :key="index">
                        <div class="del-tbody2-item-cost">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.docDate") }}</div>
                            <div class="del-tbody2-item-txt">
                                <v-date-picker class="delegations-tinput-date" mode="single" @change="getTravelRate(index)" v-model="cost.docDate">
                                    <input value="otherCosts[index].docDate" />
                                </v-date-picker>
                            </div>
                            <div class="del-tfoot2"></div>
                        </div>
                        <div class="del-tbody2-item-cost-w">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.company") }}</div>
                            <div class="del-tbody2-item-txt">
                                <input class="delegations-tinput" @input="checkTravelFields" v-model="cost.company" />
                            </div>
                            <div class="del-tfoot2"></div>
                        </div>
                        <div class="del-tbody2-item-cost">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.docNo") }}</div>
                            <div class="del-tbody2-item-txt">
                                <input class="delegations-tinput" @input="checkTravelFields" v-model="cost.docNo" />
                            </div>
                            <div class="del-tfoot2">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                        </div>
                        <div class="del-tbody2-item-cost-s">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.return") }}?</div>
                            <div class="del-tbody2-item-txt">
                                <input type="checkbox" @change="updateTravelCosts" v-model="cost.payback" />
                            </div>
                            <div class="del-tfoot2-s">{{ totalCostsInCurr.trvPayback }}</div>
                        </div>
                        <div class="del-tbody2-item-cost-xw">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.transport") }}</div>
                            <div class="del-tbody2-item-txt">
                                <select class="delegations-tselect" :id="index" v-model="cost.transport" @change="setFieldsValues(cost)">
                                    <option v-for="transport in transportList" :key="transport.id" :value="transport.id">{{ transport.name }}</option>
                                </select>
                                <p class="table-p">{{ $t("label.registrationNo") }}</p>
                                <input :disabled="hideLicencePlateNo(cost)" :class="[{ 'delegations-tinput-disabled': hideLicencePlateNo(cost) },  'delegations-tinput']" @change="checkTravelFields" v-model="cost.licencePlateNo" />
                            </div>
                            <div class="del-tfoot2"></div>
                        </div>

                        <div class="del-tbody2-item-cost">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.paymentType") }}</div>
                            <div class="del-tbody2-item-txt">
                                <select :id="index" :disabled="disableReturnType(cost)" :class="[{ 'delegations-tselect-s-disabled': disableReturnType(cost) },  'delegations-tselect-s']" v-model="cost.flatRate" @change="valuesForReturnType(cost)">
                                    <option disabled selected value></option>
                                    <option key="true" :value="true">{{ $t("table.delegations.flatRate") }}</option>
                                    <option key="false" :value="false">{{ $t("table.delegations.noFlatRate") }}</option>
                                </select>
                                <!-- </div>
                            <div class="del-tbody2-item-txt"> -->
                                <select :disabled="disableEngineCapacity(cost)" :class="[{ 'delegations-tselect-s-disabled': disableEngineCapacity(cost) },  'delegations-tselect-s']" v-model="cost.engineCapacity" @change="updateTravelCosts">
                                    <option disabled selected value></option>
                                    <!-- true is for more than 900 cm, false for less -->
                                    <option key="false" :value="false">{{ $t("label.capacityLess") }}<sup>3</sup></option>
                                    <option key="true" :value="true">{{ $t("label.capacityMore") }}<sup>3</sup></option>
                                </select>
                            </div>
                            <div class="del-tfoot2"></div>
                        </div>
                        <div class="del-tbody2-item-cost">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.kilometers") }}?</div>
                            <div class="del-tbody2-item-txt">
                                <!-- class="delegations-tinput-s-disabled" :disabled="hideKilometers" -->
                                <input :disabled="disableKilometers(cost)" :class="[{ 'delegations-tinput-s-disabled': disableKilometers(cost) },  'delegations-tinput-s']" type="number" @change="updateTravelCosts" v-model="cost.kilometers" />
                            </div>
                            <div class="del-tfoot2"></div>
                        </div>
                        <div class="del-tbody2-item-cost-s">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.currency") }}</div>
                            <div class="del-tbody2-item-txt">
                                <select :disabled="disableCostAmount(cost)" :class="[{ 'delegations-tselect-s-disabled': disableCostAmount(cost) },  'delegations-tselect-s']" v-model="travelCosts[index].currency" @change="getTravelRate(index)">
                                    <option v-for="currency in currencyList" :key="currency.id" :value="currency.id">{{ currency.id }}</option>
                                </select>
                            </div>
                            <div class="del-tfoot2">---</div>
                        </div>
                        <!-- acc -accomodation, trv - travel - oth - others -->
                        <div class="del-tbody2-item-cost">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.amount") }}</div>
                            <div class="del-tbody2-item-txt">
                                <input :disabled="disableCostAmount(cost)" :class="[{ 'delegations-tinput-s-disabled': disableCostAmount(cost) },  'delegations-tinput-s']" type="number" min="0" @input="updateTravelCosts" v-model="cost.amount" />
                            </div>
                            <div class="del-tfoot2"></div>
                        </div>

                        <div class="del-tbody2-item-cost">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                            <div class="del-tbody2-item-txt">{{cost.totalAmountCurr}}</div>
                            <div class="del-tfoot2">
                                <p>{{totalCostsInCurr.travel }}</p>
                            </div>
                        </div>
                        <div class="del-tbody2-item-cost">
                            <div class="del-tbody2-item-txt">
                                <button @click="removeCostRow(index)"> X </button>
                            </div>
                            <div class="del-tfoot2"></div>
                        </div>
                    </div>
                </div>
                <div class="delegations-table-2 del-table-footer">
                    <div class="del-tbody-2">
                        <div class="del-tbody2-item-wfoot-cost"></div>
                        <div class="del-tbody2-item-cost">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                        <div class="del-tbody2-item-cost-s">{{ totalCostsInCurr.trvPayback }}</div>
                        <div class="del-tbody2-item-cost-xw">---</div>
                        <div class="del-tbody2-item-cost">---</div>
                        <div class="del-tbody2-item-cost">---</div>
                        <div class="del-tbody2-item-cost-s">---</div>
                        <div class="del-tbody2-item-cost">---</div>
                        <div class="del-tbody2-item-cost">{{totalCostsInCurr.travel }}</div>
                        <div class="del-tbody2-item-cost">---</div>
                    </div>
                </div>
            </div>
        <!-- </div> -->
    </div>
</div>
</template>
<script>
import {
    mapGetters,
    mapActions
} from 'vuex';
export default {
    data() {
        return {
            showCarData: false,
            showEngineCapacity: false,
            hideKilometers: false,
            hideAmount: false
        }
    },
    computed: {
        ...mapGetters({
            currencyList: 'getCurrencyList',
            travelCosts: 'getTravelCostData',
            totalCosts: 'getTotalCosts',
            totalCostsInCurr: 'getTotalCostsInCurr',
            transportList: "getTransportList",
            newDelegation: "getNewDelegation"
        })
    },
    methods: {
        ...mapActions({
            checkTravelFields: 'checkTravelFields',
            addCostRow: 'addTravelCostRow',
            removeCostRow: 'removeTravelCostRow',
            updateTravelCosts: 'countTravelCosts',
            getTravelRate: 'getTravelRate'
        }),
        setFieldsValues(cost) {
            // type false  = not flat rate (kilometrówka), type  true = flat rate (ryczałt)
            cost.flatRate = null
            cost.kilometers = 0
            cost.engineCapacity = (cost.transport === "companyCar") ? true : null
            cost.amount = 0
            cost.currency = null

            this.checkTravelFields()
        },
        valuesForReturnType(cost) {
            if (cost.flatRate == true) {
                cost.engineCapacity = 0
                cost.kilometers = 0
                cost.amount = 0
                cost.currency = null
            } else {
                cost.engineCapacity = (cost.transport === "companyCar") ? true : null
            }
            this.checkTravelFields()
        },
        disableReturnType(cost) {
            const type = cost.transport
            return (type === "companyCar" || type === "privateCar" || type === "motocycle" || type === "moped") ? false : true
        },
        disableCostAmount(cost) {
            const type = cost.transport
            return (type === "companyCar" || type === "privateCar" || type === "motocycle" || type === "moped") ? true : false
        },
        disableEngineCapacity(cost) {
            const type = cost.transport
            return (type === "privateCar" && cost.flatRate == false) ? false : true
        },
        disableKilometers(cost) {
            const type = cost.flatRate
            if (type === "companyCar" || type === "privateCar" || type === "motocycle" || type === "moped") {
                return (type == false) ? false : true
            } else {
                return false
            }
        },
        hideLicencePlateNo(cost) {
            const type = cost.transport
            return (type === "companyCar" || type === "privateCar" || type === "motocycle" || type === "moped") ? false : true
        },

        toggleTile() {
            let el = this.$el.lastChild,
                style = window.getComputedStyle(el)
            
           const name = {el, style}
           this.$store.dispatch('toggleTile', name)
        }

    }
}
</script>

