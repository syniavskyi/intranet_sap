<template>
        <div class="delegations-tile">
            <div class="delegations-tile-header">
                <div @click.self="toggleTile" class="delegations-tile-title">
                    {{ $t("header.accomodationCosts") }}
                    <button class="del-add-row" @click="addCostRow"> {{ $t("button.addRow") }} </button>
                </div>
                <div class="tile-underscore"></div>
            </div>
            <div class="delegations-tile-content">
                <div class="delegations-table-wrapper">
                    <div class="delegations-table-2">
                        <div class="del-thead-2">
                            <div class="del-thead-item-scost">{{ $t("table.delegations.flatRate") }}?</div>
                            <div class="del-thead-item-scost">{{ $t("table.delegations.docDate") }}</div>
                            <div class="del-thead-item-scost">{{ $t("table.delegations.company") }}</div>
                            <div class="del-thead-item-scost">{{ $t("table.delegations.docNo") }}</div>
                            <div class="del-thead-item-scost">{{ $t("table.delegations.return") }}?</div>
                            <div class="del-thead-item-scost">{{ $t("table.delegations.currency") }}</div>
                            <div class="del-thead-item-scost">{{ $t("table.delegations.amount") }}</div>
                            <div class="del-thead-item-scost">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                            <div class="del-thead-item-scost"></div>
                        </div>
                        <div class="del-tbody-2 del-tbody-2-accom" v-for="(cost, index) in accomodationCosts" :key="index">
                            <div class="del-tbody2-item-scost">
                                <div class="del-tbody2-item-title">{{ $t("table.delegations.flatRate") }}?</div>
                                <div class="del-tbody2-item-txt">
                                    <label class="checkbox-wrap">
                                        <input class="checkbox-new" type="checkbox" @change="checkAccomodationFields" v-model="cost.flatRate" />
                                        <div class="checkbox-in"></div>
                                    </label>
                                    <div class="del-div-tcool" v-show="hideAccFields(cost)">
                                        <input required class="delegations-tinput-s del-tinput-sfont"  v-model="cost.flatRateDays" @input="countAccFlatRate(index)"/>
                                        <span class="del-div-bar"></span>
                                        <label class="delegations-tlabel-cool" v-show="hideAccFields(cost)">{{ $t("table.delegations.days") }}</label>
                                    </div>
                                </div>
                                <div class="del-tfoot2">&nbsp;</div>
                            </div>
                            <div class="del-tbody2-item-scost">
                                <div class="del-tbody2-item-title">{{ $t("table.delegations.docDate") }}</div>
                                <div class="del-tbody2-item-txt" @mouseover="setOverflow" @mouseout="outOverflow">
                                    <v-date-picker popover-direction="top" :class="[{ 'delegations-tinput-date-disabled': hideAccFields(cost) },  'delegations-tinput-date']"  mode="single" @input="getAccCostRate(index)" v-model="cost.docDate">
                                        <input :disabled="hideAccFields(cost)" value="accomodationCosts[index].docDate" />
                                    </v-date-picker>
                                </div>
                                <div class="del-tfoot2">&nbsp;</div>
                            </div>
                            <div class="del-tbody2-item-scost">
                                <div class="del-tbody2-item-title">{{ $t("table.delegations.company") }}</div>
                                <div class="del-tbody2-item-txt">
                                    <div class="del-tbody-item-wrap">
                                        <input :disabled="hideAccFields(cost)" :class="[{ 'delegations-tinput-disabled': hideAccFields(cost) },  'delegations-tinput']" @input="checkAccomodationFields" v-model="cost.company" />
                                        <span class="del-div-bar"></span>
                                    </div>
                                </div>
                                <div class="del-tfoot2">&nbsp;</div>
                            </div>
                            <div class="del-tbody2-item-scost">
                                <div class="del-tbody2-item-title">{{ $t("table.delegations.docNo") }}</div>
                                <div class="del-tbody2-item-txt">
                                    <div class="del-tbody-item-wrap">
                                        <input :disabled="hideAccFields(cost)" :class="[{ 'delegations-tinput-disabled': hideAccFields(cost) },  'delegations-tinput']" @input="checkAccomodationFields" v-model="cost.docNo" />
                                        <span class="del-div-bar"></span>
                                    </div>
                                </div>
                                <div class="del-tfoot2">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                            </div>
                            <div class="del-tbody2-item-scost">
                                <div class="del-tbody2-item-title">{{ $t("table.delegations.return") }}?</div>
                                <div class="del-tbody2-item-txt">
                                    <label class="checkbox-wrap">
                                        <input :disabled="hideAccFields(cost)" type="checkbox" @change="updateAccCosts" v-model="cost.payback" />
                                        <div class="checkbox-in"></div>
                                    </label>
                                </div>
                                <div class="del-tfoot2">{{ totalCostsInCurr.accPayback }}</div>
                            </div>
                            <div class="del-tbody2-item-scost">
                                <div class="del-tbody2-item-title">{{ $t("table.delegations.currency") }}</div>
                                <div class="del-tbody2-item-txt">
                                    <select :disabled="hideAccFields(cost)" :class="[{ 'delegations-tselect-s-disabled': hideAccFields(cost) },  'delegations-tselect-s']" v-model="accomodationCosts[index].currency" @change="getAccCostRate(index)">
                                        <option v-for="currency in currencyList" :key="currency.id" :value="currency.id">{{ currency.id }}</option>
                                    </select>
                                </div>
                                <div class="del-tfoot2">---</div>
                            </div>
                            <!-- acc -accomodation, trv - travel - oth - others -->
                            <div class="del-tbody2-item-scost">
                                <div class="del-tbody2-item-title">{{ $t("table.delegations.amount") }} </div>
                                <div class="del-tbody2-item-txt">
                                    <div class="del-tbody-item-wrap">
                                        <input :disabled="hideAccFields(cost)" :class="[{ 'delegations-tinput-disabled': hideAccFields(cost) },  'delegations-tinput']" type="number" min="0" @change="getAccCostRate(index)" v-model="cost.amount" />
                                        <span class="del-div-bar"></span>
                                    </div>
                                </div>
                                <div class="del-tfoot2">&nbsp;</div>
                            </div>
                            <div class="del-tbody2-item-scost">
                                <div class="del-tbody2-item-title">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                                <div class="del-tbody2-item-txt">{{cost.totalAmountInCurr}}</div>
                                <div class="del-tfoot2">
                                    <p>{{totalCostsInCurr.accomodation }}</p>
                                </div>
                            </div>
                            <div class="del-tbody2-item-scost">
                                <div class="del-tbody2-item-title"></div>
                                <div class="del-tbody2-item-txt">
                                    <button class="btn-delete-row" @click="removeCostRow(index)">{{ $t("button.delete") }}</button>
                                </div>
                                <div class="del-tfoot2">&nbsp;</div>
                            </div>
                        </div>
                    </div>
                    <div class="delegations-table-2 del-table-footer">
                        <div class="del-tbody-2">
                            <div class="del-tbody2-item-xwfoot-scost"></div>
                            <div class="del-tbody2-item-scost">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                            <div class="del-tbody2-item-scost">{{ totalCostsInCurr.accPayback }}</div>
                            <div class="del-tbody2-item-scost">---</div>
                            <div class="del-tbody2-item-scost"></div>
                            <div class="del-tbody2-item-scost">{{totalCostsInCurr.accomodation }}</div>
                            <div class="del-tbody2-item-scost"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters({
            currencyList: 'getCurrencyList',
            accomodationCosts: 'getAccomodationCostData',
            totalCosts: 'getTotalCosts',
            newDelegation: 'getNewDelegation',
            totalCostsInCurr: 'getTotalCostsInCurr'

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
            checkAccomodationFields: 'checkAccomodationFields',
            addCostRow: 'addAccCostRow',
            removeCostRow: 'removeAccCostRow',
            countAccFlatRate: 'countAccFlatRate',
            getAccCostRate: 'getAccCostRate',
            updateAccCosts: 'countAccomodationCosts'

        }),
        hideAccFields: cost => { return (cost.flatRate == false) ? false : true },
        /* Adding and hiding overflow of tile content to display datepicker  */
        setOverflow() {
            this.$store.dispatch("setVisibleOverflow", this.$el)
        },
        outOverflow() {
            this.$store.dispatch("setHiddenOverflow", this.$el)
        },
        /* Accordion tiles showing and hiding content when clicking on tile header */
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
            this.$store.dispatch('addAccCostRow')
        },

        removeCostRow() {
            this.$el.lastChild.style.height = "auto"
            this.$store.dispatch('removeAccCostRow')
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