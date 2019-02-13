<template>
  <div class="availability-tile ava-tile-2">
    <div class="tile-head">
        <div class="tile-head-title">
            <h2>{{ $t("label.projectsOverview") }}</h2>   
        </div>
        <div class="tile-underscore"/>
    </div>
    <p class="notAuthToAddProject">{{ $t("message.notAuthToAddProject") }}</p>
  </div>
</template>
<script>
export default {
    props: ['selected-type', 'selected-user', 'auth-type']
};
</script>