<template>
<div class="request-body">
        <div> <!-- first table -->
             <table class="personal-data-table">
            <tr>
                <td class="request-fullname">
                    <input v-model="newHoliday.fullname" type="text" class="request-input request-personal-data" :placeholder="$t('label.fullName')">
                </td>
                <td>
                    <select v-model="newHoliday.city" class="request-input personal-data-select">
                        <option v-for="city in cities" :key="city" :value="city">{{city}}</option>
                    </select>
                </td>
                <td>
                    <input type="date" id="date1" v-model="newHoliday.today" class="request-input request-input-date">
                </td>
            </tr>
            <tr>
                <td>
                    <input v-model="newHoliday.address" type="text" class="request-input request-personal-data" :placeholder="$t('label.address')">
                </td>
                <td> <p class="request-label"> {{ $t("label.citySelect") }} </p></td>
                <td> <p class="request-label"> {{ $t("label.dateSelect") }} </p></td>
            </tr>
            <tr>
                <td>
                    <input v-model="newHoliday.phone" type="text" class="request-input request-personal-data" :placeholder="$t('label.phone')">
                </td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>
                    <input v-model="newHoliday.email" type="text" class="request-input request-personal-data" :placeholder="$t('label.email')">
                </td>
                <td></td>
                <td></td>
            </tr>
        </table>
        </div>
       <div>
           <h4 class="request-header">{{ $t("label.holidayRequest").toUpperCase() }}</h4>
           <h6 class="request-info">{{ $t("message.leaveRequest") }}</h6>
       </div>
       <div>
           <table> <!-- second table -->
            <tr>
                <td> <select v-model="newHoliday.type" class="request-input personal-data-select">
                        <option v-for="type in types" :key="type" :value="type">{{type}}</option>
                    </select>
                </td>
                <td> <input v-model="newHoliday.year" type="text" class="request-input"> </td>
                <td> <input v-model="newHoliday.dateStart" type="date" id="date2" class="request-input request-input-date" @input="countDays(newHoliday)"> </td>
                <td> <input v-model="newHoliday.dateEnd" type="date" id="date3" class="request-input request-input-date" @input="countDays(newHoliday)"> </td>
                <td> <input v-model="newHoliday.countedDays" type="text" class="request-input"> </td>
            </tr>
            <tr>
                <td> <p class="request-label"> {{ $t("label.requestTypeSelect") }}</p> </td>
                <td> <p class="request-label"> {{ $t("label.yearSelect") }}</p> </td>
                <td> <p class="request-label"> {{ $t("label.dayFromSelect") }} </p></td>
                <td> <p class="request-label"> {{ $t("label.dayToSelect") }}</p> </td>
                <td> <p class="request-label"> {{ $t("label.daysCountSelect") }}</p> </td>
            </tr>
            <tr>
                <td colspan="2">
                    <div class="request-for-day">{{ $t("label.forDay") }}
                         <input type="text" class="request-input">
                    </div>
                </td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr rowspan="2">
                <td colspan="3">
                    <textarea class="request-input request-comments" :placeholder="$t('label.comments')" cols="30" rows="10"></textarea>
                </td>
                <td colspan="2">
                    <p class="request-signature">{{ $t("message.employeesSignature") }}</p>
                </td>
            </tr>
            <tr>
                <td colspan="3">
                    {{ $t("message.requestPermission") }}
                </td>
                <td colspan="2">
                    <p class="request-signature">{{ $t("message.authPersonSignature") }}</p>
                </td>
            </tr>
        </table>
       </div>
       <div>
           <p class="request-footer">BTech Sp. z o. o., 54-203 Wrocław, ul. Legnicka 57D lokal B/A, NIP 8942908985</p>
       </div>
 </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import i18n from "../../lang/lang";
const utils = require("../../utils")
export default {
    name: 'holidayRequestTemplate',
     created() {
         this.countDays(this.$store.getters.getHoliday);
    },
    computed: {
        ...mapGetters({
            cities: "getCityToHolidayRequest",
            types: "getTypesToHolidayRequest",
            newHoliday: "getHoliday"
        })
    },
    methods: {
        ...mapActions([]),
        countDays(holiday) {
            let dateStart, dateEnd, countedDays;
            if(holiday.dateStart && holiday.dateEnd){
                dateStart = new Date(holiday.dateStart)
                dateEnd = new Date(holiday.dateEnd)
                countedDays = (( dateEnd - dateStart) / 86400000) + 1;
                for(let d = dateStart; d <= dateEnd; d.setDate(d.getDate()+1)){
                    if(!this._chekIfWorkDate(d)){
                        --countedDays;
                    }
                }
            }

            holiday.countedDays = countedDays ? countedDays : 0;
            
        },
        _chekIfWorkDate(date){
            if(date.getDay() === 0 || date.getDay() === 6){
                return false
            } else if(this._chechIfHoliday(date)){
                return false
            } else {
                return true
            }
        },
        _chechIfHoliday(date){
            let holidays = this._determinesHolidays(date)
            if(holidays.find(h => h.getFullYear() === date.getFullYear() && h.getMonth() === date.getMonth() && h.getDate() === date.getDate())){
                return true
            } else {
                return false
            }
        },
        _getEasterDate(date){
            let year = date.getFullYear(),
                baseDate = new Date(year, 2, 22),
                easter;
            let A = 24, 
                B = year >= 2100 ? 6 : 5, 
                a = year % 19, 
                b = year % 4, 
                c = year % 7, 
                d = ( a * 19 + A ) % 30, 
                e = ( 2 * b + 4 * c + 6 * d + B) % 7;
            easter = new Date(baseDate.setDate(baseDate.getDate() + d + e))
            // WYJĄTKI 
            //jeśli 26.04 to tydzień wcześniej -> 19.04 (tylko wg współczynników)
            if(d === 29 && e === 6){
                easter = new Date(year, 3, 19)
            }
            // jeśli 25.04 to tydzień wcześniej -> 18.04
            if(d === 28 && e === 6){
                easter = new Date(year, 3, 18)
            }

            return easter;

        },
        _determinesHolidays(date){
            let easter = this._getEasterDate(date),
                addDate = new Date(),
                year = date.getFullYear(),
                easterMonday = utils.addDaysToDate(easter, 1),
                ascensionDay = utils.addDaysToDate(easter, 40),
                pentecost = utils.addDaysToDate(easter, 49),
                corpusChristi = utils.addDaysToDate(easter, 60),
                holidays = [
                    new Date(year, 0, 1), // new year
                    new Date(year, 0, 6), // three kings
                    easter, 
                    easterMonday,
                    new Date(year, 4, 1), // labour day
                    new Date(year, 4, 3), // Constitution Day of May 3
                    pentecost, 
                    ascensionDay,
                    new Date(year, 7, 15), // Armed Forces Day
                    new Date(year, 10, 1), // All the saints
                    new Date(year, 10, 11), //Independence Day
                    new Date(year, 11, 25), // Christmas (first day)
                    new Date(year, 11, 26) //Christmas (second date day)
                    ]
            return holidays
        }
    }
}

</script>

<style>

</style>
