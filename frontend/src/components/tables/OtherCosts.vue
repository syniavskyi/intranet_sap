<template>
        <div class="delegations-tile">
            <!-- <input id="delegations-row-5" class="documents-tiles-row-header-input" type="checkbox">
            <label class="delegations-tiles-row-header" for="delegations-row-5"> -->
                 <div @click="toggleTile" class="delegations-tile-header">
                        <div class="delegations-tile-title">
                            {{ $t("header.otherCosts") }}
                            <button class="del-add-row" @click.prevent="toggleTile" @click="addCostRow"> dodaj wiersz </button>
                        </div>
                        <div class="delegations-tile-underscore"></div>
                    </div>
            <!-- </label>
            <div class="delegations-tile-wrap"> -->
                   
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
                                    <div class="del-thead-item-scost">przyciski</div>
                                </div>
                                <div class="del-tbody-2" v-for="(cost, index) in otherCosts" :key="index">
                                    <div class="del-tbody2-item-scost">
                                        <div class="del-tbody2-item-title">{{ $t("table.delegations.docDate") }}</div>
                                        <div class="del-tbody2-item-txt">
                                            <v-date-picker class="delegations-tinput-date" mode="single" @change="getOtherCostRate(index)" v-model="cost.docDate">
                                                <input value="otherCosts[index].docDate" />
                                            </v-date-picker>
                                        </div>
                                        <div class="del-tfoot2"></div>
                                    </div>
                                    <div class="del-tbody2-item-scost">
                                        <div class="del-tbody2-item-title">{{ $t("table.delegations.company") }}</div>
                                        <div class="del-tbody2-item-txt">
                                            <input class="delegations-tinput" @input="checkOtherCostsFields" v-model="cost.company" />
                                        </div>
                                        <div class="del-tfoot2"></div>
                                    </div>
                                    <div class="del-tbody2-item-scost">
                                        <div class="del-tbody2-item-title">{{ $t("table.delegations.docNo") }}</div>
                                        <div class="del-tbody2-item-txt">
                                            <input class="delegations-tinput" v-model="cost.docNo" /> 
                                        </div>
                                        <div class="del-tfoot2">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                                    </div>
                                    <div class="del-tbody2-item-scost">
                                        <div class="del-tbody2-item-title">{{ $t("table.delegations.return") }}?</div>
                                        <div class="del-tbody2-item-txt">
                                            <input type="checkbox" @change="updateOtherCosts" v-model="cost.payback" />
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
                                             <input class="delegations-tinput" type="number" min="0" @change="getOtherCostRate(index)" v-model="cost.amount" /></div>
                                        <div class="del-tfoot2"></div>
                                    </div>
                                    
                                    <div class="del-tbody2-item-scost">
                                        <div class="del-tbody2-item-title">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                                        <div class="del-tbody2-item-txt">{{cost.totalAmountCurr}}</div>
                                        <div class="del-tfoot2">
                                            <p>{{totalCostsInCurr.others }}</p>
                                        </div>
                                    </div>
                                    <div class="del-tbody2-item-scost">
                                        <div class="del-tbody2-item-txt"><button @click="removeCostRow(index)"> X </button></div>
                                        <div class="del-tfoot2"></div>
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
            <!-- </div> -->
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
    methods: {
        ...mapActions({
            checkOtherCostsFields: 'checkOtherCostsFields',
            addCostRow: 'addOtherCostRow',
            removeCostRow: 'removeOtherCostRow',
            updateOtherCosts: 'countOtherCosts',
            getOtherCostRate: 'getOtherCostRate'
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