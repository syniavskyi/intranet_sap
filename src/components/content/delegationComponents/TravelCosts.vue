<template>
    <div class="delegations-tile" refs="travelCosts">
        <div  class="delegations-tile-header">
            <div v-on:click.self="toggleTile" class="delegations-tile-title">
                {{ $t("header.travelCosts") }}
                <button class="del-add-row"  @click="addCostRow"> {{ $t("button.addRow") }} </button>
            </div>
            <div class="tile-underscore"></div>
        </div>
        <div class="delegations-tile-content">
            <div class="delegations-table-travel-wrapper" id="delegations-table">
                <div class="delegations-table-2">
                    <div class="del-thead-travel">
                        <div class="del-thead-item-travel-l">{{ $t("table.delegations.docDate") }}</div>
                        <div class="del-thead-item-travel">{{ $t("table.delegations.company") }}</div>
                        <div class="del-thead-item-travel">{{ $t("table.delegations.docNo") }}</div>
                        <div class="del-thead-item-travel-xs">{{ $t("table.delegations.return") }}?</div>
                        <div class="del-thead-item-travel-xl">{{ $t("table.delegations.transport") }}</div>
                        <div class="del-thead-item-travel-m">{{ $t("table.delegations.paymentType") }}</div>
                        <div class="del-thead-item-travel">{{ $t("table.delegations.kilometers") }}</div>
                        <div class="del-thead-item-travel-s">{{ $t("table.delegations.currency") }}</div>
                        <div class="del-thead-item-travel">{{ $t("table.delegations.amount") }}</div>
                        <div class="del-thead-item-travel">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                        <div class="del-thead-item-travel-s"></div>
                    </div>
                    <div class="del-tbody-2-travel" v-for="(cost, index) in travelCosts" :key="index">
                        <div class="del-tbody2-item-travel-l">
                            <div class="del-tbody2-travel-item-title">{{ $t("table.delegations.docDate") }}</div>
                            <div class="del-tbody2-item-txt" @mouseover="setOverflow" @mouseout="outOverflow">
                                <v-date-picker class="cd-tdate" mode="single" @change="getTravelRate(index)" v-model="cost.docDate">
                                    <input value="otherCosts[index].docDate" />
                                </v-date-picker>
                            </div>
                            <div class="del-tfoot2-travel">&nbsp;</div>
                        </div>
                        <div class="del-tbody2-item-travel">
                            <div class="del-tbody2-travel-item-title">{{ $t("table.delegations.company") }}</div>
                            <div class="del-tbody2-item-txt">
                                <div class="del-tbody-item-wrap">
                                    <input class="cd-tinput" @input="checkTravelFields" v-model="cost.company" />
                                    <span class="cd-span"/>
                                </div>
                            </div>
                            <div class="del-tfoot2-travel">&nbsp;</div>
                        </div>
                        <div class="del-tbody2-item-travel">
                            <div class="del-tbody2-travel-item-title">{{ $t("table.delegations.docNo") }}</div>
                            <div class="del-tbody2-item-txt">
                                <div class="del-tbody-item-wrap">
                                    <input class="cd-tinput" @input="checkTravelFields" v-model="cost.docNo" />
                                    <span class="cd-span"/>
                                </div>
                            </div>
                            <div class="del-tfoot2-travel">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                        </div>
                        <div class="del-tbody2-item-travel-xs">
                            <div class="del-tbody2-travel-item-title">{{ $t("table.delegations.return") }}?</div>
                            <div class="del-tbody2-item-txt">
                                <label class="checkbox-wrap">
                                    <input type="checkbox" class="checkbox-new" @change="updateTravelCosts" v-model="cost.payback" />
                                    <div class="checkbox-in"></div>
                                </label>
                            </div>
                            <div class="del-tfoot2-travel">{{ totalCostsInCurr.trvPayback }}</div>
                            <!-- del-tfoot-travel-s -->
                        </div>
                        <div class="del-tbody2-item-travel-xl">
                            <div class="del-tbody2-travel-item-title">{{ $t("table.delegations.transport") }}</div>
                            <div class="del-tbody2-item-txt">
                                <select class="cd-tselectm" :id="index" v-model="cost.transport" @change="setFieldsValues(cost)">
                                    <option v-for="transport in transportList" :key="transport.Key" :value="transport.Key">{{ transport.Value }}</option>
                                </select>
                                <div class="del-div-tcool">
                                    <input required :disabled="hideLicencePlateNo(cost)" :class="[{ 'cd-tinput-dis': hideLicencePlateNo(cost) },  'cd-tinput', 'del-tinput-sfont']" @change="checkTravelFields" v-model="cost.licencePlateNo" />
                                    <span class="cd-span"/>
                                    <label class="cd-tslabel" v-if="!cost.licencePlateNo">{{ $t("label.registrationNo") }}</label>
                                </div>
                            </div>
                            <div class="del-tfoot2-travel">&nbsp;</div>
                        </div>

                        <div class="del-tbody2-item-travel-m">
                            <div class="del-tbody2-travel-item-title">{{ $t("table.delegations.paymentType") }}</div>
                            <div class="del-tbody2-item-txt">
                                <select :id="index" :disabled="disableReturnType(cost)" :class="[{ 'cd-tselects-dis': disableReturnType(cost) },  'cd-tselects']" v-model="cost.flatRate" @change="valuesForReturnType(cost)">
                                    <option disabled selected value></option>
                                    <option key="true" :value="true">{{ $t("table.delegations.flatRate") }}</option>
                                    <option key="false" :value="false">{{ $t("table.delegations.noFlatRate") }}</option>
                                </select>
                            <!-- </div>
                            <div class="del-tbody2-item-txt"> -->
                                <select :disabled="disableEngineCapacity(cost)" :class="[{ 'cd-tselects-dis': disableEngineCapacity(cost) },  'cd-tselects']" v-model="cost.engineCapacity" @change="updateTravelCosts">
                                    <option disabled selected value></option>
                                    <!-- true is for more than 900 cm, false for less -->
                                    <option key="false" :value="false">{{ $t("label.capacityLess") }}<sup>3</sup></option>
                                    <option key="true" :value="true">{{ $t("label.capacityMore") }}<sup>3</sup></option>
                                </select>
                            </div>
                            <div class="del-tfoot2-travel">&nbsp;</div>
                        </div>
                        <div class="del-tbody2-item-travel">
                            <div class="del-tbody2-travel-item-title">{{ $t("table.delegations.kilometers") }}?</div>
                            <div class="del-tbody2-item-txt">
                                <div class="del-tbody-item-wrap">
                                    <input :disabled="disableKilometers(cost)" :class="[{ 'cd-tinput-dis': disableKilometers(cost) },  'cd-tinput']" type="number" @change="updateTravelCosts" v-model="cost.kilometers" />
                                    <span class="cd-span"/>
                                </div>
                            </div>
                            <div class="del-tfoot2-travel">&nbsp;</div>
                        </div>
                        <div class="del-tbody2-item-travel-s">
                            <div class="del-tbody2-travel-item-title">{{ $t("table.delegations.currency") }}</div>
                            <div class="del-tbody2-item-txt">
                                <select :disabled="disableCostAmount(cost)" :class="[{ 'cd-tselectxs-dis': disableCostAmount(cost) },  'cd-tselectxs']" v-model="travelCosts[index].currency" @change="getTravelRate(index)">
                                    <option v-for="currency in currencyList" :key="currency.id" :value="currency.id">{{ currency.id }}</option>
                                </select>
                            </div>
                            <div class="del-tfoot2-travel">---</div>
                        </div>
                        <!-- acc -accomodation, trv - travel - oth - others -->
                        <div class="del-tbody2-item-travel">
                            <div class="del-tbody2-travel-item-title">{{ $t("table.delegations.amount") }}</div>
                            <div class="del-tbody2-item-txt">
                                <div class="del-tbody-item-wrap">
                                    <input :disabled="disableCostAmount(cost)" :class="[{ 'cd-tinput-dis': disableCostAmount(cost) },  'cd-tinput']" type="number" min="0" @input="updateTravelCosts" v-model="cost.amount" />
                                    <span class="cd-span"/>
                                </div>
                            </div>
                            <div class="del-tfoot2-travel">&nbsp;</div>
                        </div>

                        <div class="del-tbody2-item-travel">
                            <div class="del-tbody2-travel-item-title">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                            <div class="del-tbody2-item-txt">{{cost.totalAmountCurr}}</div>
                            <div class="del-tfoot2-travel">
                                <p>{{totalCostsInCurr.travel }}</p>
                            </div>
                        </div>
                        <div class="del-tbody2-item-travel-s">
                            <div class="del-tbody2-travel-item-title"></div>
                            <div class="del-tbody2-item-txt">
                                <button class="btn-row" @click="removeCostRow(index)">{{ $t("button.delete") }}</button>
                            </div>
                            <div class="del-tfoot2-travel">&nbsp;</div>
                        </div>
                    </div>
                </div>
                <div class="del-table-travel-footer">
                    <div class="del-tbody-2 del-tbody-2-travel">
                        <div class="del-tbody2-item-wfoot-cost"/>
                        <div class="del-tbody2-item-cost">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                        <div class="del-tbody2-item-cost-s">{{ totalCostsInCurr.trvPayback }}</div>
                        <div class="del-tbody2-item-cost-xw">---</div>
                        <div class="del-tbody2-item-cost-w">---</div>
                        <div class="del-tbody2-item-cost-m">---</div>
                        <div class="del-tbody2-item-cost-xs">---</div>
                        <div class="del-tbody2-item-cost-m">---</div>
                        <div class="del-tbody2-item-cost-m">{{totalCostsInCurr.travel}}</div>
                        <div class="del-tbody2-item-cost-xs">---</div>
                    </div>
                </div>
            </div>
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
    updated() {
        this.$nextTick(() => {this.calcHeight(this.$el.lastChild, this.$el.lastChild.firstChild).then(height => {
                    this.$el.lastChild.style.height = height
                    this.$el.lastChild.style.opacity = "1"
                })})
    },
    mounted() {
        this.$nextTick(function() {
            window.addEventListener('resize', this.getWindowWidth);
            this.getWindowWidth()
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
        setOverflow() {
            this.$store.dispatch("setVisibleOverflow", this.$el)
        },
        outOverflow() {
            this.$store.dispatch("setHiddenOverflow", this.$el)
        },
        setFieldsValues(cost) {
            // type false  = not flat rate (kilometrówka), type  true = flat rate (ryczałt)
            cost.flatRate = null
            cost.kilometers = 0
            cost.engineCapacity = (cost.transport === "COMCAR") ? true : null
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
                cost.engineCapacity = (cost.transport === "COMCAR") ? true : null
            }
            this.checkTravelFields()
        },
        disableReturnType(cost) {
            const type = cost.transport
            return (type === "COMCAR" || type === "PRVCAR" || type === "MOTOR" || type === "MOPED") ? false : true
        },
        disableCostAmount(cost) {
            const type = cost.transport
            return (type === "COMCAR" || type === "PRVCAR" || type === "MOTOR" || type === "MOPED") ? true : false
        },
        disableEngineCapacity(cost) {
            const type = cost.transport
            return (type === "PRVCAR" && cost.flatRate == false) ? false : true
        },
        disableKilometers(cost) {
            const type = cost.flatRate
            if (type === "COMCAR" || type === "PRVCAR" || type === "MOTOR" || type === "MOPED") {
                return (type == false) ? false : true
            } else {
                return false
            }
        },
        hideLicencePlateNo(cost) {
            const type = cost.transport
            return (type === "COMCAR" || type === "PRVCAR" || type === "MOTOR" || type === "MOPED") ? false : true
        },

        toggleTile() {
            let el = this.$el.lastChild,
                elChild = el.firstChild

           const name = {el, elChild}
           this.$store.dispatch('toggleTile', name)
        },

        calcHeight(el, elChild) {
            const name = {el, elChild}
            let height = this.$store.dispatch('calcHeight', name)
            return height
        },

        addCostRow() {
            let el = this.$el.lastChild.style.height
            !el || el ? el = "auto" : ""
            this.$store.dispatch('addTravelCostRow')
        },

        removeCostRow() {
            this.$el.lastChild.style.height = "auto"
            this.$store.dispatch('removeTravelCostRow')
        },

        getWindowWidth() {
            this.windowWidth = document.documentElement.clientWidth
            let el = this.$el
            const name = {el}
            this.$store.dispatch('checkWidthAndToggle', name)
        }
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.getWindowWidth)
    }
}
</script>

