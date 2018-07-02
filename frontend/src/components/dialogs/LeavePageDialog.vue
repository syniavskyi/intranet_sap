<template>
    <div>
        <h1>Potwierdź opuszczanie strony</h1>
        <p>Wprowadzone dane nie zostaną zapisane. Czy na pewno chcesz opuścić stronę?</p>
        <button @click="setSelectedAction('leave')">TAK</button>
        <button @click="$emit('close')">Anuluj</button>
    </div>
</template>
<script>
export default {
    methods: {
        setSelectedAction(action) {
            this.$emit('action-selected', action)
        }
    }
}
</script>