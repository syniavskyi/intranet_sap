import { mapGetters } from 'vuex';
<template>
    <div class="modal-new">
        <div class="modal-content">
            <div class="cv-modal-header">
                <h1 class="cv-modal-h1">Generuj CV</h1>
                <button class="cv-modal-close" @click="close">&#x2716;</button>
            </div>
            <div class="cv-modal-content"> 
                <div class="cv-modal-tbuttons">
                    <button class="cv-modal-btn-bclear" @click="selectAllCvElements">Zaznacz wszystkie</button>
                    <button class="cv-modal-btn-bclear" @click="deselectAllCvElements">Odznacz wszystkie</button>
                </div>
                <div class="cv-modal-middle">
                    <div class="cv-modal-chkbxs">
                        <label class="checkbox-wrap cv-chkbx">
                            <input type="checkbox" name="name" v-model="cvElements.name">
                            <div class="checkbox-in"></div>
                            <p class="checkbox-label">Imię i nazwisko</p>
                        </label>
                        <label class="checkbox-wrap cv-chkbx">
                            <input type="checkbox" name="photo" v-model="cvElements.photo">
                            <div class="checkbox-in"></div>
                            <p class="checkbox-label">Zdjęcie</p>
                        </label>
                        <label class="checkbox-wrap cv-chkbx">
                            <input type="checkbox" name="address" v-model="cvElements.address">
                            <div class="checkbox-in"></div>
                            <p class="checkbox-label">Adres email</p>
                        </label>
                    </div>
                    <div class="cv-modal-chkbxs">
                        <label class="checkbox-wrap cv-chkbx">
                            <input type="checkbox" name="phone" v-model="cvElements.phone">
                            <div class="checkbox-in"></div>
                            <p class="checkbox-label">Numer telefonu</p>
                        </label>
                        <label class="checkbox-wrap cv-chkbx">
                            <input type="checkbox" name="date" v-model="cvElements.date">
                            <div class="checkbox-in"></div>
                            <p class="checkbox-label">Data urodzenia</p>
                        </label>
                        <label class="checkbox-wrap cv-chkbx">
                            <input type="checkbox" name="date" v-model="cvElements.contractor">
                            <div class="checkbox-in"></div>
                            <p class="checkbox-label">Nazwa kontrahenta</p>
                        </label>
                    </div>
                </div>
                <div class="cv-modal-selects">
                    <div class="cv-modal-div-s">
                        <!-- <p>Wybierz język</p> -->
                        <select required class="cv-modal-select" v-model="cvElements.language">
                            <option v-for="language in languageList" :key="language.id" :value="language.id"> {{language.name}}</option>
                        </select>
                        <label class="cv-modal-label">Wybierz język</label>
                    </div>
                    
                    <div class="cv-modal-div">
                        <!-- <p>Wybierz format</p> -->
                        <select required class="cv-modal-select" v-model="cvElements.format">
                            <option value="DOCX"> DOCX </option>
                            <option value="PDF"> PDF </option>
                        </select>
                        <label class="cv-modal-label">Wybierz format</label>
                    </div>
                    <div class="cv-modal-div-l">
                        <!-- <p>Wybierz pozycję</p> -->
                        <select required class="cv-modal-select" v-model="cvElements.position">
                            <option v-for="position in userPositions" :key="position" :value="position"> {{position}}</option>
                        </select>
                        <label class="cv-modal-label">Wybierz pozycję</label>
                    </div>
                    <div class="cv-modal-div-s">
                        <input required class="cv-modal-input">
                        <span class="imodal-div-bar"></span>
                        <label class="cv-modal-label">Podmiot</label>
                    </div>
                </div>
            </div>
            <div class="cv-modal-bbuttons">
                <button class="cv-modal-btn" @click="showCv">Zobacz podgląd</button>
                <button class="cv-modal-btn-clear" @click="close">Zamknij</button>
            </div>
        </div>
    </div>
</template>

<script>
import  { mapActions, mapGetters } from 'vuex'
import i18n from "../../../lang/lang";
import { app } from '../../../main'

export default {
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters({
            cvElements: 'getCvElements',
            languageList: 'getLanguageList',
            industryList: 'getIndustryList',
            userPositions: "getUserJobPositions"
        })
    },
    methods: {
        ...mapActions([
            'selectAllCvElements', 'deselectAllCvElements', 'getDomainValues', 'getIndustryList', 'getUserData'
        ]),
        close(){
            this.$store.commit('SET_SHOW_CV_DIALOG', false)
        },
        showCv(){   
            /* Sylwia */
            let lang = this.cvElements.language;    
            this.$store.commit('SET_CV_ELEMENTS', this.cvElements)
            localStorage.setItem('Object', JSON.stringify(this.cvElements));
            this.$router.push({name: 'CV'});
        }
    }
}
</script>

<style>

.cv-modal-header {
    display: flex;
    justify-content: space-between;
}

.cv-modal-h1 {
    margin-left: 1rem;
    color: #333;
}

