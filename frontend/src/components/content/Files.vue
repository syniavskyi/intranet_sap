<template>
  <div class="plane-component">
    <div class="component-nav-and-content">
      <app-menu v-show="displayMenu"></app-menu>
      <div class="component-content">
        <div class="content-header"> 
          <div class="content-header-title-and-menu">
            <!-- <img src="../../assets/images/nav/if_menu-32.png" width="32px" class="content-header-menu"> -->
            <div @click="showMenu" class="content-header-menu">&#9776;</div>
            <p class="content-header-title">Dokumenty</p>
          </div>
        </div>
        <div class="documents-page-tiles">
          <div class="documents-tiles-row">
            <input id="documents-row-1" class="documents-tiles-row-header-input" type="checkbox">
            <label class="documents-tiles-row-header" for="documents-row-1">Dokumenty Kagrin</label>
            <div class="documents-tiles-row-content">
              <div class="documents-tile documents-tile-1-3">
                <div class="documents-tile-header">
                  <p class="documents-tile-header-title">Wniosek Urlopowy</p>
                  <div class="documents-tile-underscore"></div>
                </div>
                <div class="documents-tile-content">
                  <div class="documents-div">
                    <a class="doc-file-div">
                      <div class="doc-file-img doc-file-doc"></div>
                      <div class="doc-file-desc">Wniosek urlopowy w DOC do uzupełnienia i podpisania</div>
                    </a>
                  </div>
                </div>
              </div>
              <div class="documents-tile documents-tile-1-3">
                <div class="documents-tile-header">
                  <p class="documents-tile-header-title">Lista obecności</p>
                  <div class="documents-tile-underscore"></div>
                </div>
                <div class="documents-tile-content">
                  <div class="documents-div">
                      <a class="doc-file-div">
                      <div class="doc-file-img doc-file-xls"></div>
                      <div class="doc-file-desc">Lista obecności w XLS do wydrukowania i podpisania</div>
                    </a>
                    <a class="doc-file-div">
                      <div class="doc-file-img  doc-file-pdf"></div>
                      <div class="doc-file-desc">List obecności w PDF do wydrukowania i podpisania</div>
                     </a>
                  </div>
                </div>
              </div>
              <div class="documents-tile documents-tile-1-3">
                <div class="documents-tile-header">
                  <p class="documents-tile-header-title">Wzory CV</p>
                  <div class="documents-tile-underscore"></div>
                </div>
                <div class="documents-tile-content">
                </div>
              </div>
            </div>
            <div class="documents-tiles-row-content">
              <div class="documents-tile documents-tile-1-3">
                <div class="documents-tile-header">
                  <p class="documents-tile-header-title">Dokumenty ważne</p>
                  <div class="documents-tile-underscore"></div>
                </div>
                <div class="documents-tile-content">
                </div>
              </div>
              <div class="documents-tile documents-tile-1-3">
                <div class="documents-tile-header">
                  <p class="documents-tile-header-title">Dokumenty ważne</p>
                  <div class="documents-tile-underscore"></div>
                </div>
                <div class="documents-tile-content">
                </div>
              </div>
            </div>
          </div>
          <div class="documents-tiles-row">
            <input id="documents-row-2" class="documents-tiles-row-header-input" type="checkbox">
            <label class="documents-tiles-row-header" for="documents-row-2">Dokumenty istotne</label>
            <div class="documents-tiles-row-content">
              <div class="documents-tile documents-tile-1-3">
                <div class="documents-tile-header">
                  <p class="documents-tile-header-title">Dokumenty ważne</p>
                  <div class="documents-tile-underscore"></div>
                </div>
                <div class="documents-tile-content">
                </div>
              </div>
              <div class="documents-tile documents-tile-1-3">
                <div class="documents-tile-header">
                  <p class="documents-tile-header-title">Wzory CV</p>
                  <div class="documents-tile-underscore"></div>
                </div>
                <div class="documents-tile-content">
                </div>
              </div>
              <div class="documents-tile documents-tile-1-3">
                <div class="documents-tile-header">
                  <p class="documents-tile-header-title">Dokumenty ważne</p>
                  <div class="documents-tile-underscore"></div>
                </div>
                <div class="documents-tile-content">
                </div>
              </div>
            </div>
          </div>
          <div class="documents-tiles-row">
            <input id="documents-row-3" class="documents-tiles-row-header-input" type="checkbox">
            <label class="documents-tiles-row-header" for="documents-row-3">Dokumenty istotne</label>
            <div class="documents-tiles-row-content">
              <div class="documents-tile documents-tile-1-3">
                <div class="documents-tile-header">
                  <p class="documents-tile-header-title">Dokumenty ważne</p>
                  <div class="documents-tile-underscore"></div>
                </div>
                <div class="documents-tile-content">
                  <h1 class="documents-tile-text">Jakiś content</h1>
                </div>
              </div>
              <div class="documents-tile documents-tile-1-3">
                <div class="documents-tile-header">
                  <p class="documents-tile-header-title">Wzory CV</p>
                  <div class="documents-tile-underscore"></div>
                </div>
                <div class="documents-tile-content">
                  <h1>asdadsada</h1>
                  <h2>asadsad</h2>
                </div>
              </div>
              <div class="documents-tile documents-tile-1-3">
                <div class="documents-tile-header">
                  <p class="documents-tile-header-title">Dokumenty ważne</p>
                  <div class="documents-tile-underscore"></div>
                </div>
                <div class="documents-tile-content">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Menu from '../Menu.vue'
import axios from 'axios'
import i18n from '../../lang/lang'
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      listOfDoc: []
    }
  },
  // created() {
  //   window.addEventListener("resize", this.showMenu)
  // },
  // destroyed() {
  //   window.removeEventListener("resize", this.showMenu)
  // },
  computed: {
    ...mapGetters({
      displayMenu: 'getShowMenu'
    })
  },
  methods: {
    showMenu(event) {
      var x = window.matchMedia("(max-width: 40rem)")
      if (x.matches && event.type === "resize") {
        this.$store.commit("SET_DISPLAY_MENU", false)
      } else {
        this.$store.commit("SET_DISPLAY_MENU", true);
      }
    },
  },
  components: {
    'app-menu': Menu
  }
}
</script>
<style>
</style>
