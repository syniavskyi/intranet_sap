<template>
        <div class="delegations-tile">
        <!-- <input id="delegations-row-4" class="documents-tiles-row-header-input" type="checkbox">
        <label class="delegations-tiles-row-header" for="delegations-row-4"> -->
            <div @click="toggleTile" class="delegations-tile-header">
                        <div class="delegations-tile-title">
                            {{ $t("header.accomodationCosts") }}
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
                                    <div class="del-thead-item-scost">{{ $t("table.delegations.flatRate") }}?</div>
                                    <div class="del-thead-item-scost">{{ $t("table.delegations.docDate") }}</div>
                                    <div class="del-thead-item-scost">{{ $t("table.delegations.company") }}</div>
                                    <div class="del-thead-item-scost">{{ $t("table.delegations.docNo") }}</div>
                                    <div class="del-thead-item-scost">{{ $t("table.delegations.return") }}?</div>
                                    <div class="del-thead-item-scost">{{ $t("table.delegations.currency") }}</div>
                                    <div class="del-thead-item-scost">{{ $t("table.delegations.amount") }}</div>
                                    <div class="del-thead-item-scost">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                                    <div class="del-thead-item-scost">przyciski</div>
                                </div>
                                <div class="del-tbody-2" v-for="(cost, index) in accomodationCosts" :key="index">
                                    <div class="del-tbody2-item-scost">
                                        <div class="del-tbody2-item-title">{{ $t("table.delegations.flatRate") }}?</div>
                                        <div class="del-tbody2-item-txt">
                                            <input type="checkbox" @change="checkAccomodationFields" v-model="cost.flatRate" />
                                            <label v-show="hideAccFields(cost)">{{ $t("table.delegations.days") }}</label>
                                            <input v-show="hideAccFields(cost)" v-model="cost.flatRateDays" @input="countAccFlatRate(index)"/>
                                        </div>
                                        <div class="del-tfoot2"></div>
                                    </div>
                                    <div class="del-tbody2-item-scost">
                                        <div class="del-tbody2-item-title">{{ $t("table.delegations.docDate") }}</div>
                                        <div class="del-tbody2-item-txt">
                                            <v-date-picker  :class="[{ 'delegations-tinput-date-disabled': hideAccFields(cost) },  'delegations-tinput-date']"  mode="single" @input="getAccCostRate(index)" v-model="cost.docDate">
                                                <input :disabled="hideAccFields(cost)" value="accomodationCosts[index].docDate" />
                                            </v-date-picker>
                                        </div>
                                        <div class="del-tfoot2"></div>
                                    </div>
                                    <div class="del-tbody2-item-scost">
                                        <div class="del-tbody2-item-title">{{ $t("table.delegations.company") }}</div>
                                        <div class="del-tbody2-item-txt">
                                            <input :disabled="hideAccFields(cost)" :class="[{ 'delegations-tinput-disabled': hideAccFields(cost) },  'delegations-tinput']" @input="checkAccomodationFields" v-model="cost.company" />
                                        </div>
                                        <div class="del-tfoot2"></div>
                                    </div>
                                    <div class="del-tbody2-item-scost">
                                        <div class="del-tbody2-item-title">{{ $t("table.delegations.docNo") }}</div>
                                        <div class="del-tbody2-item-txt">
                                            <input :disabled="hideAccFields(cost)" :class="[{ 'delegations-tinput-disabled': hideAccFields(cost) },  'delegations-tinput']" @input="checkAccomodationFields" v-model="cost.docNo" /> 
                                        </div>
                                        <div class="del-tfoot2">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                                    </div>
                                    <div class="del-tbody2-item-scost">
                                        <div class="del-tbody2-item-title">{{ $t("table.delegations.return") }}?</div>
                                        <div class="del-tbody2-item-txt">
                                            <input :disabled="hideAccFields(cost)" type="checkbox" @change="updateAccCosts" v-model="cost.payback" />
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
                                             <input :disabled="hideAccFields(cost)" :class="[{ 'delegations-tinput-disabled': hideAccFields(cost) },  'delegations-tinput']" type="number" min="0" @change="getAccCostRate(index)" v-model="cost.amount" /></div>
                                        <div class="del-tfoot2"></div>
                                    </div>
                                    
                                    <div class="del-tbody2-item-scost">
                                        <div class="del-tbody2-item-title">{{ $t("table.delegations.amount") }} {{newDelegation.currency}}</div>
                                        <div class="del-tbody2-item-txt">{{cost.totalAmountInCurr}}</div>
                                        <div class="del-tfoot2">
                                            <p>{{totalCostsInCurr.accomodation }}</p>
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
                                    <div class="del-tbody2-item-scost">{{ totalCostsInCurr.accPayback }}</div>
                                    <div class="del-tbody2-item-scost">---</div>
                                    <div class="del-tbody2-item-scost"></div>
                                    <div class="del-tbody2-item-scost">{{totalCostsInCurr.accomodation }}</div>
                                    <div class="del-tbody2-item-scost"></div>
                                </div>
                            </div>
                        </div>
                
            <!-- </div> -->
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

        toggleTile() {
            let el = this.$el.lastChild,
                style = window.getComputedStyle(el)
            
           const name = {el, style}
           this.$store.dispatch('toggleTile', name)
        }
    }
}
</script>