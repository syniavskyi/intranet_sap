<template>
<div class="content">
  <button @click="generate" class="cv-modal-btn-bclear center-btn">{{ $t("button.confirmGenerate") }}</button>
  <div id="content">
    <div class="Section1" >
    <!-- header with name and position-->
      <table id="main-table" width="100%">
        <tr>
          <td>
            <tr class="tr-header" align="right">
              <h1  v-if="cvElements.name" style="font-family:'Arial'">{{userInfo.Fullname}}</h1>
              <h2 style="font-family: 'Arial'">{{cvElements.position}}</h2>
            </tr>
        <!-- personal data -->
          <h3 style="font-weight:bold; margin-bottom:10px; margin-top:10px; padding-bottom:5px; border-bottom:2px solid #E79600; text-transform:uppercase; font-family:'Arial';">{{ $t("header.personalData") }} </h3>
          <!-- <v:line  from="0,0" to="800,0" strokeweight="2pt"  xmlns:v="urn:schemas-microsoft-com:vml" strokecolor="blue"/> -->
            <table width="100%">
              <tr>
                <td>
                  <table width="500px">
                    <!-- <tr> -->
                      <!-- width="180px" -->
                      <!-- <td v-if="cvElements.photo" width="45%" style="font-weight:bold; font-family:'Arial';"><p style="mso-cellspacing:0; margin:0; padding:0;">{{ $t("label.nationality") }}</p></td>
                      <td v-if="!cvElements.photo" width="45%" style="font-weight:bold; font-family:'Arial';"><p style="mso-cellspacing:0; margin:0; padding:0;">{{ $t("label.nationality") }}</p></td>
                      <td style="font-family: 'Arial'"><p style="mso-cellspacing:0; margin:0; padding:0;">Polska</p></td>
                    </tr> -->
                    <!-- <tr v-if="cvElements.date">
                      <td  style="font-weight:bold; font-family:'Arial';"><p style="mso-cellspacing:0; margin:0; padding:0;">{{ $t("label.dateOfBirth") }}</p></td>
                      <td style="font-family:'Arial';"><p style="mso-cellspacing:0; margin:0; padding:0;">{{ formatDate(userInfo.DateBirth)}}</p></td>
                    </tr> -->
                    <tr v-if="cvElements.phone">
                      <td  style="font-weight: bold; font-family:'Arial';"><p style="mso-cellspacing:0; margin:0; padding:0;">{{ $t("label.phone") }}</p></td>
                      <td style="font-family:'Arial';"><p style="mso-cellspacing:0; margin:0; padding:0;">{{userInfo.Telephone}}</p></td>
                    </tr>
                    <tr v-if="cvElements.address">
                      <td  style="font-weight: bold; font-family:'Arial';"><p style="mso-cellspacing:0; margin:0; padding:0;">{{ $t("label.email") }}</p></td>
                      <td style="font-family:'Arial';"><p style="mso-cellspacing:0; margin:0; padding:0;">{{userInfo.Email}}</p></td>
                    </tr>
                    <tr>
                      <!-- width="180px" -->
                      <td valign="top" style="font-weight:bold; font-family:'Arial';">{{ $t("label.knowledgeOfForeignLanguages") }}
                        <!-- <p style="mso-text-control: 'wrap'; mso-cellspacing:0; width: 80%; margin:0; padding:0;"></p> -->
                        </td>
                      <td style="font-family:'Arial';"><p v-for="langu in userLangs" :key="langu.id" style="mso-cellspacing:0; margin:0; padding:0;">{{formatLangName(langu.LanguageId)}} - {{formatLangLevel(langu.LangLevel)}}</p></td>
                    </tr>
                  </table>
                </td>
                <td>
                  <table v-if="cvElements.photo" width="15%">
                    <tr>
                      <td>
                        <img class="img-user-class" id="cv-img" :src="userPhoto" width="150px">
                      </td>
                    </tr>
                  </table>
                  <table v-if="!cvElements.photo" width="15%">
                    <tr>
                      <td>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td><p style="mso-cellspacing:0; margin:0; margin-bottom: 16px;"></p></td>
              </tr>
            </table>
         <!-- education -->
            <h3 style="mso-cellspacing:0pt; margin-bottom:10px; margin-top:10px; padding-bottom:5px; font-family:'Arial'; font-weight:bold; border-bottom:2px solid #E79600; text-transform:uppercase; ">{{ $t("header.education") }}</h3>
            <table align="center" cellspacing="0"  id="cv-education" width="99%" v-for="(education) in userEducation" :key="education.id">
              <tr>
                <th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th>
              </tr>
              <tr>
                <td colspan="2" style="font-weight:bold; font-family:'Arial';" width="41%"><p style="width: 70%; mso-cellspacing:0; margin:0;margin-bottom:3px; padding:0;">{{formatSchoolDsec(education.University)}}</p></td>
                <td colspan="10" style="font-family:'Arial';" valign="top" ><p style="mso-cellspacing:0; margin:0; padding:0;">{{formatFieldOfStudyDesc(education.FieldOfStudy)}}</p></td>
              </tr>
              <tr >
                <td style="font-family:'Arial';" v-if="!education.IsCurrent"><p style="margin:0; padding:0; margin-bottom:10px;" v-if="!education.IsCurrent">{{formatDate(education.DateStart)}} - {{formatDate(education.DateEnd)}}</p></td>
                <td style="font-family:'Arial';" v-if="education.IsCurrent"><p style="margin:0; padding:0; margin-bottom:10px;" >{{formatDate(education.DateStart)}} - {{setIfCurrentDate(education.IsCurrent)}}</p></td>
              </tr>
              <tr>
                <td></td>
                <!-- <td><p style="mso-cellspacing:0; margin:0; padding:0;">&nbsp;</p></td> -->
              </tr>
            </table>
       <!-- experience -->
            <h3 style="font-weight:bold; margin-bottom:10px; margin-top:10px; padding-bottom:5px; border-bottom:2px solid #E79600; text-transform:uppercase; font-family:'Arial';">{{ $t("header.experience") }}</h3>
            <table align="center" class="border-collapse: collapse;"  width="99%" v-for="(experience) in userExperience" :key='experience.id'>
              <tr>
                <td style="padding:0; font-family:'Arial'; font-weight:bold;" width="41%"><p style="mso-cellspacing:0; margin:0; padding:0;"> {{experience.Employer}}</p></td>
                <td style="padding:0; font-family:'Arial'; font-size:0.9rem;"><p style="mso-cellspacing:0; margin:0; padding:0;">{{formatPositionName(experience.WorkPos)}}</p></td>
              </tr>
              <tr>
                <td style="border-spacing:0; font-family:'Arial';" v-if="!experience.IsCurrent"><p style="mso-cellspacing:0; margin:0; padding:0; margin-bottom:10px;" >{{formatDate(experience.DateStart)}} - {{formatDate(experience.DateEnd)}}</p></td>
                <td style="font-family:'Arial';" v-if="experience.IsCurrent"><p style="margin:0; padding:0; margin-bottom:10px;" >{{formatDate(experience.DateStart)}} - {{setIfCurrentDate(experience.IsCurrent)}}</p></td>
              </tr>
              <tr>
                <!-- <td><p style="mso-cellspacing:0; margin:0; padding:0;">&nbsp;</p></td> -->
              </tr>
            </table>
          <!-- projects -->
            <h3 style="font-weight:bold; margin-bottom:10px; margin-top:10px; padding-bottom:5px; border-bottom: 2px solid #E79600; text-transform:uppercase; font-family:'Arial';">{{ $t("header.projects") }}</h3>
            <table align="center" width="99%" v-for="(project, index) in userProjects" :key="project.id">
              <tr>
                <td style="width:30%; vertical-align: top;  font-family:'Arial';" v-if="cvElements.contractor">
                  <p style="padding:0; margin:0;margin-bottom: 3px; font-weight:bold;">{{project.ContractorName}}</p>
                  <p style="padding:0; margin:0;" v-if="!project.IsCurrent">{{formatDate(project.DateStart)}} - {{formatDate(project.DateEnd)}}</p>
                  <p style="padding:0; margin:0;" v-if="project.IsCurrent">{{formatDate(project.DateStart)}} - {{setIfCurrentDate(project.IsCurrent)}}</p>
                </td>
                <td id="projectID" style="width:55%; vertical-align: top; font-family:'Arial';">
                  <p style="margin:0; padding:0; margin-bottom:3px; width:90%; font-weight:bold;" v-for="industry in project.Industries" :key="industry.id">{{industry.name}}</p>
                  <p :id="index" style="mso-cellspacing:0; margin:0; padding:0; height: 0;">{{descriptionFormatting(index, project.Description)}}</p>
                  <!-- margin-bottom: 10px; -->
                </td>
                <td style="width:10%; max-width:10%; vertical-align: top; font-family:'Arial';">
                  <p style="mso-cellspacing:0; margin:0; padding:0;" v-for="sapModule in project.Modules" :key="sapModule.id">
                    {{ sapModule.id }}
                    <!-- <strong >&nbsp;</strong> -->
                  </p>
                </td>
              </tr>
              <tr>
                <!-- <td><p style="mso-cellspacing:0; margin:0; padding:0;">&nbsp;</p></td> -->
              </tr>
            </table>
            <!-- SAP experience -->
            <h3 style="font-weight: bold; margin-bottom: 10px; margin-top:10px; padding-bottom:5px; border-bottom:2px solid #E79600; text-transform: uppercase; font-family: 'Arial';">{{ $t("label.sapModulesExp") }}</h3>
            <table>
              <tr>
                <td width="50%" style="font-family: 'Arial'; font-weight: bold;"><p style="mso-cellspacing:0; margin:0; padding:0;" v-if="userSkills.SapModules && userSkills.SapModules != 0">{{ $t("label.sapModules") }}</p></td>
                <!-- <td style="mso-cellspacing:0; margin:0; padding:0; white-space: normal;"><p style="float: left; letter-spacing: -1px; mso-cellspacing:0; margin:0; padding:0; font-family: 'Arial';white-space: normal;" v-for="sapModule in userSkills.SapModules" :key="sapModule.id">{{sapModule}}</p></td> -->
                <td><p style="mso-cellspacing:0; margin:0; padding:0; font-family: 'Arial';">{{fnLoop(userSkills.SapModules)}}</p></td>
              </tr>
              <tr>
                <td style="font-family: 'Arial'; font-weight: bold;"><p style="mso-cellspacing:0; margin:0; padding:0;" v-if="userSkills.ProgramLang && userSkills.ProgramLang != 0">{{ $t("label.programmingLanguages") }}</p></td>
                <!-- <td><p style="mso-cellspacing:0; margin:0; padding:0; font-family: 'Arial';"  v-for="programLang in userSkills.ProgramLang" :key="programLang.id">{{programLang}}</p></td> -->
                <td><p style="mso-cellspacing:0; margin:0; padding:0; font-family: 'Arial';">{{fnLoop(userSkills.ProgramLang)}}</p></td>
              </tr>
              <tr>
                <td style="font-family: 'Arial'; font-weight: bold;"><p style="mso-cellspacing:0; margin:0; padding:0;" v-if="userSkills.Technologies && userSkills.Technologies != 0">{{ $t("label.technologies") }}</p></td>
                <!-- <td><p style="mso-cellspacing:0; margin:0; padding:0; font-family: 'Arial';" v-for="technology in userSkills.Technologies" :key="technology.id">{{technology}}</p></td> -->
                <td><p style="mso-cellspacing:0; margin:0; padding:0; font-family: 'Arial';">{{fnLoop(userSkills.Technologies)}}</p></td>
              </tr>
              <tr>
                <td style="font-family: 'Arial'; font-weight: bold;"><p style="mso-cellspacing:0; margin:0; padding:0;" v-if="userSkills.Extensions && userSkills.Extensions.length != 0">{{ $t("label.extensions") }}</p></td>
                <!-- <td><p style="mso-cellspacing:0; margin:0; padding:0; font-family: 'Arial';" v-for="extension in userSkills.Extensions" :key="extension.id">{{extension}}</p></td> -->
                <td><p style="mso-cellspacing:0; margin:0; padding:0; font-family: 'Arial';">{{fnLoop(userSkills.Extensions)}}</p></td>
              </tr>
              <tr>
                <td style="font-family: 'Arial'; font-weight: bold;"><p style="mso-cellspacing:0; margin:0; padding:0;" v-if="userSkills.AdiitionalSkills && userSkills.AdiitionalSkills.length != 0">{{ $t("label.additionalSkills") }}</p></td>
                <!-- <td><p style="mso-cellspacing:0; margin:0; padding:0; font-family: 'Arial';" v-for="additionalSkill in userSkills.AdiitionalSkills" :key="additionalSkill.id">{{additionalSkill}}</p></td> -->
                <td><p style="mso-cellspacing:0; margin:0; padding:0; font-family: 'Arial';">{{fnLoop(userSkills.AdiitionalSkills)}}</p></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import jszip from "jszip";
