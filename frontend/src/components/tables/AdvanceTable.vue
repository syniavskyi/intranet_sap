<template>
<div class="delegations-tile">
    <!-- <input id="delegations-row-1" class="documents-tiles-row-header-input" type="checkbox">
    <label class="delegations-tiles-row-header" for="delegations-row-1"> -->
        <div @click="toggleTile" class="delegations-tile-header">
            <div class="delegations-tile-title">
                {{ $t("header.advance") }}
                <button class="del-add-row" @click.prevent="toggleTile" @click="addAdvanceRow"> dodaj wiersz </button>
            </div>
            <div class="delegations-tile-underscore"></div>
        </div>
    <!-- </label> -->
    <!-- <div class="delegations-tile-wrap">     -->
        
        <div class="delegations-tile-content">

        
        <div class="delegations-table-wrapper">
            <div class="delegations-table-2">
                <div class="del-thead-2">
                    <div class="del-thead-item-adv">{{ $t("table.delegations.advanceDate") }}</div>
                    <div class="del-thead-item-adv">{{ $t("table.delegations.advanceCurrency") }}</div>
                    <div class="del-thead-item-adv">{{ $t("table.delegations.advanceAmount") }}</div>
                    <div class="del-thead-item-adv"> {{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                    <div class="del-thead-item-adv">przyciski</div>
                </div>
                <div class="del-tbody-2" v-for="(advance, index) in advanceData" :key="index">
                    <div class="del-tbody2-item-adv">
                        <div class="del-tbody2-item-title">{{ $t("table.delegations.advanceDate") }}</div>
                        <div class="del-tbody2-item-txt">
                            <v-date-picker class="delegations-tinput-date" mode="single" @input="getAdvanceRate(index)" v-model="advance.date">
                                <input value="otherCosts[index].docDate" />
                            </v-date-picker>
                        </div>
                        <div class="del-tfoot2"></div>
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
                            <input class="delegations-tinput" type="number" min="0" @input="getAdvanceRate(index)" v-model="advance.amount" /></div>
                    </div>
                    <div class="del-tfoot2"></div>
                    <div class="del-tbody2-item-adv">
                        <div class="del-tbody2-item-title"> {{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                        <div class="del-tbody2-item-txt">
                            {{advance.totalAmountCurr}}
                        </div>
                    </div>
                    <div class="del-tfoot2">{{totalCostsInCurr.advance }}</div>
                    <div class="del-tbody2-item-adv">
                        <div class="del-tbody2-item-txt"><button @click="removeAdvanceRow(index)"> X </button></div>
                        <div class="del-tfoot2"></div>
                    </div>
                </div>

            </div>
            <div class="delegations-table-2 del-table-footer">
                <div class="del-tbody-2">
                    <div class="del-tbody2-item-wfoot-adv"></div>
                    <div class="del-tbody2-item-adv">{{ $t("table.delegations.amount") }}  {{newDelegation.currency}}</div>
                    <div class="del-tbody2-item-adv">{{totalCostsInCurr.advance }}</div>
                    <div class="del-tbody2-item-adv"></div>
                </div>
            </div>
        </div>
        
    </div>
    <!-- </div> -->
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
    methods: {
        ...mapActions([
            'checkAdvanceFields',
            'updateAdvance',
            'removeAdvanceRow',
            'getAdvanceRate'
        ]),
        addAdvanceRow() {
            this.$store.dispatch('addAdvanceRow')
            this.$store.commit('SET_ADVANCE_VALIDATED', false)
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
