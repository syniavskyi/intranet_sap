<template>
<div class="request-body-center">
    <button @click="generatePDF" class="cv-modal-btn-bclear center-btn"> {{$t('button.generatePDF')}} </button>
     <div class="request-body">
        <div class="content" id="content">
            <holiday-request-template></holiday-request-template>
            <hr>
            <holiday-request-template></holiday-request-template>
        </div>
    </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import i18n from "../../../lang/lang";
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import HolidayRequestTemplate from "../../templates/HolidayRequestTemplate";
export default {
    name: 'holidayRequest',
    components: {
        'holiday-request-template': HolidayRequestTemplate
    },
    data() {
        return {

        }
    },
     computed: {
        ...mapGetters({
            newHoliday: "getHoliday"
        })
    },
    methods: {
        generatePDF() {
            let pdfName;

            let helps = document.getElementsByClassName('request-input-date');
            for(let help of helps) {
                help.type = "text";
            }

           let elements = document.getElementsByClassName('request-input');
            for(let element of elements) {
                element.style.setProperty('--request-input-color', 'white');
            }

            this.newHoliday.userAlias && this.newHoliday.dateStart ? pdfName = 'wniosek_urlopowy' + '/' + this.newHoliday.dateStart + '/' + this.newHoliday.userAlias: pdfName = 'wniosek_urlopowy';
            html2canvas(document.getElementById("content")).then(canvas => {
                 let contentWidth = canvas.width,
                    contentHeight = canvas.height,
                    imgWidth = 540,
                    imgHeight = 540/contentWidth * contentHeight,
                    img = canvas.toDataURL("image/jpeg", 1.0),
                    doc = new jsPDF('', 'pt', 'a4');
                    doc.addImage(img, 'JPEG', 10, 10, imgWidth, imgHeight);
                    doc.save(pdfName + '.pdf');
            });
             this.$router.push({ name: "News"});
        },
    }
}
</script>

<style>
    body {
        background-color: rgb(82, 86, 89)
    }
</style>