.cv-modal-close {
    font-size: 1.5rem;
    background: transparent;
    color: #ccc;
    font-weight: bold;
    height: 1.2rem;
    border: 0;
    margin: .5rem;
    transition: color 0.2s ease;
    cursor:pointer;
}

.cv-modal-close:hover {
    color: grey;
}

.cv-modal-content {
    display: flex;
    flex-direction: column;
    height: 80%;
    justify-content: space-around;
}
.cv-modal-tbuttons {
    display: flex;
    align-self: center;
    width: 80%;
    /* height: 3rem; */
    margin: 1rem;
    justify-content: space-around;
}
.cv-modal-middle {
    display: flex;
    align-self: center;
    align-items: flex-start;
    width: 100%;
    margin: 1rem;
    /* height: 60%; */
    justify-content: space-around;
}

.cv-modal-chkbxs {
    display: flex;
    width: 48%;
    flex-direction: column;
    justify-content: space-between
}
.cv-chkbx {
    display: flex;
    align-self: flex-start;
    margin-bottom: 1rem;
}

.cv-modal-div,
.cv-modal-div-s,
.cv-modal-div-l {
    display: flex;
    position: relative;
    margin-top: .4rem;
    margin-bottom: 1rem;
    width: 10rem;
    flex-direction: column;
}

.cv-modal-div-s {
    width: 9.2rem;
}

.cv-modal-div {
    width: 10.1rem;
}
.cv-modal-div-l {
    width: 12rem;
}

.cv-modal-input {
    display: flex;
    text-align: center;
    height: 2rem;
    font-family: 'Roboto';
    font-size: 1rem;
    background :transparent;
    border:0;
    width: 100%;
    text-indent: 0.5rem;
    position: relative;
    border-bottom: 1px solid #757575;
}

.imodal-div-bar { position:relative; display:flex; width:100%; }
    
.imodal-div-bar:before, 
.imodal-div-bar:after {
    content:'';
    height:2px; 
    width:0;
    bottom:0; 
    position:absolute;
    background:rgb(255, 145, 0); 
    transition:0.5s ease all; 
    -moz-transition:0.5s ease all; 
    -webkit-transition:0.5s ease all;
}
.imodal-div-bar:before {
    left:50%;
}
.imodal-div-bar:after {
    right:50%; 
} 
/* active state */
.cv-modal-input:focus ~ span:before, .cv-modal-input:focus ~ span:after {
    width:50%;
}

.cv-modal-select {
    display: flex;
    width: 100%;
    height: 2rem;
    border-radius: 3px;
    flex-shrink: 0;
    border:0;
    font-family: 'Roboto';
    appearance: none;
    -webkit-appearance: none; 
    -moz-appearance: none;
    font-size: 1rem;
    background: white;
    text-indent: .5rem;
    background-image: url("../../../assets/images/expand2.png");
    background-repeat: no-repeat;
    background-position: right;
    border: 1px solid lightgrey;
}

.cv-modal-select:valid ~ label,
.cv-modal-select:focus ~ label,
.cv-modal-input:valid ~ label,
.cv-modal-input:focus ~ label {
    top: -.65rem;
    font-size: 1rem;
    color: rgb(255, 145, 0);
    padding: 0 .2rem;
}
.cv-modal-label {
    display: flex;
    align-items: flex-end;
    color:#999; 
    position:absolute;
    pointer-events:none;
    background-color: white;
    transition:0.3s ease all; 
    font-weight: 400;
    left:0.35rem;
    top:0.25rem;
    font-size: 1.2rem;
}

.cv-modal-btn,
.cv-modal-btn-clear,
.cv-modal-btn-bclear {
    display: flex;
    cursor: pointer;
    color: #333;
    text-transform: capitalize;
    border: 0;
    border-radius: 4px;
    transition: all 0.2s ease;
    justify-content: center;
    align-items: center;
    margin: .2rem;
    outline: none;
    font-size: .85rem;
}

.cv-modal-btn {
    padding: .5rem .7rem;
    background: #ccc;
    box-shadow: 0 3px 3px -2px gray;
}

.cv-modal-btn-clear {
    padding: .5rem .7rem;
}

.cv-modal-btn-bclear {
    background: transparent;
    border: 2px solid rgb(61, 61, 61);
    padding: .6rem .8rem;
}

.cv-modal-btn-bclear:hover {
    box-shadow:0 0 8px #333;
    background: #333;
    color: white;
}

.cv-modal-btn-clear {
    background: white;
}

.cv-modal-btn-clear:hover {
    color: orange;
}

.cv-modal-btn:hover {
    background: rgb(156, 156, 156);
}

.cv-modal-bbuttons {
    display: flex;
    align-self: flex-end;
    align-items: center;
    margin: 1rem;
    /* height: 20%; */
}

.cv-modal-selects {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-self: center;
    justify-content: space-around;
}


@media (min-width: 30rem) {
    .cv-modal-middle {
        width: 80%;
        justify-content: space-around;
    }
    .cv-modal-chkbxs {
        width: 40%;
    }

    .cv-modal-selects {
        width: 80%;
    }
}

</style>