import htmlDocx from "html-docx-js/dist/html-docx";
import { saveAs } from "file-saver";
import i18n from "../../lang/lang";
import axios from 'axios';
import Modal from '../dialogs/MessageLogDialog';
const utils = require("../../utils")
export default {
  data() {
    return {};
  },
  components: {
    "modal": Modal
  },
  beforeRouteLeave(to, from, next) {
    if(to.name === "Profile"){
      this.$store.commit("SET_GO_FROM_CV", true);
    }
    next();
  },
  beforeCreate() {
    let oStore = this.$store;
    const retrievedObject = JSON.parse(localStorage.getItem("Object"));
    oStore.commit("SET_CV_ELEMENTS", retrievedObject);
      let userData = {
        lang: retrievedObject.language.toUpperCase(),
        cvLang: retrievedObject.language,
        changePage: false
      }

      oStore.getters.getSelectedForCvUser ? userData.user = oStore.getters.getSelectedForCvUser : userData.user = localStorage.getItem('id');
      oStore.commit('SET_PROMISE_TO_READ', oStore.getters.getCvToRead);

     oStore.dispatch("loadData", userData);

     this.$i18n.locale  = retrievedObject.language.toLowerCase();
  },
  created() {
    let oStore = this.$store;
    utils.checkAuthLink(this.$router, oStore.getters.getUserAuth.ZMENU);
  },
  methods: {
    ...mapActions([
       "getIndustries"
    ]), 
    descriptionFormatting(projectid, desc){
      let i,
          newDesc = "",
          domElem = document.getElementById(projectid) || null,
          parentDiv = document.getElementById("projectID") || null
      if (desc.match(/\n/) && domElem !== undefined && domElem !== null) {
        desc = desc.split('\n')
        i = desc.length
        while (i--) {
          if (desc[i] === "") {
            desc.splice(i, 1)
          } else {
            break
          }
        }
        if (desc.length > 1) {
          for (i = 0; i < desc.length; i++) {
            let newDiv = this.createElem(desc[i])
            if (domElem.nextElementSibling !== null) {
              // let endDiv = this.endElem(domElem)
              domElem.nextElementSibling.insertAdjacentElement('afterend', newDiv)
              // endDiv.insertAdjacentElement('afterend', newDiv)
            }
            else {
              domElem.insertAdjacentElement('afterend', newDiv)
            }
          }
        } else {
          let newDiv = this.createElem(desc[0])
          domElem.insertAdjacentElement('afterend', newDiv)
        }
      } else if (domElem !== null) {
        let newDiv = this.createElem(desc)
        domElem.insertAdjacentElement('afterend', newDiv)
      }
    },
    // endElem(domElem) {
    //   if (domElem.nextElementSibling && domElem.nextElementSibling.id === "") {
    //     this.endElem(domElem.nextElementSibling)
    //   } else {
    //     return domElem
    //   }
    // },
    createElem(desc) {
      let newDiv = document.createElement("p"),
          newDesc = ""
      newDiv.className = "pempty"
      newDesc = document.createTextNode(desc)
      newDiv.appendChild(newDesc)
      return newDiv
    },
    generate(oEvent) {
      if (this.cvElements.format == "PDF") {
        this.generatePdf();
      } else {
        this.generateDocx();
      }
      this._saveCVHistory(); // save information about generating CV to DB
    },
    fnLoop(skills) {
      let skillStr = "";
      if(skills) {
        for (let i = 0; i < skills.length; i++) {
          if(i == skills.length-1) {
            skillStr += skills[i] + " "
          } else {
            skillStr += skills[i]  + ", "
          }
        }
        return skillStr
      } else return
    },
    generateDocx() {
      let userData = this.userInfo;
      let oTimeStampOld = new Date().toLocaleString(),
            oTimeStamp = oTimeStampOld.replace(/:\s*/g, "-"),
            sLanguage = this.cvElements.language.toUpperCase(),
            fileNameAndFormat = `CV ${userData.Fullname},${sLanguage}(${oTimeStamp}).docx`;
      if (this.cvElements.photo) {this.convertImagesToBase64();}
      const preHtml = "<html xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns:m='http://schemas.microsoft.com/office/2004/12/omml' xmlns='http://www.w3.org/TR/REC-html40'> <head><meta http-equiv=Content-Type content='text/html; charset=utf-8'></head> <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]--><body>",
        postHtml = "</body></html>";
      const content = preHtml + document.getElementById("content").innerHTML + postHtml;
      // const converted = htmlDocx.asBlob(content, { margins: { bottom: 0 }, footer: {} });
      // saveAs(converted, "document.docx");

      var zip = new jszip();
      const preCoreXmlSubject = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title></dc:title><dc:subject>',
            postCoreXmlSubject = '</dc:subject><dc:creator></dc:creator><cp:keywords></cp:keywords><dc:description></dc:description><cp:lastModifiedBy>Damian</cp:lastModifiedBy><cp:revision>4</cp:revision><dcterms:created xsi:type="dcterms:W3CDTF">2018-08-21T11:36:00Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2018-08-22T13:23:00Z</dcterms:modified></cp:coreProperties>';
      var coreXmlSubject = "Dla BPX 17.08.2018",
          coreXml = preCoreXmlSubject + coreXmlSubject + postCoreXmlSubject;
      var encodedCoreXml = btoa(unescape(encodeURIComponent(coreXml)));
      zip.file('[Content_Types].xml', Buffer("PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/Pgo8VHlwZXMgeG1sbnM9Imh0dHA6Ly9zY2hlbWFzLm9wZW54bWxmb3JtYXRzLm9yZy9wYWNrYWdlLzIwMDYvY29udGVudC10eXBlcyI+CiAgPERlZmF1bHQgRXh0ZW5zaW9uPSJyZWxzIiBDb250ZW50VHlwZT0KICAgICJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtcGFja2FnZS5yZWxhdGlvbnNoaXBzK3htbCIgLz4KICA8T3ZlcnJpZGUgUGFydE5hbWU9Ii93b3JkL2RvY3VtZW50LnhtbCIgQ29udGVudFR5cGU9CiAgICAiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnQubWFpbit4bWwiLz4KICA8T3ZlcnJpZGUgUGFydE5hbWU9Ii93b3JkL2FmY2h1bmsubWh0IiBDb250ZW50VHlwZT0ibWVzc2FnZS9yZmM4MjIiLz4KPE92ZXJyaWRlIFBhcnROYW1lPSIvZG9jUHJvcHMvY29yZS54bWwiIENvbnRlbnRUeXBlPSJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtcGFja2FnZS5jb3JlLXByb3BlcnRpZXMreG1sIi8+CjxPdmVycmlkZSBQYXJ0TmFtZT0iL2RvY1Byb3BzL2FwcC54bWwiIENvbnRlbnRUeXBlPSJhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuZXh0ZW5kZWQtcHJvcGVydGllcyt4bWwiLz4KPE92ZXJyaWRlIFBhcnROYW1lPSIvd29yZC9mb290ZXIxLnhtbCIgQ29udGVudFR5cGU9ImFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmZvb3Rlcit4bWwiLz4KPC9UeXBlcz4=","base64"));
      zip.folder('_rels').file('.rels', Buffer("PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxSZWxhdGlvbnNoaXBzIHhtbG5zPSJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvcGFja2FnZS8yMDA2L3JlbGF0aW9uc2hpcHMiPjxSZWxhdGlvbnNoaXAgVHlwZT0iaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL29mZmljZURvY3VtZW50LzIwMDYvcmVsYXRpb25zaGlwcy9vZmZpY2VEb2N1bWVudCIgVGFyZ2V0PSIvd29yZC9kb2N1bWVudC54bWwiIElkPSJSMDljODNmYWZjMDY3NDg4ZSIgLz48UmVsYXRpb25zaGlwIFRhcmdldD0iL2RvY1Byb3BzL2NvcmUueG1sIiBUeXBlPSJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvcGFja2FnZS8yMDA2L3JlbGF0aW9uc2hpcHMvbWV0YWRhdGEvY29yZS1wcm9wZXJ0aWVzIiBJZD0icklkMiIvPjxSZWxhdGlvbnNoaXAgVGFyZ2V0PSJkb2NQcm9wcy9hcHAueG1sIiBUeXBlPSJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvb2ZmaWNlRG9jdW1lbnQvMjAwNi9yZWxhdGlvbnNoaXBzL2V4dGVuZGVkLXByb3BlcnRpZXMiIElkPSJySWQzIi8+PC9SZWxhdGlvbnNoaXBzPg==","base64"))
      /* core.xml stores information about the Subject of the Document (ex.: Dla BPX) <> app.xml stores data about the Company (BTech Sp. z o.o.)  */
      zip.folder('docProps').file('core.xml', Buffer(encodedCoreXml, "base64")).file('app.xml', Buffer("PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/Pgo8UHJvcGVydGllcyB4bWxucz0iaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL29mZmljZURvY3VtZW50LzIwMDYvZXh0ZW5kZWQtcHJvcGVydGllcyIgeG1sbnM6dnQ9Imh0dHA6Ly9zY2hlbWFzLm9wZW54bWxmb3JtYXRzLm9yZy9vZmZpY2VEb2N1bWVudC8yMDA2L2RvY1Byb3BzVlR5cGVzIj48VGVtcGxhdGU+Tm9ybWFsPC9UZW1wbGF0ZT48VG90YWxUaW1lPjA8L1RvdGFsVGltZT48UGFnZXM+MTwvUGFnZXM+PFdvcmRzPjI8L1dvcmRzPjxDaGFyYWN0ZXJzPjE0PC9DaGFyYWN0ZXJzPjxBcHBsaWNhdGlvbj5NaWNyb3NvZnQgT2ZmaWNlIFdvcmQ8L0FwcGxpY2F0aW9uPjxEb2NTZWN1cml0eT4wPC9Eb2NTZWN1cml0eT48TGluZXM+MTwvTGluZXM+PFBhcmFncmFwaHM+MTwvUGFyYWdyYXBocz48U2NhbGVDcm9wPmZhbHNlPC9TY2FsZUNyb3A+PEhlYWRpbmdQYWlycz48dnQ6dmVjdG9yIHNpemU9IjIiIGJhc2VUeXBlPSJ2YXJpYW50Ij48dnQ6dmFyaWFudD48dnQ6bHBzdHI+VGl0bGU8L3Z0Omxwc3RyPjwvdnQ6dmFyaWFudD48dnQ6dmFyaWFudD48dnQ6aTQ+MTwvdnQ6aTQ+PC92dDp2YXJpYW50PjwvdnQ6dmVjdG9yPjwvSGVhZGluZ1BhaXJzPjxUaXRsZXNPZlBhcnRzPjx2dDp2ZWN0b3Igc2l6ZT0iMSIgYmFzZVR5cGU9Imxwc3RyIj48dnQ6bHBzdHI+PC92dDpscHN0cj48L3Z0OnZlY3Rvcj48L1RpdGxlc09mUGFydHM+PENvbXBhbnk+QlRlY2ggU3AuIHogby5vLjwvQ29tcGFueT48TGlua3NVcFRvRGF0ZT5mYWxzZTwvTGlua3NVcFRvRGF0ZT48Q2hhcmFjdGVyc1dpdGhTcGFjZXM+MTU8L0NoYXJhY3RlcnNXaXRoU3BhY2VzPjxTaGFyZWREb2M+ZmFsc2U8L1NoYXJlZERvYz48SHlwZXJsaW5rc0NoYW5nZWQ+ZmFsc2U8L0h5cGVybGlua3NDaGFuZ2VkPjxBcHBWZXJzaW9uPjE2LjAwMDA8L0FwcFZlcnNpb24+PC9Qcm9wZXJ0aWVzPg==", "base64"));
      zip.folder('word').file("document.xml", this.xmlDocumentCreation()).file('afchunk.mht', this.convertToMhtandAddMimeType(content)).folder('_rels').file('document.xml.rels', Buffer("PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxSZWxhdGlvbnNoaXBzIHhtbG5zPSJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvcGFja2FnZS8yMDA2L3JlbGF0aW9uc2hpcHMiPjxSZWxhdGlvbnNoaXAgSWQ9Imh0bWxDaHVuayIgVGFyZ2V0PSIvd29yZC9hZmNodW5rLm1odCIgVHlwZT0iaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL29mZmljZURvY3VtZW50LzIwMDYvcmVsYXRpb25zaGlwcy9hRkNodW5rIi8+PFJlbGF0aW9uc2hpcCBUYXJnZXQ9Ii9kb2NQcm9wcy9jb3JlLnhtbCIgVHlwZT0iaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL3BhY2thZ2UvMjAwNi9yZWxhdGlvbnNoaXBzL21ldGFkYXRhL2NvcmUtcHJvcGVydGllcyIgSWQ9InJJZDIiLz48UmVsYXRpb25zaGlwIFRhcmdldD0iZG9jUHJvcHMvYXBwLnhtbCIgVHlwZT0iaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL29mZmljZURvY3VtZW50LzIwMDYvcmVsYXRpb25zaGlwcy9leHRlbmRlZC1wcm9wZXJ0aWVzIiBJZD0icklkMyIvPjxSZWxhdGlvbnNoaXAgVGFyZ2V0PSJmb290ZXIxLnhtbCIgVHlwZT0iaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL29mZmljZURvY3VtZW50LzIwMDYvcmVsYXRpb25zaGlwcy9mb290ZXIiIElkPSJySWQ2Ii8+PC9SZWxhdGlvbnNoaXBzPg==","base64"));
      zip.folder('word').file("footer1.xml", Buffer("PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/Pgo8dzpmdHIgeG1sbnM6d3BjPSJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL29mZmljZS93b3JkLzIwMTAvd29yZHByb2Nlc3NpbmdDYW52YXMiIHhtbG5zOm1jPSJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvbWFya3VwLWNvbXBhdGliaWxpdHkvMjAwNiIgeG1sbnM6YWluaz0iaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS9vZmZpY2UvZHJhd2luZy8yMDE2L2luayIgeG1sbnM6YW0zZD0iaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS9vZmZpY2UvZHJhd2luZy8yMDE3L21vZGVsM2QiIHhtbG5zOm89InVybjpzY2hlbWFzLW1pY3Jvc29mdC1jb206b2ZmaWNlOm9mZmljZSIgeG1sbnM6cj0iaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL29mZmljZURvY3VtZW50LzIwMDYvcmVsYXRpb25zaGlwcyIgeG1sbnM6bT0iaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL29mZmljZURvY3VtZW50LzIwMDYvbWF0aCIgeG1sbnM6dj0idXJuOnNjaGVtYXMtbWljcm9zb2Z0LWNvbTp2bWwiIHhtbG5zOndwMTQ9Imh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vb2ZmaWNlL3dvcmQvMjAxMC93b3JkcHJvY2Vzc2luZ0RyYXdpbmciIHhtbG5zOndwPSJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvZHJhd2luZ21sLzIwMDYvd29yZHByb2Nlc3NpbmdEcmF3aW5nIiB4bWxuczp3MTA9InVybjpzY2hlbWFzLW1pY3Jvc29mdC1jb206b2ZmaWNlOndvcmQiIHhtbG5zOnc9Imh0dHA6Ly9zY2hlbWFzLm9wZW54bWxmb3JtYXRzLm9yZy93b3JkcHJvY2Vzc2luZ21sLzIwMDYvbWFpbiIgeG1sbnM6dzE0PSJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL29mZmljZS93b3JkLzIwMTAvd29yZG1sIiB4bWxuczp3MTU9Imh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vb2ZmaWNlL3dvcmQvMjAxMi93b3JkbWwiICBtYzpJZ25vcmFibGU9IncxNCB3MTUiPjx3OnAgdzE0OnBhcmFJZD0iNjBDMjAxNzQiIHcxNDp0ZXh0SWQ9IjM0MzlGRjZDIiB3OnJzaWRSPSIwMDM2NTZDMCIgdzpyc2lkUkRlZmF1bHQ9IjAwMzY1NkMwIj48dzpwUHI+PHc6cEJkcj48dzp0b3Agdzp2YWw9InNpbmdsZSIgdzpzej0iNCIgdzpzcGFjZT0iMSIgdzpjb2xvcj0iYXV0byIvPjwvdzpwQmRyPjx3OnNwYWNpbmcgdzphZnRlcj0iMCIvPjx3OmluZCB3OnJpZ2h0PSItMiIvPjx3OmpjIHc6dmFsPSJjZW50ZXIiLz48dzpyUHI+PHc6bGFuZyB3OnZhbD0iZW4tVVMiLz48L3c6clByPjwvdzpwUHI+PHc6cHJvb2ZFcnIgdzp0eXBlPSJzcGVsbFN0YXJ0Ii8+PHc6cj48dzp0PkJUZWNoPC93OnQ+PC93OnI+PHc6cHJvb2ZFcnIgdzp0eXBlPSJzcGVsbEVuZCIvPjx3OnI+PHc6dCB4bWw6c3BhY2U9InByZXNlcnZlIj4gU3AuIHogby4gby4sIFBMIDU0LTI8L3c6dD48L3c6cj48dzpyIHc6cnNpZFI9IjAwNTYwMTk5Ij48dzp0PjAzPC93OnQ+PC93OnI+PHc6cj48dzp0IHhtbDpzcGFjZT0icHJlc2VydmUiPiBXcm9jPC93OnQ+PC93OnI+PHc6ciB3OnJzaWRSPSIwMDNFNTU0RiI+PHc6dD7Fgjwvdzp0PjwvdzpyPjx3OnI+PHc6dCB4bWw6c3BhY2U9InByZXNlcnZlIj5hdywgdWwuIDwvdzp0PjwvdzpyPjx3OnByb29mRXJyIHc6dHlwZT0ic3BlbGxTdGFydCIvPjx3OnIgdzpyc2lkUj0iMDA1NjAxOTkiIHc6cnNpZFJQcj0iMDAzRTU1NEYiPjx3OnJQcj48dzpsYW5nIHc6dmFsPSJlbi1VUyIvPjwvdzpyUHI+PHc6dD5MZWduaWNrYTwvdzp0PjwvdzpyPjx3OnByb29mRXJyIHc6dHlwZT0ic3BlbGxFbmQiLz48dzpyIHc6cnNpZFI9IjAwNTYwMTk5IiB3OnJzaWRSUHI9IjAwM0U1NTRGIj48dzpyUHI+PHc6bGFuZyB3OnZhbD0iZW4tVVMiLz48L3c6clByPjx3OnQgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+IDU3RCA8L3c6dD48L3c6cj48dzpwcm9vZkVyciB3OnR5cGU9InNwZWxsU3RhcnQiLz48dzpyIHc6cnNpZFI9IjAwNTYwMTk5IiB3OnJzaWRSUHI9IjAwM0U1NTRGIj48dzpyUHI+PHc6bGFuZyB3OnZhbD0iZW4tVVMiLz48L3c6clByPjx3OnQ+bG9rPC93OnQ+PC93OnI+PHc6cHJvb2ZFcnIgdzp0eXBlPSJzcGVsbEVuZCIvPjx3OnIgdzpyc2lkUj0iMDA1NjAxOTkiIHc6cnNpZFJQcj0iMDAzRTU1NEYiPjx3OnJQcj48dzpsYW5nIHc6dmFsPSJlbi1VUyIvPjwvdzpyUHI+PHc6dD4uIEIvQTwvdzp0PjwvdzpyPjwvdzpwPjx3OnAgdzpyc2lkUj0iMDA5MDAzRUEiIHc6cnNpZFJQcj0iMDAxMjY4QzEiIHc6cnNpZFJEZWZhdWx0PSIwMDkwMDNFQSIgdzpyc2lkUD0iMDA5MDAzRUEiPjx3OnBQcj48dzpwQmRyPjx3OnRvcCB3OnZhbD0ic2luZ2xlIiB3OnN6PSI0IiB3OnNwYWNlPSIxIiB3OmNvbG9yPSJhdXRvIi8+PC93OnBCZHI+PHc6c3BhY2luZyB3OmFmdGVyPSIwIi8+PHc6aW5kIHc6cmlnaHQ9Ii0yIi8+PHc6amMgdzp2YWw9ImNlbnRlciIvPjx3OnJQcj48dzpsYW5nIHc6dmFsPSJlbi1VUyIvPjwvdzpyUHI+PC93OnBQcj48dzpyIHc6cnNpZFJQcj0iMDAxMjY4QzEiPjx3OnJQcj48dzpsYW5nIHc6dmFsPSJlbi1VUyIvPjwvdzpyUHI+PHc6dCB4bWw6c3BhY2U9InByZXNlcnZlIj5EaXN0cmljdCBDb3VydCBmb3IgV3JvY2xhdyAtIDwvdzp0PjwvdzpyPjx3OnByb29mRXJyIHc6dHlwZT0ic3BlbGxTdGFydCIvPjx3OnIgdzpyc2lkUlByPSIwMDEyNjhDMSI+PHc6clByPjx3Omxhbmcgdzp2YWw9ImVuLVVTIi8+PC93OnJQcj48dzp0PkZhYnJ5Y3puYTwvdzp0PjwvdzpyPjx3OnByb29mRXJyIHc6dHlwZT0ic3BlbGxFbmQiLz48dzpyIHc6cnNpZFJQcj0iMDAxMjY4QzEiPjx3OnJQcj48dzpsYW5nIHc6dmFsPSJlbi1VUyIvPjwvdzpyUHI+PHc6dD4sIE5hdGlvbmFsIENvdXJ0IFJlZ2lzdHJhdGlvbiBOdW1iZXIgS1JTOiAwMDAwMjg0MjU3PC93OnQ+PC93OnI+PC93OnA+PHc6cCB3OnJzaWRSPSIwMDI4NjU4NiIgdzpyc2lkUlByPSIwMDEyNjhDMSIgdzpyc2lkUkRlZmF1bHQ9IjAwOTAwM0VBIiB3OnJzaWRQPSIwMDkwMDNFQSI+PHc6cFByPjx3OnNwYWNpbmcgdzphZnRlcj0iMCIvPjx3OmluZCB3OnJpZ2h0PSItMiIvPjx3OmpjIHc6dmFsPSJjZW50ZXIiLz48dzpyUHI+PHc6bGFuZyB3OnZhbD0iZW4tVVMiLz48L3c6clByPjwvdzpwUHI+PHc6ciB3OnJzaWRSUHI9IjAwMTI2OEMxIj48dzpyUHI+PHc6bGFuZyB3OnZhbD0iZW4tVVMiLz48L3c6clByPjx3OnQ+VGF4IElkZW50aWZpY2F0aW9uIE51bWJlciBOSVA6IDg5NC0yOTAtODktODUsIFZBVC1JRDogUEw4OTQyOTA4OTg1LCBSRUdPTjogMDIwNTUwNzA8L3c6dD48L3c6cj48L3c6cD48L3c6ZnRyPg==","base64"));
      zip.generateAsync({type: "blob", mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}).then((outputDoc) => {
    // let oTimeStampOld = new Date().toLocaleString(),
    //         oTimeStamp = oTimeStampOld.replace(/:\s*/g, "-"),
    //         sLanguage = this.schoolDesc[0].Language.toUpperCase() || this.cvElements.language,
    //         fileNameAndFormat = `CV ${userData.Fullname},${sLanguage}(${oTimeStamp}).docx`;
        saveAs(outputDoc, fileNameAndFormat);
      })

    },
    convertToMhtandAddMimeType(htmlSource) {
      htmlSource = htmlSource.replace(/\=/g, '=3D');
      var mimeTypeToAdd = 'MIME-Version: 1.0\nContent-Type: multipart/related;\n        boundary="----=mhtDocumentPart"\n\n\n------=mhtDocumentPart\nContent-Type: text/html;\n    charset="UTF-8"\nContent-Transfer-Encoding: quoted-printable\nContent-Location: file:///C:/fake/document.html\n\n'
      var onEndofHtml = "\n\n------=mhtDocumentPart--"
      return htmlSource = mimeTypeToAdd + htmlSource + onEndofHtml;
    },

    xmlDocumentCreation() {
      const xmlDocHead = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?> <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:ns6="http://schemas.openxmlformats.org/schemaLibrary/2006/main" xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:ns8="http://schemas.openxmlformats.org/drawingml/2006/chartDrawing" xmlns:dgm="http://schemas.openxmlformats.org/drawingml/2006/diagram" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture" xmlns:ns11="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:dsp="http://schemas.microsoft.com/office/drawing/2008/diagram" xmlns:ns13="urn:schemas-microsoft-com:office:excel" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:ns17="urn:schemas-microsoft-com:office:powerpoint" xmlns:odx="http://opendope.org/xpaths" xmlns:odc="http://opendope.org/conditions" xmlns:odq="http://opendope.org/questions" xmlns:odi="http://opendope.org/components" xmlns:odgm="http://opendope.org/SmartArt/DataHierarchy" xmlns:ns24="http://schemas.openxmlformats.org/officeDocument/2006/bibliography" xmlns:ns25="http://schemas.openxmlformats.org/drawingml/2006/compatibility" xmlns:ns26="http://schemas.openxmlformats.org/drawingml/2006/lockedCanvas"> <w:body> <w:altChunk r:id="htmlChunk" /> <w:sectPr> <w:footerReference r:id="rId6" w:type="default"/> <w:pgSz w:w="12240" w:h="15840" w:orient="portrait" /> <w:pgMar w:top="1440" w:right="1440" w:bottom="0" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/> </w:sectPr> </w:body> </w:document>'
      return xmlDocHead
    },

    convertImagesToBase64() {
      let contentDocument = document.getElementById("content"),
        image = document.getElementById("cv-img"),
        canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        width = image.width,
        height = image.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, width, height);
      const dataURL = canvas.toDataURL("image/jpeg");
      image.setAttribute("src", dataURL);
    },
    formatDate(date) {
      return date !== null && date !== undefined
        ? moment(date).format("YYYY-MM")
        : "-";
    },
    formatSchoolDsec(University) {
         let schoolName = [];
         schoolName = this.schoolDesc.find(o => o.SchoolId === University);
         return schoolName.SchoolDescription;
    },
    formatFieldOfStudyDesc(FieldOfStudy) {
        let fieldOfStudyName = [];
         fieldOfStudyName = this.fieldOfStudyDesc.find(o => o.SchoolId === FieldOfStudy);
         return fieldOfStudyName.SchoolDescription;
    },
    formatPositionName(WorkPos) {
      if(WorkPos) {
         let workPoses = [];
         workPoses = this.workPositions.find(o => o.Key === WorkPos);
         return workPoses.Value;
      }
    },
    formatLangName(Lang) {
       if(this.fullLanguageList.length > 0) {
      let langNames = [];
       langNames = this.fullLanguageList.find(o => o.LanguageId === Lang);
       return langNames.LangName;
       }
    },
    formatLangLevel(LangLevel) {
      if(this.langLevels.length > 0) {
       let langLevels = [];
       langLevels = this.langLevels.find(o => o.Key === LangLevel);
       return langLevels.Value;
      }
    },
    setIfCurrentDate(IsCurrent){
          if(IsCurrent === true) {
            return i18n.t("label.present");
          }
    },
    _saveCVHistory(){
      let oCVOptions = JSON.parse(localStorage.getItem("Object")),
          oData = {
            CreatedFor: localStorage.getItem("id"),
            Language: oCVOptions.language,
            FileFormat: (this.cvElements.format == "PDF") ? "PDF" : "DOCX",
            CvPosition: oCVOptions.position,
            TargetEntity: oCVOptions.entity,
            Name: oCVOptions.name,
            Photo: oCVOptions.photo,
            Email: oCVOptions.address,
            Phone: oCVOptions.phone,
            Contractor: oCVOptions.contractor
          };
      // save data to CV History
       axios({
        url: "CVHistories",
        method: 'post',
        data: oData,
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Cache-Control": "no-cache",
          "x-csrf-token": this.getToken
        }
      }).catch(error => {
            console.log(error);
      });
    }
  },
  computed: {
    ...mapGetters({
      userEducation: "getUserEducation",
      userProjects: "getUserProjectsList",
      userExperience: "getUserExperience",
      userData: "userData",
      cvElements: "getCvElements",
      userInfo: "getUserInfo",
      userLangs: "getUserLanguages",
      userSkills: "getUserSkills",
      schoolDesc: 'getSchoolDescList',
      fieldOfStudyDesc: 'getFieldOfStudyDescList',
      workPositions: 'getWorkPositions',
      fullLanguageList: 'getFullLanguageList',
      langLevels: 'getLangLevels',
      getToken: 'getToken',
      getCookie: 'getCookie',
      messageLog: "getMessageLog",
      showModal: "getShowModal",
      userPhoto: "getSelectedUserPhotoUrl"
    })
  }
}
</script>
<style>

