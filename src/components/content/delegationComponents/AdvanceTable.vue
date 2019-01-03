<template>
    <div class="delegations-tile">
        <div  class="delegations-tile-header">
            <div @click.self="toggleTile" class="delegations-tile-title">
                {{ $t("header.advance") }}
                <button class="del-add-row" @click="addAdvanceRow"> {{ $t("button.addRow") }} </button>
            </div>
            <div class="delegations-tile-underscore"></div>
        </div>
        <div class="delegations-tile-content">
            <div class="delegations-table-wrapper">
                <div class="delegations-table-2 del-table-2">
                    <div class="del-thead-2">
                        <div class="del-thead-item-adv">{{ $t("table.delegations.advanceDate") }}</div>
                        <div class="del-thead-item-adv">{{ $t("table.delegations.advanceCurrency") }}</div>
                        <div class="del-thead-item-adv">{{ $t("table.delegations.advanceAmount") }}</div>
                        <div class="del-thead-item-adv">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                        <div class="del-thead-item-adv"></div>
                    </div>
                    <div class="del-tbody-2" v-for="(advance, index) in advanceData" :key="index">
                        <div class="del-tbody2-item-adv">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.advanceDate") }}</div>
                            <div class="del-tbody2-item-txt" @mouseover="setOverflow" @mouseout="outOverflow">
                                <v-date-picker  class="delegations-tinput-date" mode="single" @input="getAdvanceRate(index)" v-model="advance.date">
                                    <input  value="otherCosts[index].docDate" />
                                </v-date-picker>
                            </div>
                            <div class="del-tfoot2">&nbsp;</div>
                        </div>
                        <div class="del-tbody2-item-adv">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.currency") }}</div>
                            <div class="del-tbody2-item-txt">
                                <select class="delegations-tselect-s" v-model="advance.currency" @change="getAdvanceRate(index)">
                                    <option v-for="currency in currencyList" :key="currency.id" :value="currency.id">{{ currency.id }}</option>
                                </select>
                            </div>
                            <div class="del-tfoot2">{{ $t("table.delegations.amountPLN") }}</div>
                        </div>
                        <div class="del-tbody2-item-adv">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.advanceAmount") }}</div>
                            <div class="del-tbody2-item-txt">
                                <div class="del-tbody-item-wrap">
                                    <input class="delegations-tinput" type="number" min="0" @input="getAdvanceRate(index)" v-model="advance.amount" />
                                    <span class="del-div-bar"></span>
                                </div>
                            </div>
                            <div class="del-tfoot2">&nbsp;</div>
                        </div>
                        <div class="del-tbody2-item-adv">
                            <div class="del-tbody2-item-title">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                            <div class="del-tbody2-item-txt">{{advance.totalAmountCurr}}</div>
                            <div class="del-tfoot2">{{totalCostsInCurr.advance }}</div>
                        </div>
                        <div class="del-tbody2-item-adv">
                            <div class="del-tbody2-item-title"></div>
                            <div class="del-tbody2-item-txt">
                                <button class="btn-delete-row" @click="removeAdvanceRow(index)">{{ $t("button.delete") }}</button>
                            </div>
                            <div class="del-tfoot2">&nbsp;</div>
                        </div>
                    </div>
                </div>
                <div class="delegations-table-2 del-table-footer">
                    <div class="del-tbody-2">
                        <div class="del-tbody2-item-wfoot-adv"></div>
                        <div class="del-tbody2-item-adv">{{ $t("table.delegations.amount") }}  {{newDelegation.currency}}</div>
                        <div class="del-tbody2-item-adv">{{totalCostsInCurr.advance }}</div>
                        <div class="del-tbody2-item-adv">&nbsp;</div>
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

        }
    },
    computed: {
        ...mapGetters({
            currencyList: 'getCurrencyList',
            advanceData: 'getAdvanceData',
            totalCosts: 'getTotalCosts',
            totalCostsInCurr: "getTotalCostsInCurr",
            newDelegation: 'getNewDelegation'
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
        ...mapActions([
            'checkAdvanceFields',
            'updateAdvance',
            'removeAdvanceRow',
            'getAdvanceRate'
        ]),
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
        addAdvanceRow() {
            let el = this.$el.lastChild.style.height
            !el || el ? el = "auto" : ""
            this.$store.dispatch('addAdvanceRow')
        },

        removeAdvanceRow() {
            this.$el.lastChild.style.height = "auto"
            this.$store.dispatch('removeAdvanceRow')
        },

        getWindowWidth() {
            // this.windowWidth = document.documentElement.clientWidth
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
