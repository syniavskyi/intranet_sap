<template>
    <div class="delegations-tile">
        <div class="delegations-tile-header">
            <div @click.self="toggleTile" class="delegations-tile-title">
                {{ $t("header.otherCosts") }}
                <button class="del-add-row" @click="addCostRow"> {{ $t("button.addRow") }} </button>
            </div>
            <div class="delegations-tile-underscore"></div>
        </div>
        <div class="delegations-tile-content">
            <div class="delegations-table-wrapper">
                <div class="delegations-table-2">
                    <div class="del-thead-2">
                        <div class="del-thead-item-scost">{{ $t("table.delegations.docDate") }}</div>
                        <div class="del-thead-item-scost">{{ $t("table.delegations.company") }}</div>
                        <div class="del-thead-item-scost">{{ $t("table.delegations.docNo") }}</div>
                        <div class="del-thead-item-scost">{{ $t("table.delegations.return") }}?</div>
                        <div class="del-thead-item-scost">{{ $t("table.delegations.currency") }}</div>
                        <div class="del-thead-item-scost">{{ $t("table.delegations.amount") }}</div>
                        <div class="del-thead-item-scost">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                        <div class="del-thead-item-scost"></div>
                    </div>
                    <div class="del-tbody-2" v-for="(cost, index) in otherCosts" :key="index">
                        <div class="del-tbody2-item-scost">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.docDate") }}</div>
                            <div class="del-tbody2-item-txt" @mouseover="setOverflow" @mouseout="outOverflow">
                                <v-date-picker popover-direction="top" class="delegations-tinput-date" mode="single" @change="getOtherCostRate(index)" v-model="cost.docDate">
                                    <input value="otherCosts[index].docDate" />
                                </v-date-picker>
                            </div>
                            <div class="del-tfoot2">&nbsp;</div>
                        </div>
                        <div class="del-tbody2-item-scost">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.company") }}</div>
                            <div class="del-tbody2-item-txt">
                                <div class="del-tbody-item-wrap">
                                    <input class="delegations-tinput" @input="checkOtherCostsFields" v-model="cost.company" />
                                    <span class="del-div-bar"></span>
                                </div>
                            </div>
                            <div class="del-tfoot2">&nbsp;</div>
                        </div>
                        <div class="del-tbody2-item-scost">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.docNo") }}</div>
                            <div class="del-tbody2-item-txt">
                                <div class="del-tbody-item-wrap">
                                    <input class="delegations-tinput" v-model="cost.docNo"/>
                                    <span class="del-div-bar"></span>
                                </div>
                            </div>
                            <div class="del-tfoot2">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                        </div>
                        <div class="del-tbody2-item-scost">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.return") }}?</div>
                            <div class="del-tbody2-item-txt">
                                <label class="checkbox-wrap">
                                    <input type="checkbox" @change="updateOtherCosts" v-model="cost.payback" />
                                    <div class="checkbox-in"></div>
                                </label>
                            </div>
                            <div class="del-tfoot2">{{ totalCostsInCurr.othPayback }}</div>
                        </div>
                        <div class="del-tbody2-item-scost">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.currency") }}</div>
                            <div class="del-tbody2-item-txt">
                                <select class="delegations-tselect-s" v-model="otherCosts[index].currency" @change="getOtherCostRate(index)">
                                    <option v-for="currency in currencyList" :key="currency.id" :value="currency.id">{{ currency.id }}</option>
                                </select>
                            </div>
                            <div class="del-tfoot2">---</div>
                        </div>
                        <!-- acc -accomodation, trv - travel - oth - others -->
                        <div class="del-tbody2-item-scost">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.amount") }}</div>
                            <div class="del-tbody2-item-txt">
                                <div class="del-tbody-item-wrap">
                                    <input class="delegations-tinput" type="number" min="0" @change="getOtherCostRate(index)" v-model="cost.amount" />
                                    <span class="del-div-bar"></span>
                                </div>
                            </div>
                            <div class="del-tfoot2">&nbsp;</div>
                        </div>
                        <div class="del-tbody2-item-scost">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                            <div class="del-tbody2-item-txt">{{cost.totalAmountCurr}}</div>
                            <div class="del-tfoot2">
                                <p>{{totalCostsInCurr.others }}</p>
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
                        <div class="del-tbody2-item-wfoot-scost"></div>
                        <div class="del-tbody2-item-scost">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                        <div class="del-tbody2-item-scost">{{ totalCostsInCurr.othPayback }}</div>
                        <div class="del-tbody2-item-scost">---</div>
                        <div class="del-tbody2-item-scost"></div>
                        <div class="del-tbody2-item-scost">{{totalCostsInCurr.others }}</div>
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
            otherCosts: 'getOtherCostData',
            totalCosts: 'getTotalCosts',
            totalCostsInCurr: 'getTotalCostsInCurr',
            newDelegation: 'getNewDelegation',
        })
    },
    updated() {
        this.$nextTick(() => {this.calcHeight(this.$el.lastChild, this.$el.lastChild.firstChild).then(height => {
                this.$el.lastChild.style.height = height
                this.$el.lastChild.style.opacity = "1"
            })
        })
    },
    mounted() {
        this.$nextTick(function() {
            window.addEventListener('resize', this.getWindowWidth);
            this.getWindowWidth()
        })
    },
    methods: {
        ...mapActions({
            checkOtherCostsFields: 'checkOtherCostsFields',
            addCostRow: 'addOtherCostRow',
            removeCostRow: 'removeOtherCostRow',
            updateOtherCosts: 'countOtherCosts',
            getOtherCostRate: 'getOtherCostRate'
        }),
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
            this.$store.dispatch('addOtherCostRow')
        },
        removeCostRow() {
            this.$el.lastChild.style.height = "auto"
            this.$store.dispatch('removeOtherCostRow')
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