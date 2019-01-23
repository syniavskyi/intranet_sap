<template>
  <div class="content-weather content-empty">{{ $t("message.weatherError") }}</div>
</template>

<script>
export default {};
</script>

<style scoped>
.content-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #808080;
  padding: 1rem;
  text-align: center;
}
</style>
