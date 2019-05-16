<template>
    <div @click="closeConfirmDialog" slot-scope="{ myConfirm, confirmMethod }">
        <div class="message-box">
            <div class="message-box__container modal-xs" @click.stop>
                <header class="message-box__header">
                    <h1 class="message-box__title">
                        <slot name="modal-title"></slot>
                    </h1>   
                    <button @click="closeConfirmDialog" class="m-close">&#10006;</button>
                </header>
                <div class="message-box__content">
                    <div class="message-box__text">
                        <slot name="modal-text"></slot>
                    </div>   
                </div>
                <footer class="message-box__footer">
                    <button class="message-box__btn message-box__btn--conf" @click="confirmMethod()">{{ $t("button.confirm") }}</button>
                    <button class="message-box__btn message-box__btn--rej" @click="rejectMethod">{{ $t("button.cancel") }}</button>
                </footer>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        closeConfirmDialog() {
            this.$store.commit("SET_MESSAGE_BOX", false);
        },
        // confirmMethod() {

        // },
        rejectMethod() {
            
        }
    }
}
</script>


import i18n from "../../../lang/lang";

<style scoped>
.message-box {
    position: fixed;
    z-index: 1500;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
}

.message-box__container {
    display: flex;
    flex-direction: column;
    background-color: #f0f0f0;
}

.message-box__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 25%;
}

.message-box__content {
    display: flex;
    align-items: center;
    justify-content: space-around;
    /* height: 60%; */
}

.message-box__text {
    padding: 2rem 3rem;
    line-height: 1.4rem;
}

.message-box__footer {
    display: flex;
    align-items: center;
    justify-content: center;
}

.message-box__title {
    color: #333;
    padding-top: 1.6rem;
    padding-left: 1.4rem;
}

.message-box__btn {
    border: none;
    padding: .6rem .8rem;
    margin: auto .6rem;
    box-shadow: 0 3px 3px -2px gray;
    border-radius: 10px;
    font-size: .8rem;
    font-weight: 100;
    text-transform: uppercase;
    cursor: pointer;
    transition: all .2s;
}

.message-box__btn:focus, .message-box__btn:active {
    outline: none;
    transform: translateY(-1px);
    box-shadow: 0 .5rem 1rem rgba(#000, 0.2);
}

.message-box__btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 1rem 2rem rgba(#000,.2);
}

.message-box__btn--conf {
    background-color: rgba(136, 255, 77, .7);
    color: #666;
}

.message-box__btn--rej {
    background-color: rgba(255, 51, 51, .7);
    color: #fff;
}
</style>