.pempty {
  margin: 0;
  padding: 0;
}

#content,
.content {
  background: grey;
  /* display: flex; */
  justify-content: center;
  align-items: center;
  width: 100%;
  height: min-content;
}
.tr-header {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.Section1 {
  background: white;
  display: flex;
  align-self: center;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  margin: 1rem auto;
  margin-bottom: 0.5cm;
  box-shadow: 0px 0px 0.5cm rgba(0, 0, 0, 0.5);
  width: 50%;
  height: 100%;
  padding: 6rem;
  /* transform: scale(0.5, 0.5); */
}
.cv-table-header {
  text-align: left;
  background-color: lightgray;
}
.cv-modal-btn,
.cv-modal-btn-clear,
.cv-modal-btn-bclear {
  display: flex;
  cursor: pointer;
  color: #333;
  border: 0;
  /* height: 4rem; */
  border-radius: 4px;
  transition: all 0.2s ease;
  justify-content: center;
  align-items: center;
  margin: 0.2rem;
  outline: none;
  font-size: 0.85rem;
}
.cv-modal-btn-bclear {
  background: transparent;
  /* text-transform: uppercase; */
  border: 2px solid rgb(61, 61, 61);
  /* padding: .6rem .8rem; */
}
.cv-modal-btn-bclear:hover {
  box-shadow: 0px 0px 8px #333;
  background: #333;
  color: white;
}
.center-btn {
  margin: 10px auto 10px auto;
  background: white;
  display: flex;
}
</style>
